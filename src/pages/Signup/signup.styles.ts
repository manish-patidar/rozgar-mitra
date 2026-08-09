import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

export const SignupRowGroup = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    gap: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
}));
