import { apiPost } from './client';

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AddressPayload {
    apartmentNumber: string;
    buildingName: string;
    colony: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface SignupPayload {
    name: string;
    username: string;
    email: string;
    dob: string;
    phone_number: string;
    address: AddressPayload;
    password: string;
    role: string;
}

// Update this interface to match your Spring Boot JSON exactly
export interface AuthResponse {
    data?: {
        token?: string;
        role?: string;
        id?: string;
        username?: string;
        // add other fields if you need them later
    };
    message?: string;
    status?: number;
}

// Update the extractors to look inside the nested 'data' object
export const extractAuthToken = (response: AuthResponse): string | undefined =>
    response.data?.token;

export const extractUserRole = (response: AuthResponse): string | undefined =>
    response.data?.role;

export const loginRequest = (payload: LoginPayload) =>
    apiPost<AuthResponse, LoginPayload>('/auth/login', payload);

export const signupRequest = (payload: SignupPayload) =>
    apiPost<AuthResponse, SignupPayload>('/auth/signup', payload);


