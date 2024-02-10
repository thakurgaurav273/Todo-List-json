import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import Status from './status';
import TodoItem from './item';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [count, setCount] = useState(0); // count variable for providing distinct ID's to each task
  const [selectedValue, setSelectedValue] = useState('Low');


  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/todos');    // request made to JSON server to get all the items
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setCount(data.length > 0 ? parseInt(data[data.length - 1].id)+1 : 0 ) // this line finds out the ID of the last task added into todo
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    const newTodo = {
      id: count.toString(),
      time: new Date().toLocaleString(), // to append time in the list object
      text: newTodoText.trim(),
      done: false,                  // initial status of each todo set as false by default
      priority:selectedValue        // to indicate priority level of the task
    };

    try {
      const response = await fetch('http://localhost:3001/todos', {   // post request made to append the newly added task into DB.json
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoText('');
      setCount(count + 1);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const toggleTodo = async (id, todo) => {
    try {
      // Invert the done status before sending the request to the server
      const updatedTodo = { ...todo, done: !todo.done };
  
      const response = await fetch(`http://localhost:3001/todos/`+id, { // a PUT request made to change the status of task
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
      const updatedTodo = { ...todo, priority: level};
  
      const response = await fetch(`http://localhost:3001/todos/`+id, { // put request made to change the priority level of task
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
      const response = await fetch(`http://localhost:3001/todos/`+id, {  // Delete request to JSON server to delete the task from DB.json file
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
  
    const response = await fetch(`http://localhost:3001/todos/`+id, {     // PUT request to change the task added earlier
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