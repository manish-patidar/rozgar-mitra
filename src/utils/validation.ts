import dayjs, { type Dayjs } from 'dayjs';
import { ADDRESS_VALIDATION, VALIDATION } from './constants';

export const sanitizeAddressNumber = (value: string, maxLength: number): string =>
    value.replace(/\D/g, '').slice(0, maxLength);

export const sanitizeAddressText = (value: string, maxLength: number): string =>
    value.replace(/[^A-Za-z\s.'-]/g, '').slice(0, maxLength);

export const validateAddressApartment = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
        return 'Flat / Apartment Number is required';
    }

    if (!/^\d{1,4}$/.test(trimmed)) {
        return 'Flat / Apartment Number must be exactly 4 digits';
    }

    return undefined;
};

export const validateAddressPincode = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
        return 'Pincode is required';
    }

    if (!ADDRESS_VALIDATION.PINCODE_PATTERN.test(trimmed)) {
        return 'Pincode must be a valid 6-digit Indian PIN code';
    }

    return undefined;
};

export const validateAddressText = (
    value: string,
    fieldName: string,
    maxLength: number,
): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
        return `${fieldName} is required`;
    }

    if (trimmed.length > maxLength) {
        return `${fieldName} must be at most ${maxLength} characters`;
    }

    if (!ADDRESS_VALIDATION.TEXT_PATTERN.test(trimmed)) {
        return `${fieldName} can contain only letters, spaces, apostrophes, dots, and hyphens`;
    }

    return undefined;
};

export const formatPhoneNumber = (value: string): string => {
    const rawDigits = value.replace(/\D/g, '');

    if (!rawDigits || rawDigits.length <= 1) {
        return '+91';
    }

    const digits = rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;
    return `+91${digits.slice(0, 10)}`;
};

export const sanitizeFullName = (value: string): string =>
    value.replace(/[^A-Za-z\s.'-]/g, '').slice(0, VALIDATION.NAME_MAX_LENGTH);

export const sanitizeUsername = (value: string): string =>
    value.replace(/\s+/g, '').slice(0, VALIDATION.USERNAME_MAX_LENGTH);

export const validateFullName = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
        return 'Full name is required';
    }

    if (trimmed.length > VALIDATION.NAME_MAX_LENGTH) {
        return `Full name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters`;
    }

    if (!/^[A-Za-z\s.'-]+$/.test(trimmed)) {
        return 'Full name can contain only letters, spaces, apostrophes, dots, and hyphens';
    }

    return undefined;
};

export const validateUsername = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
        return 'Username is required';
    }

    if (trimmed.length > VALIDATION.USERNAME_MAX_LENGTH) {
        return `Username must be at most ${VALIDATION.USERNAME_MAX_LENGTH} characters`;
    }

    if (!/^[^\s]+$/.test(trimmed)) {
        return 'Username cannot contain spaces and must be at most 35 characters';
    }

    return undefined;
};

export const validateEmail = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
        return 'Email is required';
    }

    if (trimmed.length > VALIDATION.EMAIL_MAX_LENGTH) {
        return `Email must be at most ${VALIDATION.EMAIL_MAX_LENGTH} characters`;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return 'Please enter a valid email address';
    }

    return undefined;
};

export const validateDateOfBirth = (value: Dayjs | null): string | undefined => {
    if (!value) {
        return 'Date of birth is required';
    }

    const age = dayjs().diff(value, 'year');

    if (age < VALIDATION.AGE_MIN) {
        return `You must be at least ${VALIDATION.AGE_MIN} years old`;
    }

    if (age > VALIDATION.AGE_MAX) {
        return `You must be at most ${VALIDATION.AGE_MAX} years old`;
    }

    return undefined;
};

export const validatePhoneNumber = (value: string): string | undefined => {
    const trimmed = value.trim();

    if (!trimmed) {
        return 'Phone number is required';
    }

    if (!/^\+91\d{10}$/.test(trimmed)) {
        return 'Phone number must be a valid 10-digit Indian mobile number';
    }

    return undefined;
};

export const validatePassword = (value: string): string | undefined => {
    if (!value) {
        return 'Password is required';
    }

    if (value.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }

    if (!/[A-Z]/.test(value)) {
        return 'Password must include at least one uppercase letter';
    }

    if (!/[a-z]/.test(value)) {
        return 'Password must include at least one lowercase letter';
    }

    if (!/[0-9]/.test(value)) {
        return 'Password must include at least one number';
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
        return 'Password must include at least one special character';
    }

    return undefined;
};

export const getEligibleDobBounds = () => ({
    minDate: dayjs().subtract(VALIDATION.AGE_MAX, 'year'),
    maxDate: dayjs().subtract(VALIDATION.AGE_MIN, 'year'),
});
