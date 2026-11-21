import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { FoodListing } from '../types';
import { fetchRoute, RouteResult, getGoogleMapsNavigationUrl } from '../services/routing';
import {
  Navigation,
  Crosshair,
  Clock,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Bike,
  Car
} from 'lucide-react';

interface FoodMapProps {
  listings: FoodListing[];
  selectedListingId?: string;
  onSelectListing: (listing: FoodListing) => void;
  userLocation?: [number, number];
  onUserLocationChange?: (coords: [number, number]) => void;
}

function formatCountdown(safeUntil: string): string {
  const diffMs = new Date(safeUntil).getTime() - Date.now();
  if (diffMs <= 0) return "Expired";
  const totalMins = Math.floor(diffMs / (1000 * 60));
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hrs}h ${mins}m`;
}

export const FoodMap: React.FC<FoodMapProps> = ({
  listings,
  selectedListingId,
  onSelectListing,
  userLocation,
  onUserLocationChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeCasingRef = useRef<L.Polyline | null>(null);

  // Real-time user coordinates: Default to Central Bengaluru (MG Road / Vidhana Soudha)
  const [liveLocation, setLiveLocation] = useState<[number, number]>(
    userLocation || [12.9716, 77.5946]
  );
  const [locationStatus, setLocationStatus] = useState<'locating' | 'live' | 'fallback'>('locating');

  // Route guidance state
  const [activeRoute, setActiveRoute] = useState<{
    listing: FoodListing;
    route: RouteResult;
  } | null>(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // 1. Initialize Map once with 100% Free OpenStreetMap Tiles (NO API KEY REQUIRED)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: liveLocation,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Genuine OpenStreetMap Tile Server - 100% Free, Public, Zero API Key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map instance alive across rerenders
    };
  }, []);

  // 2. Real-time GPS Tracking of User's Current Location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('fallback');
      return;
    }

    // Immediate initial fetch
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLiveLocation(coords);
        setLocationStatus('live');
        if (onUserLocationChange) onUserLocationChange(coords);
      },
      (err) => {
        console.warn("Geolocation fallback to Bengaluru center:", err.message);
        setLocationStatus('fallback');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );

    // Continuous real-time location watch
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLiveLocation(coords);
        setLocationStatus('live');
        if (onUserLocationChange) onUserLocationChange(coords);
      },
      (err) => {
        console.warn("Geolocation watch error:", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 15000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [onUserLocationChange]);

  // 3. Update User Marker on Map whenever liveLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // High-visibility animated pulsing beacon for Real-time location
    const userBeaconIcon = L.divIcon({
      className: 'custom-live-user-beacon',
      html: `
        <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(0, 0, 0, 0.2); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; border-radius: 50%; background: #000000; border: 2.5px solid #ffffff; box-shadow: 0 0 6px rgba(0,0,0,0.4); z-index: 2;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const userMarker = L.marker(liveLocation, {
      icon: userBeaconIcon,
      zIndexOffset: 1000
    }).addTo(map);

    userMarker.bindTooltip("You are here (Live GPS Location)", {
      permanent: false,
      direction: 'top',
      offset: [0, -10]
    });

    userMarkerRef.current = userMarker;
  }, [liveLocation]);

  // 4. Update Food Listing Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old listing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    listings.forEach((item) => {
      if (item.status === 'collected' || item.status === 'expired') return;

      const countdownText = formatCountdown(item.safeUntil);
      const isSelected = item.id === selectedListingId;

      const pinIcon = L.divIcon({
        className: `food-pin-${item.id}`,
        html: `
          <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="
              background: ${isSelected ? '#000000' : '#1a1a1a'}; 
              color: #ffffff; 
              padding: 5px 11px; 
              border-radius: 28.8px; 
              font-family: 'Inter', system-ui, sans-serif;
              font-size: 11px; 
              font-weight: 600; 
              display: flex; 
              align-items: center; 
              gap: 5px;
              white-space: nowrap;
              border: ${isSelected ? '2px solid #ffffff' : '1px solid #dfdcd5'};
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            ">
              <span>${item.quantityPlates} pl</span>
              <span style="color: #c4c3b6; font-size: 9px; font-weight: normal;">• ${countdownText}</span>
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 5px solid transparent; 
              border-right: 5px solid transparent; 
              border-top: 6px solid #000000;
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([item.pickupLat, item.pickupLng], { icon: pinIcon }).addTo(map);

      // Museum Wall Label popup
      const popupHtml = `
        <div style="font-family: 'Inter', system-ui, sans-serif; width: 240px; padding: 4px; color: #000000;">
          <img src="${item.photoUrl}" alt="${item.title}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #595855; margin-bottom: 2px;">
            ${item.foodType} • ${item.quantityPlates} PLATES (${item.quantityKg} KG)
          </div>
          <h4 style="margin: 0 0 4px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 500; color: #000000; line-height: 1.2;">
            ${item.title}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #595855;">📍 ${item.pickupAddress}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #dfdcd5; padding-top: 8px; gap: 6px;">
            <span style="font-size: 10px; font-weight: 600;">⏱ ${countdownText}</span>
            <div style="display: flex; gap: 4px;">
              <button id="popup-route-${item.id}" style="
                background: #000000; 
                color: #ffffff; 
                border: none; 
                padding: 5px 10px; 
                border-radius: 28.8px; 
                font-size: 10px; 
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 3px;
              ">🧭 Route</button>
              <button id="popup-btn-${item.id}" style="
                background: #e7e5e4; 
                color: #000000; 
                border: 1px solid #dfdcd5; 
                padding: 5px 10px; 
                border-radius: 28.8px; 
                font-size: 10px; 
                cursor: pointer;
              ">Details</button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false });

      marker.on('popupopen', () => {
        const detailBtn = document.getElementById(`popup-btn-${item.id}`);
        if (detailBtn) {
          detailBtn.onclick = () => onSelectListing(item);
        }
        const routeBtn = document.getElementById(`popup-route-${item.id}`);
        if (routeBtn) {
          routeBtn.onclick = () => handleGuideRoute(item);
        }
      });

      marker.on('click', () => {
        onSelectListing(item);
        handleGuideRoute(item);
      });

      markersRef.current[item.id] = marker;
    });
  }, [listings, selectedListingId, onSelectListing]);

  // 5. Handle Turn-by-Turn Route Guidance Calculation
  const handleGuideRoute = async (targetListing: FoodListing) => {
    setIsRoutingLoading(true);
    const startCoords = liveLocation;
    const destCoords: [number, number] = [targetListing.pickupLat, targetListing.pickupLng];

    try {
      const routeData = await fetchRoute(startCoords, destCoords, targetListing.title);
      setActiveRoute({
        listing: targetListing,
        route: routeData
      });

      const map = mapInstanceRef.current;
      if (map) {
        // Remove existing route polylines
        if (routePolylineRef.current) routePolylineRef.current.remove();
        if (routeCasingRef.current) routeCasingRef.current.remove();

        // 1. Dark hairline casing shadow
        const casing = L.polyline(routeData.coordinates, {
          color: '#595855',
          weight: 7,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
        routeCasingRef.current = casing;

        // 2. High-contrast route polyline (Gallery Ink)
        const polyline = L.polyline(routeData.coordinates, {
          color: '#000000',
          weight: 4,
          opacity: 0.95,
          dashArray: routeData.source === 'fallback' ? '6, 6' : undefined,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
        routePolylineRef.current = polyline;

        // Smoothly fit bounds to show both user location and destination
        map.fitBounds(polyline.getBounds(), {
          padding: [60, 60],
          animate: true,
          duration: 1.2
        });
      }
    } catch (err) {
      console.warn("Routing failed:", err);
    } finally {
      setIsRoutingLoading(false);
    }
  };

  // Trigger route automatically if a listing was selected externally (e.g. from list view or booking)
  useEffect(() => {
    if (!selectedListingId) return;
    const item = listings.find((l) => l.id === selectedListingId);
    if (item && (!activeRoute || activeRoute.listing.id !== selectedListingId)) {
      handleGuideRoute(item);
    }
  }, [selectedListingId, listings]);

  const handleClearRoute = () => {
    setActiveRoute(null);
    if (routePolylineRef.current) routePolylineRef.current.remove();
    if (routeCasingRef.current) routeCasingRef.current.remove();
    routePolylineRef.current = null;
    routeCasingRef.current = null;
    mapInstanceRef.current?.setView(liveLocation, 13, { animate: true });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLiveLocation(coords);
        setLocationStatus('live');
        mapInstanceRef.current?.setView(coords, 15, { animate: true });
      },
      () => {
        mapInstanceRef.current?.setView([12.9716, 77.5946], 13, { animate: true });
      }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-[9px] overflow-hidden border border-[#dfdcd5] bg-[#dfdcd5]">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Left Tag: Genuine OSM status indicator */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="bg-[#e7e5e4] px-3 py-1.5 rounded-[4px] border border-[#dfdcd5] text-[10px] font-mono uppercase tracking-wider text-[#000000] flex items-center gap-2 shadow-xs">
          <span className={`w-2 h-2 rounded-full ${locationStatus === 'live' ? 'bg-green-600 animate-pulse' : 'bg-black'}`}></span>
          <span>{locationStatus === 'live' ? 'GPS Active · Bengaluru OpenStreetMap' : 'Bengaluru OpenStreetMap'}</span>
        </div>
      </div>

      {/* Floating Recenter Location Button */}
      <button
        onClick={handleLocateMe}
        className="absolute top-4 right-14 z-20 bg-[#ffffff] text-[#000000] p-2 rounded-[9px] border border-[#dfdcd5] hover:bg-[#e7e5e4] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 text-xs font-sans"
        title="Recenter on My Live GPS Location"
      >
        <Crosshair className="w-4 h-4 text-[#000000]" />
        <span className="hidden sm:inline text-[11px]">My GPS</span>
      </button>

      {/* FLOATING ROUTE GUIDANCE HUD PANEL (When food chosen/booked) */}
      {activeRoute && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:max-w-md z-30 card-bone p-4 border border-[#000000] shadow-xl space-y-3 animate-in slide-in-from-bottom duration-300">
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#000000] text-white flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#595855] block">
                  Route to Food Handover
                </span>
                <h4 className="font-davinci text-sm text-[#000000] leading-tight">
                  {activeRoute.listing.title}
                </h4>
              </div>
            </div>

            <button
              onClick={handleClearRoute}
              className="text-[#595855] hover:text-[#000000] p-1 rounded-full hover:bg-[#dfdcd5] transition-colors"
              title="Close Route Guidance"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Distance & Time Matrix */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#ffffff] rounded-[6px] border border-[#dfdcd5] text-center font-mono">
            <div>
              <span className="text-[9px] text-[#595855] uppercase block">Distance</span>
              <span className="text-sm font-bold text-[#000000]">
                {activeRoute.route.distanceKm} km
              </span>
            </div>

            <div className="border-x border-[#dfdcd5]">
              <span className="text-[9px] text-[#595855] uppercase flex items-center justify-center gap-1">
                <Car className="w-3 h-3" /> Van/Car
              </span>
              <span className="text-sm font-bold text-[#000000]">
                ~{activeRoute.route.durationMins} min
              </span>
            </div>

            <div>
              <span className="text-[9px] text-[#595855] uppercase flex items-center justify-center gap-1">
                <Bike className="w-3 h-3" /> 2-Wheeler
              </span>
              <span className="text-sm font-bold text-[#000000]">
                ~{activeRoute.route.durationBikeMins} min
              </span>
            </div>
          </div>

          <div className="text-[11px] font-sans text-[#595855] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#000000] shrink-0" />
            <span className="truncate">{activeRoute.listing.pickupAddress}</span>
          </div>

          {/* Turn-by-Turn Directions Dropdown */}
          <div className="border-t border-[#dfdcd5] pt-2">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="w-full flex items-center justify-between text-xs font-sans text-[#000000] hover:text-[#595855] py-1 cursor-pointer"
            >
              <span className="font-medium">
                {showSteps ? 'Hide Navigation Steps' : `View ${activeRoute.route.steps.length} Turn-by-Turn Steps`}
              </span>
              {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSteps && (
              <div className="mt-2 max-h-40 overflow-y-auto space-y-2 pr-1 font-sans text-xs">
                {activeRoute.route.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[#595855] pb-1 border-b border-[#dfdcd5]/50 last:border-0">
                    <span className="font-mono text-[10px] text-[#000000] shrink-0 pt-0.5">
                      {idx + 1}.
                    </span>
                    <div className="flex-1">
                      <p className="text-[#000000] font-medium leading-snug">{st.instruction}</p>
                      <span className="text-[10px] text-[#595855]">
                        {st.distanceMeters > 1000
                          ? `${(st.distanceMeters / 1000).toFixed(1)} km`
                          : `${st.distanceMeters} m`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* External GPS Open Button */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href={getGoogleMapsNavigationUrl(
                liveLocation[0],
                liveLocation[1],
                activeRoute.listing.pickupLat,
                activeRoute.listing.pickupLng
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-pill flex-1 flex items-center justify-center gap-1.5 text-[11px] py-2"
            >
              <span>Launch Live GPS Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleClearRoute}
              className="px-3 py-2 rounded-[28.8px] border border-[#dfdcd5] text-xs font-sans hover:bg-[#dfdcd5] transition-colors"
            >
              Dismiss
            </button>
          </div>

        </div>
      )}

      {/* Loading routing indicator */}
      {isRoutingLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-[#000000] text-white px-4 py-2 rounded-[28.8px] text-xs font-mono flex items-center gap-2 shadow-lg">
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Calculating live route via OpenStreetMap...</span>
        </div>
      )}

    </div>
  );
};
