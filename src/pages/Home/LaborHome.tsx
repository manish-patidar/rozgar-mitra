import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    HomeContent,
    HomeHeader,
    HomeIconButton,
    HomeLogoAvatar,
    HomePageContainer,
    JobActionButton,
    JobRequestCard,
    JobStatusChip,
} from './home.styles';
import { CATEGORIES } from '../../data/categories';
import { clearSession } from '../../utils/auth';
import { MESSAGES, ROUTES } from '../../utils/constants';
import {
    notifyNativeIfPermitted,
    requestNotificationPermission,
    subscribeToBookingRequests,
} from '../../utils/notifications';
import logo from '../../public/download.webp';
import type { BookingRequest } from '../../types/booking';

type RequestStatus = 'pending' | 'accepted' | 'declined';

interface MockJobRequest {
    id: string;
    categoryId: string;
    customerArea: string;
    distanceKm: number;
    price: number;
    status: RequestStatus;
}

const INITIAL_REQUESTS: MockJobRequest[] = [
    { id: 'seed-1', categoryId: 'cleaning', customerArea: 'Vijay Nagar, Indore', distanceKm: 2.4, price: 150, status: 'pending' },
    { id: 'seed-2', categoryId: 'repairing', customerArea: 'Palasia, Indore', distanceKm: 5.1, price: 200, status: 'pending' },
    { id: 'seed-3', categoryId: 'painting', customerArea: 'Rajwada, Indore', distanceKm: 8.7, price: 180, status: 'pending' },
];

const toMockJobRequest = (request: BookingRequest): MockJobRequest => ({
    id: request.id,
    categoryId: request.categoryId,
    customerArea: request.address || 'Nearby',
    distanceKm: Math.round(request.distanceKm * 10) / 10,
    price: request.pricePerHour,
    status: 'pending',
});

const LaborHome: FC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<MockJobRequest[]>(INITIAL_REQUESTS);
    const [liveAlert, setLiveAlert] = useState<string | null>(null);

    const handleLogout = () => {
        clearSession();
        navigate(ROUTES.LOGIN, { replace: true });
    };

    const respondToRequest = (id: string, status: RequestStatus) => {
        setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)));
    };

    useEffect(() => {
        requestNotificationPermission();

        const unsubscribe = subscribeToBookingRequests((incoming) => {
            setRequests((prev) => [toMockJobRequest(incoming), ...prev]);
            setLiveAlert(`New ${incoming.categoryName} request nearby!`);
            notifyNativeIfPermitted('New job request', `${incoming.categoryName} • ${incoming.address}`);
        });

        return unsubscribe;
    }, []);

    return (
        <HomePageContainer>
            <HomeHeader>
                <HomeIconButton aria-label={MESSAGES.HOME_MENU}>
                    <Typography sx={{ fontSize: 18 }}>☰</Typography>
                </HomeIconButton>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <HomeLogoAvatar src={logo} alt="Rozgarmitra Logo" />
                    <Typography sx={{ fontWeight: 700 }}>{MESSAGES.HOME_LOCATION} ⌄</Typography>
                </Stack>

                <HomeIconButton aria-label={MESSAGES.HOME_LOGOUT} onClick={handleLogout}>
                    <Typography sx={{ fontSize: 18 }}>⎋</Typography>
                </HomeIconButton>
            </HomeHeader>

            <HomeContent>
                <Stack spacing={3} sx={{ px: 2.5, py: 2.5 }}>
                    <Stack spacing={0.5}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {MESSAGES.LABOUR_HOME_WELCOME}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {MESSAGES.LABOUR_HOME_SUBTITLE}
                        </Typography>
                    </Stack>

                    <Stack spacing={1.5}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {MESSAGES.LABOUR_HOME_REQUESTS_TITLE}
                        </Typography>

                        {requests.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                {MESSAGES.LABOUR_HOME_NO_REQUESTS}
                            </Typography>
                        )}

                        <Stack spacing={1.5}>
                            {requests.map((request) => {
                                const category = CATEGORIES.find((item) => item.id === request.categoryId);

                                return (
                                    <JobRequestCard key={request.id}>
                                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                            <Typography sx={{ fontSize: 28 }}>{category?.icon}</Typography>
                                            <Stack sx={{ flex: 1 }}>
                                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                    <Typography sx={{ fontWeight: 700 }}>{category?.name}</Typography>
                                                    {request.status !== 'pending' && (
                                                        <JobStatusChip
                                                            status={request.status}
                                                            size="small"
                                                            label={
                                                                request.status === 'accepted'
                                                                    ? MESSAGES.LABOUR_HOME_ACCEPTED_STATUS
                                                                    : MESSAGES.LABOUR_HOME_DECLINED_STATUS
                                                            }
                                                        />
                                                    )}
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary">
                                                    {request.customerArea} • {request.distanceKm}km away
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    ₹{request.price}/hour
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        {request.status === 'pending' && (
                                            <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                                                <JobActionButton
                                                    type="button"
                                                    variant="accept"
                                                    onClick={() => respondToRequest(request.id, 'accepted')}
                                                >
                                                    {MESSAGES.LABOUR_HOME_ACCEPT}
                                                </JobActionButton>
                                                <JobActionButton
                                                    type="button"
                                                    variant="decline"
                                                    onClick={() => respondToRequest(request.id, 'declined')}
                                                >
                                                    {MESSAGES.LABOUR_HOME_DECLINE}
                                                </JobActionButton>
                                            </Stack>
                                        )}
                                    </JobRequestCard>
                                );
                            })}
                        </Stack>
                    </Stack>
                </Stack>
            </HomeContent>

            <Snackbar
                open={Boolean(liveAlert)}
                autoHideDuration={4000}
                onClose={() => setLiveAlert(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info" onClose={() => setLiveAlert(null)}>
                    {liveAlert}
                </Alert>
            </Snackbar>
        </HomePageContainer>
    );
};

export default LaborHome;
