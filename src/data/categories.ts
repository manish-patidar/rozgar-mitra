import type { ServiceCategory } from '../types/category';

export const CATEGORIES: ServiceCategory[] = [
    {
        id: 'cleaning',
        name: 'Cleaning',
        icon: '🧹',
        description: 'Home deep cleaning, dusting, mopping and sanitization by verified helpers.',
        pricePerHour: 150,
    },
    {
        id: 'repairing',
        name: 'Repairing',
        icon: '🔧',
        description: 'Plumbing, electrical fixes and general handyman help for your home.',
        pricePerHour: 200,
    },
    {
        id: 'painting',
        name: 'Painting',
        icon: '🎨',
        description: 'Interior and exterior wall painting, touch-ups and finishing work.',
        pricePerHour: 180,
    },
    {
        id: 'loading',
        name: 'Loading',
        icon: '📦',
        description: 'Help with moving, loading and unloading goods safely.',
        pricePerHour: 120,
    },
    {
        id: 'farming',
        name: 'Farming',
        icon: '🌾',
        description: 'Farm labour for sowing, harvesting and general fieldwork.',
        pricePerHour: 100,
    },
];

export const getCategoryById = (categoryId: string): ServiceCategory | undefined =>
    CATEGORIES.find((category) => category.id === categoryId);
