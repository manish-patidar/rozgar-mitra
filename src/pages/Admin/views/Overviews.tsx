import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { StatCard } from '../../../components/admin/StatCard';
import { THEME_COLORS } from '../../../utils/admin.constants';




import { useNavigate } from 'react-router-dom';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { adminApi } from '../../../services/Admin/admin.api';
import type { AdminStats } from '../admin.types';

export const Overview: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        adminApi.getStats().then((response) => setStats(response.data)).catch(console.error);
    }, []);

    if (!stats) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: THEME_COLORS.primary }} /></Box>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                Overview & Analytics
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    gap: 3
                }}
            >
                {/* 1. Total Customers -> Customers Tab */}
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers.toLocaleString()}
                    icon={<PeopleIcon fontSize="large" />}
                    color={THEME_COLORS.primary}
                    onClick={() => navigate('/admin/customers')}
                />

                {/* 2. Active Labour -> Labours Tab */}
                <StatCard
                    title="Active Labour"
                    value={stats.activeLabours.toLocaleString()}
                    icon={<EngineeringIcon fontSize="large" />}
                    color={THEME_COLORS.success}
                    onClick={() => navigate('/admin/labours')}
                />

                {/* 3. UnActive Labour -> Labours Tab */}
                <StatCard
                    title="UnActive Labour"
                    value={Math.max(stats.totalLabours - stats.activeLabours, 0).toLocaleString()}
                    icon={<PersonOffIcon fontSize="large" />}
                    color={THEME_COLORS.warning}
                    onClick={() => navigate('/admin/labours')}
                />

                {/* 4. Task List -> Tasks Tab (Table View) */}
                <StatCard
                    title="Task List"
                    value={stats.totalTasks.toLocaleString()}
                    icon={<AssignmentTurnedInIcon fontSize="large" />}
                    color={THEME_COLORS.primary}
                    onClick={() => navigate('/admin/tasks')}
                />

                {/* 5. Platform Revenue -> Redirects to Tasks Tab as requested */}
                <StatCard
                    title="Platform Revenue"
                    value={`₹${stats.platformRevenue.toLocaleString('en-IN')}`}
                    icon={<AccountBalanceWalletIcon fontSize="large" />}
                    color="#9C27B0"
                    onClick={() => navigate('/admin/tasks')}
                />
            </Box>
        </Box>
    );
};