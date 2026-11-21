import React from 'react';
import { FoodListing } from '../types';
import { Navigation } from 'lucide-react';

interface FoodCardProps {
  listing: FoodListing;
  onBook: (listing: FoodListing) => void;
  onViewDetails: (listing: FoodListing) => void;
  onGuideRoute?: (listing: FoodListing) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ listing, onBook, onViewDetails, onGuideRoute }) => {
  const isVeg = listing.foodType === 'veg';
  const isBooked = listing.status === 'booked';
  const isCollected = listing.status === 'collected';
  const isExpired = listing.status === 'expired';

  // Calculate hours remaining
  const diffMs = new Date(listing.safeUntil).getTime() - Date.now();
  const totalMins = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  let countdownText = `${hrs}h ${mins}m left`;
  if (diffMs <= 0 || isExpired) {
    countdownText = 'Expired';
  }

  return (
    <div className="bg-[#e7e5e4] text-[#000000] rounded-[9px] border border-[#dfdcd5] overflow-hidden flex flex-col justify-between group transition-colors">
      
      {/* Top Image Container (Clean rectangle crop, no rounded corners inside, hairline border bottom) */}
      <div className="relative h-52 w-full overflow-hidden bg-[#808080] border-b border-[#dfdcd5]">
        <img
          src={listing.photoUrl}
          alt={listing.title}
          className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />

        {/* Top Badges (Restrained monochrome & museum typography) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="font-grotesk text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#000000] text-[#ffffff] rounded-[2px]">
            {listing.foodType}
          </span>
          <span className="font-grotesk text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#e7e5e4] text-[#000000] border border-[#dfdcd5] rounded-[2px]">
            {listing.quantityPlates} pl ({listing.quantityKg} kg)
          </span>
        </div>

        {/* Urgency countdown indicator */}
        <div className="absolute top-3 right-3">
          <span className="font-grotesk text-[10px] font-medium tracking-wide px-2 py-0.5 bg-[#e7e5e4] text-[#000000] border border-[#dfdcd5] rounded-[28.8px]">
            ⏱ {countdownText}
          </span>
        </div>

        {/* Bottom Banner: Donor Name */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[#ffffff] text-xs font-grotesk drop-shadow-sm">
          <span className="truncate">{listing.donorName}</span>
          {listing.donorRating && (
            <span className="font-medium">★ {listing.donorRating}</span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="font-grotesk text-[9px] uppercase tracking-widest text-[#595855] block mb-1">
            EXHIBIT ENTRY • BENGALURU
          </span>
          <h3 
            onClick={() => onViewDetails(listing)}
            className="font-davinci text-xl font-medium tracking-tight text-[#000000] hover:underline cursor-pointer leading-tight mb-2 line-clamp-2"
          >
            {listing.title}
          </h3>

          <p className="font-grotesk text-xs text-[#595855] line-clamp-2 leading-relaxed mb-3">
            {listing.description}
          </p>

          <div className="font-grotesk text-[11px] text-[#595855] truncate">
            📍 {listing.pickupAddress}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#dfdcd5] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(listing)}
              className="ghost-link text-xs text-[#595855] hover:text-[#000000]"
            >
              Details
            </button>
            {onGuideRoute && (
              <button
                onClick={() => onGuideRoute(listing)}
                className="text-xs text-[#000000] hover:text-[#595855] flex items-center gap-1 font-mono underline cursor-pointer"
                title="View Turn-by-Turn Route on Map"
              >
                <Navigation className="w-3 h-3 text-[#000000]" />
                <span>Route</span>
              </button>
            )}
          </div>

          {listing.status === 'available' ? (
            <button
              onClick={() => onBook(listing)}
              className="btn-pill"
            >
              Book Food
            </button>
          ) : isBooked ? (
            <span className="font-grotesk text-[11px] text-[#595855] uppercase tracking-wider">
              [ Claimed by {listing.bookedByName || 'NGO'} ]
            </span>
          ) : isCollected ? (
            <span className="font-grotesk text-[11px] text-[#000000] font-medium uppercase tracking-wider">
              ✓ Rescued
            </span>
          ) : (
            <span className="font-grotesk text-[11px] text-[#808080] uppercase tracking-wider">
              Expired
            </span>
          )}
        </div>

      </div>

    </div>
  );
};
