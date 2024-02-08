// item.js
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import './App.css'; // Make sure to define 'internal-text' class in this CSS file if needed

const TodoItem = ({todo, onToggle, onRemove, onEdit,changePriority}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const [selectedValue, setSelectedValue] = useState(todo.priority);
  const handleToggle = () => {
    onToggle(todo.id,todo); // Pass the todo id to the onToggle function
  };

  const handleRemove = () => {
    onRemove(todo.id); // Pass the todo id to the onRemove function
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(todo.id, editedText); // Pass the todo id and edited text to the onEdit function
    setIsEditing(false);
  };
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const savePriority=()=>{
    changePriority(todo.id,todo,selectedValue)  
  };

  return (
    <li id='each-item' className={todo.done ? 'done' : ''}>
      <Checkbox
        checked={todo.done}
        onChange={handleToggle}
        color="success"
      />
      {isEditing ? (
        <TextField
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <div className='internal-text'>
          {todo.text}
        </div>
      )}
      <span className='timing'>{todo.time}</span>
      <select value={selectedValue} id={todo.priority} onChange={handleSelectChange} onBlur={savePriority}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
      <Button
        variant="outlined"
        className='buttons'
        onClick={handleRemove}
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
      <Button
        variant="outlined"
        className='buttons'
        onClick={handleEdit}
        startIcon={<EditIcon />}
      >
        Edit
      </Button>
    </li>
  );
};

export default TodoItem;
