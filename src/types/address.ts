export interface AddressData {
    apartmentNumber: string;
    buildingName: string;
    colony: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface AddressErrors {
    apartmentNumber?: string;
    buildingName?: string;
    colony?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
}

export type AddressFormState = AddressData;
