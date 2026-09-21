import type { SvgIconComponent } from '@mui/icons-material';

// ==========================================
// 1. UI COMPONENT TYPES (Aapke purane types)
// ==========================================
export interface AdminMenuItem {
    text: string;
    path: string;
    icon: SvgIconComponent;
}

export interface SidebarProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

export interface HeaderProps {
    handleDrawerToggle: () => void;
}

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
    onClick?: () => void; // Clickable cards ke liye
}

// ==========================================
// 2. API / BACKEND DATA TYPES (Naye types)
// ==========================================
export interface Address {
    apartmentNumber?: string;
    buildingName?: string;
    colony?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
}

// UserResponseDto me city hata kar address add karein
export interface UserResponseDto {
    id: string;
    name: string;
    username: string;
    email: string;
    phone_number: string;
    role: string;
    address?: Address; // <-- YE ADD KIYA
}

export interface ServiceCategory {
    id: number;
    name: string;
    description: string;
    pricePerHour: number;
}

export interface ServiceCategoryPayload {
    name: string;
    description: string;
    pricePerHour: number;
}

export interface AdminStats {
    totalCustomers: number;
    totalLabours: number;
    activeLabours: number;
    totalTasks: number;
    platformRevenue: number;
}

export interface AdminTask {
    id: number;
    serviceId?: number;
    serviceName: string;
    customerName: string;
    customerUsername?: string;
    customerPhone?: string;
    labourName?: string;
    labourUsername?: string;
    labourPhone?: string;
    status: string;
    addressText?: string;
    estimatedPrice?: number;
    customerLatitude?: number;
    customerLongitude?: number;
    labourLatitude?: number;
    labourLongitude?: number;
    createdAt?: string;
    updatedAt?: string;
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