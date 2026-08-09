export interface GeoCoordinates {
    lat: number;
    lng: number;
}

export interface LocationResult {
    coordinates: GeoCoordinates;
    address: string;
}
