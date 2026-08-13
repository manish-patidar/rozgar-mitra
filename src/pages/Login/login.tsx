import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
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
import { loginRequest, extractAuthToken, extractUserRole } from '../../api/auth.api';
import { getApiErrorMessage } from '../../api/client';
import { setAuthToken, setUserRole } from '../../utils/auth';
import { BRAND_NAME, MESSAGES, ROUTES, VALIDATION } from '../../utils/constants';
import { sanitizeUsername, validatePassword, validateUsername } from '../../utils/validation';
import logo from '../../public/download.webp';
import heroWorker from '../../public/hero-worker.jpg';
import type { LoginFormState } from './login.types';

const INITIAL_FORM_STATE: LoginFormState = {
    username: '',
    password: '',
};

const validateLoginForm = (form: LoginFormState): Partial<Record<keyof LoginFormState, string>> => {
    const nextErrors: Partial<Record<keyof LoginFormState, string>> = {};

    const usernameError = validateUsername(form.username);
    if (usernameError) {
        nextErrors.username = usernameError;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
        nextErrors.password = passwordError;
    }

    return nextErrors;
};

const Login: FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginFormState>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormState, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange =
        (field: keyof LoginFormState) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const value = field === 'username' ? sanitizeUsername(event.target.value) : event.target.value;

                setForm((prev) => ({ ...prev, [field]: value }));
                setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
            };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateLoginForm(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setError('Please correct the highlighted fields and try again.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const response = await loginRequest({
                username: form.username.trim(),
                password: form.password,
            });
            const token = extractAuthToken(response.data);

            if (!token) {
                setError(response.data.message ?? MESSAGES.LOGIN_NO_TOKEN);
                return;
            }

            setAuthToken(token);

            const role = extractUserRole(response.data);
            if (role) {
                setUserRole(role);
            }

            navigate(ROUTES.HOME, { replace: true });
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, MESSAGES.LOGIN_GENERIC_ERROR));
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
                    {MESSAGES.LOGIN_TITLE}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {MESSAGES.LOGIN_SUBTITLE}
                </Typography>

                <AuthForm onSubmit={handleSubmit} noValidate>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label={MESSAGES.LOGIN_USERNAME_LABEL}
                        name="username"
                        value={form.username}
                        onChange={handleChange('username')}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        slotProps={{ htmlInput: { maxLength: VALIDATION.USERNAME_MAX_LENGTH } }}
                        fullWidth
                    />

                    <TextField
                        label={MESSAGES.LOGIN_PASSWORD_LABEL}
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange('password')}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        slotProps={{ htmlInput: { maxLength: 128 } }}
                        fullWidth
                    />

                    <AuthSubmitButton type="submit" variant="contained" fullWidth disabled={isLoading}>
                        {isLoading ? MESSAGES.LOGIN_SUBMITTING : MESSAGES.LOGIN_SUBMIT}
                    </AuthSubmitButton>
                </AuthForm>

                <AuthSwitchRow>
                    <Typography variant="body2" color="text.secondary">
                        {MESSAGES.LOGIN_SWITCH_PROMPT}
                    </Typography>
                    <AuthSwitchButton onClick={() => navigate(ROUTES.SIGNUP)}>
                        {MESSAGES.LOGIN_SWITCH_ACTION}
                    </AuthSwitchButton>
                </AuthSwitchRow>
            </AuthCard>
        </AuthPageContainer>
    );
};

export default Login;
