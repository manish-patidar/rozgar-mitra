import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { loginRequest, saveAuthToken } from '../../utils/api';
import logo from '../../public/download.webp';
import bg from '../../public/bg.jpg';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const response = await loginRequest({ username, password });
            const token = saveAuthToken(response.data);

            if (!token) {
                setError(response.data.message ?? 'Login succeeded but no token was returned.');
                return;
            }

            window.location.href = '/home';
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                const backendMessage =
                    requestError.response?.data?.message ??
                    requestError.response?.data?.error ??
                    requestError.response?.data ??
                    requestError.message;

                setError(`Login failed: ${String(backendMessage)}`);
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
            console.error('Login request failed:', requestError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
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
                    <h2>Customer Login</h2>
                    <form onSubmit={handleSubmit} className="signup-form">
                        {error && <div className="error-banner">{error}</div>}

                        <div className="input-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="register-btn" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>

                <div className="theme-section">
                    <h2>Welcome Back!</h2>
                    <p>Don't have an account?</p>
                    <a
                        href="/"
                        className="login-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, '', '/');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                    >
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;



