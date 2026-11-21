import React, { useState } from 'react';
import { ScheduledEvent, UserProfile, SupportedLanguage } from '../types';
import { store } from '../services/store';
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  PlusCircle,
  Phone
} from 'lucide-react';

interface EventsViewProps {
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  events: ScheduledEvent[];
  onEventCreated?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  currentUser,
  currentLang,
  events,
  onEventCreated
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [venueName, setVenueName] = useState('');
  const [eventDate, setEventDate] = useState('Saturday, 28 Nov 2026');
  const [pickupTime, setPickupTime] = useState('10:30 PM - 11:30 PM');
  const [plates, setPlates] = useState<number>(200);
  const [foodType, setFoodType] = useState<'veg' | 'mixed' | 'non-veg'>('veg');
  const [address, setAddress] = useState('Palace Grounds, Sadashivanagar, Bengaluru');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98450 12345');
  const [vehicle, setVehicle] = useState('Large Delivery Van / Canter Needed');

  const handleClaim = (event: ScheduledEvent) => {
    if (!currentUser.isVerified && currentUser.role === 'receiver') {
      alert("Only verified NGOs can claim upcoming banquet events. Your organization is currently pending admin review.");
      return;
    }
    store.claimEvent(event.id, currentUser.id, currentUser.name);
    alert(`Success! Your organization has reserved the logistics for "${event.title}". The host has been notified.`);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    store.createScheduledEvent({
      hostId: currentUser.id,
      hostName: currentUser.name,
      title,
      venueName,
      eventDate,
      pickupTime,
      estimatedPlates: Number(plates),
      foodType,
      address,
      lat: 13.0084,
      lng: 77.5898,
      contactPhone: phone,
      vehicleNeeded: vehicle
    });
    setIsModalOpen(false);
    if (onEventCreated) onEventCreated();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Banner — Bone Card */}
      <div className="card-bone p-6 sm:p-10 space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] bg-[#dfdcd5] px-2.5 py-0.5 rounded-[4px]">
          Banquet Logistics Coordination
        </span>
        <h1 className="text-3xl sm:text-4xl font-davinci font-normal text-[#000000] leading-tight">
          Event Mode: Schedule Future Banquet Surplus
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#595855] leading-relaxed max-w-3xl">
          Hosting a wedding, college fest, or corporate gala in Bengaluru? Post your expected pickup schedule (e.g. "about 200 plates after 10 PM, Saturday") so verified NGOs and shelters can schedule vehicles ahead of time.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-pill flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule Upcoming Banquet Surplus</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-davinci font-normal text-[#000000]">
          Upcoming Scheduled Banquets ({events.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="card-bone p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-[28.8px] bg-[#dfdcd5] text-[#000000]">
                    {evt.foodType.toUpperCase()} · ~{evt.estimatedPlates} Plates
                  </span>

                  <span className="text-[10px] font-mono uppercase text-[#000000] bg-[#ffffff] px-2.5 py-0.5 rounded-[28.8px] border border-[#dfdcd5]">
                    {evt.status === 'claimed' ? `Claimed by ${evt.claimedByNgoName}` : 'Open for NGO Booking'}
                  </span>
                </div>

                <h3 className="text-lg font-davinci font-normal text-[#000000]">
                  {evt.title}
                </h3>
                <p className="text-xs font-sans text-[#595855] mt-0.5">
                  Venue: {evt.venueName}
                </p>

                <div className="mt-4 space-y-2 text-xs font-sans text-[#595855]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#000000]" />
                    <span>{evt.eventDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#000000]" />
                    <span>Pickup Window: {evt.pickupTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#000000]" />
                    <span>{evt.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#000000]" />
                    <span>Logistics: {evt.vehicleNeeded || 'Van / tempo required'}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 font-mono text-[#000000]">
                    <Phone className="w-3.5 h-3.5 text-[#595855]" />
                    <span>Contact: {evt.contactPhone}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#dfdcd5]">
                {evt.status === 'upcoming' ? (
                  <button
                    onClick={() => handleClaim(evt)}
                    className="btn-pill w-full flex items-center justify-center gap-2"
                  >
                    <span>Reserve Transport & Claim for NGO</span>
                  </button>
                ) : (
                  <div className="text-xs font-mono text-center text-[#595855] py-2">
                    ✓ Logistics reserved by {evt.claimedByNgoName}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="card-bone max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-davinci font-normal text-[#000000]">
              Schedule Banquet Surplus
            </h3>
            <p className="text-xs font-sans text-[#595855]">
              Alert Bengaluru NGOs in advance so they arrange vehicle drivers and volunteer teams.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1">
                  Event / Wedding Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sharma & Verma Wedding Reception"
                  className="w-full text-xs p-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1">
                  Venue Name & Address
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Tripura Vasini, Palace Grounds, Bengaluru"
                  className="w-full text-xs p-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1">
                    Event Date
                  </label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. Saturday, 28 Nov 2026"
                    className="w-full text-xs p-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1">
                    Pickup Time Window
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="e.g. 10:30 PM - 11:30 PM"
                    className="w-full text-xs p-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1">
                    Estimated Plates
                  </label>
                  <input
                    type="number"
                    min={20}
                    required
                    value={plates}
                    onChange={(e) => setPlates(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1">
                    Food Type
                  </label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
                  >
                    <option value="veg">Pure Vegetarian</option>
                    <option value="mixed">Mixed (Veg + Non-Veg)</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dfdcd5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[28.8px] border border-[#dfdcd5] text-xs font-sans text-[#595855] hover:text-[#000000]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-pill"
                >
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
