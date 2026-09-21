import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { adminApi } from '../../../services/Admin/admin.api';
import type { AdminTask } from '../admin.types';
import { THEME_COLORS } from '../../../utils/admin.constants';
import { ServiceDetailDialog } from '../../../components/ServiceDetailDialog';

export const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<AdminTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);

    useEffect(() => {
        adminApi.getTasks().then((response) => setTasks(response.data)).finally(() => setLoading(false));
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: THEME_COLORS.text, mb: 1 }}>Service Assignments</Typography>
            <Typography variant="body2" sx={{ color: THEME_COLORS.textSecondary, mb: 3 }}>
                See which customer requested each service and which labour accepted it.
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: THEME_COLORS.primary }} /></Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: THEME_COLORS.background }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>Service</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Labour</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id} hover onClick={() => setSelectedTask(task)} sx={{ cursor: 'pointer' }}>
                                    <TableCell>{task.serviceName}</TableCell>
                                    <TableCell>{task.customerName}</TableCell>
                                    <TableCell>{task.labourName ?? 'Not assigned'}</TableCell>
                                    <TableCell sx={{ color: task.status === 'COMPLETED' ? THEME_COLORS.success : task.status === 'REJECTED' ? '#dc2626' : THEME_COLORS.warning, fontWeight: 700 }}>{task.status}</TableCell>
                                    <TableCell>₹{task.estimatedPrice ?? 0}</TableCell>
                                </TableRow>
                            ))}
                            {tasks.length === 0 && <TableRow><TableCell colSpan={5} align="center">No service assignments found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ServiceDetailDialog service={selectedTask} onClose={() => setSelectedTask(null)} />
        </Box>
    );
};
