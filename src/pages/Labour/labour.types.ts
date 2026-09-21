export interface LabourTask {
    id: string;
    customerName: string;
    location: string;
    service: string;
    estimatedEarnings: number;
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
}

export interface LabourStats {
    todayEarnings: number;
    completedTasks: number;
    rating: number;
}