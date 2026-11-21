import React, { useState } from 'react';
import { store, SEED_PROFILES } from '../services/store';
import { UserProfile } from '../types';
import { Check, RotateCcw } from 'lucide-react';

interface DemoRoleSwitcherProps {
  currentUser: UserProfile;
  onUserChange?: (user: UserProfile) => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ currentUser, onUserChange }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectUser = (profile: UserProfile) => {
    store.switchUser(profile.id);
    if (onUserChange) onUserChange(profile);
    showToast(`Persona: ${profile.name} (${profile.role.toUpperCase()})`);
  };

  const handleResetData = () => {
    if (confirm("Reset demo data back to initial 15 Bengaluru listings and 3 NGOs?")) {
      store.resetToDefaultSeed();
      showToast("Gallery records reset to baseline seed.");
    }
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#000000] text-[#ffffff] px-4 py-2 rounded-[28.8px] text-xs font-grotesk tracking-wide flex items-center gap-2 border border-[#595855] animate-in fade-in duration-200">
          <Check className="w-3.5 h-3.5 text-[#ffffff]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <aside aria-label="Demo Persona Switcher" className="bg-[#000000] text-[#ffffff] text-[11px] font-grotesk py-1.5 px-6 border-b border-[#595855] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest text-[#808080]">
              DEMO PERSONA:
            </span>
            <span className="font-medium text-[#ffffff] truncate">
              {currentUser.name}
            </span>
            {currentUser.isVerified && (
              <span className="text-[9px] font-medium text-[#808080] border border-[#595855] px-1.5 py-0.2 rounded-[2px] hidden sm:inline">
                VERIFIED
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[10px] text-[#808080] hidden lg:inline mr-1">Switch:</span>

            {SEED_PROFILES.map((p) => {
              const isSelected = p.id === currentUser.id;
              let label = p.role === 'donor' ? 'Donor' :
                p.role === 'volunteer' ? 'Volunteer' :
                p.role === 'admin' ? 'City Admin' :
                p.isVerified ? 'Verified NGO' : 'Pending NGO';

              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectUser(p)}
                  className={`px-2.5 py-0.5 rounded-[28.8px] text-[10px] font-grotesk transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#ffffff] text-[#000000] font-medium'
                      : 'bg-transparent text-[#808080] hover:text-[#ffffff] border border-[#595855]'
                  }`}
                  title={`${p.name} (${p.email})`}
                >
                  {label}
                </button>
              );
            })}

            <button
              onClick={handleResetData}
              title="Reset sample listings"
              className="p-1 text-[#808080] hover:text-[#ffffff] transition-colors ml-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
