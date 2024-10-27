CREATE TABLE users(
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
password VARCHAR(50) NOT NULL
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(10),
  completed BOOLEAN DEFAULT FALSE
);