import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { saveAuthToken, signupRequest } from '../../utils/api';
import logo from '../../public/download.webp';
import bg from '../../public/bg.jpg';
import Box from '@mui/material/Box';


// Define the shape of our form data
interface FormData {
    name: string;
    username: string;
    email: string;
    age: string;
    phone: string;
    password: string;
    role: string;
}

// Define the shape of our errors object (all fields are optional)
interface FormErrors {
    name?: string;
    username?: string;
    email?: string;
    age?: string;
    phone?: string;
    password?: string;
    role?: string;
}

const Signup: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        username: '',
        email: '',
        age: '',
        phone: '',
        password: '',
        role: 'ROLE_CUSTOMER',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // Use React.ChangeEvent directly to avoid type-only import issues
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear error for the field being typed in, if it exists
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 4) {
            newErrors.username = "Username must be at least 4 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.age) {
            newErrors.age = "Age is required";
        } else {
            const ageNum = parseInt(formData.age, 10);
            if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
                newErrors.age = "Please enter a valid age (18-100)";
            }
        }

        const phoneRegex = /^\+[1-9]\d{6,14}$/;
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Phone must start with +country code, for example +919876543210";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.role.trim()) {
            newErrors.role = "Role is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Use React.FormEvent directly 
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setApiError('');

            const payload = {
                name: formData.name.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                age: Number(formData.age),
                phone_number: formData.phone.trim(),
                password: formData.password,
                role: formData.role,
            }

            const response = await signupRequest(payload);

            saveAuthToken(response?.data);
            alert('Registration successful');
            window.location.href = '/login';
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                const backendMessage =
                    requestError.response?.data?.message ??
                    requestError.response?.data?.error ??
                    requestError.response?.data ??
                    requestError.message;

                setApiError(`Registration failed: ${String(backendMessage)}`);
            } else {
                setApiError('Registration failed. Please verify the backend response format.');
            }
            console.error('Signup request failed:', requestError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            className="page-container"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bg})`,
            }}
        >
            <div className="logo-container">
                <img src={logo} alt="Rozgarmitra Logo" className="brand-logo" />
            </div>

            <div className="signup-card">
                <div className="form-section">
                    <h2>Customer Registration</h2>

                    <form onSubmit={handleSubmit} className="signup-form">
                        {apiError && <div className="error-banner">{apiError}</div>}

                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="input-group row-group">
                            <div className="half-width">
                                <input
                                    type="number"
                                    name="age"
                                    placeholder="Age"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                                {errors.age && <span className="error-text">{errors.age}</span>}
                            </div>
                            <div className="half-width">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+919876543210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                />
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                            </div>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className="input-group">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="ROLE_CUSTOMER">Customer</option>
                                <option value="ROLE_LABOUR">Labour</option>
                            </select>
                            {errors.role && <span className="error-text">{errors.role}</span>}
                        </div>

                        <button type="submit" className="register-btn" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>

                <div className="theme-section">
                    <h2>Welcome Back!</h2>
                    <p>Already have an account?</p>
                    <a
                        href="/login"
                        className="login-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, '', '/login');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                    >
                        Login
                    </a>
                </div>
            </div>
        </Box>
    );
};

export default Signup;