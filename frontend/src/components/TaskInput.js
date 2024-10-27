//TaskInput.js for todo-done app
import React, { useState } from 'react';

const TaskInput = ({ addTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            addTask({ title, description, due_date: dueDate, priority });
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form task-input-container">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskInput;
