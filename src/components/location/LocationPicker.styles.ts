import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const MapFrame = styled(Box)(({ theme }) => ({
    height: 240,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,

    '& .leaflet-container': {
        height: '100%',
        width: '100%',
    },
}));

export const UseLocationButton = styled('button')(({ theme }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    background: 'none',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    borderRadius: 999,
    padding: theme.spacing(0.75, 2),
    fontWeight: 700,
    fontSize: 13,
    fontFamily: 'inherit',
    alignSelf: 'flex-start',
}));
