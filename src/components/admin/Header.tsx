import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { ADMIN_SIDEBAR_WIDTH, THEME_COLORS } from '../../utils/admin.constants';
import type { HeaderProps } from '../../pages/Admin/admin.types';

export const Header: React.FC<HeaderProps> = ({ handleDrawerToggle }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${ADMIN_SIDEBAR_WIDTH}px)` },
                ml: { md: `${ADMIN_SIDEBAR_WIDTH}px` },
                backgroundColor: '#fff',
                borderBottom: '1px solid #eee',
                color: THEME_COLORS.text,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Hamburger Menu (Only visible on mobile/tablet) */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' }, color: THEME_COLORS.primary }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: THEME_COLORS.primary }}>
                        Admin Dashboard
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Notification button yahan se hata diya gaya hai */}

                    {/* Profile Section (Removed left border for cleaner look) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: THEME_COLORS.primary, width: 35, height: 35 }}>A</Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                            Super Admin
                        </Typography>
                    </Box>

                    {/* Logout Button */}
                    <IconButton size="small" onClick={handleLogout} sx={{ color: '#d9534f', ml: 1 }}>
                        <LogoutIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};