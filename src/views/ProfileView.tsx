import React from 'react';
import { UserProfile, SupportedLanguage } from '../types';
import {
  Award,
  ShieldCheck,
  Phone,
  Mail,
  Building2,
  Download
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  onOpenCertificate: () => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  currentLang,
  onOpenCertificate,
  onOpenAuth
}) => {
  const meals = currentUser.mealsDonated || 3450;
  const nextTierMeals = currentUser.badgeLevel === 'Bronze' ? 1000 : currentUser.badgeLevel === 'Silver' ? 5000 : 10000;
  const progressPercent = Math.min(100, Math.round((meals / nextTierMeals) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="card-bone p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[9px] bg-[#000000] text-white text-2xl font-davinci flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-davinci font-normal text-[#000000]">
                  {currentUser.name}
                </h1>
                {currentUser.isVerified && (
                  <span className="bg-[#dfdcd5] text-[#000000] text-[10px] font-mono px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#000000]" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs font-sans text-[#595855] mt-0.5">
                Role: <strong className="capitalize">{currentUser.role}</strong>
                {currentUser.organizationName && ` · ${currentUser.organizationName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCertificate}
              className="btn-pill flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Food Hero Certificate</span>
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-[28.8px] border border-[#dfdcd5] text-xs font-sans text-[#595855] hover:text-[#000000]"
            >
              Switch Role
            </button>
          </div>
        </div>

        {/* Hero Badge Progress */}
        <div className="p-5 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#000000]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#000000]">
                Food Hero Tier: ★ {currentUser.badgeLevel} Level
              </span>
            </div>
            <span className="text-xs font-mono text-[#595855]">
              {meals} / {nextTierMeals} meals to next tier
            </span>
          </div>

          <div className="w-full bg-[#dfdcd5] rounded-full h-2 overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-[#000000] h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#dfdcd5] text-xs font-sans">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#595855]">Email</span>
            <p className="font-bold text-[#000000] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#595855]" />
              {currentUser.email}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#595855]">Phone</span>
            <p className="font-bold text-[#000000] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#595855]" />
              {currentUser.phone || '+91 98450 12345'}
            </p>
          </div>

          {currentUser.organizationName && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#595855]">Organization / Entity</span>
              <p className="font-bold text-[#000000] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#595855]" />
                {currentUser.organizationName}
              </p>
            </div>
          )}

          {currentUser.registrationNumber && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#595855]">Registration / Tax ID</span>
              <p className="font-bold text-[#000000]">
                {currentUser.registrationNumber}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
