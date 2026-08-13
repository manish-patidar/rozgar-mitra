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
import { getDateOfBirthBounds } from '../../utils/date';
import { ADDRESS_EMPTY_STATE, hasAddressData, normalizeAddressPayload } from '../../utils/address';
import { BRAND_NAME, MESSAGES, ROLE_OPTIONS, ROUTES, VALIDATION } from '../../utils/constants';
import {
    formatPhoneNumber,
    sanitizeAddressNumber,
    sanitizeAddressText,
    sanitizeFullName,
    sanitizeUsername,
    validateAddressApartment,
    validateAddressPincode,
    validateAddressText,
    validateDateOfBirth,
    validateEmail,
    validateFullName,
    validatePassword,
    validatePhoneNumber,
    validateUsername,
} from '../../utils/validation';
import logo from '../../public/download.webp';
import heroWorker from '../../public/hero-worker.jpg';
import { AddressSection } from '../../components/address/AddressSection';
import type { AddressData, AddressErrors } from '../../types/address';
import type { SignupFormErrors, SignupFormState } from './signup.types';
import type { Dayjs } from 'dayjs';

const INITIAL_FORM_STATE: SignupFormState = {
    name: '',
    username: '',
    email: '',
    dateOfBirth: null,
    phone: '',
    address: { ...ADDRESS_EMPTY_STATE },
    password: '',
    role: ROLE_OPTIONS[0].value,
};

const validateAddressFields = (address: AddressData): AddressErrors => {
    const nextErrors: AddressErrors = {};

    const apartmentError = validateAddressApartment(address.apartmentNumber);
    if (apartmentError) nextErrors.apartmentNumber = apartmentError;

    const buildingError = validateAddressText(
        address.buildingName,
        'Building / Society Name',
        VALIDATION.ADDRESS_BUILDING_MAX_LENGTH,
    );
    if (buildingError) nextErrors.buildingName = buildingError;

    const colonyError = validateAddressText(
        address.colony,
        'Colony / Landmark / Area',
        VALIDATION.ADDRESS_COLONY_MAX_LENGTH,
    );
    if (colonyError) nextErrors.colony = colonyError;

    const cityError = validateAddressText(
        address.city,
        'City',
        VALIDATION.ADDRESS_CITY_MAX_LENGTH,
    );
    if (cityError) nextErrors.city = cityError;

    const stateError = validateAddressText(
        address.state,
        'State',
        VALIDATION.ADDRESS_STATE_MAX_LENGTH,
    );
    if (stateError) nextErrors.state = stateError;

    const pincodeError = validateAddressPincode(address.pincode);
    if (pincodeError) nextErrors.pincode = pincodeError;

    const countryError = validateAddressText(
        address.country,
        'Country',
        VALIDATION.ADDRESS_COUNTRY_MAX_LENGTH,
    );
    if (countryError) nextErrors.country = countryError;

    return nextErrors;
};

const validate = (form: SignupFormState): SignupFormErrors => {
    const errors: SignupFormErrors = {};

    const nameError = validateFullName(form.name);
    if (nameError) {
        errors.name = nameError;
    }

    const usernameError = validateUsername(form.username);
    if (usernameError) {
        errors.username = usernameError;
    }

    const emailError = validateEmail(form.email);
    if (emailError) {
        errors.email = emailError;
    }

    const dobError = validateDateOfBirth(form.dateOfBirth);
    if (dobError) {
        errors.dateOfBirth = dobError;
    }

    const phoneError = validatePhoneNumber(form.phone);
    if (phoneError) {
        errors.phone = phoneError;
    }

    if (!hasAddressData(form.address)) {
        errors.address = MESSAGES.FIELD_REQUIRED_ADDRESS;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
        errors.password = passwordError;
    }

    if (!form.role.trim()) {
        errors.role = MESSAGES.FIELD_REQUIRED_ROLE;
    }

    return errors;
};

