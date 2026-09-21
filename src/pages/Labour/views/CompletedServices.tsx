import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useOutletContext } from 'react-router-dom';
import { bookingApi, type NearbyTask } from '../../../api/booking.api';
import { LABOUR_THEME } from '../../../utils/labour.constants';
import { ServiceDetailDialog } from '../../../components/ServiceDetailDialog';

interface OutletContextType {
    searchQuery: string;
}

export const CompletedServices: React.FC = () => {
    const { searchQuery } = useOutletContext<OutletContextType>();
    const [tasks, setTasks] = useState<NearbyTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<NearbyTask | null>(null);

    useEffect(() => {
        bookingApi.getLabourTasks(searchQuery).then((response) => setTasks(response.data)).finally(() => setLoading(false));
    }, [searchQuery]);

    const filteredTasks = tasks.filter((task) => {
        if (!searchQuery) return true;
        return (task.serviceName ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.text, mb: 3 }}>Service History</Typography>

            <Grid container spacing={3}>
                {loading ? <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress sx={{ color: LABOUR_THEME.primary }} /></Grid> : filteredTasks.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                        <Typography color="text.secondary">No matching completed jobs found.</Typography>
                    </Grid>
                ) : (
                    filteredTasks.map((task) => (
                        <Grid size={{ xs: 12, sm: 6, md: 6 }} key={task.id}>
                            <Paper elevation={1} onClick={() => setSelectedTask(task)} sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
                                <Box sx={{ width: '8px', backgroundColor: '#16a34a' }} />
                                <Box sx={{ p: 3, flexGrow: 1, backgroundColor: '#fff' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{task.serviceName ?? 'Service'}</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: task.status === 'COMPLETED' ? LABOUR_THEME.primary : LABOUR_THEME.warning }}>
                                            {task.status === 'COMPLETED' ? <CheckCircleIcon sx={{ fontSize: '18px', verticalAlign: 'middle', mr: 0.5 }} /> : null}
                                            {task.status ?? 'PENDING'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Customer: {task.customerName ?? 'Customer'}</Typography>

                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                        <Typography variant="caption">{task.addressText ?? 'Location shared with request'}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
            <ServiceDetailDialog service={selectedTask} onClose={() => setSelectedTask(null)} />
        </Box>
    );
};