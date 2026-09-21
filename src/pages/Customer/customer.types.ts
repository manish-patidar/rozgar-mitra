import type { SvgIconComponent } from '@mui/icons-material';

export interface CustomerServiceCategory {
    id: number;
    name: string;
    icon: SvgIconComponent;
    basePrice: number;
    color: string;
}

export interface PromotionalBanner {
    title: string;
    subtitle: string;
    discount: string;
}