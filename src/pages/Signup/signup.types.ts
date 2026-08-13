import type { Dayjs } from 'dayjs';
import type { AddressData } from '../../types/address';

export interface SignupFormState {
    name: string;
    username: string;
    email: string;
    dateOfBirth: Dayjs | null;
    phone: string;
    address: AddressData;
    password: string;
    role: string;
}

export type SignupFormErrors = Partial<Record<keyof SignupFormState, string>>;
