import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, Button, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { LABOUR_THEME } from '../../../utils/labour.constants';
import { useOutletContext } from 'react-router-dom';
import { bookingApi, type NearbyTask } from '../../../api/booking.api';

interface OutletContextType {
    searchQuery: string;
}

export const OpenServices: React.FC = () => {
    const { searchQuery } = useOutletContext<OutletContextType>();
    const [openTasks, setOpenTasks] = useState<NearbyTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<number | null>(null);

    const loadTasks = async () => {
        try {
            const response = await bookingApi.getNearbyTasks(searchQuery);
            setOpenTasks(response.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadTasks();
        // loadTasks reads the current search query and is intentionally recreated with it.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const handleAction = async (taskId: number, action: 'accept' | 'reject') => {
        setActionId(taskId);
        try {
            if (action === 'accept') await bookingApi.acceptTask(taskId);
            else await bookingApi.rejectTask(taskId);
            setOpenTasks((tasks) => tasks.filter((task) => task.id !== taskId));
        } finally {
            setActionId(null);
        }
    };

    const filteredTasks = openTasks.filter((task) => {
        if (!searchQuery) return true;
        return (task.serviceName ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: LABOUR_THEME.text }}>Open Services List</Typography>

            <Grid container spacing={3}>
                {loading ? (
                    <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress sx={{ color: LABOUR_THEME.primary }} /></Grid>
                ) : filteredTasks.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                        <Typography color="text.secondary">No matching ongoing jobs found.</Typography>
                    </Grid>
                ) : (
                    filteredTasks.map((task) => (
                        <Grid size={{ xs: 12, sm: 4, md: 4 }} key={task.id}>
                            <Paper elevation={2} sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden' }}>
                                <Box sx={{ width: '8px', backgroundColor: LABOUR_THEME.primary }} />
                                <Box sx={{ p: 3, flexGrow: 1, backgroundColor: '#fff' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{task.serviceName ?? 'Service'}</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: LABOUR_THEME.primary }}>₹{task.estimatedPrice ?? 0}/hr</Typography>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Customer: {task.customerName ?? 'Customer'}</Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                        <Typography variant="body2">{task.addressText ?? 'Location shared with request'}</Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button variant="outlined" color="error" fullWidth disabled={actionId === task.id} onClick={() => void handleAction(task.id, 'reject')} sx={{ borderRadius: '8px' }}>REJECT</Button>
                                        <Button variant="contained" color="success" fullWidth disabled={actionId === task.id} onClick={() => void handleAction(task.id, 'accept')} sx={{ borderRadius: '8px' }}>ACCEPT</Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};