const Signup: FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<SignupFormState>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<SignupFormErrors>({});
    const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const dobBounds = getDateOfBirthBounds();

    const handleChange = (field: keyof SignupFormState) => (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        let value = event.target.value;

        if (field === 'name') {
            value = sanitizeFullName(value);
        }

        if (field === 'username') {
            value = sanitizeUsername(value);
        }

        if (field === 'phone') {
            value = formatPhoneNumber(value);
        }

        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

    const handleDateOfBirthChange = (value: Dayjs | null) => {
        setForm((prev) => ({ ...prev, dateOfBirth: value }));
        setErrors((prev) => (prev.dateOfBirth ? { ...prev, dateOfBirth: undefined } : prev));
    };

    const handleAddressChange = (field: keyof AddressData, value: string) => {
        let nextValue = value;

        if (field === 'apartmentNumber') {
            nextValue = sanitizeAddressNumber(value, VALIDATION.ADDRESS_APARTMENT_DIGITS);
        }

        if (field === 'pincode') {
            nextValue = sanitizeAddressNumber(value, VALIDATION.ADDRESS_PINCODE_DIGITS);
        }

        if (
            field === 'buildingName' ||
            field === 'colony' ||
            field === 'city' ||
            field === 'state' ||
            field === 'country'
        ) {
            nextValue = sanitizeAddressText(
                value,
                field === 'buildingName'
                    ? VALIDATION.ADDRESS_BUILDING_MAX_LENGTH
                    : field === 'colony'
                        ? VALIDATION.ADDRESS_COLONY_MAX_LENGTH
                        : field === 'city'
                            ? VALIDATION.ADDRESS_CITY_MAX_LENGTH
                            : field === 'state'
                                ? VALIDATION.ADDRESS_STATE_MAX_LENGTH
                                : VALIDATION.ADDRESS_COUNTRY_MAX_LENGTH,
            );
        }

        setForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: nextValue,
            },
        }));

        setAddressErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));

        if (errors.address) {
            setErrors((prev) => ({ ...prev, address: undefined }));
        }
    };

    const handleAutoPopulateAddress = (detected: Partial<AddressData>) => {
        setForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                ...detected,
            },
        }));
        setAddressErrors({});
        if (errors.address) {
            setErrors((prev) => ({ ...prev, address: undefined }));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validate(form);
        const nextAddressErrors = validateAddressFields(form.address);
        setAddressErrors(nextAddressErrors);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0 || Object.keys(nextAddressErrors).length > 0 || !form.dateOfBirth) {
            return;
        }

        try {
            setIsLoading(true);
            setApiError('');

            const response = await signupRequest({
                name: form.name.trim(),
                username: form.username.trim(),
                email: form.email.trim(),
                dob: form.dateOfBirth.format('YYYY-MM-DD'),
                phone_number: form.phone.trim(),
                address: normalizeAddressPayload(form.address),
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
                        slotProps={{ htmlInput: { maxLength: VALIDATION.NAME_MAX_LENGTH } }}
                        fullWidth
                    />

                    <TextField
                        label={MESSAGES.SIGNUP_USERNAME_LABEL}
                        value={form.username}
                        onChange={handleChange('username')}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        slotProps={{ htmlInput: { maxLength: VALIDATION.USERNAME_MAX_LENGTH } }}
                        fullWidth
                    />

                    <TextField
                        label={MESSAGES.SIGNUP_EMAIL_LABEL}
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        slotProps={{ htmlInput: { maxLength: VALIDATION.EMAIL_MAX_LENGTH } }}
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
                            inputMode="numeric"
                            slotProps={{ htmlInput: { maxLength: 13 } }}
                            fullWidth
                        />
                    </SignupRowGroup>

                    <AddressSection
                        address={form.address}
                        errors={addressErrors}
                        onAddressChange={handleAddressChange}
                        onAutoPopulate={handleAutoPopulateAddress}
                    />

                    <TextField
                        label={MESSAGES.SIGNUP_PASSWORD_LABEL}
                        type="password"
                        value={form.password}
                        onChange={handleChange('password')}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        slotProps={{ htmlInput: { maxLength: 128 } }}
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
