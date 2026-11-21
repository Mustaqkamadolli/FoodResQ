import React, { useState } from 'react';
import { FoodListing, UserProfile, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  CheckCircle2,
  Truck,
  Lock,
  Share2
} from 'lucide-react';

interface ListingDetailViewProps {
  listing: FoodListing;
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  onBack: () => void;
  onBook: (listing: FoodListing, requestDelivery: boolean) => void;
  onOpenPickupCode: (listing: FoodListing) => void;
  onRate?: (listing: FoodListing) => void;
  onViewRoute?: (listing: FoodListing) => void;
}

export const ListingDetailView: React.FC<ListingDetailViewProps> = ({
  listing,
  currentUser,
  currentLang,
  onBack,
  onBook,
  onOpenPickupCode,
  onRate,
  onViewRoute
}) => {
  const t = translations[currentLang];
  const [requestDelivery, setRequestDelivery] = useState(false);
  const [copied, setCopied] = useState(false);

  const isVeg = listing.foodType === 'veg';
  const isDonorOwner = currentUser.id === listing.donorId;
  const isBookedByMe = listing.bookedById === currentUser.id;
  const isAvailable = listing.status === 'available';

  // Calculate hours remaining
  const diffMs = new Date(listing.safeUntil).getTime() - Date.now();
  const totalMins = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Back button & share toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-sans text-[#595855] hover:text-[#000000] transition-colors py-1.5 px-3 rounded-[28.8px] border border-[#dfdcd5] bg-[#e7e5e4]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-sans text-[#000000] border border-[#dfdcd5] bg-[#e7e5e4] px-3.5 py-1.5 rounded-[28.8px] hover:bg-[#dfdcd5] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link Copied!' : 'Share Listing'}</span>
        </button>
      </div>

      {/* Main Hero Card — Bone Surface */}
      <div className="card-bone overflow-hidden">
        
        {/* Large Food Image */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#dfdcd5]">
          <img
            src={listing.photoUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Dietary badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-[28.8px] text-[10px] font-mono uppercase tracking-widest bg-[#000000] text-[#ffffff] border border-[#dfdcd5]">
              {listing.foodType}
            </span>

            <span className="bg-[#ffffff] text-[#000000] text-[11px] font-mono px-3 py-1 rounded-[28.8px] border border-[#dfdcd5]">
              {listing.quantityPlates} Plates ({listing.quantityKg} kg)
            </span>
          </div>

          {/* Urgency Pill */}
          <div className="absolute top-4 right-4">
            <span className="bg-[#ffffff] text-[#000000] font-mono text-[11px] px-3.5 py-1 rounded-[28.8px] border border-[#dfdcd5] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Safe for {hrs}h {mins}m</span>
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <h1 className="text-2xl sm:text-4xl font-davinci font-normal leading-tight">
              {listing.title}
            </h1>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Status Alert Banner */}
          {!isAvailable && (
            <div className="p-4 rounded-[9px] border border-[#dfdcd5] bg-[#dfdcd5] text-xs font-mono text-[#000000] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>
                  Status: {listing.status.toUpperCase()}
                  {listing.bookedByName && ` by ${listing.bookedByName}`}
                </span>
              </div>

              {(isBookedByMe || isDonorOwner) && listing.status === 'booked' && (
                <button
                  onClick={() => onOpenPickupCode(listing)}
                  className="px-3.5 py-1.5 bg-[#000000] text-white rounded-[28.8px] text-[11px] font-sans hover:opacity-90"
                >
                  {isDonorOwner ? 'Verify PIN Code' : 'View My 4-Digit Code'}
                </button>
              )}
            </div>
          )}

          {/* Description & Packaging Notes */}
          <div>
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#595855] mb-1.5">
              Food Preparation & Packaging Details
            </h3>
            <p className="text-sm font-sans text-[#000000] leading-relaxed">
              {listing.description}
            </p>
            {listing.notes && (
              <div className="mt-3 p-3 bg-[#dfdcd5] rounded-[9px] text-xs font-sans text-[#000000] border border-[#dfdcd5]">
                <strong>Donor Note:</strong> {listing.notes}
              </div>
            )}
          </div>

          {/* Food Safety Guarantee Card */}
          <div className="bg-[#dfdcd5] p-4 rounded-[9px] border border-[#dfdcd5] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#000000] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-davinci font-normal text-[#000000]">
                FoodResQ 4-Point Safety Verified
              </h4>
              <p className="text-xs font-sans text-[#595855] mt-0.5">
                Freshly prepared, kept in temperature-controlled containers, untouched by diners, and packed in hygienic food-grade vessels.
              </p>
            </div>
          </div>

          {/* Location & Donor Profile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Location Card */}
            <div className="p-4 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#595855]">
                Pickup Address
              </span>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#000000] shrink-0 mt-0.5" />
                <p className="text-xs font-sans text-[#000000]">
                  {listing.pickupAddress}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-3">
                {onViewRoute && (
                  <button
                    onClick={() => onViewRoute(listing)}
                    className="text-[11px] font-sans font-medium text-[#000000] bg-[#e7e5e4] px-3 py-1.5 rounded-[28.8px] border border-[#dfdcd5] hover:bg-[#dfdcd5] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>🧭 Live Route Guidance</span>
                  </button>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.pickupAddress)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-sans text-[#595855] hover:text-[#000000] underline"
                >
                  Google Maps ↗
                </a>
              </div>
            </div>

            {/* Donor Card */}
            <div className="p-4 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#595855]">
                Donor Profile
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-davinci font-normal text-[#000000]">
                    {listing.donorName}
                  </h4>
                  <p className="text-[10px] font-sans text-[#595855]">{listing.donorOrg || 'Catering & Banquets'}</p>
                </div>
                {listing.donorRating && (
                  <span className="bg-[#e7e5e4] text-[#000000] text-[11px] font-mono px-2 py-0.5 rounded-[4px] border border-[#dfdcd5]">
                    ★ {listing.donorRating}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-sans text-[#000000] pt-1">
                <Phone className="w-3.5 h-3.5 text-[#595855]" />
                <a href={`tel:${listing.donorPhone}`} className="hover:underline">
                  {listing.donorPhone}
                </a>
              </div>
            </div>

          </div>

          {/* Action Zone for Booking */}
          {isAvailable && (
            <div className="pt-4 border-t border-[#dfdcd5] space-y-4">
              
              {/* Optional Volunteer Delivery Request */}
              <label className="flex items-center gap-3 p-3.5 rounded-[9px] bg-[#ffffff] border border-[#dfdcd5] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={requestDelivery}
                  onChange={(e) => setRequestDelivery(e.target.checked)}
                  className="w-4 h-4 rounded border-[#dfdcd5] text-[#000000] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-sans text-[#000000]">
                    <Truck className="w-3.5 h-3.5 text-[#000000]" />
                    <span>Request Volunteer Transport Delivery</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#595855]">
                    Tick this if your NGO lacks an available vehicle right now. Nearby volunteer drivers will be alerted.
                  </p>
                </div>
              </label>

              {/* Book Button */}
              <button
                onClick={() => onBook(listing, requestDelivery)}
                className="btn-pill w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Book This Food Now (Atomic Lock)</span>
              </button>

              <p className="text-[11px] font-mono text-[#595855] text-center">
                Booking immediately reserves the food so no other NGO can claim it. You will receive a 4-digit pickup code.
              </p>
            </div>
          )}

          {/* Completed Rating Prompt */}
          {listing.status === 'collected' && onRate && (
            <div className="pt-4 border-t border-[#dfdcd5] text-center">
              <button
                onClick={() => onRate(listing)}
                className="btn-pill"
              >
                ★ Rate Handover Experience
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
