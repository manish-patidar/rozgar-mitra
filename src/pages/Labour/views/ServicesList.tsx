import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { LABOUR_THEME } from '../../../utils/labour.constants';
import { adminApi } from '../../../services/Admin/admin.api';
import type { ServiceCategory } from '../../Admin/admin.types';
import { useOutletContext } from 'react-router-dom';

interface LabourOutletContext {
    searchQuery: string;
}

export const ServicesList: React.FC = () => {
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const { searchQuery } = useOutletContext<LabourOutletContext>();

    useEffect(() => {
        adminApi.getServices(searchQuery).then((response) => setServices(response.data)).finally(() => setLoading(false));
    }, [searchQuery]);

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.text, mb: 1 }}>Available Services on Platform</Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>These are the standard services set by Admin. Prices are fixed per hour.</Typography>

            {loading ? <CircularProgress sx={{ color: LABOUR_THEME.primary }} /> : <Grid container spacing={3}>
                {services.map((service) => (
                    <Grid size={{ xs: 12, sm: 3 }} key={service.id}>
                        <Paper sx={{ p: 3, borderRadius: '16px', borderLeft: `6px solid ${LABOUR_THEME.primary}`, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} elevation={0}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{service.name}</Typography>
                                <Typography variant="h6" sx={{ color: LABOUR_THEME.primary, fontWeight: 'bold' }}>₹{service.pricePerHour}/hr</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>}
        </Box>
    );
};