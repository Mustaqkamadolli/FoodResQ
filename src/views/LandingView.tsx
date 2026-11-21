import React from 'react';
import { SupportedLanguage, FoodListing, ImpactStats } from '../types';
import { translations } from '../i18n/translations';
import { FoodCard } from '../components/FoodCard';
import { HexNavDot } from '../components/HexNavDot';
import {
  ArrowRight,
  PlusCircle,
  MapPin,
  Flame,
  ChevronRight,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface LandingViewProps {
  currentLang: SupportedLanguage;
  onNavigate: (tab: string) => void;
  urgentListings: FoodListing[];
  impactStats: ImpactStats;
  onSelectListing: (listing: FoodListing) => void;
  onBookListing: (listing: FoodListing) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  currentLang,
  onNavigate,
  urgentListings,
  impactStats,
  onSelectListing,
  onBookListing
}) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-20 pb-20 bg-[#c4c3b6] text-[#000000]">
      
      {/* HERO SECTION — Structured Renaissance Folio */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#dfdcd5]">
        
        {/* Prominent, 100% Fully Visible FoodResQ Hero Brand Title */}
        <div className="w-full max-w-5xl mx-auto text-center px-4 pt-4 pb-2 select-none">
          <div className="inline-block">
            <span className="hero-wordmark tracking-tight text-[#000000]">
              FoodRes<span className="text-[#064E3B]">Q</span>
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mt-6 relative z-10">
          
          {/* Museum Label Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[28.8px] bg-[#e7e5e4] text-[#000000] text-[11px] font-mono uppercase tracking-[0.14em] border border-[#dfdcd5] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#000000]"></span>
            <span>Bengaluru Surplus Rescue Network · Est. 2026</span>
          </div>

          {/* Main Hero Headline: Davinci 52px serif with italic highlight */}
          <h1 className="text-4xl sm:text-6xl font-davinci font-normal text-[#000000] tracking-tight leading-[1.05] mb-6">
            DON'T WASTE IT. <br />
            <span className="italic font-normal">share it.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#595855] font-sans font-normal leading-relaxed mb-8">
            Connecting surplus food from weddings, campus messes, and caterers with nearby verified NGOs and shelters before expiry.
          </p>

          {/* Stat Pair in Helvetica Now */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-6 py-2.5 rounded-[9px] bg-[#e7e5e4] border border-[#dfdcd5] text-xs font-mono tracking-wider text-[#000000] mb-8">
            <span>MEALS SAVED: <strong className="font-bold">{impactStats.totalMealsSaved.toLocaleString()}</strong></span>
            <span className="text-[#808080]">·</span>
            <span>RESCUED: <strong className="font-bold">{impactStats.totalKgRescued.toLocaleString()} KG</strong></span>
            <span className="text-[#808080]">·</span>
            <span>CO2 AVOIDED: <strong className="font-bold">{impactStats.totalCo2AvoidedKg.toLocaleString()} KG</strong></span>
          </div>

          {/* Action Buttons: Pill buttons (28.8px radius) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => onNavigate('donate')}
              className="btn-pill w-full sm:w-auto flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.donateFood}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('browse')}
              className="w-full sm:w-auto px-[17px] py-[9px] rounded-[28.8px] bg-[#e7e5e4] text-[#000000] font-sans text-[12px] font-medium border border-[#dfdcd5] hover:bg-[#dfdcd5] transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.findFood}</span>
            </button>
          </div>

          {/* Editorial Trust Markers */}
          <div className="mt-10 flex items-center justify-center gap-6 text-[11px] font-mono text-[#595855] flex-wrap uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#000000]" /> Leaflet & OSM Integration
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#000000]" /> 100% Verified NGOs
            </span>
            <span>·</span>
            <span>Zero Waste Commitment</span>
          </div>

        </div>
      </section>

      {/* PITCH-BLACK ROOM SECTION — Structured Dark Folio Room */}
      <section className="bg-[#000000] text-[#ffffff] py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <HexNavDot color="#ffffff" active={true} size={14} />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#808080]">
                Max Food Preserved
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-davinci font-normal tracking-tight">
              SURPLUS RESCUE EXPLAINED
            </h2>
            <p className="text-sm font-sans text-[#808080] leading-relaxed">
              Surplus banquet food is perishable within hours. Our protocol coordinates immediate local pickup through three synchronous steps.
            </p>
          </div>

          {/* 3 Circular Vignettes (~200px diameter with Hex indicators) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <div className="flex flex-col items-center space-y-4">
              <div className="circular-vignette w-48 h-48 border border-[#595855] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
                  alt="AI Food Recognition"
                  className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <HexNavDot color="#dfdcd5" active={true} size={12} />
                <span className="text-xs font-mono tracking-widest text-[#dfdcd5]">01 / SCAN & CATALOG</span>
              </div>
              <h3 className="text-lg font-davinci font-normal text-white">AI Vision Auto-Fill</h3>
              <p className="text-xs font-sans text-[#808080] max-w-xs leading-relaxed">
                Take a photo of surplus banquet trays. Gemini AI estimates plate counts, identifies vegetarian status, and verifies freshness.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="circular-vignette w-48 h-48 border border-[#595855] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=80"
                  alt="Atomic Reservation Lock"
                  className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <HexNavDot color="#dfdcd5" active={true} size={12} />
                <span className="text-xs font-mono tracking-widest text-[#dfdcd5]">02 / ATOMIC LOCK</span>
              </div>
              <h3 className="text-lg font-davinci font-normal text-white">Instant Booking Lock</h3>
              <p className="text-xs font-sans text-[#808080] max-w-xs leading-relaxed">
                When an NGO claims food, the listing locks immediately via atomic transactions. A 4-digit pickup code is assigned to prevent duplicate claims.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="circular-vignette w-48 h-48 border border-[#595855] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80"
                  alt="Verified Handover"
                  className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <HexNavDot color="#dfdcd5" active={true} size={12} />
                <span className="text-xs font-mono tracking-widest text-[#dfdcd5]">03 / VERIFIED HANDOVER</span>
              </div>
              <h3 className="text-lg font-davinci font-normal text-white">PIN Code Handover</h3>
              <p className="text-xs font-sans text-[#808080] max-w-xs leading-relaxed">
                Donor checks the receiver's 4-digit PIN at the door. Food status transitions to 'Collected' and impact metrics increment in real time.
              </p>
            </div>

          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => onNavigate('browse')}
              className="px-6 py-2.5 rounded-[28.8px] bg-white text-black font-sans text-xs font-medium hover:bg-[#e7e5e4] transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Live Rescue Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* URGENT FOOD SPOTLIGHT NEARBY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#dfdcd5] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#000000] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#000000]" />
              <span>Urgent Surplus</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-davinci font-normal text-[#000000]">
              {t.urgentFoodNearYou}
            </h3>
            <p className="text-xs text-[#595855] font-sans mt-0.5">Expiring in under 2 to 4 hours — claim for immediate distribution</p>
          </div>

          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-mono uppercase tracking-wider text-[#000000] hover:text-[#595855] flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{t.exploreAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgentListings.slice(0, 3).map((listing) => (
            <FoodCard
              key={listing.id}
              listing={listing}
              onBook={onBookListing}
              onViewDetails={onSelectListing}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — Bone Cards on Putty */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#595855]">
            Structured Workflow
          </span>
          <h2 className="text-3xl font-davinci font-normal text-[#000000] mt-1">
            {t.howItWorks}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="card-bone p-7 relative">
            <span className="text-2xl font-davinci font-normal text-[#000000] mb-4 block">
              I.
            </span>
            <h3 className="text-base font-davinci font-normal text-[#000000] mb-2">
              {t.step1Title}
            </h3>
            <p className="text-xs font-sans text-[#595855] leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          <div className="card-bone p-7 relative">
            <span className="text-2xl font-davinci font-normal text-[#000000] mb-4 block">
              II.
            </span>
            <h3 className="text-base font-davinci font-normal text-[#000000] mb-2">
              {t.step2Title}
            </h3>
            <p className="text-xs font-sans text-[#595855] leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          <div className="card-bone p-7 relative">
            <span className="text-2xl font-davinci font-normal text-[#000000] mb-4 block">
              III.
            </span>
            <h3 className="text-base font-davinci font-normal text-[#000000] mb-2">
              {t.step3Title}
            </h3>
            <p className="text-xs font-sans text-[#595855] leading-relaxed">
              {t.step3Desc}
            </p>
          </div>

        </div>
      </section>

      {/* TESTIMONIAL FOLIO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="card-bone p-8 sm:p-12 text-center space-y-4">
          <Quote className="w-8 h-8 text-[#595855] mx-auto opacity-40" />
          <p className="text-base sm:text-lg font-davinci italic text-[#000000] leading-relaxed">
            "During weekend wedding seasons at Palace Grounds, we used to throw away over 200 plates of fresh biryani and pulao. With FoodResQ, Robin Hood Army and Sneha Sadan collect the hot containers within 45 minutes."
          </p>
          <div className="pt-2 border-t border-[#dfdcd5] max-w-xs mx-auto">
            <h4 className="text-xs font-bold font-sans text-[#000000] uppercase tracking-wider">
              Priya Sharma
            </h4>
            <p className="text-[11px] font-sans text-[#595855]">
              Head Caterer, Royal Sagar Banquets (Gold Food Hero)
            </p>
          </div>
        </div>
      </section>

      {/* CHALK FOOTER — Structured Renaissance Footer */}
      <footer className="bg-[#ebebeb] border-t border-[#dfdcd5] pt-14 pb-12 text-[#595855] text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full border border-[#000000] flex items-center justify-center font-davinci text-xs text-[#000000]">
                F
              </div>
              <span className="font-davinci text-base text-[#000000] tracking-tight">
                FoodResQ
              </span>
            </div>
            <p className="text-[11px] text-[#595855] leading-relaxed font-sans">
              Connecting surplus banquet and mess food with Bengaluru NGOs, anathashrams, and families in need.
            </p>
          </div>

          <div>
            <h5 className="font-mono text-[10px] text-[#000000] mb-3 uppercase tracking-widest">
              Directory
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => onNavigate('browse')} className="hover:text-[#000000]">Surplus Food Map</button></li>
              <li><button onClick={() => onNavigate('events')} className="hover:text-[#000000]">Event Mode (Banquet Bookings)</button></li>
              <li><button onClick={() => onNavigate('volunteer')} className="hover:text-[#000000]">Volunteer Delivery Board</button></li>
              <li><button onClick={() => onNavigate('impact')} className="hover:text-[#000000]">Community Impact Ledger</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[10px] text-[#000000] mb-3 uppercase tracking-widest">
              Verification
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => onNavigate('admin')} className="hover:text-[#000000]">Verified NGO Program</button></li>
              <li><button onClick={() => onNavigate('admin')} className="hover:text-[#000000]">City Waste Hotspot Map</button></li>
              <li><button onClick={() => onNavigate('profile')} className="hover:text-[#000000]">Food Hero Certificate</button></li>
              <li><a href="tel:18002008888" className="hover:text-[#000000]">Helpline: 1800 200 8888</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[10px] text-[#000000] mb-3 uppercase tracking-widest">
              Architecture
            </h5>
            <p className="text-[11px] text-[#595855] mb-2">
              Leaflet · OpenStreetMap · Supabase RLS · Web Speech API
            </p>
            <div className="card-bone p-2 text-[10px] text-[#000000] font-mono">
              Offline-ready PWA · Structured Theme
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#dfdcd5] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#595855] font-mono">
          <span>© 2026 FoodResQ Bengaluru. All surplus saved.</span>
          <span className="mt-2 sm:mt-0">Renaissance Gallery on Putty Paper</span>
        </div>
      </footer>

    </div>
  );
};
