import React from 'react';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { THEME_COLORS } from '../utils/admin.constants';

export interface ServiceDetailData {
    id: number | string;
    serviceName?: string;
    customerName?: string;
    customerUsername?: string;
    customerPhone?: string;
    labourName?: string;
    labourUsername?: string;
    labourPhone?: string;
    status?: string;
    addressText?: string;
    estimatedPrice?: number;
    customerLatitude?: number;
    customerLongitude?: number;
    startedAt?: string;
    completedAt?: string;
    startOtpGeneratedAt?: string;
    startOtpVerifiedAt?: string;
    completionOtpVerifiedAt?: string;
    durationMinutes?: number;
    finalAmount?: number;
    paymentStatus?: string;
}

const statusColor = (status?: string): string => {
    switch (status?.toUpperCase()) {
        case 'COMPLETED': return THEME_COLORS.success;
        case 'ACCEPTED':
        case 'STARTED':
        case 'IN_PROGRESS': return '#2563eb';
        case 'CANCELLED':
        case 'REJECTED': return '#dc2626';
        default: return THEME_COLORS.warning;
    }
};

const mapUrl = (latitude?: number, longitude?: number): string | null =>
    latitude !== undefined && longitude !== undefined ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}` : null;

interface ServiceDetailDialogProps {
    service: ServiceDetailData | null;
    onClose: () => void;
}

export const ServiceDetailDialog: React.FC<ServiceDetailDialogProps> = ({ service, onClose }) => (
    <Dialog open={Boolean(service)} onClose={onClose} fullWidth maxWidth="sm">
        {service && (
            <>
                <DialogTitle sx={{ fontWeight: 800 }}>
                    Assignment #{service.id}
                    <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: THEME_COLORS.primary }}>{service.serviceName ?? 'Service'}</Typography>
                    <Typography sx={{ color: statusColor(service.status), fontWeight: 800, mt: 0.5 }}>{service.status ?? 'PENDING'}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography sx={{ fontWeight: 800, mb: 1 }}>Customer</Typography>
                    <Typography>{service.customerName ?? 'Customer'}</Typography>
                    <Typography variant="body2" color="text.secondary">{service.customerUsername ?? ''} {service.customerPhone ? `• ${service.customerPhone}` : ''}</Typography>
                    <Typography sx={{ fontWeight: 800, mt: 2, mb: 1 }}>Labour</Typography>
                    <Typography>{service.labourName ?? 'No labour has accepted this request'}</Typography>
                    {service.labourUsername && <Typography variant="body2" color="text.secondary">{service.labourUsername} {service.labourPhone ? `• ${service.labourPhone}` : ''}</Typography>}
                    <Typography sx={{ fontWeight: 800, mt: 2, mb: 1 }}>Booking</Typography>
                    <Typography>Price: ₹{service.estimatedPrice ?? 0}</Typography>
                    <Typography>Final amount: ₹{service.finalAmount?.toFixed(2) ?? 'Not calculated'}</Typography>
                    <Typography>Payment: {service.paymentStatus ?? 'Not paid'}</Typography>
                    <Typography>Started: {service.startedAt ? new Date(service.startedAt).toLocaleString() : 'Not started'}</Typography>
                    <Typography>Completed: {service.completedAt ? new Date(service.completedAt).toLocaleString() : 'Not completed'}</Typography>
                    <Typography>Duration: {service.durationMinutes ? `${service.durationMinutes} minutes` : 'Not available'}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Start OTP generated: {service.startOtpGeneratedAt ? new Date(service.startOtpGeneratedAt).toLocaleString() : 'No'}</Typography>
                    <Typography variant="body2" color="text.secondary">Start OTP verified: {service.startOtpVerifiedAt ? new Date(service.startOtpVerifiedAt).toLocaleString() : 'No'}</Typography>
                    <Typography variant="body2" color="text.secondary">Completion OTP verified: {service.completionOtpVerifiedAt ? new Date(service.completionOtpVerifiedAt).toLocaleString() : 'No'}</Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', mt: 1 }}><LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: THEME_COLORS.primary }} />{service.addressText ?? 'Location not provided'}</Typography>
                    {mapUrl(service.customerLatitude, service.customerLongitude) && <Typography component="a" href={mapUrl(service.customerLatitude, service.customerLongitude) ?? undefined} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-block', mt: 1, color: THEME_COLORS.primary }}>Open customer location</Typography>}
                </DialogContent>
            </>
        )}
    </Dialog>
);