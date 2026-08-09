import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { heroGradientBackground } from '../../styles/backgrounds';

export const AuthPageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2.5),
    ...heroGradientBackground(theme),
}));

export const AuthCard = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 28,
    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
    overflow: 'hidden',
    padding: theme.spacing(3.5, 3.5, 4),
}));

export const AuthIllustrationBox = styled(Box)(({ theme }) => ({
    height: 190,
    borderRadius: 20,
    background: `linear-gradient(160deg, ${theme.palette.primary.light}33 0%, ${theme.palette.primary.light}0D 100%)`,
    marginBottom: theme.spacing(3),
    overflow: 'hidden',
}));

export const AuthIllustrationImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top center',
    display: 'block',
});

export const AuthLogo = styled('img')({
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
});

export const AuthBrandRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    marginBottom: theme.spacing(2.5),
}));

export const AuthForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const AuthSwitchRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(3),
}));

export const AuthSubmitButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5),
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 999,
    textTransform: 'none',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: `0 10px 20px ${theme.palette.primary.main}4D`,

    '&:hover': {
        background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
}));

export const AuthSwitchButton = styled(Button)(({ theme }) => ({
    borderRadius: 999,
    textTransform: 'none',
    fontWeight: 700,
    padding: theme.spacing(0.5, 2),
    color: theme.palette.primary.main,
}));
