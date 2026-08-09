import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { functionalBackground } from '../../styles/backgrounds';

export const HomePageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    ...functionalBackground(theme),
}));

export const HomeHeader = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(2, 2.5),
    backgroundColor: '#fff',
}));

export const HomeIconButton = styled(IconButton)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    padding: theme.spacing(1),
}));

export const HomeContent = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
    flex: 1,

    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(0, 2),
    },
}));

export const HomeLogoAvatar = styled(Avatar)({
    height: 40,
    width: 40,
});

export const PromoBannerCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    borderRadius: 20,
    padding: theme.spacing(3),
    background: `linear-gradient(135deg, ${theme.palette.primary.light}30 0%, ${theme.palette.primary.light}0A 100%)`,
    border: `1px solid ${theme.palette.primary.light}40`,
}));

export const PromoCtaButton = styled('button')(({ theme }) => ({
    marginTop: theme.spacing(1.5),
    border: 'none',
    cursor: 'pointer',
    borderRadius: 999,
    padding: theme.spacing(1, 3),
    fontWeight: 700,
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#fff',
    background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
}));

export const PromoIconCircle = styled(Avatar)(({ theme }) => ({
    flexShrink: 0,
    width: 76,
    height: 76,
    backgroundColor: '#fff',
    boxShadow: `0 8px 20px ${theme.palette.primary.main}33`,
}));

export const CategoriesRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2.5),
    overflowX: 'auto',
    paddingBottom: theme.spacing(0.5),
}));

export const CategoryItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    minWidth: 72,
    cursor: 'pointer',
    transition: 'transform 0.15s ease',

    '&:hover': {
        transform: 'translateY(-2px)',
    },

    '&:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 4,
        borderRadius: 12,
    },
}));

export const CategoryIconCircle = styled(Box)(({ theme }) => ({
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    backgroundColor: `${theme.palette.primary.light}26`,
}));

export const SectionHeaderRow = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

export const SeeAllLink = styled('button')(({ theme }) => ({
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 700,
    color: theme.palette.primary.main,
    padding: 0,
}));

export const JobRequestCard = styled(Box)({
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 10px rgba(11, 22, 66, 0.06)',
});

export const JobStatusChip = styled(Chip)<{ status: 'pending' | 'accepted' | 'declined' }>(({ theme, status }) => ({
    height: 24,
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
    backgroundColor:
        status === 'accepted'
            ? theme.palette.success.main
            : status === 'declined'
              ? theme.palette.text.disabled
              : theme.palette.secondary.main,
}));

export const JobActionButton = styled('button')<{ variant: 'accept' | 'decline' }>(({ theme, variant }) => ({
    flex: 1,
    border: variant === 'accept' ? 'none' : `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    borderRadius: 999,
    padding: theme.spacing(1, 2),
    fontWeight: 700,
    fontSize: 13,
    fontFamily: 'inherit',
    color: variant === 'accept' ? '#fff' : theme.palette.text.primary,
    background: variant === 'accept' ? theme.palette.primary.main : 'transparent',

    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
}));
