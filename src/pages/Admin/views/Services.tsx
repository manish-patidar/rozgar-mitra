import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { adminApi } from '../../../services/Admin/admin.api';
import type { ServiceCategory } from '../../../pages/Admin/admin.types';
import { getApiErrorMessage } from '../../../api/client';
import { THEME_COLORS } from '../../../utils/admin.constants';

export const Services: React.FC = () => {
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [newService, setNewService] = useState({ name: '', description: '', pricePerHour: '' });

    const fetchServices = async () => {
        try {
            const response = await adminApi.getServices();
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", getApiErrorMessage(error, "Failed"));
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.addService({
                name: newService.name,
                description: newService.description,
                pricePerHour: Number(newService.pricePerHour)
            });
            setNewService({ name: '', description: '', pricePerHour: '' });
            fetchServices();
        } catch (error) {
            alert(getApiErrorMessage(error, "Failed to add service. Name might be duplicate."));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Delete this service?")) {
            try {
                await adminApi.deleteService(id);
                fetchServices();
            } catch (error) {
                alert(getApiErrorMessage(error, "Failed to delete service"));
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: THEME_COLORS.text, mb: 3 }}>
                Services Configuration
            </Typography>

            <Paper sx={{ p: 3, mb: 4, borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Add New Service</Typography>
                <form onSubmit={handleAddService}>
                    {/* Error-Free CSS Grid using Box instead of MUI Grid */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '3fr 5fr 2fr 2fr' },
                            gap: 2,
                            alignItems: 'center'
                        }}
                    >
                        <TextField fullWidth label="Service Name" size="small" required
                            value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />

                        <TextField fullWidth label="Description" size="small" required
                            value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />

                        <TextField fullWidth label="Price/Hour (₹)" type="number" size="small" required
                            value={newService.pricePerHour} onChange={(e) => setNewService({ ...newService, pricePerHour: e.target.value })} />

                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '40px' }}>
                            Add Service
                        </Button>
                    </Box>
                </form>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: THEME_COLORS.background }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Price/Hour</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell>#{service.id}</TableCell>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>₹{service.pricePerHour}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(service.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};