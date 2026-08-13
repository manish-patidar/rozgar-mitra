import React, { useEffect, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { reverseGeocode } from '../../api/geocode.api';
import type { AddressFormState } from '../../types/address';
import { ADDRESS_EMPTY_STATE, buildReadableAddress, geocodeAddressParts, hasAddressData } from '../../utils/address';

interface AddressFieldsProps {
    value: AddressFormState;
    onChange: (next: AddressFormState) => void;
    onLocationReady?: (value: string) => void;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ value, onChange, onLocationReady }) => {
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [manualAddress, setManualAddress] = useState('');
    const isResolvingLocationRef = useRef(false);

    useEffect(() => {
        if (!navigator.geolocation || !useCurrentLocation || isResolvingLocationRef.current) {
            return;
        }

        isResolvingLocationRef.current = true;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const nextAddress = await reverseGeocode({ lat: latitude, lng: longitude });
                    const parsed = geocodeAddressParts(nextAddress);
                    const mergedAddress: AddressFormState = {
                        ...ADDRESS_EMPTY_STATE,
                        ...value,
                        ...parsed,
                    };

                    onChange(mergedAddress);
                    setManualAddress(buildReadableAddress(mergedAddress));
                    onLocationReady?.(nextAddress);
                    setLocationError('');
                } catch {
                    setLocationError('Location access succeeded, but the address could not be resolved. You can still enter it manually.');
                } finally {
                    isResolvingLocationRef.current = false;
                }
            },
            () => {
                setLocationError('Location access was denied. You can still enter your address manually.');
                isResolvingLocationRef.current = false;
            },
        );
    }, [useCurrentLocation]);

    const handleFieldChange = (field: keyof AddressFormState) => (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const nextValue = { ...value, [field]: event.target.value };
        onChange(nextValue);

        if (field === 'apartmentNumber' || field === 'buildingName' || field === 'colony' || field === 'city' || field === 'state' || field === 'pincode' || field === 'country') {
            setManualAddress(buildReadableAddress(nextValue));
        }
    };

    const currentAddressText = manualAddress || buildReadableAddress(value);

    return (
        <Stack spacing={2}>
            <Button
                type="button"
                variant="outlined"
                onClick={() => setUseCurrentLocation(true)}
                sx={{ alignSelf: 'flex-start' }}
            >
                Use my current location
            </Button>

            {locationError && <Alert severity="warning">{locationError}</Alert>}

            {hasAddressData(value) && (
                <TextField
                    label="Current address"
                    value={currentAddressText}
                    multiline
                    minRows={2}
                    slotProps={{ input: { readOnly: true } }}
                    fullWidth
                />
            )}

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Apartment / Flat Number"
                        value={value.apartmentNumber}
                        onChange={handleFieldChange('apartmentNumber')}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Building Name"
                        value={value.buildingName}
                        onChange={handleFieldChange('buildingName')}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Colony / Locality"
                        value={value.colony}
                        onChange={handleFieldChange('colony')}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="City"
                        value={value.city}
                        onChange={handleFieldChange('city')}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="State"
                        value={value.state}
                        onChange={handleFieldChange('state')}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Pincode"
                        value={value.pincode}
                        onChange={handleFieldChange('pincode')}
                        slotProps={{ htmlInput: { maxLength: 10 } }}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Country"
                        value={value.country}
                        onChange={handleFieldChange('country')}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary">
                You may edit the location details before submitting.
            </Typography>
        </Stack>
    );
};

export default AddressFields;
