import type { GeoCoordinates } from '../components/location/location.types';
import { apiGet } from './client';

// Use backend endpoint to avoid CORS and rate-limiting issues.
// The backend proxies to Nominatim, which avoids browser restrictions.
export const reverseGeocode = async ({ lat, lng }: GeoCoordinates): Promise<string> => {
    const response = await apiGet<{ display_name: string }>('/geocode/reverse', {
        lat: lat.toString(),
        lon: lng.toString(),
    });

    return response.data.display_name ?? '';
};
