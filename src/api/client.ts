import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { getAuthToken } from '../utils/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

export const apiGet = <TResponse>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<TResponse>> => apiClient.get<TResponse>(url, { ...config, params });

export const apiPost = <TResponse, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: AxiosRequestConfig,
): Promise<AxiosResponse<TResponse>> => apiClient.post<TResponse>(url, payload, config);

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string; error?: string } | string | undefined;

        if (typeof data === 'string') return data;

        return data?.message ?? data?.error ?? error.message ?? fallback;
    }

    return fallback;
};
