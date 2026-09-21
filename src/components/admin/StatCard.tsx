import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { THEME_COLORS } from '../../utils/admin.constants';
import type { StatCardProps } from '../../pages/Admin/admin.types';



// Humne onClick add kiya hai (Types file me bhi chahein toh add kar sakte hain)
export const StatCard: React.FC<StatCardProps & { onClick?: () => void }> = ({ title, value, icon, color = THEME_COLORS.primary, onClick }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: onClick ? 'pointer' : 'default', // Clickable look
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': onClick ? {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                } : {}
            }}
        >
            <Box sx={{ backgroundColor: `${color}15`, color: color, p: 1.5, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME_COLORS.text }}>
                    {value}
                </Typography>
            </Box>
        </Card>
    );
};