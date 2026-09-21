import React, { useState } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Button, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { LABOUR_THEME } from '../../utils/labour.constants';
import type { LabourTask } from '../../pages/Labour/labour.types';

export const LabourHome: React.FC = () => {
    // Ye state baad me backend API se map hogi
    const [isOnline, setIsOnline] = useState(false);

    // Dummy Task for UI check
    const pendingTasks: LabourTask[] = [
        { id: 'TSK-101', customerName: 'Rohan Sharma', location: 'Vijay Nagar, Indore', service: 'Plumbing Repair', estimatedEarnings: 250, status: 'PENDING' }
    ];

    const handleDutyToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOnline(event.target.checked);
        // Aage chal kar yahan Backend API call hogi status update karne ke liye
    };

    return (
        <Box sx={{ backgroundColor: LABOUR_THEME.background, minHeight: '100vh', p: { xs: 2, sm: 4 }, fontFamily: 'Abhaya Libre' }}>

            {/* Header & Duty Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.text }}>Welcome, Ramesh</Typography>
                    <Typography variant="body2" sx={{ color: LABOUR_THEME.textSecondary }}>Ready to work today?</Typography>
                </Box>
                <FormControlLabel
                    control={<Switch checked={isOnline} onChange={handleDutyToggle} color="success" />}
                    label={
                        <Typography sx={{ fontWeight: 'bold', color: isOnline ? LABOUR_THEME.primary : LABOUR_THEME.textSecondary }}>
                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </Typography>
                    }
                    labelPlacement="bottom"
                />
            </Box>

            {/* Quick Stats Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 4 }}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">Today's Earnings</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CurrencyRupeeIcon fontSize="small" /> 450
                    </Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">Tasks Done</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: LABOUR_THEME.text }}>
                        2
                    </Typography>
                </Paper>
            </Box>

            {/* Task Requests Section */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                New Requests {isOnline && <span style={{ color: 'red', fontSize: '12px' }}>● Live</span>}
            </Typography>

            {!isOnline ? (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', textAlign: 'center', backgroundColor: '#f1f5f9' }}>
                    <Typography variant="body1" sx={{ color: LABOUR_THEME.textSecondary }}>
                        Go Online to start receiving work requests in your area.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pendingTasks.map((task) => (
                        <Paper key={task.id} elevation={0} sx={{ p: 2, borderRadius: '16px', borderLeft: `6px solid ${LABOUR_THEME.warning}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ fontWeight: 800 }}>{task.service}</Typography>
                                <Typography sx={{ fontWeight: 800, color: LABOUR_THEME.primary }}>₹{task.estimatedEarnings}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: LABOUR_THEME.textSecondary, mb: 2 }}>
                                <LocationOnIcon sx={{ fontSize: '16px', mr: 0.5 }} />
                                <Typography variant="caption">{task.location}</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Button variant="outlined" color="error" fullWidth sx={{ borderRadius: '8px' }}>Reject</Button>
                                <Button variant="contained" color="success" fullWidth sx={{ borderRadius: '8px' }}>Accept</Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};