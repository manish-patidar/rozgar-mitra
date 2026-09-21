import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { customerApi } from '../../../api/customer.api';
import { bookingApi } from '../../../api/booking.api';
import type { ServiceCategory } from '../../../pages/Admin/admin.types';
import { CUSTOMER_THEME } from '../../../utils/customer.constants';
import { useOutletContext } from 'react-router-dom';

interface CustomerOutletContext {
    searchQuery: string;
}

export const CustomerServices: React.FC = () => {
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [activeBookings, setActiveBookings] = useState<{ serviceId?: number; serviceName?: string; status?: string }[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('activeCustomerServiceRequests') ?? '[]');
        } catch {
            return [];
        }
    });
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const { searchQuery } = useOutletContext<CustomerOutletContext>();

    useEffect(() => {
        customerApi.getServices().then(res => setServices(res.data)).catch(console.error);
        customerApi.getBookings().then(res => {
            const bookings = Array.isArray(res.data) ? res.data : res.data.content;
            const activeRequests = bookings
                .filter((booking) => ['PENDING', 'ACCEPTED', 'STARTED', 'IN_PROGRESS'].includes(booking.status?.toUpperCase() ?? ''))
                .map((booking) => ({ serviceId: booking.serviceId, serviceName: booking.serviceName ?? booking.name, status: booking.status }));
            setActiveBookings(activeRequests);
            localStorage.setItem('activeCustomerServiceRequests', JSON.stringify(activeRequests));
        }).catch(() => setActiveBookings([]));
    }, []);

    const activeStatuses = ['PENDING', 'ACCEPTED', 'STARTED', 'IN_PROGRESS'];
    const hasActiveBooking = (service: ServiceCategory): boolean => activeBookings.some((booking) => {
        const sameService = booking.serviceId === service.id || booking.serviceName?.toLowerCase() === service.name.toLowerCase();
        return sameService && activeStatuses.includes(booking.status?.toUpperCase() ?? 'PENDING');
    });

    const filteredServices = services.filter((service) => {
        const query = searchQuery.trim().toLowerCase();
        return !query || service.name.toLowerCase().includes(query) || service.description.toLowerCase().includes(query);
    });

    const handleRequest = (serviceId: number) => {
        const service = services.find((item) => item.id === serviceId);
        if (service && hasActiveBooking(service)) {
            alert('You already have an active request for this service. Track it from Booked & Completed.');
            return;
        }
        setLoadingId(serviceId);

        // 1. Browser se Live Location nikalna
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setLoadingId(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // 2. Backend ko Request Bhejna
                    await bookingApi.requestService({
                        serviceId: serviceId,
                        latitude: latitude,
                        longitude: longitude,
                        addressText: "Indore, MP (Live Location)" // Baad me isko input field se le sakte hain
                    });
                    setActiveBookings((currentBookings) => {
                        const nextBookings = [...currentBookings, { serviceId, serviceName: service?.name, status: 'PENDING' }];
                        localStorage.setItem('activeCustomerServiceRequests', JSON.stringify(nextBookings));
                        return nextBookings;
                    });
                    alert("✅ Request Sent Successfully! Finding nearby labours...");
                } catch (error) {
                    alert("❌ Failed to send request.");
                    console.error(error);
                } finally {
                    setLoadingId(null);
                }
            },
            () => {
                alert("Please allow location access to book a service.");
                setLoadingId(null);
            }
        );
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: CUSTOMER_THEME.text, mb: 3 }}>Available Services</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {filteredServices.map((service) => (
                    <Paper key={service.id} sx={{ p: 3, borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>{service.name}</Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>{service.description}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: CUSTOMER_THEME.primary }}>₹{service.pricePerHour}/hr</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            disabled={loadingId === service.id || hasActiveBooking(service)}
                            sx={{ borderRadius: '8px', py: 1, backgroundColor: CUSTOMER_THEME.primary, '&:hover': { backgroundColor: '#047857' } }}
                            onClick={() => handleRequest(service.id)}
                        >
                            {loadingId === service.id ? <CircularProgress size={24} color="inherit" /> : hasActiveBooking(service) ? 'Request Active' : 'Request Service'}
                        </Button>
                    </Paper>
                ))}
                {filteredServices.length === 0 && (
                    <Typography sx={{ gridColumn: '1 / -1', color: CUSTOMER_THEME.textSecondary }}>
                        No matching services found.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};