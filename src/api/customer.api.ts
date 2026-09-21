import { apiDelete, apiGet, apiPost, apiPut } from '../api/client';
import type { ServiceCategory } from '../pages/Admin/admin.types';

export interface ProfileResponse {
    id: string;
    name: string;
    username: string;
    email: string;
    phone_number: string;
    dob?: string;
    address?: { colony?: string; city?: string; state?: string };
}

export interface CustomerBooking {
    id: string | number;
    serviceId?: number;
    serviceName?: string;
    name?: string;
    description?: string;
    pricePerHour?: number;
    price?: number;
    status?: string;
    addressText?: string;
    address?: string;
    labourName?: string;
    customerUsername?: string;
    customerPhone?: string;
    labourUsername?: string;
    labourPhone?: string;
    createdAt?: string;
    latitude?: number;
    longitude?: number;
    labourLatitude?: number;
    labourLongitude?: number;
    startOtp?: string;
    completionOtp?: string;
    startOtpGeneratedAt?: string;
    startOtpVerifiedAt?: string;
    completionOtpGeneratedAt?: string;
    completionOtpVerifiedAt?: string;
    startedAt?: string;
    completedAt?: string;
    durationMinutes?: number;
    finalAmount?: number;
    paymentStatus?: string;
    paidAt?: string;
}

export interface PagedResponse<T> {
    content: T[];
    number: number;
    totalPages: number;
    last: boolean;
}

export const customerApi = {
    // Services (Admin wali same API use kar sakte hain agar backend me permit-all ya user role allowed hai)
    getServices: () => apiGet<ServiceCategory[]>('/admin/services'),

    getBookings: (page = 0, size = 50) => apiGet<CustomerBooking[] | PagedResponse<CustomerBooking>>('/booking/customer/bookings', { page, size }),

    deleteAccount: () => apiDelete<string>('/customer/account'),

    getProfile: () => apiGet<ProfileResponse>('/customer/profile'),

    // Booking Request (Under 12km logic backend pe handle hoga)
    requestService: (serviceId: number) => apiPost('/customer/request', { serviceId }),

    // Profile Management
    updateProfile: (data: unknown) => apiPut<ProfileResponse>('/customer/profile', data),
    changePassword: (data: unknown) => apiPut('/customer/change-password', data),
};