import React, { useState } from 'react';

const TodoList = ({ tasks, toggleTaskCompletion, handleDelete, handleUpdate }) => {
    const [editingTask, setEditingTask] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newPriority, setNewPriority] = useState('');

    const startEditing = (task) => {
        setEditingTask(task.id);
        setNewTitle(task.title);
        setNewDescription(task.description);
        setNewDueDate(task.due_date);
        setNewPriority(task.priority);
    };

    const submitEdit = () => {
        handleUpdate(editingTask, { title: newTitle, description: newDescription, due_date: newDueDate, priority: newPriority });
        setEditingTask(null);
        setNewTitle('');
        setNewDescription('');
        setNewDueDate('');
        setNewPriority('');
    };

    return (
        <ul className="todo-list">
            {tasks.map((task) => (
                <li key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
                    {editingTask === task.id ? (
                        <div>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                            <input
                                type="date"
                                value={newDueDate}
                                onChange={(e) => setNewDueDate(e.target.value)}
                            />
                            <input
                                type="text"
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div>
                            <span onClick={() => toggleTaskCompletion(task.id)}>
                                <strong>Title:</strong> {task.title}
                            </span>
                            <div>
                                <strong>Description:</strong> {task.description}
                            </div>
                            <div>
                                <strong>Priority:</strong> {task.priority}
                            </div>
                            <div>
                                <strong>Due Date:</strong> {task.due_date}
                            </div>
                        </div>
                    )}
                    <button onClick={() => handleDelete(task.id)} className="delete-btn">Delete</button>
                    {editingTask === task.id ? (
                        <button onClick={submitEdit}>Save</button>
                    ) : (
                        <button onClick={() => startEditing(task)}>Edit</button>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
