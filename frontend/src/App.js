import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import TaskInput from './components/TaskInput';
import TodoList from './components/TodoList';
import './App.css';
function AppContent() {
    const [tasks, setTasks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('/auth/check-session');
                if (response.ok) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };
        checkLoginStatus();
    }, []);

    const handleRegister = async (username, password) => {
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
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
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
            setIsLoggedIn(true);
            navigate('/tasks');
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            alert('Logout successful!');
            setIsLoggedIn(false);
            setTasks([]); // Clear tasks after logout
            navigate('/');
        } catch (error) {
            alert('Logout failed: ' + error.message);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
            alert('Failed to delete task: ' + error.message);
        }
    };

    const handleUpdate = async (taskId, updatedFields) => {
        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields),
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const updatedTask = await response.json();
            setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
        } catch (error) {
            alert('Failed to update task: ' + error.message);
        }
    };

    const handleAddTask = async (task) => {
        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const newTask = await response.json();
            setTasks([...tasks, newTask]);
        } catch (error) {
            alert('Failed to add task: ' + error.message);
        }
    };

    const handleToggleTaskCompletion = async (taskId) => {
        try {
            const taskToUpdate = tasks.find((task) => task.id === taskId);
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !taskToUpdate.completed }),
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const updatedTask = await response.json();
            setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
        } catch (error) {
            alert('Failed to toggle task completion: ' + error.message);
        }
    };

    return (
        <>
            <Routes>
                <Route exact path="/" element={
                    <div>
                        <h1>Welcome to To-do, Done!</h1>
                        <nav className="welcome-nav">
                            <Link to="/register">Register</Link> |
                            <Link to="/login">Login</Link>
                        </nav>
                    </div>
                } />
                <Route path="/register" element={<Register onRegister={handleRegister} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/tasks" element={
                    <>
                        <nav>
                            <Link to="/">Home</Link>
                            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                        </nav>
                        <div className="container">
                            <h2>Here's your To-Do List:</h2>
                            <TaskInput addTask={handleAddTask} />
                            <TodoList
                                tasks={tasks}
                                toggleTaskCompletion={handleToggleTaskCompletion}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                            />
                        </div>
                    </>
                } />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;

