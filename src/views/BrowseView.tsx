import React, { useState, useMemo } from 'react';
import { FoodListing, SupportedLanguage, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { FoodMap } from '../components/FoodMap';
import { FoodCard } from '../components/FoodCard';
import {
  Map,
  List,
  Search,
  Flame,
  SlidersHorizontal
} from 'lucide-react';

interface BrowseViewProps {
  listings: FoodListing[];
  currentLang: SupportedLanguage;
  currentUser: UserProfile;
  onSelectListing: (listing: FoodListing) => void;
  onBookListing: (listing: FoodListing) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  listings,
  currentLang,
  currentUser,
  onSelectListing,
  onBookListing
}) => {
  const t = translations[currentLang];
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [minPlates, setMinPlates] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'soonest' | 'plates' | 'recent'>('soonest');
  const [selectedListingId, setSelectedListingId] = useState<string | undefined>();

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Don't show already collected or expired items in active browse
      if (item.status === 'collected' || item.status === 'expired') return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesArea = item.pickupAddress.toLowerCase().includes(query);
        const matchesDonor = item.donorName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesArea && !matchesDonor) return false;
      }

      // Veg filter
      if (vegFilter !== 'all' && item.foodType !== vegFilter) {
        return false;
      }

      // Urgent filter (<2 hours)
      if (urgentOnly) {
        const diffHrs = (new Date(item.safeUntil).getTime() - Date.now()) / (3600 * 1000);
        if (diffHrs > 2) return false;
      }

      // Minimum plates
      if (minPlates > 0 && item.quantityPlates < minPlates) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'soonest') {
        return new Date(a.safeUntil).getTime() - new Date(b.safeUntil).getTime();
      } else if (sortBy === 'plates') {
        return b.quantityPlates - a.quantityPlates;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [listings, searchQuery, vegFilter, urgentOnly, minPlates, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Search / Filters Toolbar — Bone Card */}
      <div className="card-bone p-6 space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#000000] bg-[#dfdcd5] px-2 py-0.5 rounded-[4px]">
                Active Feed
              </span>
              <span className="text-xs font-mono text-[#595855]">
                {filteredListings.length} surplus lots across Bengaluru
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-davinci font-normal text-[#000000] mt-1.5">
              Surplus Food Map & Directory
            </h1>
          </div>

          {/* Map vs List View Toggle */}
          <div className="flex items-center bg-[#dfdcd5] p-1 rounded-[28.8px] self-start md:self-auto">
            <button
              onClick={() => setViewMode('both')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-[28.8px] text-xs font-sans transition-all ${
                viewMode === 'both'
                  ? 'bg-[#000000] text-[#ffffff]'
                  : 'text-[#595855] hover:text-[#000000]'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Split</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-[28.8px] text-xs font-sans transition-all ${
                viewMode === 'map'
                  ? 'bg-[#000000] text-[#ffffff]'
                  : 'text-[#595855] hover:text-[#000000]'
              }`}
            >
              <Map className="w-3 h-3" />
              <span>Map</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-[28.8px] text-xs font-sans transition-all ${
                viewMode === 'list'
                  ? 'bg-[#000000] text-[#ffffff]'
                  : 'text-[#595855] hover:text-[#000000]'
              }`}
            >
              <List className="w-3 h-3" />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Search Input & Quick Filter Chips */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#808080] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish name, area (Malleshwaram, Palace Grounds, Koramangala)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] placeholder-[#808080] outline-hidden focus:border-[#000000] font-sans"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-sans px-3 py-2.5 rounded-[9px] border border-[#dfdcd5] bg-[#ffffff] text-[#000000] outline-hidden cursor-pointer"
            >
              <option value="soonest">⏱ Soonest Expiry</option>
              <option value="plates">🍲 Highest Quantity</option>
              <option value="recent">✨ Recently Posted</option>
            </select>
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 font-sans">
          <button
            onClick={() => setVegFilter('all')}
            className={`px-3 py-1 rounded-[28.8px] text-xs whitespace-nowrap transition-all border ${
              vegFilter === 'all'
                ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
                : 'bg-[#e7e5e4] text-[#595855] border-[#dfdcd5] hover:border-[#000000]'
            }`}
          >
            All Diets
          </button>

          <button
            onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
            className={`px-3 py-1 rounded-[28.8px] text-xs whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              vegFilter === 'veg'
                ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
                : 'bg-[#e7e5e4] text-[#000000] border-[#dfdcd5] hover:border-[#000000]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#000000]"></span>
            <span>Veg Only</span>
          </button>

          <button
            onClick={() => setVegFilter(vegFilter === 'non-veg' ? 'all' : 'non-veg')}
            className={`px-3 py-1 rounded-[28.8px] text-xs whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              vegFilter === 'non-veg'
                ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
                : 'bg-[#e7e5e4] text-[#000000] border-[#dfdcd5] hover:border-[#000000]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full border border-[#000000]"></span>
            <span>Non-Veg Only</span>
          </button>

          <button
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`px-3 py-1 rounded-[28.8px] text-xs whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              urgentOnly
                ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
                : 'bg-[#e7e5e4] text-[#000000] border-[#dfdcd5] hover:border-[#000000]'
            }`}
          >
            <Flame className="w-3 h-3 text-[#000000]" />
            <span>Expires in &lt;2 hrs</span>
          </button>

          <button
            onClick={() => setMinPlates(minPlates === 50 ? 0 : 50)}
            className={`px-3 py-1 rounded-[28.8px] text-xs whitespace-nowrap transition-all border ${
              minPlates === 50
                ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
                : 'bg-[#e7e5e4] text-[#595855] border-[#dfdcd5] hover:border-[#000000]'
            }`}
          >
            Large Batches (&gt;50 plates)
          </button>
        </div>

      </div>

      {/* Main Content Layout */}
      {viewMode === 'both' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Leaflet OpenStreetMap */}
          <div className="lg:col-span-7 h-[580px] sticky top-24">
            <FoodMap
              listings={filteredListings}
              selectedListingId={selectedListingId}
              onSelectListing={(listing) => {
                setSelectedListingId(listing.id);
                onSelectListing(listing);
              }}
            />
          </div>

          {/* Right Column: Listing Cards List */}
          <div className="lg:col-span-5 space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {filteredListings.length === 0 ? (
              <div className="card-bone p-12 text-center text-[#595855]">
                <p className="font-davinci text-lg text-[#000000] mb-1">No surplus food found</p>
                <p className="text-xs font-sans">Try adjusting your filters or search radius</p>
              </div>
            ) : (
              filteredListings.map((listing) => (
                <FoodCard
                  key={listing.id}
                  listing={listing}
                  onBook={onBookListing}
                  onViewDetails={onSelectListing}
                  onGuideRoute={(item) => {
                    setSelectedListingId(item.id);
                  }}
                />
              ))
            )}
          </div>

        </div>
      )}

      {viewMode === 'map' && (
        <div className="h-[680px]">
          <FoodMap
            listings={filteredListings}
            selectedListingId={selectedListingId}
            onSelectListing={(listing) => {
              setSelectedListingId(listing.id);
              onSelectListing(listing);
            }}
          />
        </div>
      )}

      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length === 0 ? (
            <div className="col-span-full card-bone p-16 text-center text-[#595855]">
              <p className="font-davinci text-xl text-[#000000] mb-2">No surplus food listings match</p>
              <p className="text-xs font-sans">Clear filters to see all available lots</p>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <FoodCard
                key={listing.id}
                listing={listing}
                onBook={onBookListing}
                onViewDetails={onSelectListing}
                onGuideRoute={(item) => {
                  setSelectedListingId(item.id);
                  setViewMode('both');
                }}
              />
            ))
          )}
        </div>
      )}

    </div>
  );
};
