import React, { useState } from 'react';
import { UserProfile, WasteHotspot, SupportedLanguage } from '../types';
import { store } from '../services/store';
import { WasteHeatmap } from '../components/WasteHeatmap';
import {
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

interface AdminViewProps {
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  profiles: UserProfile[];
  hotspots: WasteHotspot[];
  onApproved?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  currentLang,
  profiles,
  hotspots,
  onApproved
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<WasteHotspot | null>(null);

  // Filter receiver profiles that need verification or are verified
  const receiverProfiles = profiles.filter((p) => p.role === 'receiver' || p.organizationName);

  const pendingNgos = receiverProfiles.filter((p) => !p.isVerified);
  const verifiedNgos = receiverProfiles.filter((p) => p.isVerified);

  const handleApprove = (profileId: string) => {
    store.approveNgoVerification(profileId);
    if (onApproved) onApproved();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Title */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] bg-[#dfdcd5] px-2.5 py-0.5 rounded-[4px]">
          City Coordinator & Administrator
        </span>
        <h1 className="text-3xl sm:text-4xl font-davinci font-normal text-[#000000] mt-2">
          Admin Hub & Waste Hotspot Planning
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#595855] mt-1">
          Approve verified NGO badges and monitor city-wide surplus hotspots across Bengaluru.
        </p>
      </div>

      {/* SECTION 1: NGO VERIFICATION WORKFLOW */}
      <div className="card-bone p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-[#000000] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#000000]" />
            </div>
            <div>
              <h2 className="text-lg font-davinci font-normal text-[#000000]">
                NGO Verification Requests ({pendingNgos.length} Pending)
              </h2>
              <p className="text-xs font-sans text-[#595855]">
                Grant "Verified" badges to legitimate charities and anathashrams to reserve high-volume banquet food.
              </p>
            </div>
          </div>
        </div>

        {/* Pending Requests List */}
        {pendingNgos.length === 0 ? (
          <div className="p-4 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5] text-xs font-mono text-[#000000] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#000000]" />
            <span>All NGO applications are up-to-date and approved.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingNgos.map((ngo) => (
              <div
                key={ngo.id}
                className="p-4 sm:p-5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#000000] bg-[#dfdcd5] px-2 py-0.5 rounded-[4px]">
                      Pending Review
                    </span>
                    <h3 className="text-sm font-davinci font-normal text-[#000000]">
                      {ngo.organizationName || ngo.name}
                    </h3>
                  </div>

                  <p className="text-xs font-sans text-[#595855]">
                    Reg ID: <strong className="font-mono text-[#000000]">{ngo.registrationNumber || 'KA/2026/0891 (Under Review)'}</strong> · Contact: {ngo.name} ({ngo.phone})
                  </p>
                  <p className="text-[11px] font-mono text-[#808080]">
                    Email: {ngo.email} · Type: {ngo.receiverType?.toUpperCase() || 'NGO'}
                  </p>
                </div>

                <button
                  onClick={() => handleApprove(ngo.id)}
                  className="btn-pill flex items-center gap-1.5 self-start sm:self-auto text-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Verified Badge</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Already Verified NGOs Table */}
        <div className="pt-4 border-t border-[#dfdcd5]">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#595855] mb-3">
            Currently Verified NGOs & Anathashrams
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {verifiedNgos.map((ngo) => (
              <div
                key={ngo.id}
                className="p-3.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-davinci text-[#000000] truncate">
                    {ngo.organizationName || ngo.name}
                  </span>
                  <span className="text-[#000000] font-mono text-[10px]">✓ Verified</span>
                </div>
                <p className="text-[11px] font-mono text-[#595855]">{ngo.registrationNumber || '12A/80G Certified'}</p>
                <p className="text-[10px] font-sans text-[#808080]">{ngo.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: CITY WASTE HOTSPOT HEATMAP */}
      <div className="card-bone p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] bg-[#dfdcd5] px-2.5 py-0.5 rounded-[4px]">
              City Planner GIS Layer
            </span>
          </div>
          <h2 className="text-xl font-davinci font-normal text-[#000000] mt-2">
            Bengaluru Waste Hotspots Heatmap
          </h2>
          <p className="text-xs font-sans text-[#595855]">
            Density map identifying areas and clusters that generate the highest surplus food volume.
          </p>
        </div>

        {/* Heatmap Component */}
        <WasteHeatmap
          hotspots={hotspots}
          onSelectHotspot={(spot: WasteHotspot) => setSelectedHotspot(spot)}
        />

        {/* Hotspot Breakdown Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              className="p-4 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#000000] bg-[#dfdcd5] px-2 py-0.5 rounded-[4px]">
                  {spot.type}
                </span>
                <span className="text-xs font-mono text-[#000000]">
                  {spot.monthlyDonationsKg.toLocaleString()} kg/mo
                </span>
              </div>
              <h4 className="text-sm font-davinci text-[#000000]">
                {spot.name}
              </h4>
              <p className="text-[11px] font-sans text-[#595855]">
                Area: {spot.area} · ~{spot.mealsShared.toLocaleString()} meals rescued
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
