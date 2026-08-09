import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
import { BRAND_NAME, MESSAGES, REGEX, ROLE_OPTIONS, ROUTES, VALIDATION } from '../../utils/constants';
import logo from '../../public/download.webp';
import heroWorker from '../../public/hero-worker.jpg';
import type { SignupFormErrors, SignupFormState } from './signup.types';

const INITIAL_FORM_STATE: SignupFormState = {
    name: '',
    username: '',
    email: '',
    age: '',
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

    if (!form.age) {
        errors.age = MESSAGES.FIELD_REQUIRED_AGE;
    } else {
        const ageNum = Number(form.age);
        if (Number.isNaN(ageNum) || ageNum < VALIDATION.AGE_MIN || ageNum > VALIDATION.AGE_MAX) {
            errors.age = MESSAGES.FIELD_INVALID_AGE;
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

    const handleChange = (field: keyof SignupFormState) => (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { value } = event.target;
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validate(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            setIsLoading(true);
            setApiError('');

            const response = await signupRequest({
                name: form.name.trim(),
                username: form.username.trim(),
                email: form.email.trim(),
                age: Number(form.age),
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
                        label="Full Name"
                        value={form.name}
                        onChange={handleChange('name')}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        fullWidth
                    />

                    <TextField
                        label="Username"
                        value={form.username}
                        onChange={handleChange('username')}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        fullWidth
                    />

                    <TextField
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        fullWidth
                    />

                    <SignupRowGroup>
                        <TextField
                            label="Age"
                            type="number"
                            value={form.age}
                            onChange={handleChange('age')}
                            error={Boolean(errors.age)}
                            helperText={errors.age}
                            fullWidth
                        />
                        <TextField
                            label="Phone"
                            type="tel"
                            placeholder="+919876543210"
                            value={form.phone}
                            onChange={handleChange('phone')}
                            error={Boolean(errors.phone)}
                            helperText={errors.phone}
                            autoComplete="tel"
                            fullWidth
                        />
                    </SignupRowGroup>

                    <TextField
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={handleChange('password')}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Role"
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
