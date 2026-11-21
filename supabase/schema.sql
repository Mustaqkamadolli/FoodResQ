-- ==============================================================================
-- FoodResQ Production Supabase Schema & Realtime Architecture
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. User Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('donor', 'receiver', 'volunteer', 'admin')),
  name text not null,
  email text not null,
  phone text,
  avatar text,
  organization_name text,
  registration_number text,
  receiver_type text check (receiver_type in ('ngo', 'anathashram', 'individual')),
  is_verified boolean default false,
  verification_date timestamp with time zone,
  meals_donated integer default 0,
  kg_rescued numeric default 0,
  deliveries_completed integer default 0,
  rating_avg numeric(3,2) default 5.0,
  rating_count integer default 0,
  badge_level text default 'Bronze' check (badge_level in ('Bronze', 'Silver', 'Gold')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Admins can update verification status."
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 3. Listings Table
create table if not exists public.listings (
  id uuid default uuid_generate_v4() primary key,
  donor_id uuid references public.profiles(id) on delete cascade not null,
  donor_name text not null,
  donor_phone text not null,
  donor_org text,
  donor_rating numeric(3,2) default 5.0,
  title text not null,
  description text,
  photo_url text not null,
  food_type text not null check (food_type in ('veg', 'non-veg')),
  quantity_plates integer not null check (quantity_plates > 0),
  quantity_kg numeric not null check (quantity_kg > 0),
  safe_until timestamp with time zone not null,
  pickup_address text not null,
  pickup_lat numeric(10,7) not null,
  pickup_lng numeric(10,7) not null,
  notes text,
  safety_checklist_passed boolean not null default false,
  status text not null default 'available' check (status in ('available', 'booked', 'collected', 'expired')),
  booked_by_id uuid references public.profiles(id),
  booked_by_name text,
  booked_by_phone text,
  booked_by_org text,
  booked_at timestamp with time zone,
  pickup_code text,
  collected_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.listings enable row level security;

create policy "Listings are viewable by everyone."
  on public.listings for select
  using ( true );

create policy "Donors can insert their own listings."
  on public.listings for insert
  with check ( auth.uid() = donor_id );

create policy "Donors can update their own listings."
  on public.listings for update
  using ( auth.uid() = donor_id );

-- 4. Bookings Table
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  donor_id uuid references public.profiles(id) on delete cascade not null,
  pickup_code text not null,
  status text not null default 'pending_pickup' check (status in ('pending_pickup', 'collected', 'cancelled')),
  delivery_requested boolean default false,
  volunteer_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bookings enable row level security;

create policy "Bookings are viewable by parties involved."
  on public.bookings for select
  using ( auth.uid() = receiver_id or auth.uid() = donor_id or auth.uid() = volunteer_id );

create policy "Receivers can create booking."
  on public.bookings for insert
  with check ( auth.uid() = receiver_id );

-- 5. ATOMIC BOOKING TRANSACTION FUNCTION
-- Uses row-level lock (FOR UPDATE) to strictly prevent double-booking race conditions.
create or replace function public.book_listing_atomic(
  p_listing_id uuid,
  p_receiver_id uuid,
  p_receiver_name text,
  p_receiver_phone text,
  p_receiver_org text,
  p_pickup_code text,
  p_delivery_requested boolean default false
) returns jsonb as $$
declare
  v_listing public.listings%rowtype;
  v_booking_id uuid;
begin
  -- Row-level lock acquisition
  select * into v_listing
  from public.listings
  where id = p_listing_id
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Listing not found');
  end if;

  if v_listing.status <> 'available' then
    return jsonb_build_object('success', false, 'error', 'This food has already been claimed by another organization.');
  end if;

  if v_listing.safe_until < now() then
    update public.listings set status = 'expired' where id = p_listing_id;
    return jsonb_build_object('success', false, 'error', 'This listing has expired and cannot be booked.');
  end if;

  -- 1. Update listing state to locked 'booked'
  update public.listings
  set
    status = 'booked',
    booked_by_id = p_receiver_id,
    booked_by_name = p_receiver_name,
    booked_by_phone = p_receiver_phone,
    booked_by_org = p_receiver_org,
    booked_at = now(),
    pickup_code = p_pickup_code
  where id = p_listing_id;

  -- 2. Insert Booking Record
  insert into public.bookings (
    listing_id, receiver_id, donor_id, pickup_code, status, delivery_requested
  ) values (
    p_listing_id, p_receiver_id, v_listing.donor_id, p_pickup_code, 'pending_pickup', p_delivery_requested
  ) returning id into v_booking_id;

  -- 3. Notify Donor
  insert into public.notifications (
    user_id, title, message, type, listing_id
  ) values (
    v_listing.donor_id,
    'Food Claimed! 🍲',
    p_receiver_name || ' has booked your listing "' || v_listing.title || '". They will provide code: ' || p_pickup_code || ' at pickup.',
    'booking_alert',
    p_listing_id
  );

  return jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'pickup_code', p_pickup_code,
    'message', 'Food successfully booked!'
  );
end;
$$ language plpgsql security definer;

-- 6. Events Table (Event Mode)
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references public.profiles(id) on delete cascade not null,
  host_name text not null,
  title text not null,
  venue_name text not null,
  event_date date not null,
  pickup_time text not null,
  estimated_plates integer not null,
  food_type text not null check (food_type in ('veg', 'mixed', 'non-veg')),
  address text not null,
  lat numeric(10,7) not null,
  lng numeric(10,7) not null,
  contact_phone text not null,
  vehicle_needed text not null,
  claimed_by_ngo_id uuid references public.profiles(id),
  claimed_by_ngo_name text,
  status text not null default 'upcoming' check (status in ('upcoming', 'claimed', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.events enable row level security;
create policy "Events are viewable by everyone." on public.events for select using (true);
create policy "Hosts can manage events." on public.events for all using (auth.uid() = host_id);

-- 7. Delivery Requests Table
create table if not exists public.delivery_requests (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  listing_title text not null,
  plates integer not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  receiver_name text not null,
  receiver_address text not null,
  receiver_phone text not null,
  donor_name text not null,
  donor_address text not null,
  donor_phone text not null,
  pickup_lat numeric(10,7) not null,
  pickup_lng numeric(10,7) not null,
  drop_lat numeric(10,7) not null,
  drop_lng numeric(10,7) not null,
  distance_km numeric(5,2) not null,
  volunteer_id uuid references public.profiles(id),
  volunteer_name text,
  volunteer_phone text,
  status text not null default 'open' check (status in ('open', 'accepted', 'picked_up', 'delivered')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.delivery_requests enable row level security;
create policy "Delivery requests viewable by all volunteers and participants."
  on public.delivery_requests for select using (true);
create policy "Volunteers can update deliveries."
  on public.delivery_requests for update using (true);

-- 8. Ratings Table
create table if not exists public.ratings (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  from_user_id uuid references public.profiles(id) on delete cascade not null,
  from_user_name text not null,
  to_user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ratings enable row level security;
create policy "Ratings are publicly viewable." on public.ratings for select using (true);
create policy "Users can post ratings." on public.ratings for insert with check (auth.uid() = from_user_id);

-- 9. Notifications Table
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null,
  read boolean default false,
  listing_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;
create policy "Users can view their notifications."
  on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their notifications."
  on public.notifications for update using (auth.uid() = user_id);

-- 10. Enable Supabase Realtime
alter publication supabase_realtime add table public.listings;
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.delivery_requests;
alter publication supabase_realtime add table public.notifications;
