export type UserRole = 'donor' | 'receiver' | 'volunteer' | 'admin';

export type ReceiverType = 'ngo' | 'anathashram' | 'individual';

export type FoodType = 'veg' | 'non-veg';

export type ListingStatus = 'available' | 'booked' | 'collected' | 'expired';

export type DeliveryStatus = 'open' | 'accepted' | 'picked_up' | 'delivered';

export type HeroBadgeLevel = 'Bronze' | 'Silver' | 'Gold';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password?: string;
  provider?: 'gmail' | 'email';
  phone: string;
  avatar?: string;
  organizationName?: string;
  registrationNumber?: string;
  receiverType?: ReceiverType;
  isVerified: boolean;
  verificationDate?: string;
  mealsDonated: number;
  kgRescued: number;
  deliveriesCompleted: number;
  ratingAvg: number;
  ratingCount: number;
  badgeLevel: HeroBadgeLevel;
  createdAt: string;
}

export interface FoodListing {
  id: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  donorOrg?: string;
  donorRating?: number;
  title: string;
  description: string;
  photoUrl: string;
  foodType: FoodType;
  quantityPlates: number;
  quantityKg: number;
  safeUntil: string; // ISO datetime
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  notes?: string;
  safetyChecklistPassed: boolean;
  status: ListingStatus;
  bookedById?: string;
  bookedByName?: string;
  bookedByPhone?: string;
  bookedByOrg?: string;
  bookedAt?: string;
  pickupCode?: string; // 4-digit code
  collectedAt?: string;
  createdAt: string;
  volunteerDeliveryRequested?: boolean;
  volunteerId?: string;
  volunteerName?: string;
  deliveryStatus?: DeliveryStatus;
}

export interface ScheduledEvent {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  venueName: string;
  eventDate: string;
  pickupTime: string;
  estimatedPlates: number;
  foodType: 'veg' | 'mixed' | 'non-veg';
  address: string;
  lat: number;
  lng: number;
  contactPhone: string;
  vehicleNeeded: string;
  claimedByNgoId?: string;
  claimedByNgoName?: string;
  status: 'upcoming' | 'claimed' | 'completed';
  createdAt: string;
}

export interface DeliveryRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  plates: number;
  receiverId: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  donorName: string;
  donorAddress: string;
  donorPhone: string;
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  distanceKm: number;
  volunteerId?: string;
  volunteerName?: string;
  volunteerPhone?: string;
  status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserRating {
  id: string;
  listingId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'listing_alert' | 'booking_alert' | 'pickup_code' | 'delivery_update' | 'verification' | 'system';
  read: boolean;
  createdAt: string;
  listingId?: string;
}

export interface ImpactStats {
  totalMealsSaved: number;
  totalKgRescued: number;
  totalCo2AvoidedKg: number;
  activeDonorsCount: number;
  activeNgosCount: number;
  weeklyData: {
    day: string;
    meals: number;
  }[];
}

export interface WasteHotspot {
  id: string;
  name: string;
  area: string;
  type: 'Wedding Hall' | 'College Mess' | 'Restaurant Cluster' | 'Catering Hub';
  monthlyDonationsKg: number;
  mealsShared: number;
  lat: number;
  lng: number;
  intensity: number; // 0.1 to 1.0
}

export type SupportedLanguage = 'en' | 'hi' | 'kn';
