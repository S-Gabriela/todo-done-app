// server.js for the todo-done app
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db'); // import database pool
const { router: authRoutes, isAuthenticated } = require('./auth'); // import authentication routes and middleware

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
// Session setup
app.use(
    session({
        store: new pgSession({
            pool: pool, // connection pool
            createTableIfMissing: true, // to automatically create the session table if it don't exist
        }),
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // set to true if using HTTPS
    })
);
app.use(express.json());
app.use(express.static('public'));

// Routes

//Root route
app.get('/', (req, res) => {
    res.send('Welcome to To-do, Done!');
});
app.use('/auth', authRoutes); // Authentication routes

// CRUD operations for tasks
app.post('/tasks', isAuthenticated, async (req, res) => {
    const { title, description, due_date, priority } = req.body;
    const userId = req.session.userId;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (user_id, title, description, due_date, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, title, description, due_date, priority]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding task');
    }
});

app.get('/tasks/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching task');
    }
});

app.put('/tasks/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, description, due_date, priority, completed } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4, completed = $5 WHERE id = $6 RETURNING *',
            [title, description, due_date, priority, completed, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating task');
    }
});

app.delete('/tasks/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.send('Task deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting task');
    }
});
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
