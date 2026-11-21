import React, { useState } from 'react';
import { FoodListing, UserProfile, SupportedLanguage } from '../types';
import {
  Award,
  PlusCircle,
  Download
} from 'lucide-react';

interface DonorDashboardViewProps {
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  listings: FoodListing[];
  onOpenDonate: () => void;
  onOpenPickupCode: (listing: FoodListing) => void;
  onOpenCertificate: () => void;
  onViewDetails: (listing: FoodListing) => void;
}

export const DonorDashboardView: React.FC<DonorDashboardViewProps> = ({
  currentUser,
  currentLang,
  listings,
  onOpenDonate,
  onOpenPickupCode,
  onOpenCertificate,
  onViewDetails
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'collected'>('all');

  // Filter listings where currentUser is the donor (or in demo mode, show all donor's items)
  const donorListings = listings.filter((l) => l.donorId === currentUser.id || currentUser.role === 'donor');

  const pendingHandoverListings = donorListings.filter((l) => l.status === 'booked');
  const availableListings = donorListings.filter((l) => l.status === 'available');
  const collectedListings = donorListings.filter((l) => l.status === 'collected');

  const filteredListings = filter === 'pending'
    ? pendingHandoverListings
    : filter === 'collected'
    ? collectedListings
    : donorListings;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header & Hero Stats — Bone Card Frame */}
      <div className="card-bone p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-0.5 rounded-[28.8px] bg-[#dfdcd5] text-[#000000] border border-[#dfdcd5]">
                ★ {currentUser.badgeLevel} Food Hero
              </span>
              <span className="text-xs font-mono text-[#595855]">
                {currentUser.organizationName || 'Catering Partner'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-davinci font-normal text-[#000000] mt-2">
              {currentUser.name}
            </h1>
            <p className="text-xs font-sans text-[#595855] mt-1">
              Your surplus food is directly transforming lives across Bengaluru.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCertificate}
              className="px-4 py-2 rounded-[28.8px] bg-[#dfdcd5] text-[#000000] text-xs font-sans border border-[#dfdcd5] hover:bg-[#c4c3b6] transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get Hero Certificate</span>
            </button>

            <button
              onClick={onOpenDonate}
              className="btn-pill flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Donate Food</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-[#dfdcd5]">
          <div className="bg-[#ffffff] rounded-[9px] p-4 border border-[#dfdcd5]">
            <span className="text-[10px] font-mono uppercase text-[#595855] block mb-1">
              Meals Donated
            </span>
            <p className="text-2xl font-mono text-[#000000]">
              {(currentUser.mealsDonated || 0).toLocaleString()}
            </p>
            <span className="text-[10px] font-sans text-[#595855] mt-1 block">
              Direct community relief
            </span>
          </div>

          <div className="bg-[#ffffff] rounded-[9px] p-4 border border-[#dfdcd5]">
            <span className="text-[10px] font-mono uppercase text-[#595855] block mb-1">
              Surplus Weight
            </span>
            <p className="text-2xl font-mono text-[#000000]">
              {(currentUser.kgRescued || 0).toLocaleString()} kg
            </p>
            <span className="text-[10px] font-sans text-[#595855] mt-1 block">
              Rescued from landfill
            </span>
          </div>

          <div className="bg-[#ffffff] rounded-[9px] p-4 border border-[#dfdcd5]">
            <span className="text-[10px] font-mono uppercase text-[#595855] block mb-1">
              CO2 Prevented
            </span>
            <p className="text-2xl font-mono text-[#000000]">
              {Math.round((currentUser.kgRescued || 0) * 2).toLocaleString()} kg
            </p>
            <span className="text-[10px] font-sans text-[#595855] mt-1 block">
              Emissions avoided
            </span>
          </div>

          <div className="bg-[#ffffff] rounded-[9px] p-4 border border-[#dfdcd5]">
            <span className="text-[10px] font-mono uppercase text-[#595855] block mb-1">
              Donor Rating
            </span>
            <p className="text-2xl font-mono text-[#000000]">
              ★ {currentUser.ratingAvg || '5.0'}
            </p>
            <span className="text-[10px] font-sans text-[#595855] mt-1 block">
              {currentUser.ratingCount || 12} verified reviews
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Handover Notice if pending */}
      {pendingHandoverListings.length > 0 && (
        <div className="card-bone p-5 border border-[#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#000000] animate-pulse"></span>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#000000]">
                {pendingHandoverListings.length} Surplus Lot(s) Booked & Waiting for Pickup!
              </h3>
              <p className="text-xs font-sans text-[#595855]">
                When receiver or volunteer arrives, enter their 4-digit code to complete the handover.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenPickupCode(pendingHandoverListings[0])}
            className="btn-pill text-xs whitespace-nowrap self-start sm:self-auto"
          >
            Verify Handover PIN Now
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-[#dfdcd5]">
        <h2 className="text-xl font-davinci font-normal text-[#000000]">
          My Donation History ({donorListings.length})
        </h2>

        <div className="flex bg-[#dfdcd5] p-1 rounded-[28.8px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-[28.8px] text-xs font-sans transition-all ${
              filter === 'all'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            All ({donorListings.length})
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-[28.8px] text-xs font-sans transition-all ${
              filter === 'pending'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            Booked ({pendingHandoverListings.length})
          </button>

          <button
            onClick={() => setFilter('collected')}
            className={`px-3 py-1 rounded-[28.8px] text-xs font-sans transition-all ${
              filter === 'collected'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            Collected ({collectedListings.length})
          </button>
        </div>
      </div>

      {/* Listings Table / Cards */}
      <div className="space-y-4">
        {filteredListings.length === 0 ? (
          <div className="card-bone p-12 text-center text-[#595855]">
            <p className="font-davinci text-base text-[#000000]">No donations in this category</p>
          </div>
        ) : (
          filteredListings.map((item) => (
            <div
              key={item.id}
              className="card-bone p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded-[9px] object-cover bg-[#dfdcd5] shrink-0 border border-[#dfdcd5]"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[28.8px] bg-[#dfdcd5] text-[#000000]">
                      {item.foodType} · {item.quantityPlates} pl ({item.quantityKg} kg)
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#000000] bg-[#ffffff] px-2 py-0.5 rounded-[28.8px] border border-[#dfdcd5]">
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-davinci font-normal text-[#000000]">
                    {item.title}
                  </h3>

                  <p className="text-xs font-sans text-[#595855]">
                    Pickup: {item.pickupAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                {item.status === 'booked' && (
                  <button
                    onClick={() => onOpenPickupCode(item)}
                    className="btn-pill text-xs"
                  >
                    Enter 4-Digit Handover PIN
                  </button>
                )}

                <button
                  onClick={() => onViewDetails(item)}
                  className="px-4 py-2 rounded-[28.8px] border border-[#dfdcd5] text-xs font-sans text-[#000000] hover:border-[#000000] transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
