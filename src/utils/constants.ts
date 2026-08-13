// Application route paths
export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/',
    HOME: '/home',
    CATEGORY_DETAIL: '/category/:categoryId',
} as const;

export const buildCategoryDetailPath = (categoryId: string): string => `/category/${categoryId}`;

// Validation regex patterns
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+91\d{10}$/,
} as const;

// Field length / value constraints
export const VALIDATION = {
    NAME_MAX_LENGTH: 35,
    USERNAME_MAX_LENGTH: 35,
    EMAIL_MAX_LENGTH: 64,
    USERNAME_MIN_LENGTH: 4,
    PASSWORD_MIN_LENGTH: 8,
    AGE_MIN: 13,
    AGE_MAX: 100,
    ADDRESS_APARTMENT_DIGITS: 4,
    ADDRESS_PINCODE_DIGITS: 6,
    ADDRESS_BUILDING_MAX_LENGTH: 255,
    ADDRESS_COLONY_MAX_LENGTH: 255,
    ADDRESS_CITY_MAX_LENGTH: 35,
    ADDRESS_STATE_MAX_LENGTH: 60,
    ADDRESS_COUNTRY_MAX_LENGTH: 35,
} as const;

export const ADDRESS_VALIDATION = {
    APARTMENT_PATTERN: /^\d{1,4}$/,
    PINCODE_PATTERN: /^\d{6}$/,
    TEXT_PATTERN: /^[A-Za-z\s.'-]+$/,
    BUILDING_NAME: { maxLength: VALIDATION.ADDRESS_BUILDING_MAX_LENGTH },
    COLONY: { maxLength: VALIDATION.ADDRESS_COLONY_MAX_LENGTH },
    CITY: { maxLength: VALIDATION.ADDRESS_CITY_MAX_LENGTH },
    STATE: { maxLength: VALIDATION.ADDRESS_STATE_MAX_LENGTH },
    COUNTRY: { maxLength: VALIDATION.ADDRESS_COUNTRY_MAX_LENGTH },
} as const;

// localStorage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER_ROLE: 'userRole',
} as const;

// User roles
export const ROLES = {
    CUSTOMER: 'ROLE_CUSTOMER',
    LABOUR: 'ROLE_LABOUR',
} as const;

// User roles available at signup
export const ROLE_OPTIONS = [
    { value: ROLES.CUSTOMER, label: 'Customer' },
    { value: ROLES.LABOUR, label: 'Labour' },
] as const;

// How far a booking request should search for nearby labour
export const NEARBY_RADIUS_KM = 10;

// Brand
export const BRAND_NAME = 'Rozgarmitra';

