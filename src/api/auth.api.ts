import { apiPost } from './client';

export interface LoginPayload {
    username: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    username: string;
    email: string;
    age: number;
    phone_number: string;
    password: string;
    role: string;
}

export interface AuthResponse {
    token?: string;
    accessToken?: string;
    jwt?: string;
    role?: string;
    message?: string;
    [key: string]: unknown;
}

export const loginRequest = (payload: LoginPayload) =>
    apiPost<AuthResponse, LoginPayload>('/auth/login', payload);

export const signupRequest = (payload: SignupPayload) =>
    apiPost<AuthResponse, SignupPayload>('/auth/signup', payload);

export const extractAuthToken = (response: AuthResponse): string | undefined =>
    response.token ?? response.accessToken ?? response.jwt;

export const extractUserRole = (response: AuthResponse): string | undefined => response.role;
