import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, InputBase, alpha, styled } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../../public/download.webp';
import { LABOUR_THEME } from '../../../utils/labour.constants';

const DRAWER_WIDTH = 260;

// --- MUI Search Bar Styling ---
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '8px',
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': { backgroundColor: alpha(theme.palette.common.black, 0.08) },
    width: '100%',
    [theme.breakpoints.up('sm')]: { width: '40ch' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: LABOUR_THEME.textSecondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: LABOUR_THEME.text,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));
// -----------------------------

interface JwtPayload {
    sub?: string;
    role?: string;
    iat?: number;
    exp?: number;
}

export const LabourLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();

    const token: string | null = localStorage.getItem('authToken');
    let userName: string = 'Labor';

    if (token) {
        try {
            const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
            userName = payload.sub || 'Labor';
        } catch (error) {
            console.error("Token decode nahi ho paya", error);
        }
    }

    const menuItems = [
        { text: 'Dashboard', path: '/labour', icon: <DashboardIcon /> },
        { text: 'Open Services List', path: '/labour/open-services', icon: <WorkHistoryIcon /> },
        { text: 'Services (View Only)', path: '/labour/services', icon: <BuildIcon /> },
        { text: 'Completed Services', path: '/labour/completed-services', icon: <CheckCircleIcon /> },
        { text: 'Edit Profile', path: '/labour/profile', icon: <PersonIcon /> }
    ];

    const drawer = (
        <Box sx={{ height: '100%', backgroundColor: LABOUR_THEME.surface }}>
            <Toolbar sx={{ display: 'flex', gap: 1.5, py: 2 }}>
                <img src={logo} alt="RozgarMitra" style={{ width: 40, height: 40, borderRadius: '8px' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: LABOUR_THEME.primary }}>RozgarMitra</Typography>
            </Toolbar>
            <List sx={{ px: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (location.pathname === '/labour/' && item.path === '/labour');
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: isActive ? `${LABOUR_THEME.primary}15` : 'transparent',
                                    color: isActive ? LABOUR_THEME.primary : LABOUR_THEME.textSecondary,
                                    '&:hover': { backgroundColor: `${LABOUR_THEME.primary}20` }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>{item.text}</Typography>} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', backgroundColor: LABOUR_THEME.background, minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar position="fixed" elevation={0} sx={{ width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { sm: `${DRAWER_WIDTH}px` }, backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>

                    <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' }, color: LABOUR_THEME.text }}>
                        <MenuIcon />
                    </IconButton>

                    {/* SEARCH BAR AT TOP MIDDLE */}
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search services, requests..."
                                inputProps={{ 'aria-label': 'search services and requests' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Search>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: LABOUR_THEME.primary, width: 35, height: 35, textTransform: 'uppercase' }}>
                            {userName.charAt(0)}
                        </Avatar>
                        <IconButton onClick={() => { localStorage.clear(); navigate('/login'); }} sx={{ color: '#ef4444' }}><LogoutIcon /></IconButton>
                    </Box>

                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH } }}>
                    {drawer}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #eee' } }} open>
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, mt: 8 }}>
                {/* Yahan context={{ searchQuery }} bheja gaya hai */}
                <Outlet context={{ searchQuery }} />
            </Box>
        </Box>
    );
};