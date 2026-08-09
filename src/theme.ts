import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#3E7BFA',
            dark: '#0B1642',
            light: '#8FB3FF',
        },
        secondary: {
            main: '#FF7A1A',
            dark: '#CC5D0E',
            light: '#FFA35C',
        },
    },
    typography: {
        fontFamily: "'Abhaya Libre', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    shape: {
        borderRadius: 8,
    },
});
