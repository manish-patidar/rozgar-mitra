import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress } from '@mui/material';
import { adminApi } from '../../../services/Admin/admin.api';
import type { UserResponseDto } from '../../../pages/Admin/admin.types';
import { getApiErrorMessage } from '../../../api/client';
import { THEME_COLORS } from '../../../utils/admin.constants';

export const Labours: React.FC = () => {
    const [labours, setLabours] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLabours = async () => {
        try {
            const response = await adminApi.getLabours();
            setLabours(response.data);
        } catch (error) {
            console.error("Error fetching labours:", getApiErrorMessage(error, "Failed to load"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLabours();
    }, []);
    const getFullAddress = (addr: any) => {
        if (!addr) return 'N/A';
        // Jo jo fields address me hongi, unhe filter karke comma se jod dega
        const parts = [addr.apartmentNumber, addr.buildingName, addr.colony, addr.city, addr.state, addr.pincode].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'N/A';
    };
    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this labour?")) {
            try {
                await adminApi.deleteUser(id);
                fetchLabours();
            } catch (error) {
                alert(getApiErrorMessage(error, "Failed to delete user"));
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: THEME_COLORS.text, mb: 3 }}>
                Labour Management
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                ) : (
                    <Table>
                        <TableHead sx={{ backgroundColor: THEME_COLORS.background }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Full Address</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {labours.map((labour) => (
                                <TableRow key={labour.id}>
                                    <TableCell>{labour.name}</TableCell>
                                    <TableCell>{labour.username}</TableCell>
                                    <TableCell>{labour.phone_number}</TableCell>
                                    <TableCell>{getFullAddress(labour.address)}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(labour.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {labours.length === 0 && (
                                <TableRow><TableCell colSpan={5} align="center">No labours found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </Box>
    );
};