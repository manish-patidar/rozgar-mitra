import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { PREMIUM_THEME } from '../../utils/theme.constants';

export const LabourHome: React.FC = () => {
    const [isOnline, setIsOnline] = useState(true);
    // Dummy state to simulate swiping/removing cards
    const [tasks, setTasks] = useState([
        { id: 1, service: 'Plumbing Repair', location: 'Vijay Nagar', price: 450, zIndex: 3, scale: 1, top: 0 },
        { id: 2, service: 'Water Tank Clean', location: 'Bhawarkuan', price: 300, zIndex: 2, scale: 0.95, top: 15 },
        { id: 3, service: 'Pipe Fitting', location: 'Palasia', price: 600, zIndex: 1, scale: 0.9, top: 30 },
    ]);

    // Simulate Swiping Effect
    const handleAction = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id).map((t, index) => ({
            ...t,
            zIndex: 3 - index,
            scale: 1 - (index * 0.05),
            top: index * 15
        })));
    };

    return (
        <Box sx={{
            background: PREMIUM_THEME.labourBg,
            minHeight: '100vh', p: 3,
            fontFamily: 'Abhaya Libre', color: PREMIUM_THEME.textWhite
        }}>

            {/* Header & Status */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>Dashboard</Typography>
                    <Typography variant="body2" sx={{ color: PREMIUM_THEME.textGray }}>Today's Earnings: ₹450</Typography>
                </Box>
                <FormControlLabel
                    control={<Switch checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} color="success" />}
                    label={<Typography sx={{ fontWeight: 800, color: isOnline ? '#10b981' : PREMIUM_THEME.textGray }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Typography>}
                    labelPlacement="start"
                />
            </Box>

            {/* STACKED SWIPE CARDS UI */}
            {isOnline ? (
                <Box sx={{ position: 'relative', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {tasks.length > 0 ? tasks.map((task) => (
                        <Box key={task.id} sx={{
                            position: 'absolute',
                            width: '100%', maxWidth: '350px',
                            ...PREMIUM_THEME.glassEffect,
                            p: 4,
                            zIndex: task.zIndex,
                            transform: `scale(${task.scale}) translateY(${task.top}px)`,
                            transition: 'all 0.3s ease',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                        }}>
                            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                <CurrencyRupeeIcon sx={{ color: '#10b981', fontSize: 32 }} />
                            </Box>

                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', mb: 1 }}>₹{task.price}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{task.service}</Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', color: PREMIUM_THEME.textGray, mb: 4 }}>
                                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography>{task.location}</Typography>
                            </Box>

                            {/* Swipe Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 4, width: '100%', justifyContent: 'center' }}>
                                <IconButton
                                    onClick={() => handleAction(task.id)}
                                    sx={{ width: 64, height: 64, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.3)' } }}>
                                    <CloseIcon fontSize="large" />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleAction(task.id)}
                                    sx={{ width: 64, height: 64, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', color: '#10b981', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.3)' } }}>
                                    <CheckIcon fontSize="large" />
                                </IconButton>
                            </Box>
                        </Box>
                    )) : (
                        <Typography sx={{ color: PREMIUM_THEME.textGray }}>No more requests right now.</Typography>
                    )}
                </Box>
            ) : (
                <Box sx={{ ...PREMIUM_THEME.glassEffect, p: 4, textAlign: 'center', mt: 10 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>You are Offline</Typography>
                    <Typography variant="body2" sx={{ color: PREMIUM_THEME.textGray }}>Toggle online to receive nearby tasks.</Typography>
                </Box>
            )}
        </Box>
    );
};