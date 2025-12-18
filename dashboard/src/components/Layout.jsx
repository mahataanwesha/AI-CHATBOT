import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Divider, IconButton } from '@mui/material';
import { LayoutDashboard, Users, AlertTriangle, LogOut, Activity } from 'lucide-react';

const DRAWER_WIDTH = 260;

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { text: 'Community Registry', icon: <Users size={20} />, path: '/registry' },
        { text: 'Vaccinations', icon: <Activity size={20} />, path: '/vaccinations' },
        { text: 'Escalations & Alerts', icon: <AlertTriangle size={20} />, path: '/alerts' },
        { text: 'Health Trends', icon: <Activity size={20} />, path: '/trends' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        borderRight: 'none',
                        boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
                        bgcolor: '#ffffff'
                    },
                }}
            >
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: '#1e3c72', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>EH</Box>
                    <Typography variant="h6" fontWeight="bold" color="#1e3c72">EcoHealth</Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <List sx={{ px: 2 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                selected={location.pathname === item.path}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'rgba(30, 60, 114, 0.1)',
                                        color: '#1e3c72',
                                        '& .MuiListItemIcon-root': { color: '#1e3c72' }
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(30, 60, 114, 0.05)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: '#64748b' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ mt: 'auto', p: 3 }}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#2a5298', fontSize: 14 }}>
                            {user?.role?.charAt(0) || 'A'}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">Officer</Typography>
                            <Typography variant="caption" color="text.secondary">PIN: {user?.pincode}</Typography>
                        </Box>
                    </Box>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#ef4444' }}>
                        <ListItemIcon sx={{ minWidth: 40, color: '#ef4444' }}><LogOut size={20} /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
                <Outlet />
            </Box>
        </Box>
    );
}
