import type { GeoCoordinates } from '../components/location/location.types';

export interface BookingRequest {
    id: string;
    categoryId: string;
    categoryName: string;
    icon: string;
    address: string;
    coordinates: GeoCoordinates;
    pricePerHour: number;
    distanceKm: number;
    createdAt: number;
}
