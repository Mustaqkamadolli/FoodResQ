// Service for 100% free turn-by-turn routing (No API key needed) using OSRM with offline geometric fallback

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
}

export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng] array for Leaflet polyline
  distanceKm: number;
  durationMins: number;
  durationBikeMins: number;
  steps: RouteStep[];
  source: 'osrm' | 'fallback';
}

function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

function formatManeuver(type: string, modifier?: string, name?: string): string {
  const street = name && name.trim() ? `onto ${name}` : 'along current road';
  switch (type) {
    case 'depart':
      return `Head out ${street}`;
    case 'turn':
      return `Turn ${modifier || 'ahead'} ${street}`;
    case 'new name':
    case 'continue':
      return `Continue ${modifier ? modifier : ''} ${street}`;
    case 'end of road':
      return `At end of road, turn ${modifier || 'ahead'} ${street}`;
    case 'fork':
      return `Take ${modifier || 'the'} fork ${street}`;
    case 'roundabout':
    case 'rotary':
      return `Enter roundabout and take exit ${street}`;
    case 'arrive':
      return 'Arrive at surplus food pickup destination';
    default:
      return `Proceed ${modifier ? modifier : ''} ${street}`;
  }
}

export async function fetchRoute(
  start: [number, number], // [lat, lng]
  end: [number, number],   // [lat, lng]
  destName: string = 'Food Pickup Location'
): Promise<RouteResult> {
  const [startLat, startLng] = start;
  const [endLat, endLng] = end;

  // Try Open Source Routing Machine (OSRM) - 100% Free, No API Key Required
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // OSRM coordinates are [lng, lat], convert to Leaflet [lat, lng]
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        const distanceMeters = route.distance;
        const durationSeconds = route.duration;
        const distanceKm = Number((distanceMeters / 1000).toFixed(1));
        const durationMins = Math.max(1, Math.round(durationSeconds / 60));
        // Bengaluru 2-wheelers / bikes cut transit by ~25% in heavy traffic
        const durationBikeMins = Math.max(1, Math.round(durationMins * 0.75));

        const steps: RouteStep[] = [];
        if (route.legs && route.legs[0] && route.legs[0].steps) {
          route.legs[0].steps.forEach((st: any) => {
            const instr = formatManeuver(st.maneuver.type, st.maneuver.modifier, st.name);
            steps.push({
              instruction: instr,
              distanceMeters: Math.round(st.distance),
              durationSeconds: Math.round(st.duration)
            });
          });
        }

        return {
          coordinates,
          distanceKm,
          durationMins,
          durationBikeMins,
          steps,
          source: 'osrm'
        };
      }
    }
  } catch (err) {
    console.warn("OSRM routing network error, falling back to local spline road geometry:", err);
  }

  // Graceful Local Fallback: Smooth interpolated road geometry
  const directKm = calculateHaversineDistanceKm(startLat, startLng, endLat, endLng);
  const roadDistanceKm = Number((directKm * 1.25).toFixed(1)); // road curvature factor
  const durationMins = Math.max(2, Math.round((roadDistanceKm / 28) * 60));
  const durationBikeMins = Math.max(1, Math.round(durationMins * 0.7));

  // Generate 8 curvature waypoint nodes between start and end
  const coordinates: [number, number][] = [];
  const waypointsCount = 8;
  for (let i = 0; i <= waypointsCount; i++) {
    const t = i / waypointsCount;
    const baseLat = startLat + (endLat - startLat) * t;
    const baseLng = startLng + (endLng - startLng) * t;
    // add small natural road wobble in Bengaluru street grid
    const offset = i > 0 && i < waypointsCount ? Math.sin(t * Math.PI) * 0.0025 : 0;
    coordinates.push([baseLat + offset, baseLng + offset * 0.7]);
  }

  const fallbackSteps: RouteStep[] = [
    {
      instruction: `Depart towards destination from current location`,
      distanceMeters: Math.round((roadDistanceKm * 1000) * 0.15),
      durationSeconds: Math.round(durationMins * 60 * 0.15)
    },
    {
      instruction: `Follow connecting arterial road towards ${destName.split(',')[0]}`,
      distanceMeters: Math.round((roadDistanceKm * 1000) * 0.65),
      durationSeconds: Math.round(durationMins * 60 * 0.65)
    },
    {
      instruction: `Turn into entrance and arrive at ${destName}`,
      distanceMeters: Math.round((roadDistanceKm * 1000) * 0.2),
      durationSeconds: Math.round(durationMins * 60 * 0.2)
    }
  ];

  return {
    coordinates,
    distanceKm: roadDistanceKm,
    durationMins,
    durationBikeMins,
    steps: fallbackSteps,
    source: 'fallback'
  };
}

export function getGoogleMapsNavigationUrl(
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}&travelmode=driving`;
}
