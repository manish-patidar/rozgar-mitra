import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { functionalBackground } from '../../styles/backgrounds';

export const CategoryDetailPageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    ...functionalBackground(theme),
}));

export const CategoryDetailHeader = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2, 2.5),
    backgroundColor: '#fff',
}));

export const CategoryDetailContent = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 700,
    margin: '0 auto',
    flex: 1,
    padding: theme.spacing(3, 2.5),

    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4, 2),
    },
}));

export const CategoryHeroIcon = styled(Avatar)(({ theme }) => ({
    width: 84,
    height: 84,
    fontSize: 40,
    backgroundColor: `${theme.palette.primary.light}26`,
}));

export const CategoryDetailCard = styled(Box)({
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(11, 22, 66, 0.06)',
});

export const CategoryPrimaryButton = styled('button')(({ theme }) => ({
    border: 'none',
    cursor: 'pointer',
    borderRadius: 999,
    padding: theme.spacing(1.75),
    fontWeight: 700,
    fontSize: 16,
    fontFamily: 'inherit',
    color: '#fff',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: `0 10px 20px ${theme.palette.primary.main}4D`,

    '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
}));

export const SuccessIconCircle = styled(Box)(({ theme }) => ({
    width: 84,
    height: 84,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    margin: '0 auto',
    backgroundColor: `${theme.palette.success.main}1F`,
    color: theme.palette.success.main,
}));
