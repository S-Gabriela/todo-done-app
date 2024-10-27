//db.js file for the todo-done app
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           //database username
  host: 'localhost',          //database server
  database: 'todo_done_db',   //database name
  password: 'snowfall',       //database password
  port: 5432,                 //default PostgreSQL port
});

// Connect to the database
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    return;
  }
  console.log('Connected to PostgreSQL database.');
});

module.exports = pool;