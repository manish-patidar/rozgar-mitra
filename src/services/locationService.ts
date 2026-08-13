import type { AddressData } from '../types/address';

export const detectLocationDetails = (): Promise<Partial<AddressData>> =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Browser geolocation is not supported on this device.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                    );

                    if (!response.ok) {
                        throw new Error('Reverse geocoding failed.');
                    }

                    const data = await response.json();
                    const addr = data.address || {};

                    resolve({
                        apartmentNumber: '',
                        buildingName: addr.building || '',
                        colony: addr.suburb || addr.neighbourhood || addr.residential || addr.road || '',
                        city: addr.city || addr.town || addr.village || addr.county || '',
                        state: addr.state || '',
                        pincode: addr.postcode || '',
                        country: addr.country || 'India',
                    });
                } catch {
                    reject(new Error('Location address could not be resolved. Please enter the address manually.'));
                }
            },
            (geoError) => {
                if (geoError.code === geoError.PERMISSION_DENIED) {
                    reject(new Error('Location access permission was denied. Please enter the address manually.'));
                    return;
                }

                reject(new Error('Location could not be fetched. Please enter the address manually.'));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            },
        );
    });
