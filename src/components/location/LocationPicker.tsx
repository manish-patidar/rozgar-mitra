import { useEffect, useState } from 'react';
import type { FC } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { MapFrame, UseLocationButton } from './LocationPicker.styles';
import { reverseGeocode } from '../../api/geocode.api';
import { MESSAGES } from '../../utils/constants';
import { DEFAULT_MAP_CENTER } from '../../utils/geo';
import type { GeoCoordinates, LocationResult } from './location.types';

// Vite doesn't resolve Leaflet's default marker asset paths automatically —
// point them at the bundled images explicitly.
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface RecenterProps {
    coordinates: GeoCoordinates;
}

const Recenter: FC<RecenterProps> = ({ coordinates }) => {
    const map = useMap();

    useEffect(() => {
        map.setView([coordinates.lat, coordinates.lng], map.getZoom());
    }, [coordinates, map]);

    return null;
};

interface LocationPickerProps {
    onChange: (result: LocationResult) => void;
}

const LocationPicker: FC<LocationPickerProps> = ({ onChange }) => {
    const [coordinates, setCoordinates] = useState<GeoCoordinates>(DEFAULT_MAP_CENTER);
    const [address, setAddress] = useState('');
    const [isLocating, setIsLocating] = useState(true);
    const [locationError, setLocationError] = useState('');

    const applyLocation = async (next: GeoCoordinates) => {
        setCoordinates(next);
        try {
            const resolvedAddress = await reverseGeocode(next);
            setAddress(resolvedAddress);
            onChange({ coordinates: next, address: resolvedAddress });
        } catch {
            onChange({ coordinates: next, address: '' });
        }
    };

    // Pure browser API call — no React state touched synchronously, so this
    // is safe to invoke directly from the mount effect below.
    const requestCurrentPosition = () => {
        if (!navigator.geolocation) {
            setIsLocating(false);
            setLocationError(MESSAGES.BOOKING_LOCATION_DENIED);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocating(false);
                void applyLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            },
            () => {
                setIsLocating(false);
                setLocationError(MESSAGES.BOOKING_LOCATION_DENIED);
            },
        );
    };

    const handleUseCurrentLocationClick = () => {
        setIsLocating(true);
        setLocationError('');
        requestCurrentPosition();
    };

    useEffect(() => {
        // requestCurrentPosition only sets state inside the async
        // getCurrentPosition callbacks, never synchronously in this body.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        requestCurrentPosition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextAddress = event.target.value;
        setAddress(nextAddress);
        onChange({ coordinates, address: nextAddress });
    };

    return (
        <Stack spacing={1.5}>
            <UseLocationButton type="button" onClick={handleUseCurrentLocationClick} disabled={isLocating}>
                {isLocating ? MESSAGES.BOOKING_LOCATING : MESSAGES.BOOKING_USE_CURRENT_LOCATION}
            </UseLocationButton>

            {locationError && <Alert severity="warning">{locationError}</Alert>}

            <MapFrame>
                <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={14} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Recenter coordinates={coordinates} />
                    <Marker
                        position={[coordinates.lat, coordinates.lng]}
                        draggable
                        eventHandlers={{
                            dragend: (event) => {
                                const marker = event.target as L.Marker;
                                const position = marker.getLatLng();
                                void applyLocation({ lat: position.lat, lng: position.lng });
                            },
                        }}
                    />
                </MapContainer>
            </MapFrame>

            <Typography variant="caption" color="text.secondary">
                {MESSAGES.BOOKING_ADDRESS_SUBTITLE}
            </Typography>

            <TextField
                label={MESSAGES.BOOKING_ADDRESS_LABEL}
                placeholder={MESSAGES.BOOKING_ADDRESS_PLACEHOLDER}
                value={address}
                onChange={handleAddressChange}
                multiline
                minRows={2}
                fullWidth
            />
        </Stack>
    );
};

export default LocationPicker;
