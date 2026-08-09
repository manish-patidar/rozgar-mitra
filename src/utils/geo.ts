import type { GeoCoordinates } from '../components/location/location.types';

// Used as the map's initial center and as a stand-in "reference point" for
// distance calculations until real labour locations are tracked.
export const DEFAULT_MAP_CENTER: GeoCoordinates = { lat: 22.7196, lng: 75.8577 }; // Indore, MP

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

// Haversine great-circle distance between two lat/lng points, in kilometers.
export const getDistanceKm = (a: GeoCoordinates, b: GeoCoordinates): number => {
    const dLat = toRadians(b.lat - a.lat);
    const dLng = toRadians(b.lng - a.lng);
    const lat1 = toRadians(a.lat);
    const lat2 = toRadians(b.lat);

    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};
