import { apiGet, apiPost, apiDelete } from '../../api/client';
import type { UserResponseDto, ServiceCategory, ServiceCategoryPayload, AdminStats, AdminTask } from '../../pages/Admin/admin.types';

export const adminApi = {
    getStats: () => apiGet<AdminStats>('/admin/stats'),

    getTasks: (search = '') =>
        apiGet<AdminTask[]>('/admin/tasks', search.trim() ? { search: search.trim() } : undefined),
    // --- Users ---
    getCustomers: () =>
        apiGet<UserResponseDto[]>('/admin/customers'),

    getLabours: () =>
        apiGet<UserResponseDto[]>('/admin/labours'),

    deleteUser: (id: string) =>
        apiDelete<string>(`/admin/users/${id}`),

    // --- Services ---
    getServices: (search = '') =>
        apiGet<ServiceCategory[]>('/admin/services', search.trim() ? { search: search.trim() } : undefined),

    addService: (payload: ServiceCategoryPayload) =>
        apiPost<ServiceCategory, ServiceCategoryPayload>('/admin/services', payload),

    deleteService: (id: number) =>
        apiDelete<string>(`/admin/services/${id}`),
};