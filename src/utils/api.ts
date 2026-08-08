import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
    message?: string;
    [key: string]: unknown;
}

export const loginRequest = (payload: LoginPayload) => {
    return api.post<AuthResponse>('/auth/login', payload);
};

export const signupRequest = (payload: SignupPayload) => {
    return api.post<AuthResponse>('/auth/signup', payload);
};

export const saveAuthToken = (response: AuthResponse) => {
    const token = response.token ?? response.accessToken ?? response.jwt;

    if (token) {
        localStorage.setItem('authToken', token);
    }

    return token;
};
