import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    CategoryDetailCard,
    CategoryDetailContent,
    CategoryDetailHeader,
    CategoryDetailPageContainer,
    CategoryHeroIcon,
    CategoryPrimaryButton,
    SuccessIconCircle,
} from './categoryDetail.styles';
import LocationPicker from '../../components/location/LocationPicker';
import type { LocationResult } from '../../components/location/location.types';
import { getCategoryById } from '../../data/categories';
import { MESSAGES, NEARBY_RADIUS_KM, ROUTES, buildBookingSuccessMessage } from '../../utils/constants';
import { publishBookingRequest } from '../../utils/notifications';
import { DEFAULT_MAP_CENTER, getDistanceKm } from '../../utils/geo';
import type { BookingRequest } from '../../types/booking';

type BookingStep = 'idle' | 'address' | 'searching' | 'success';

const MOCK_MIN_WORKERS_NOTIFIED = 2;
const MOCK_MAX_WORKERS_NOTIFIED = 6;
const MOCK_SEARCH_DELAY_MS = 1500;

const CategoryDetail: FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const category = getCategoryById(categoryId ?? '');

    const [step, setStep] = useState<BookingStep>('idle');
    const [location, setLocation] = useState<LocationResult | null>(null);
    const [addressError, setAddressError] = useState('');
    const [notifiedCount, setNotifiedCount] = useState(0);

    if (!category) {
        return (
            <CategoryDetailPageContainer>
                <CategoryDetailContent>
                    <Stack spacing={2} sx={{ alignItems: 'center', pt: 8, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {MESSAGES.CATEGORY_DETAIL_NOT_FOUND}
                        </Typography>
                        <CategoryPrimaryButton type="button" onClick={() => navigate(ROUTES.HOME)}>
                            {MESSAGES.CATEGORY_DETAIL_BACK_TO_HOME}
                        </CategoryPrimaryButton>
                    </Stack>
                </CategoryDetailContent>
            </CategoryDetailPageContainer>
        );
    }

    const handleConfirmBooking = () => {
        if (!location?.address.trim()) {
            setAddressError(MESSAGES.BOOKING_ADDRESS_REQUIRED);
            return;
        }

        setAddressError('');
        setStep('searching');

        const distanceKm = getDistanceKm(location.coordinates, DEFAULT_MAP_CENTER);

        window.setTimeout(() => {
            const randomCount =
                Math.floor(Math.random() * (MOCK_MAX_WORKERS_NOTIFIED - MOCK_MIN_WORKERS_NOTIFIED + 1)) +
                MOCK_MIN_WORKERS_NOTIFIED;
            setNotifiedCount(randomCount);
            setStep('success');

            const request: BookingRequest = {
                id: crypto.randomUUID(),
                categoryId: category.id,
                categoryName: category.name,
                icon: category.icon,
                address: location.address,
                coordinates: location.coordinates,
                pricePerHour: category.pricePerHour,
                distanceKm: Math.min(distanceKm, NEARBY_RADIUS_KM),
                createdAt: Date.now(),
            };
            publishBookingRequest(request);
        }, MOCK_SEARCH_DELAY_MS);
    };

    return (
        <CategoryDetailPageContainer>
            <CategoryDetailHeader>
                <IconButton aria-label={MESSAGES.CATEGORY_DETAIL_BACK} onClick={() => navigate(-1)}>
                    <Typography sx={{ fontSize: 20 }}>←</Typography>
                </IconButton>
                <Typography sx={{ fontWeight: 700 }}>{category.name}</Typography>
            </CategoryDetailHeader>

            <CategoryDetailContent>
                {step === 'success' ? (
                    <Stack spacing={2} sx={{ alignItems: 'center', pt: 4, textAlign: 'center' }}>
                        <SuccessIconCircle>✓</SuccessIconCircle>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {MESSAGES.BOOKING_SUCCESS_TITLE}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {buildBookingSuccessMessage(notifiedCount)}
                        </Typography>
                        <CategoryPrimaryButton type="button" onClick={() => navigate(ROUTES.HOME)}>
                            {MESSAGES.BOOKING_BACK_TO_HOME}
                        </CategoryPrimaryButton>
                    </Stack>
                ) : (
                    <Stack spacing={3}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                            <CategoryHeroIcon>{category.icon}</CategoryHeroIcon>
                            <Stack>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {category.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Verified helpers • Within {NEARBY_RADIUS_KM}km
                                </Typography>
                            </Stack>
                        </Stack>

                        <CategoryDetailCard>
                            <Typography variant="subtitle2" color="text.secondary">
                                {MESSAGES.CATEGORY_DETAIL_ABOUT}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {category.description}
                            </Typography>
                        </CategoryDetailCard>

                        <CategoryDetailCard sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {MESSAGES.CATEGORY_DETAIL_PRICE_LABEL}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                ₹{category.pricePerHour}
                                {MESSAGES.CATEGORY_DETAIL_PRICE_UNIT}
                            </Typography>
                        </CategoryDetailCard>

                        {step === 'idle' && (
                            <CategoryPrimaryButton type="button" onClick={() => setStep('address')}>
                                {MESSAGES.CATEGORY_DETAIL_BOOK_CTA}
                            </CategoryPrimaryButton>
                        )}

                        {step === 'address' && (
                            <Stack spacing={2}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {MESSAGES.BOOKING_ADDRESS_TITLE}
                                </Typography>

                                <LocationPicker
                                    onChange={(result) => {
                                        setLocation(result);
                                        if (result.address.trim()) setAddressError('');
                                    }}
                                />

                                {addressError && (
                                    <Typography variant="caption" color="error">
                                        {addressError}
                                    </Typography>
                                )}

                                <CategoryPrimaryButton type="button" onClick={handleConfirmBooking}>
                                    {MESSAGES.BOOKING_CONFIRM_CTA}
                                </CategoryPrimaryButton>
                            </Stack>
                        )}

                        {step === 'searching' && (
                            <Stack spacing={2} sx={{ alignItems: 'center', py: 4 }}>
                                <CircularProgress />
                                <Typography variant="body2" color="text.secondary">
                                    {MESSAGES.BOOKING_SEARCHING}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                )}
            </CategoryDetailContent>
        </CategoryDetailPageContainer>
    );
};

export default CategoryDetail;
