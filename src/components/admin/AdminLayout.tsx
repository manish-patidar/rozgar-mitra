import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { THEME_COLORS, ADMIN_SIDEBAR_WIDTH } from '../../utils/admin.constants';

export const AdminLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: THEME_COLORS.background, minHeight: '100vh', fontFamily: 'Abhaya Libre' }}>
            <CssBaseline />

            <Header handleDrawerToggle={handleDrawerToggle} />
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 4 },
                    width: { md: `calc(100% - ${ADMIN_SIDEBAR_WIDTH}px)` },
                    mt: 8
                }}
            >

                <Outlet />
            </Box>
        </Box>
    );
};