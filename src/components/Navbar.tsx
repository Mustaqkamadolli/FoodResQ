import React, { useState } from 'react';
import { SupportedLanguage, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import {
  Bell,
  Globe,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  currentUser: UserProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  currentUser,
  activeTab,
  onTabChange,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const navLinks = [
    { id: 'browse', label: 'Directory' },
    { id: 'events', label: 'Banquet Events' },
    { id: 'volunteer', label: 'Deliveries' },
    { id: 'impact', label: 'Impact Folio' },
  ];

  if (currentUser.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Hub' });
  }

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full h-12 px-6 sm:px-10 flex items-center justify-between bg-[#c4c3b6] border-b border-[#dfdcd5] sticky top-[33px] z-30 select-none">
      
      {/* Top-Left: Circled Monogram (32px diameter, 1.5px #000000 stroke) */}
      <div 
        onClick={() => onTabChange('landing')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 group-hover:scale-105"
        >
          <circle cx="16" cy="16" r="14.5" stroke="#000000" strokeWidth="1.5" />
          <text
            x="16"
            y="21.5"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="17"
            fontWeight="500"
            textAnchor="middle"
            fill="#000000"
          >
            F
          </text>
        </svg>

        <span className="font-davinci text-lg font-bold tracking-tight text-[#000000]">
          FoodRes<span className="text-[#064E3B]">Q</span>
        </span>
      </div>

      {/* Desktop Navigation Links (Ghost text links in Helvetica Now 12px, underline on hover only) */}
      <nav className="hidden md:flex items-center gap-8 font-grotesk text-xs">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`ghost-link ${isActive ? 'underline font-medium' : 'font-normal'}`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Right Actions: Language Switcher, Notifications, Role Profile, Black Pill Button */}
      <div className="flex items-center gap-4">
        
        {/* Language Switcher */}
        <div className="flex items-center font-grotesk text-xs text-[#000000]">
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-transparent text-[11px] font-grotesk font-medium text-[#000000] outline-none cursor-pointer py-1"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          className="relative p-1 text-[#000000] hover:opacity-75 transition-opacity cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#000000] text-[#ffffff] text-[9px] font-grotesk rounded-full flex items-center justify-center">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* User Persona Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className="ghost-link hidden lg:inline-flex items-center gap-1.5 text-xs text-[#595855]"
        >
          <span>{currentUser.name.split(' ')[0]}</span>
          <span className="text-[10px] uppercase tracking-wider text-[#000000]">({currentUser.role})</span>
        </button>

        {/* Primary CTA: Filled Black Pill Button (9px 17px padding, 28.8px radius) */}
        <button
          onClick={() => onTabChange('donate')}
          className="btn-pill hidden sm:inline-flex"
        >
          {t.donateFood}
        </button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-[#000000]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[73px] left-0 right-0 bg-[#e7e5e4] border-b border-[#dfdcd5] p-6 space-y-4 shadow-xl z-30 font-grotesk text-xs">
          <button
            onClick={() => handleNavClick('donate')}
            className="btn-pill w-full py-3"
          >
            {t.donateFood}
          </button>

          <div className="space-y-3 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="block w-full text-left py-1.5 ghost-link text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#dfdcd5] flex justify-between items-center text-xs text-[#595855]">
            <button onClick={() => handleNavClick('profile')} className="ghost-link">
              Food Hero Profile & Certificate
            </button>
            <button onClick={onOpenAuth} className="ghost-link font-medium">
              Switch Account
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
