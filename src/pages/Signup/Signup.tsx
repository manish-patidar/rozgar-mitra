import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    AuthBrandRow,
    AuthCard,
    AuthForm,
    AuthIllustrationBox,
    AuthIllustrationImage,
    AuthLogo,
    AuthPageContainer,
    AuthSubmitButton,
    AuthSwitchButton,
    AuthSwitchRow,
} from '../../components/auth/AuthLayout.styles';
import { SignupRowGroup } from './signup.styles';
import { extractAuthToken, signupRequest } from '../../api/auth.api';
import { getApiErrorMessage } from '../../api/client';
import { setAuthToken, setUserRole } from '../../utils/auth';
import { getAgeFromDate, getDateOfBirthBounds } from '../../utils/date';
import { BRAND_NAME, MESSAGES, REGEX, ROLE_OPTIONS, ROUTES, VALIDATION } from '../../utils/constants';
import logo from '../../public/download.webp';
import heroWorker from '../../public/hero-worker.jpg';
import type { SignupFormErrors, SignupFormState } from './signup.types';
import type { Dayjs } from 'dayjs';

const INITIAL_FORM_STATE: SignupFormState = {
    name: '',
    username: '',
    email: '',
    dateOfBirth: null,
    phone: '',
    password: '',
    role: ROLE_OPTIONS[0].value,
};

const validate = (form: SignupFormState): SignupFormErrors => {
    const errors: SignupFormErrors = {};

    if (!form.name.trim()) errors.name = MESSAGES.FIELD_REQUIRED_NAME;

    if (!form.username.trim()) {
        errors.username = MESSAGES.FIELD_REQUIRED_USERNAME;
    } else if (form.username.length < VALIDATION.USERNAME_MIN_LENGTH) {
        errors.username = MESSAGES.FIELD_INVALID_USERNAME;
    }

    if (!form.email) {
        errors.email = MESSAGES.FIELD_REQUIRED_EMAIL;
    } else if (!REGEX.EMAIL.test(form.email)) {
        errors.email = MESSAGES.FIELD_INVALID_EMAIL;
    }

    if (!form.dateOfBirth) {
        errors.dateOfBirth = MESSAGES.FIELD_REQUIRED_DOB;
    } else {
        const age = getAgeFromDate(form.dateOfBirth);
        if (age < VALIDATION.AGE_MIN || age > VALIDATION.AGE_MAX) {
            errors.dateOfBirth = MESSAGES.FIELD_INVALID_DOB;
        }
    }

    if (!form.phone) {
        errors.phone = MESSAGES.FIELD_REQUIRED_PHONE;
    } else if (!REGEX.PHONE.test(form.phone)) {
        errors.phone = MESSAGES.FIELD_INVALID_PHONE;
    }

    if (!form.password) {
        errors.password = MESSAGES.FIELD_REQUIRED_PASSWORD;
    } else if (form.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        errors.password = MESSAGES.FIELD_INVALID_PASSWORD;
    }

    if (!form.role.trim()) errors.role = MESSAGES.FIELD_REQUIRED_ROLE;

    return errors;
};

const Signup: FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<SignupFormState>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<SignupFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const dobBounds = getDateOfBirthBounds();

    const handleChange = (field: keyof SignupFormState) => (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { value } = event.target;
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

    const handleDateOfBirthChange = (value: Dayjs | null) => {
        setForm((prev) => ({ ...prev, dateOfBirth: value }));
        setErrors((prev) => (prev.dateOfBirth ? { ...prev, dateOfBirth: undefined } : prev));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validate(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0 || !form.dateOfBirth) return;

        try {
            setIsLoading(true);
            setApiError('');

            const response = await signupRequest({
                name: form.name.trim(),
                username: form.username.trim(),
                email: form.email.trim(),
                age: getAgeFromDate(form.dateOfBirth),
                phone_number: form.phone.trim(),
                password: form.password,
                role: form.role,
            });

            const token = extractAuthToken(response.data);
            if (token) {
                setAuthToken(token);
                setUserRole(form.role);
                navigate(ROUTES.HOME, { replace: true });
                return;
            }

            navigate(ROUTES.LOGIN, { replace: true });
        } catch (requestError) {
            setApiError(getApiErrorMessage(requestError, MESSAGES.SIGNUP_GENERIC_ERROR));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthPageContainer>
            <AuthCard>
                <AuthBrandRow>
                    <AuthLogo src={logo} alt={`${BRAND_NAME} Logo`} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {BRAND_NAME}
                    </Typography>
                </AuthBrandRow>

                <AuthIllustrationBox>
                    <AuthIllustrationImage src={heroWorker} alt="A friendly professional ready to help" />
                </AuthIllustrationBox>

                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {MESSAGES.SIGNUP_TITLE}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {MESSAGES.SIGNUP_SUBTITLE}
                </Typography>

                <AuthForm onSubmit={handleSubmit} noValidate>
                    {apiError && <Alert severity="error">{apiError}</Alert>}

                    <TextField
                        label={MESSAGES.SIGNUP_NAME_LABEL}
                        value={form.name}
                        onChange={handleChange('name')}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        fullWidth
                    />

                    <TextField
                        label={MESSAGES.SIGNUP_USERNAME_LABEL}
                        value={form.username}
                        onChange={handleChange('username')}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        fullWidth
                    />

                    <TextField
                        label={MESSAGES.SIGNUP_EMAIL_LABEL}
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        fullWidth
                    />

                    <SignupRowGroup>
                        <DatePicker
                            label={MESSAGES.SIGNUP_DOB_LABEL}
                            value={form.dateOfBirth}
                            onChange={handleDateOfBirthChange}
                            minDate={dobBounds.minDate}
                            maxDate={dobBounds.maxDate}
                            sx={{ width: '100%' }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(errors.dateOfBirth),
                                    helperText: errors.dateOfBirth,
                                },
                            }}
                        />
                        <TextField
                            label={MESSAGES.SIGNUP_PHONE_LABEL}
                            type="tel"
                            placeholder={MESSAGES.SIGNUP_PHONE_PLACEHOLDER}
                            value={form.phone}
                            onChange={handleChange('phone')}
                            error={Boolean(errors.phone)}
                            helperText={errors.phone}
                            autoComplete="tel"
                            fullWidth
                        />
                    </SignupRowGroup>

                    <TextField
                        label={MESSAGES.SIGNUP_PASSWORD_LABEL}
                        type="password"
                        value={form.password}
                        onChange={handleChange('password')}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        fullWidth
                    />

                    <TextField
                        select
                        label={MESSAGES.SIGNUP_ROLE_LABEL}
                        value={form.role}
                        onChange={handleChange('role')}
                        error={Boolean(errors.role)}
                        helperText={errors.role}
                        fullWidth
                    >
                        {ROLE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <AuthSubmitButton type="submit" variant="contained" fullWidth disabled={isLoading}>
                        {isLoading ? MESSAGES.SIGNUP_SUBMITTING : MESSAGES.SIGNUP_SUBMIT}
                    </AuthSubmitButton>
                </AuthForm>

                <AuthSwitchRow>
                    <Typography variant="body2" color="text.secondary">
                        {MESSAGES.SIGNUP_SWITCH_PROMPT}
                    </Typography>
                    <AuthSwitchButton onClick={() => navigate(ROUTES.LOGIN)}>
                        {MESSAGES.SIGNUP_SWITCH_ACTION}
                    </AuthSwitchButton>
                </AuthSwitchRow>
            </AuthCard>
        </AuthPageContainer>
    );
};

export default Signup;
