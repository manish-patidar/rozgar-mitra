import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import type { CustomerServiceCategory } from '../pages/Customer/customer.types';

export const CUSTOMER_THEME = {
    primary: '#059669', // Green theme for Labour (Earning vibe)
    warning: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280'
};

// Placeholder data jab tak backend connect nahi hota
export const DUMMY_CATEGORIES: CustomerServiceCategory[] = [
    { id: 1, name: 'Plumber', icon: PlumbingIcon, basePrice: 150, color: '#e0f2fe' },
    { id: 2, name: 'Electrician', icon: ElectricalServicesIcon, basePrice: 200, color: '#fef3c7' },
    { id: 3, name: 'Cleaner', icon: CleaningServicesIcon, basePrice: 100, color: '#dcfce7' },
    { id: 4, name: 'Loader', icon: LocalShippingIcon, basePrice: 300, color: '#fee2e2' },
];