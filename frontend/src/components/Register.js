// Register.js for the todo-done app
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onRegister(username, password);
        navigate('/tasks'); // redirect here after registering
    };

    const handleRegistration = async (username, password) => {
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, password }),
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            alert('Registration successful!');
            navigate('/tasks'); // Use navigate instead of history.push
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Register to use To-do, done!</h2>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
