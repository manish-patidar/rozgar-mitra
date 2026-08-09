import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    CategoriesRow,
    CategoryIconCircle,
    CategoryItem,
    HomeContent,
    HomeHeader,
    HomeIconButton,
    HomeLogoAvatar,
    HomePageContainer,
    PromoBannerCard,
    PromoCtaButton,
    PromoIconCircle,
} from './home.styles';
import { CATEGORIES } from '../../data/categories';
import { clearSession } from '../../utils/auth';
import { MESSAGES, ROUTES, buildCategoryDetailPath } from '../../utils/constants';
import logo from '../../public/download.webp';
import promoCleaning from '../../public/promo-cleaning.jpg';

const CustomerHome: FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearSession();
        navigate(ROUTES.LOGIN, { replace: true });
    };

    const goToCategory = (categoryId: string) => {
        navigate(buildCategoryDetailPath(categoryId));
    };

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
                    <PromoBannerCard>
                        <Stack sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {MESSAGES.HOME_PROMO_TITLE}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {MESSAGES.HOME_PROMO_SUBTITLE}
                            </Typography>
                            <PromoCtaButton type="button" onClick={() => goToCategory('cleaning')}>
                                {MESSAGES.HOME_PROMO_CTA}
                            </PromoCtaButton>
                        </Stack>
                        <PromoIconCircle src={promoCleaning} alt="Cleaning service" />
                    </PromoBannerCard>

                    <Stack spacing={1.5}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {MESSAGES.HOME_SERVICES_TITLE}
                        </Typography>

                        <CategoriesRow>
                            {CATEGORIES.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    onClick={() => goToCategory(category.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            goToCategory(category.id);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <CategoryIconCircle>{category.icon}</CategoryIconCircle>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                        {category.name}
                                    </Typography>
                                </CategoryItem>
                            ))}
                        </CategoriesRow>
                    </Stack>
                </Stack>
            </HomeContent>
        </HomePageContainer>
    );
};

export default CustomerHome;
