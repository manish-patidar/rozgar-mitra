import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Divider, Switch, FormControlLabel, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useOutletContext } from 'react-router-dom';
import { LABOUR_THEME } from '../../../utils/labour.constants';
import { bookingApi, type NearbyTask } from '../../../api/booking.api';
import { apiPost, getApiErrorMessage } from '../../../api/client';

interface OutletContextType {
    searchQuery: string;
}

export const LabourDashboard: React.FC = () => {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [nearbyTasks, setNearbyTasks] = useState<NearbyTask[]>([]);
    const [myTasks, setMyTasks] = useState<NearbyTask[]>([]);
    const [rejectingTaskId, setRejectingTaskId] = useState<number | null>(null);
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [startOtp, setStartOtp] = useState('');
    const [completionOtp, setCompletionOtp] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const { searchQuery } = useOutletContext<OutletContextType>();

    const fetchTasks = async () => {
        const [nearbyResult, myTasksResult] = await Promise.allSettled([
            bookingApi.getNearbyTasks(searchQuery),
            bookingApi.getLabourTasks(searchQuery),
        ]);

        if (nearbyResult.status === 'fulfilled') {
            setNearbyTasks(nearbyResult.value.data);
        }
        if (myTasksResult.status === 'fulfilled') {
            setMyTasks(myTasksResult.value.data);
        }
    };

    const updateLabourLiveLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    await apiPost('/labour/update-location', { latitude, longitude });
                } catch (error) {
                    console.error("Failed to update labour location", error);
                }
            });
        }
    };

    useEffect(() => {
        if (!isOnline) return;
        updateLabourLiveLocation();
        // Polling synchronizes remote booking state; it intentionally updates state from this effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTasks();
        const interval = setInterval(() => {
            updateLabourLiveLocation();
            fetchTasks();
        }, 10000);
        return () => clearInterval(interval);
        // fetchTasks reads the current search query and is intentionally recreated with it.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, searchQuery]);

    const handleDutyToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOnline(event.target.checked);
    };

    const handleAccept = async (taskId: number) => {
        try {
            await bookingApi.acceptTask(taskId);
            setActiveTaskId(taskId);
            alert("✅ Job Accepted Successfully! Customer is notified.");
            fetchTasks();
        } catch {
            alert("❌ Failed to accept job. Maybe someone else took it.");
        }
    };

    const activeTask = myTasks.find((task) => task.id === activeTaskId)
        ?? nearbyTasks.find((task) => task.id === activeTaskId)
        ?? myTasks.find((task) => ['ACCEPTED', 'STARTED', 'IN_PROGRESS'].includes(task.status?.toUpperCase() ?? ''))
        ?? (activeTaskId !== null ? { id: activeTaskId } : undefined);

    const handleVerifyStart = async (taskId: number) => {
        setVerifyingOtp(true);
        try {
            await bookingApi.verifyStartOtp(taskId, startOtp);
            setStartOtp('');
            alert('✅ Start OTP verified. Service is now STARTED.');
            await fetchTasks();
        } catch (error) {
            alert(getApiErrorMessage(error, 'Start OTP verify nahi hua.'));
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleVerifyCompletion = async (taskId: number) => {
        setVerifyingOtp(true);
        try {
            await bookingApi.verifyCompletionOtp(taskId, completionOtp);
            setCompletionOtp('');
            setActiveTaskId(null);
            alert('✅ Completion OTP verified. Service completed and amount calculated.');
            await fetchTasks();
        } catch (error) {
            alert(getApiErrorMessage(error, 'Completion OTP verify nahi hua.'));
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleReject = async (taskId: number) => {
        setRejectingTaskId(taskId);
        try {
            await bookingApi.rejectTask(taskId);
            if (activeTaskId === taskId) setActiveTaskId(null);
            setNearbyTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
            await fetchTasks();
            alert('Request rejected. You can choose another service.');
        } catch {
            alert('Request reject nahi hua. Backend reject endpoint check karein.');
        } finally {
            setRejectingTaskId(null);
        }
    };

    const getCustomerCoordinates = (task: NearbyTask): { latitude: number; longitude: number } | null => {
        const latitude = task.customerLatitude ?? task.latitude ?? task.customerLocation?.latitude;
        const longitude = task.customerLongitude ?? task.longitude ?? task.customerLocation?.longitude;

        return typeof latitude === 'number' && typeof longitude === 'number' ? { latitude, longitude } : null;
    };

    const getCustomerMapUrl = (task: NearbyTask): string | null => {
        const coordinates = getCustomerCoordinates(task);
        if (!coordinates) return null;

        return `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
    };

    const canViewCustomerLocation = (task: NearbyTask): boolean =>
        ['ACCEPTED', 'STARTED', 'IN_PROGRESS'].includes(task.status?.toUpperCase() ?? '') || activeTask?.id === task.id;

    const filteredTasks = nearbyTasks.filter((task) => {
        if (!searchQuery) return true;
        return task.serviceName?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <Box sx={{ fontFamily: 'Abhaya Libre' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.text }}>Welcome to Work</Typography>
                    <Typography variant="body2" sx={{ color: LABOUR_THEME.textSecondary }}>Find new job requests here</Typography>
                </Box>
                <FormControlLabel
                    control={<Switch checked={isOnline} onChange={handleDutyToggle} color="success" />}
                    label={<Typography sx={{ fontWeight: 'bold', color: isOnline ? LABOUR_THEME.primary : LABOUR_THEME.textSecondary }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Typography>}
                    labelPlacement="start"
                />
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <Typography variant="body2" color="textSecondary">Today's Earnings</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CurrencyRupeeIcon fontSize="small" /> 0
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <Typography variant="body2" color="textSecondary">Tasks Accepted</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.text }}>0</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Live Requests (Within 12km) {isOnline && <span style={{ color: 'red', fontSize: '12px' }}>● Live</span>}
            </Typography>

            {activeTask && (
                <Paper sx={{ p: 2, mb: 3, borderRadius: '16px', border: `1px solid ${LABOUR_THEME.primary}`, backgroundColor: '#ecfdf5' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 800, color: LABOUR_THEME.primary }}>
                                Active service: {activeTask.serviceName ?? 'Service'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: LABOUR_THEME.textSecondary }}>
                                Complete this service before accepting another request.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {getCustomerMapUrl(activeTask) && (
                                <Button component="a" href={getCustomerMapUrl(activeTask) ?? undefined} target="_blank" rel="noopener noreferrer" variant="outlined" color="success" sx={{ borderRadius: '8px' }}>
                                    OPEN MAP
                                </Button>
                            )}
                            {activeTask.status === 'ACCEPTED' && <TextField size="small" label="Start OTP" value={startOtp} onChange={(event) => setStartOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }} />}
                            {activeTask.status === 'ACCEPTED' && <Button variant="contained" color="success" onClick={() => void handleVerifyStart(activeTask.id)} disabled={verifyingOtp || startOtp.length !== 6} sx={{ borderRadius: '8px' }}>VERIFY START</Button>}
                            {activeTask.status === 'STARTED' && <TextField size="small" label="Completion OTP" value={completionOtp} onChange={(event) => setCompletionOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }} />}
                            {activeTask.status === 'STARTED' && <Button variant="contained" color="success" onClick={() => void handleVerifyCompletion(activeTask.id)} disabled={verifyingOtp || completionOtp.length !== 6} sx={{ borderRadius: '8px' }}>VERIFY COMPLETE</Button>}
                            {activeTask.status === 'ACCEPTED' && <Button variant="outlined" color="error" onClick={() => void handleReject(activeTask.id)} disabled={rejectingTaskId === activeTask.id} sx={{ borderRadius: '8px' }}>REJECT REQUEST</Button>}
                        </Box>
                    </Box>
                </Paper>
            )}

            {!isOnline ? (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', textAlign: 'center', backgroundColor: '#f1f5f9' }}>
                    <Typography variant="body1" sx={{ color: LABOUR_THEME.textSecondary }}>
                        You are offline. Go Online to start receiving work requests in your area.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredTasks.length === 0 ? (
                        <Grid size={{ xs: 12 }}>
                            <Typography sx={{ color: 'text.secondary' }}>No matching requests found...</Typography>
                        </Grid>
                    ) : (
                        filteredTasks.map((task) => (
                            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={task.id}>
                                <Paper elevation={0} sx={{ display: 'flex', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                    <Box sx={{ width: '8px', backgroundColor: LABOUR_THEME.warning }} />
                                    <Box sx={{ p: 3, flexGrow: 1, backgroundColor: '#fff' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '18px' }}>{task.serviceName}</Typography>
                                            <Typography sx={{ fontWeight: 800, color: LABOUR_THEME.primary, fontSize: '18px' }}>₹{task.estimatedPrice}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>Customer: {task.customerName ?? 'Customer'}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: LABOUR_THEME.textSecondary, mb: 2 }}>
                                            <LocationOnIcon sx={{ fontSize: '18px', mr: 0.5 }} />
                                            <Typography variant="body2">{task.addressText ?? 'Location shared with request'}</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button variant="outlined" color="error" onClick={() => handleReject(task.id)} disabled={Boolean(activeTask) || rejectingTaskId === task.id} fullWidth sx={{ borderRadius: '8px' }}>
                                                {rejectingTaskId === task.id ? 'REJECTING...' : 'REJECT'}
                                            </Button>
                                            {activeTask?.id === task.id ? (
                                                <Button variant="contained" color="success" disabled fullWidth sx={{ borderRadius: '8px' }}>
                                                    {task.status === 'STARTED' ? 'SERVICE IN PROGRESS' : 'WAITING FOR START OTP'}
                                                </Button>
                                            ) : (
                                                <Button variant="contained" color="success" onClick={() => handleAccept(task.id)} disabled={Boolean(activeTask)} fullWidth sx={{ borderRadius: '8px' }}>
                                                    {activeTask ? 'ACTIVE JOB RUNNING' : 'ACCEPT JOB'}
                                                </Button>
                                            )}
                                        </Box>
                                        {canViewCustomerLocation(task) && getCustomerMapUrl(task) && (
                                            <Button
                                                component="a"
                                                href={getCustomerMapUrl(task) ?? undefined}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="outlined"
                                                color="success"
                                                fullWidth
                                                sx={{ mt: 2, borderRadius: '8px' }}
                                            >
                                                OPEN CUSTOMER LOCATION
                                            </Button>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}
        </Box>
    );
};