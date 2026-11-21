import React from 'react';
import { MapPin, Plus, Calendar, BookmarkCheck, User } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentLang: SupportedLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#e7e5e4] border-t border-[#dfdcd5] px-4 py-2 font-grotesk">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Directory */}
        <button
          onClick={() => onTabChange('browse')}
          className={`flex flex-col items-center py-1 px-2 transition-colors cursor-pointer ${
            activeTab === 'browse' ? 'text-[#000000] font-medium' : 'text-[#595855]'
          }`}
        >
          <MapPin className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-wide">Directory</span>
        </button>

        {/* Bookings */}
        <button
          onClick={() => onTabChange('bookings')}
          className={`flex flex-col items-center py-1 px-2 transition-colors cursor-pointer ${
            activeTab === 'bookings' ? 'text-[#000000] font-medium' : 'text-[#595855]'
          }`}
        >
          <BookmarkCheck className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-wide">Bookings</span>
        </button>

        {/* Center Donate Pill */}
        <button
          onClick={() => onTabChange('donate')}
          className="btn-pill px-4 py-2 text-[11px]"
          title="Donate Food"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Donate</span>
        </button>

        {/* Events */}
        <button
          onClick={() => onTabChange('events')}
          className={`flex flex-col items-center py-1 px-2 transition-colors cursor-pointer ${
            activeTab === 'events' ? 'text-[#000000] font-medium' : 'text-[#595855]'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-wide">Events</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center py-1 px-2 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-[#000000] font-medium' : 'text-[#595855]'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-wide">Profile</span>
        </button>

      </div>
    </nav>
  );
};
