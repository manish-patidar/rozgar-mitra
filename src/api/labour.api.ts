import { apiGet } from '../api/client';
import type { ServiceCategory } from '../pages/Admin/admin.types';

export const labourApi = {
    // Labour ko bhi services aur unke price dekhne hain
    getServices: () => apiGet<ServiceCategory[]>('/admin/services'),

    // Earnings & Tasks
    getEarnings: () => apiGet('/labour/earnings'),
    getTaskHistory: () => apiGet('/labour/history'),
};