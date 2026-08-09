import type { GeoCoordinates } from '../components/location/location.types';

// Nominatim (OpenStreetMap) is a free, keyless reverse-geocoding service.
// Its usage policy caps clients at ~1 request/second — fine for this
// on-demand, user-triggered lookup. A production app with real traffic
// should proxy this through its own backend instead of calling it directly.
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

export const reverseGeocode = async ({ lat, lng }: GeoCoordinates): Promise<string> => {
    const url = `${NOMINATIM_REVERSE_URL}?format=jsonv2&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Reverse geocoding failed');
    }

    const data: { display_name?: string } = await response.json();
    return data.display_name ?? '';
};
