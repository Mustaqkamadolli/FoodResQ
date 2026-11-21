import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { WasteHotspot } from '../types';

interface WasteHeatmapProps {
  hotspots: WasteHotspot[];
  onSelectHotspot?: (hotspot: WasteHotspot) => void;
}

export const WasteHeatmap: React.FC<WasteHeatmapProps> = ({ hotspots, onSelectHotspot }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.5946],
        zoom: 11,
        zoomControl: true,
        attributionControl: false
      });

      // 100% Free OpenStreetMap Tiles (No API Key Required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    hotspots.forEach((spot) => {
      L.circle([spot.lat, spot.lng], {
        color: '#595855',
        fillColor: '#000000',
        fillOpacity: 0.15 * spot.intensity,
        radius: 2000,
        weight: 0
      }).addTo(map);

      const core = L.circleMarker([spot.lat, spot.lng], {
        radius: 12 + spot.intensity * 6,
        color: '#000000',
        fillColor: '#595855',
        fillOpacity: 0.75,
        weight: 1.5
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: 'Inter', system-ui, sans-serif; padding: 4px; min-width: 200px; color: #000000;">
          <span style="font-size: 9px; font-weight: 500; color: #595855; text-transform: uppercase; letter-spacing: 1px;">
            ${spot.type}
          </span>
          <h4 style="margin: 2px 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 500; color: #000000;">
            ${spot.name}
          </h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #595855;">
            📍 Area: <strong>${spot.area}</strong>
          </p>
          <div style="background: #e7e5e4; border-radius: 4px; padding: 6px; border: 1px solid #dfdcd5; margin-top: 6px;">
            <div style="font-size: 11px; font-weight: 500; color: #000000;">
              Monthly Surplus: ${spot.monthlyDonationsKg.toLocaleString()} kg
            </div>
            <div style="font-size: 10px; color: #595855;">
              ~${spot.mealsShared.toLocaleString()} meals rescued per month
            </div>
          </div>
        </div>
      `;

      core.bindPopup(popupHtml);
      core.on('click', () => {
        if (onSelectHotspot) onSelectHotspot(spot);
      });
    });
  }, [hotspots, onSelectHotspot]);

  return (
    <div className="relative w-full h-[480px] rounded-[9px] overflow-hidden border border-[#dfdcd5]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Banner overlay */}
      <div className="absolute top-4 left-4 z-20 bg-[#e7e5e4] px-4 py-3 rounded-[9px] border border-[#dfdcd5] max-w-xs font-grotesk text-[#000000]">
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#000000] mb-0.5">
          CITY PLANNER GIS LAYER
        </h3>
        <p className="text-[11px] text-[#595855] leading-normal">
          Surplus density index across Bengaluru wedding halls, tech messes, and restaurant corridors.
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#e7e5e4] px-3.5 py-2 rounded-[28.8px] border border-[#dfdcd5] flex items-center gap-3 text-xs font-grotesk text-[#000000]">
        <span className="text-[10px] text-[#595855]">Low Surplus</span>
        <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#dfdcd5] to-[#000000]"></div>
        <span className="text-[10px] text-[#000000] font-medium">High Surplus (&gt;8,000kg)</span>
      </div>
    </div>
  );
};
