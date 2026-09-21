import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, InputBase, alpha, styled } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../public/download.webp';
import { CUSTOMER_THEME } from '../../utils/customer.constants';
import { customerApi } from '../../api/customer.api';
import { getApiErrorMessage } from '../../api/client';

const DRAWER_WIDTH = 260;

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
    color: CUSTOMER_THEME.textSecondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: CUSTOMER_THEME.text,
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
}));

export const CustomerLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingAccount, setDeletingAccount] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Services', path: '/home', icon: <HomeRepairServiceIcon /> },
        { text: 'Booked & Completed', path: '/home/bookings', icon: <ReceiptLongIcon /> },
        { text: 'Edit Profile', path: '/home/profile', icon: <PersonIcon /> }
    ];

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to permanently delete your account?')) return;

        setDeletingAccount(true);
        try {
            await customerApi.deleteAccount();
            localStorage.clear();
            navigate('/login');
        } catch (error) {
            alert(getApiErrorMessage(error, 'Failed to delete account'));
        } finally {
            setDeletingAccount(false);
        }
    };
    const token = localStorage.getItem('authToken');
    let userName = 'Labor'; // Default fallback

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Ab hume pata hai ki naam 'sub' ke andar hai
            userName = payload.sub || 'Labor';

        } catch (error) {
            console.error("Token decode nahi ho paya", error);
        }
    }

    const drawer = (
        <Box sx={{ height: '100%', backgroundColor: CUSTOMER_THEME.surface }}>
            <Toolbar sx={{ display: 'flex', gap: 1.5, py: 2 }}>
                <img src={logo} alt="RozgarMitra" style={{ width: 40, height: 40, borderRadius: '8px' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: CUSTOMER_THEME.primary }}>RozgarMitra</Typography>
            </Toolbar>
            <List sx={{ px: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            {/* [FIXED]: ListItemButton use kiya gaya hai error hatane ke liye */}
                            <ListItemButton
                                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: isActive ? `${CUSTOMER_THEME.primary}15` : 'transparent',
                                    color: isActive ? CUSTOMER_THEME.primary : CUSTOMER_THEME.textSecondary,
                                    '&:hover': { backgroundColor: `${CUSTOMER_THEME.primary}20` }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>{item.text}</Typography>} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount}
                        sx={{ borderRadius: '12px', color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2' } }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><DeleteForeverIcon /></ListItemIcon>
                        <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>{deletingAccount ? 'Deleting Account...' : 'Delete Account'}</Typography>} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', backgroundColor: CUSTOMER_THEME.background, minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar position="fixed" elevation={0} sx={{ width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { sm: `${DRAWER_WIDTH}px` }, backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' }, color: CUSTOMER_THEME.text }}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                        <Search>
                            <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search services..."
                                inputProps={{ 'aria-label': 'search services' }}
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                        </Search>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: CUSTOMER_THEME.primary, width: 35, height: 35, textTransform: 'uppercase' }}>
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
                <Outlet context={{ searchQuery }} />
            </Box>
        </Box>
    );
};