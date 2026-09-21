import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';

export const LabourProfile: React.FC = () => {
    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Labour Profile Settings</Typography>

            <Paper sx={{ p: 4, borderRadius: '16px', mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Personal Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField label="Full Name" fullWidth defaultValue="Ramesh" />
                    <TextField label="Phone Number" fullWidth defaultValue="9876543210" />
                    <TextField label="Working City" fullWidth defaultValue="Indore" />
                </Box>
                <Button variant="contained" color="success">Save Changes</Button>
            </Paper>
        </Box>
    );
};