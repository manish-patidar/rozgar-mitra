import type { Dayjs } from 'dayjs';

export interface SignupFormState {
    name: string;
    username: string;
    email: string;
    dateOfBirth: Dayjs | null;
    phone: string;
    password: string;
    role: string;
}

export type SignupFormErrors = Partial<Record<keyof SignupFormState, string>>;
