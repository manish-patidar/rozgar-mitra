import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ADMIN_SIDEBAR_WIDTH, ADMIN_MENU_ITEMS, THEME_COLORS } from '../../utils/admin.constants';
import type { SidebarProps } from '../../pages/Admin/admin.types';
import logo from '../../public/download.webp'; // Update path if needed

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path: string) => {
        navigate(path);
        if (mobileOpen) {
            handleDrawerToggle(); // Mobile me click karne par drawer band ho jayega
        }
    };

    // Sidebar ka content variable me rakha hai taaki 2 jagah reuse ho sake
    const drawerContent = (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1.5 }}>
                <img src={logo} alt="RozgarMitra" style={{ width: 40, height: 40, borderRadius: '8px' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: THEME_COLORS.primary }}>
                    RozgarMitra
                </Typography>
            </Box>
            <List sx={{ px: 2 }}>
                {ADMIN_MENU_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: isActive ? `${THEME_COLORS.primary}15` : 'transparent',
                                    color: isActive ? THEME_COLORS.primary : THEME_COLORS.textSecondary,
                                    '&:hover': { backgroundColor: `${THEME_COLORS.primary}20` },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? THEME_COLORS.primary : '#777', minWidth: 40 }}>
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontWeight: 600 }}>
                                            {item.text}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { md: ADMIN_SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
            {/* Mobile Drawer (Temporary) */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }} // Better open performance on mobile
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: ADMIN_SIDEBAR_WIDTH, backgroundColor: THEME_COLORS.white },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer (Permanent) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: ADMIN_SIDEBAR_WIDTH, backgroundColor: THEME_COLORS.white, borderRight: '1px solid #eee' },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};