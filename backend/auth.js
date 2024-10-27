//auth.js for the todo-done app
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // import database pool
const router = express.Router();

// Register
router.post('/register', (req, res) => {
    console.log('Register endpoint hit');
    const { name, password } = req.body;

    // Check if a password was sent
    if (!password) {
        return res.status(400).send('Password is required');
    }

    // Check if the username already exists
    const userExistsQuery = 'SELECT * FROM users WHERE name = $1';
    pool.query(userExistsQuery, [name], (error, result) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Error checking user existence');
        }
        if (result.rows.length > 0) {
            return res.status(400).send('Username already exists');
        }

        // If username does not exist, hash the password
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr);
                return res.status(500).send('Error hashing password');
            }

            // Insert the new user
            const insertUserQuery = 'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *';
            pool.query(insertUserQuery, [name, hashedPassword], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Error inserting user:', insertErr);
                    return res.status(500).send('Error registering user');
                }
                res.status(201).json(insertResult.rows[0]);
            });
        });
    });
});

// Login
router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE name = $1', [name]);
        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }
		//save user id in session
        req.session.userId = user.id;
        console.log('Session data:', req.session);  // Log session data
        res.send('Login successful');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error logging in');
    }
});


// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('Logged out');
    });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.status(401).send('Unauthorized');
}

module.exports = { router, isAuthenticated };

