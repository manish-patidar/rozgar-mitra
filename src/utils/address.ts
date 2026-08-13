import type { AddressData, AddressFormState } from '../types/address';

export const INITIAL_ADDRESS_DATA: AddressData = {
    apartmentNumber: '',
    buildingName: '',
    colony: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
};

export const ADDRESS_EMPTY_STATE: AddressFormState = { ...INITIAL_ADDRESS_DATA };

// List of Indian states and union territories for accurate identification
const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir',
];

export const geocodeAddressParts = (rawAddress: string): Partial<AddressFormState> => {
    const parts = rawAddress
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length === 0) {
        return {};
    }

    const result: Partial<AddressFormState> = {
        apartmentNumber: '',
        buildingName: '',
        colony: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    };

    const pincodeMatch = rawAddress.match(/\b(\d{6,10})\b/);
    if (pincodeMatch) {
        result.pincode = pincodeMatch[1];
    }

    result.country = parts[parts.length - 1] || 'India';

    let workingParts = [...parts];
    workingParts.pop();

    let stateIndex = -1;
    for (let i = 0; i < workingParts.length; i++) {
        const partLower = workingParts[i].toLowerCase();
        const matchedState = INDIAN_STATES.find((state) =>
            partLower === state.toLowerCase() ||
            partLower.includes(state.toLowerCase()) ||
            state.toLowerCase().includes(partLower)
        );
        if (matchedState) {
            result.state = workingParts[i];
            stateIndex = i;
            break;
        }
    }

    if (stateIndex !== -1) {
        workingParts.splice(stateIndex, 1);
    }

    if (workingParts.length > 0) {
        result.city = workingParts[workingParts.length - 1];
        workingParts.pop();
    }
    if (workingParts.length > 0) {
        result.colony = workingParts[workingParts.length - 1];
        workingParts.pop();
    }
    if (workingParts.length > 0) {
        result.buildingName = workingParts[workingParts.length - 1];
        workingParts.pop();
    }
    if (workingParts.length > 0) {
        result.apartmentNumber = workingParts[workingParts.length - 1];
    }

    return result;
};

export const normalizeAddressPayload = (address: AddressFormState): AddressData => ({
    apartmentNumber: address.apartmentNumber.trim(),
    buildingName: address.buildingName.trim(),
    colony: address.colony.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    pincode: address.pincode.trim(),
    country: address.country.trim() || 'India',
});

export const buildReadableAddress = (address: AddressFormState): string => {
    const parts = [
        address.apartmentNumber,
        address.buildingName,
        address.colony,
        address.city,
        address.state,
        address.pincode,
        address.country,
    ].filter(Boolean);

    return parts.join(', ');
};

export const hasAddressData = (address: Partial<AddressFormState>): boolean =>
    Object.values(address).some((value) => typeof value === 'string' && value.trim().length > 0);
