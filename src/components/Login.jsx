import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from "react";
import '../assets/css/Login.css';
import logo from "../assets/images/logo.png";

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = '/api';

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage('Username and password are required.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ usuario: username, senha: password }),
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log('API Response:', data);

                if (data.token) {
                    console.log('Token received:', data.token);
                    localStorage.setItem('token', data.token);
                    onLogin(true);
                    navigate('/admin');
                } else {
                    setErrorMessage(data.erro || 'Incorrect username or password.');
                }
            } else {
                const text = await response.text();
                console.error('Non-JSON response received:', text);

                let errorText = 'Server error. Check console for details.';
                try {
                    const errorMatch = text.match(/<b>.*?error<\/b>:.*?([^<]+)/i) ||
                        text.match(/<b>.*?Notice<\/b>:.*?([^<]+)/i) ||
                        text.match(/<b>.*?Warning<\/b>:.*?([^<]+)/i);
                    if (errorMatch && errorMatch[1]) {
                        errorText = errorMatch[1].trim();
                    }
                } catch (e) {
                    // Ignore extraction errors
                }

                setErrorMessage(errorText);
            }
        } catch (error) {
            setErrorMessage('Network error or invalid response format. See console for details.');
            console.error('Network error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-left">
                    <div className="login-logo">
                        <img src={logo} alt="Creator Splash Logo" />
                    </div>
                    <div className="login-welcome">
                        <h1>Welcome Back</h1>
                        <p>Enter your credentials to access the admin panel</p>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-header">
                        <h2>Admin Panel</h2>
                    </div>

                    {errorMessage && (
                        <div className="error-message">
                            <div className="error-icon">
                                <i className="fas fa-exclamation-circle"></i>
                            </div>
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Creator Splash Admin System</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;