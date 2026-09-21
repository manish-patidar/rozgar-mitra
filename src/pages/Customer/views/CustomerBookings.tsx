import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { customerApi, type CustomerBooking } from '../../../api/customer.api';
import { bookingApi } from '../../../api/booking.api';
import { getApiErrorMessage } from '../../../api/client';
import { CUSTOMER_THEME } from '../../../utils/customer.constants';
import { useOutletContext } from 'react-router-dom';
import { ServiceDetailDialog } from '../../../components/ServiceDetailDialog';

interface CustomerOutletContext {
    searchQuery: string;
}

const getBookingStatus = (status?: string): string => {
    switch (status?.toUpperCase()) {
        case 'COMPLETED': return 'Completed';
        case 'IN_PROGRESS': return 'In progress';
        case 'STARTED': return 'In progress';
        case 'ACCEPTED': return 'Accepted';
        case 'CANCELLED': return 'Cancelled';
        case 'REJECTED': return 'Rejected';
        default: return 'Pending';
    }
};

const getServiceName = (booking: CustomerBooking): string => booking.serviceName ?? booking.name ?? 'Service';

export const CustomerBookings: React.FC = () => {
    const { searchQuery } = useOutletContext<CustomerOutletContext>();
    const [bookings, setBookings] = useState<CustomerBooking[]>([]);
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [actionId, setActionId] = useState<string | number | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<CustomerBooking | null>(null);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const response = await customerApi.getBookings(page);
                const nextBookings = Array.isArray(response.data) ? response.data : response.data.content;
                setBookings((current) => page === 0 ? nextBookings : [...current, ...nextBookings]);
                setLastPage(Array.isArray(response.data) ? true : response.data.last);
                const activeRequests = nextBookings
                    .filter((booking) => ['PENDING', 'ACCEPTED', 'STARTED', 'IN_PROGRESS'].includes(booking.status?.toUpperCase() ?? ''))
                    .map((booking) => ({ serviceId: booking.serviceId, serviceName: booking.serviceName ?? booking.name, status: booking.status }));
                localStorage.setItem('activeCustomerServiceRequests', JSON.stringify(activeRequests));
            } catch (error) {
                setErrorMessage(getApiErrorMessage(error, 'Unable to load your booked services.'));
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
        const refresh = window.setInterval(loadBookings, 10000);
        return () => window.clearInterval(refresh);
    }, [page]);

    const filteredBookings = bookings.filter((booking) => {
        const query = searchQuery.trim().toLowerCase();
        return !query || getServiceName(booking).toLowerCase().includes(query);
    });

    const updateBooking = (updated: CustomerBooking) => {
        setBookings((current) => current.map((booking) => booking.id === updated.id ? { ...booking, ...updated } : booking));
    };

    const runAction = async (booking: CustomerBooking, action: 'start' | 'completion' | 'pay' | 'reject') => {
        setActionId(booking.id);
        try {
            const response = action === 'start'
                ? await bookingApi.generateStartOtp(Number(booking.id))
                : action === 'completion'
                    ? await bookingApi.generateCompletionOtp(Number(booking.id))
                    : action === 'pay'
                        ? await bookingApi.payForTask(Number(booking.id))
                        : await bookingApi.customerRejectTask(Number(booking.id));
            updateBooking(response.data);
        } catch (error) {
            setErrorMessage(getApiErrorMessage(error, 'Unable to update this service.'));
        } finally {
            setActionId(null);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: CUSTOMER_THEME.text, mb: 3 }}>
                Booked & Completed Services
            </Typography>

            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: CUSTOMER_THEME.primary }} /></Box>}

            {!loading && errorMessage && (
                <Paper sx={{ p: 3, borderRadius: '16px', color: '#b91c1c', backgroundColor: '#fef2f2' }}>
                    <Typography>{errorMessage}</Typography>
                </Paper>
            )}

            {!loading && !errorMessage && filteredBookings.length === 0 && (
                <Paper sx={{ p: 4, borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <Typography sx={{ color: CUSTOMER_THEME.textSecondary }}>
                        No booked or completed services found.
                    </Typography>
                </Paper>
            )}

            {!loading && !errorMessage && filteredBookings.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                    {filteredBookings.map((booking) => {
                        const status = getBookingStatus(booking.status);
                        const isCompleted = status === 'Completed';
                        const isActive = status === 'Accepted' || status === 'In progress';
                        const canReject = status === 'Pending' || status === 'Accepted';
                        const statusColor = isCompleted ? CUSTOMER_THEME.primary : isActive ? '#2563eb' : CUSTOMER_THEME.warning;
                        const labourMapUrl = booking.labourLatitude !== undefined && booking.labourLongitude !== undefined
                            ? `https://www.google.com/maps/search/?api=1&query=${booking.labourLatitude},${booking.labourLongitude}`
                            : null;

                        return (
                            <Paper key={booking.id} onClick={() => setSelectedBooking(booking)} sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                                <Box sx={{ width: '8px', backgroundColor: statusColor }} />
                                <Box sx={{ p: 3, flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{getServiceName(booking)}</Typography>
                                        <Typography sx={{ color: statusColor, fontWeight: 700, whiteSpace: 'nowrap' }}>
                                            {isCompleted ? <CheckCircleIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> : <HourglassTopIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />}
                                            {status}
                                        </Typography>
                                    </Box>
                                    {booking.description && <Typography variant="body2" sx={{ color: CUSTOMER_THEME.textSecondary, mb: 1 }}>{booking.description}</Typography>}
                                    {(booking.pricePerHour ?? booking.price) !== undefined && (
                                        <Typography sx={{ color: CUSTOMER_THEME.primary, fontWeight: 800, mb: 2 }}>
                                            ₹{booking.pricePerHour ?? booking.price}/hr
                                        </Typography>
                                    )}
                                    {booking.labourName && <Typography variant="body2" sx={{ color: CUSTOMER_THEME.textSecondary, mb: 1 }}>Labour: {booking.labourName}</Typography>}
                                    {(booking.addressText ?? booking.address) && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: CUSTOMER_THEME.textSecondary }}>
                                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">{booking.addressText ?? booking.address}</Typography>
                                        </Box>
                                    )}
                                    {booking.labourName && isActive && <Typography variant="body2" sx={{ color: CUSTOMER_THEME.textSecondary, mt: 1 }}>Accepted by: {booking.labourName}</Typography>}
                                    {labourMapUrl && isActive && (
                                        <Button component="a" href={labourMapUrl} target="_blank" rel="noopener noreferrer" variant="outlined" color="success" sx={{ mt: 2, borderRadius: '8px' }}>
                                            TRACK LABOUR ON MAP
                                        </Button>
                                    )}
                                    {status === 'Accepted' && (
                                        <Box sx={{ mt: 2, p: 2, borderRadius: '10px', backgroundColor: '#eff6ff' }}>
                                            {booking.startOtp ? (
                                                <Typography sx={{ fontWeight: 800, color: '#1d4ed8' }}>Starting OTP: {booking.startOtp}</Typography>
                                            ) : (
                                                <Button variant="contained" onClick={(event) => { event.stopPropagation(); void runAction(booking, 'start'); }} disabled={actionId === booking.id} sx={{ borderRadius: '8px' }}>
                                                    GENERATE START OTP
                                                </Button>
                                            )}
                                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: CUSTOMER_THEME.textSecondary }}>
                                                Share this 6-digit code with the labour when they arrive.
                                            </Typography>
                                        </Box>
                                    )}
                                    {status === 'In progress' && (
                                        <Box sx={{ mt: 2, p: 2, borderRadius: '10px', backgroundColor: '#fff7ed' }}>
                                            {booking.completionOtp ? (
                                                <Typography sx={{ fontWeight: 800, color: '#c2410c' }}>Completion OTP: {booking.completionOtp}</Typography>
                                            ) : (
                                                <Button variant="contained" color="warning" onClick={(event) => { event.stopPropagation(); void runAction(booking, 'completion'); }} disabled={actionId === booking.id} sx={{ borderRadius: '8px' }}>
                                                    GENERATE COMPLETION OTP
                                                </Button>
                                            )}
                                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: CUSTOMER_THEME.textSecondary }}>
                                                Share this code after the service is finished.
                                            </Typography>
                                        </Box>
                                    )}
                                    {status === 'Completed' && booking.paymentStatus !== 'PAID' && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography sx={{ fontWeight: 800, mb: 1 }}>Amount: ₹{booking.finalAmount?.toFixed(2) ?? booking.pricePerHour ?? 0}</Typography>
                                            <Button variant="contained" color="success" onClick={(event) => { event.stopPropagation(); void runAction(booking, 'pay'); }} disabled={actionId === booking.id} sx={{ borderRadius: '8px' }}>
                                                PAY NOW
                                            </Button>
                                        </Box>
                                    )}
                                    {booking.paymentStatus === 'PAID' && <Typography sx={{ mt: 2, color: CUSTOMER_THEME.primary, fontWeight: 800 }}>Payment received by labour</Typography>}
                                    {canReject && (
                                        <Button variant="outlined" color="error" onClick={(event) => { event.stopPropagation(); void runAction(booking, 'reject'); }} disabled={actionId === booking.id} sx={{ mt: 2, borderRadius: '8px' }}>
                                            REJECT REQUEST
                                        </Button>
                                    )}
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            )}
            {!loading && !errorMessage && bookings.length > 0 && !lastPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="outlined" onClick={() => setPage((current) => current + 1)}>Load more</Button>
                </Box>
            )}
            <ServiceDetailDialog service={selectedBooking} onClose={() => setSelectedBooking(null)} />
        </Box>
    );
};
