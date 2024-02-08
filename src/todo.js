// todo.js
import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material'; // Correct import path for Material-UI components
import Status from './status';
import TodoItem from './item';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [count, setCount] = useState(0); // Define count variable
  const [selectedValue, setSelectedValue] = useState('Low');


  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      console.log(data[data.length-1].id)
      setCount(data.length > 0 ? parseInt(data[data.length - 1].id)+1 : 0 )
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    const newTodo = {
      id: count.toString(),
      time: new Date().toLocaleString(), // Adjust date format if needed
      text: newTodoText.trim(),
      done: false,
      priority:selectedValue
    };

    try {
      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoText('');
      setCount(count + 1); // Increment count
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // Other functions remain unchanged

  const toggleTodo = async (id, todo) => {
    try {
      // Invert the done status locally before sending the request to the server
      const updatedTodo = { ...todo, done: !todo.done };
  
      const response = await fetch(`http://localhost:3001/todos/`+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo) // Send updated todo object to the server
      });
  
      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }
  
      // Update the todos state with the updated todo
      setTodos(prevTodos =>
        prevTodos.map(item =>
          item.id === id ? updatedTodo : item
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };
  

  const changePriority = async (id,todo,level) => {
    try {
      // Invert the done status locally before sending the request to the server
      const updatedTodo = { ...todo, priority: level};
  
      const response = await fetch(`http://localhost:3001/todos/`+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo) // Send updated todo object to the server
      });
  
      if (!response.ok) {
        throw new Error('Failed to Update priority');
      }
  
      // Update the todos state with the updated todo
      setTodos(prevTodos =>
        prevTodos.map(item =>
          item.id === id ? updatedTodo : item
        )
      );
    } catch (error) {
      console.error('Error changing priority:', error);
    }
  };

  const removeTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/`+id, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      setCount(count-1)
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const editTodo = async (id, newText) => {
    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = {...todo,text: newText };
  
    const response = await fetch(`http://localhost:3001/todos/`+id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo)
    });
  
    if (response.ok) {
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(todo => todo.id === id ? updatedTodo : todo);
        return updatedTodos;
      });
    }
  };
  return (
    <div className='apps'>
      <p className='today-date'>Date: {new Date().toLocaleDateString()}</p>
      <h1 className='appname'>TO DO LIST APPLICATION</h1>
      <div className='outer-container'>
        <div className="inner-container">
          <TextField
              label="New Todo"
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              fullWidth
              margin="normal"
            />
            <div className="level-container">
              <Button variant="contained" color="primary" onClick={addTodo}>
                Add Todo
              </Button>
              <select value={selectedValue} className='set-priority' onChange={handleSelectChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

        </div>
        <div className='status-container'>
          <Status todos={todos} />
        </div>
      </div>

      <h4 className='completion-heading'>Task to be Done</h4>
      {todos.filter(todo=>!todo.done).map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={()=>toggleTodo(todo.id,todo)}
          onRemove={()=>removeTodo(todo.id)}
          onEdit={(id,newText) => editTodo(id, newText)}
          changePriority={(id,todo,level)=> changePriority(id,todo,level)}
        />
      ))}
    <h4 className='completion-heading'>Task Completed</h4>
    <div className='done-task'>
    {todos.filter(todo=>todo.done).map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={()=>toggleTodo(todo.id,todo)}
          onRemove={()=>removeTodo(todo.id)}
          onEdit={(id,newText) => editTodo(id, newText)}
          changePriority={(id,todo,level)=> changePriority(id,todo,level)}
        />
      ))}
    </div>
    
    </div>
  ) }

export default TodoList;