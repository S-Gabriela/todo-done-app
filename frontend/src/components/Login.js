// Login.js for the todo-done app
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onLogin(username, password); // call onLogin
        navigate('/tasks'); // redirect here after logging in
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, password }),
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            alert('Login successful!');
            navigate('/tasks'); // Use navigate instead of history.push
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Login to your account</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