// User-facing strings
export const MESSAGES = {
    LOGIN_TITLE: 'Welcome Back',
    LOGIN_SUBTITLE: 'Login to book trusted help near you.',
    LOGIN_WELCOME: 'Welcome Back!',
    LOGIN_SWITCH_PROMPT: "Don't have an account?",
    LOGIN_SWITCH_ACTION: 'Sign Up',
    LOGIN_SUBMIT: 'Login',
    LOGIN_SUBMITTING: 'Logging in...',
    LOGIN_MISSING_FIELDS: 'Please enter username and password',
    LOGIN_NO_TOKEN: 'Login succeeded but no token was returned.',
    LOGIN_GENERIC_ERROR: 'Login failed. Please check your credentials and try again.',

    SIGNUP_TITLE: 'Create Account',
    SIGNUP_SUBTITLE: 'We can fix anything under your roof.',
    SIGNUP_WELCOME: 'Welcome Back!',
    SIGNUP_SWITCH_PROMPT: 'Already have an account?',
    SIGNUP_SWITCH_ACTION: 'Login',
    SIGNUP_SUBMIT: 'Sign Up',
    SIGNUP_SUBMITTING: 'Registering...',
    SIGNUP_SUCCESS: 'Registration successful',
    SIGNUP_GENERIC_ERROR: 'Registration failed. Please verify the backend response format.',

    FIELD_REQUIRED_NAME: 'Full name is required',
    FIELD_REQUIRED_USERNAME: 'Username is required',
    FIELD_INVALID_USERNAME: `Username must be 1 to ${VALIDATION.USERNAME_MAX_LENGTH} characters and may contain letters, numbers, and . _ @ - only`,
    FIELD_REQUIRED_EMAIL: 'Email is required',
    FIELD_INVALID_EMAIL: `Email must be valid and up to ${VALIDATION.EMAIL_MAX_LENGTH} characters`,
    FIELD_REQUIRED_DOB: 'Date of birth is required',
    FIELD_INVALID_DOB: `You must be at least ${VALIDATION.AGE_MIN} years old`,
    FIELD_REQUIRED_PHONE: 'Phone number is required',
    FIELD_INVALID_PHONE: 'Phone must be a valid 10-digit Indian mobile number with +91 prefix',
    FIELD_REQUIRED_ADDRESS: 'Address is required',
    ADDRESS_DETECTING: 'Detecting your location...',
    ADDRESS_DETECT_FAILED: 'Location access was denied. You can still enter your address manually.',
    FIELD_REQUIRED_PASSWORD: 'Password is required',
    FIELD_INVALID_PASSWORD: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character`,
    FIELD_REQUIRED_ROLE: 'Role is required',

    LOGIN_USERNAME_LABEL: 'Username',
    LOGIN_PASSWORD_LABEL: 'Password',

    SIGNUP_NAME_LABEL: 'Full Name',
    SIGNUP_USERNAME_LABEL: 'Username',
    SIGNUP_EMAIL_LABEL: 'Email Address',
    SIGNUP_DOB_LABEL: 'Date of Birth',
    SIGNUP_PHONE_LABEL: 'Phone',
    SIGNUP_PHONE_PLACEHOLDER: '+919876543210',
    SIGNUP_PASSWORD_LABEL: 'Password',
    SIGNUP_ROLE_LABEL: 'Role',

    HOME_LOCATION: 'Indore, MP',
    HOME_LOGOUT: 'Logout',
    HOME_MENU: 'Menu',
    HOME_WELCOME: 'Welcome, Rahul!',
    HOME_SUBTITLE: 'What kind of help do you need today?',
    HOME_SERVICES_TITLE: 'Categories',
    HOME_PROMO_TITLE: 'Get 25% OFF on Home Cleaning',
    HOME_PROMO_SUBTITLE: 'Book a trusted, verified cleaner near you today.',
    HOME_PROMO_CTA: 'View',

    LABOUR_HOME_WELCOME: 'Welcome back!',
    LABOUR_HOME_SUBTITLE: "Here's what's happening nearby.",
    LABOUR_HOME_REQUESTS_TITLE: 'Nearby Job Requests',
    LABOUR_HOME_NO_REQUESTS: 'No job requests near you right now.',
    LABOUR_HOME_ACCEPT: 'Accept',
    LABOUR_HOME_DECLINE: 'Decline',
    LABOUR_HOME_ACCEPTED_STATUS: 'Accepted',
    LABOUR_HOME_DECLINED_STATUS: 'Declined',

    CATEGORY_DETAIL_BACK: 'Back',
    CATEGORY_DETAIL_ABOUT: 'About this service',
    CATEGORY_DETAIL_PRICE_LABEL: 'Starting price',
    CATEGORY_DETAIL_PRICE_UNIT: '/hour',
    CATEGORY_DETAIL_BOOK_CTA: 'Book Now',
    CATEGORY_DETAIL_NOT_FOUND: "We couldn't find that category.",
    CATEGORY_DETAIL_BACK_TO_HOME: 'Back to Home',

    BOOKING_ADDRESS_TITLE: 'Confirm your address',
    BOOKING_ADDRESS_SUBTITLE: 'Drag the pin or use your current location.',
    BOOKING_USE_CURRENT_LOCATION: 'Use current location',
    BOOKING_ADDRESS_LABEL: 'Address',
    BOOKING_ADDRESS_PLACEHOLDER: 'House no., street, area, city',
    BOOKING_ADDRESS_REQUIRED: 'Please add an address before booking',
    BOOKING_LOCATING: 'Fetching your location...',
    BOOKING_LOCATION_DENIED: "Location access was denied. You can still drop the pin manually.",
    BOOKING_CONFIRM_CTA: 'Confirm Booking',
    BOOKING_SEARCHING: 'Searching for workers near you...',
    BOOKING_SUCCESS_TITLE: 'Request sent!',
    BOOKING_BACK_TO_HOME: 'Back to Home',
} as const;

export const buildBookingSuccessMessage = (notifiedCount: number): string =>
    `${notifiedCount} worker${notifiedCount === 1 ? '' : 's'} notified within ${NEARBY_RADIUS_KM}km of your location.`;
