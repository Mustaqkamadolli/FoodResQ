import React, { useState } from 'react';
import { FoodListing, UserProfile, SupportedLanguage } from '../types';
import {
  BookmarkCheck,
  MapPin,
  Phone,
  ExternalLink,
  Truck
} from 'lucide-react';

interface MyBookingsViewProps {
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  listings: FoodListing[];
  onOpenPickupCode: (listing: FoodListing) => void;
  onViewDetails: (listing: FoodListing) => void;
  onRate?: (listing: FoodListing) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  currentUser,
  currentLang,
  listings,
  onOpenPickupCode,
  onViewDetails,
  onRate
}) => {
  const [filterTab, setFilterTab] = useState<'active' | 'collected'>('active');

  // Filter listings booked by current user (or if in demo mode, show all booked items for convenient testing)
  const myListings = listings.filter((l) => {
    const isMine = l.bookedById === currentUser.id;
    return isMine || (currentUser.role === 'receiver' && l.status === 'booked');
  });

  const activeBookings = myListings.filter((l) => l.status === 'booked');
  const collectedBookings = myListings.filter((l) => l.status === 'collected');

  const displayedListings = filterTab === 'active' ? activeBookings : collectedBookings;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#000000] bg-[#dfdcd5] px-2.5 py-0.5 rounded-[4px]">
            Receiver Ledger
          </span>
          <h1 className="text-3xl font-davinci font-normal text-[#000000] mt-1">
            My Booked Surplus Meals
          </h1>
          <p className="text-xs font-sans text-[#595855]">
            Show your 4-digit pickup code to the donor at handover.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#dfdcd5] p-1 rounded-[28.8px] border border-[#dfdcd5]">
          <button
            onClick={() => setFilterTab('active')}
            className={`px-4 py-1.5 rounded-[28.8px] text-xs font-sans transition-all ${
              filterTab === 'active'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            Pending Pickup ({activeBookings.length})
          </button>

          <button
            onClick={() => setFilterTab('collected')}
            className={`px-4 py-1.5 rounded-[28.8px] text-xs font-sans transition-all ${
              filterTab === 'collected'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            Completed ({collectedBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {displayedListings.length === 0 ? (
        <div className="card-bone p-16 text-center text-[#595855] space-y-3">
          <BookmarkCheck className="w-10 h-10 text-[#808080] mx-auto" />
          <h3 className="text-base font-davinci font-normal text-[#000000]">
            No {filterTab} bookings found
          </h3>
          <p className="text-xs font-sans">
            Explore the live map to reserve nearby surplus banquet and mess food.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedListings.map((item) => (
            <div
              key={item.id}
              className="card-bone p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-[28.8px] bg-[#dfdcd5] text-[#000000] border border-[#dfdcd5]">
                    {item.foodType} · {item.quantityPlates} Plates ({item.quantityKg} kg)
                  </span>

                  <span className="text-[10px] font-mono uppercase text-[#000000] bg-[#ffffff] px-2.5 py-0.5 rounded-[28.8px] border border-[#dfdcd5]">
                    {item.status === 'booked' ? '🔒 Locked' : '✓ Collected'}
                  </span>
                </div>

                <h3 className="text-lg font-davinci font-normal text-[#000000] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs font-sans text-[#595855] mt-1 line-clamp-2">
                  {item.description}
                </p>

                {/* Pickup Ticket Banner */}
                {item.status === 'booked' && (
                  <div 
                    onClick={() => onOpenPickupCode(item)}
                    className="mt-4 p-4 rounded-[9px] bg-[#ffffff] border border-[#dfdcd5] flex items-center justify-between cursor-pointer hover:border-[#000000] transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#595855] block">
                        4-Digit Pickup PIN:
                      </span>
                      <span className="text-2xl font-mono text-[#000000] tracking-widest">
                        {item.pickupCode || '7429'}
                      </span>
                    </div>

                    <button className="btn-pill text-[11px] py-1 px-3">
                      View Code
                    </button>
                  </div>
                )}

                {/* Location & Contact info */}
                <div className="mt-4 space-y-2 text-xs font-sans text-[#595855]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#000000] shrink-0 mt-0.5" />
                    <span>{item.pickupAddress}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 font-sans text-[#000000]">
                      <Phone className="w-3.5 h-3.5 text-[#595855]" />
                      <a href={`tel:${item.donorPhone}`} className="hover:underline">
                        {item.donorPhone}
                      </a>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.pickupAddress)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-sans text-[#000000] underline flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {item.volunteerDeliveryRequested && (
                  <div className="mt-3 p-2.5 rounded-[9px] bg-[#dfdcd5] border border-[#dfdcd5] text-xs font-sans text-[#000000] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#000000] shrink-0" />
                    <span>Volunteer delivery requested for this meal.</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#dfdcd5] flex items-center justify-between">
                <button
                  onClick={() => onViewDetails(item)}
                  className="text-xs font-sans text-[#595855] hover:text-[#000000]"
                >
                  View Details
                </button>

                {item.status === 'collected' && onRate && (
                  <button
                    onClick={() => onRate(item)}
                    className="text-xs font-sans text-[#000000] underline"
                  >
                    ★ Rate Donor
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
