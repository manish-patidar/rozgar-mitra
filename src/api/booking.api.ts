import { apiGet, apiPost } from '../api/client';

export interface NearbyTask {
    id: number;
    serviceId?: number;
    customerName?: string;
    customerUsername?: string;
    customerPhone?: string;
    serviceName?: string;
    labourUsername?: string;
    labourPhone?: string;
    addressText?: string;
    estimatedPrice?: number;
    status?: string;
    latitude?: number;
    longitude?: number;
    customerLatitude?: number;
    customerLongitude?: number;
    customerLocation?: {
        latitude?: number;
        longitude?: number;
    };
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

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export const bookingApi = {
    // Customer ke liye
    requestService: (data: { serviceId: number; latitude: number; longitude: number; addressText: string }) =>
        apiPost('/booking/request', data),

    // Labour ke liye
    getNearbyTasks: (search = '') =>
        apiGet<NearbyTask[]>('/booking/nearby-tasks', search.trim() ? { search: search.trim() } : undefined),

    getLabourTasks: (search = '') =>
        apiGet<NearbyTask[]>('/booking/my-tasks', search.trim() ? { search: search.trim() } : undefined),

    acceptTask: (taskId: number) =>
        apiPost(`/booking/accept/${taskId}`),

    rejectTask: (taskId: number) =>
        apiPost(`/booking/reject/${taskId}`),

    customerRejectTask: (taskId: number) =>
        apiPost<NearbyTask>(`/booking/${taskId}/customer-reject`),

    completeTask: (taskId: number) => apiPost(`/booking/complete/${taskId}`),

    generateStartOtp: (taskId: number) => apiPost<NearbyTask>(`/booking/${taskId}/start-otp`),
    verifyStartOtp: (taskId: number, otp: string) => apiPost<NearbyTask, { otp: string }>(`/booking/${taskId}/start-otp/verify`, { otp }),
    generateCompletionOtp: (taskId: number) => apiPost<NearbyTask>(`/booking/${taskId}/completion-otp`),
    verifyCompletionOtp: (taskId: number, otp: string) => apiPost<NearbyTask, { otp: string }>(`/booking/${taskId}/completion-otp/verify`, { otp }),
    payForTask: (taskId: number) => apiPost<NearbyTask>(`/booking/${taskId}/pay`)
};