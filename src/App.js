import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import './App.css'
import * as amplify from './amplify'
import { Authenticator, Alert } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [tasks, setTasks] = useState([])
  const [taskTitle, setTaskTitle] = useState("")
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function getTasks() {
      const tasks = await amplify.getTasks()
      console.log(tasks)
      setTasks(tasks)
    }

    getTasks()
  }, [])

  const createTask = async (e) => {
    e.preventDefault()
    try {
      const task = await amplify.createTask(taskTitle)
      console.log(task)
      setTasks([task, ...tasks])
      setTaskTitle("")
      setErrorMsg("")
    } catch {
      setErrorMsg("You cant create it.")
    }

  }
  const deleteTask = async id => {
    try {
      const result = await amplify.deleteTask(id)
      if (result.message == "deleted successfully") {
        const newTasks = tasks.filter(item => item.id != id)
        setTasks(newTasks)
        setErrorMsg("")
      }
    } catch {
      setErrorMsg("You cant delete it.")

    }
  }


  const updateTask = async (id) => {
    const task = tasks.find(item => item.id == id)
    task.completed = !task.completed
    try {
      const updatedTask = await amplify.completedTask(id, task.completed)
      console.log(updatedTask)
      setTasks([...tasks])
      setErrorMsg("")
    } catch {
      setErrorMsg("You cant update it.")
    }
  };

  return (
    <div className="App">
      <h1>To Do Lists</h1>

      {tasks.map(task => (
        <List key={task.id} sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
          <ListItem
          >
            <ListItemText id={task.id} primary={task.title} />
            <Checkbox {...label} checked={task.completed == 1}
              onChange={() => updateTask(task.id)} />
            <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
          <Divider />
        </List>
      ))}
      {errorMsg && <Alert variation="info">{errorMsg}</Alert>}
      <Authenticator>
        {({ signOut, user }) => (
          <form onSubmit={createTask} className="create-container">
            <TextField id="standard-basic" label="Create New ToDo" variant="outlined" value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)} size="small" />
            <Button variant="contained" type="submit" >Create</Button>
            <Button onClick={signOut} variant="contained">Sign Out</Button>
          </form>
        )}
      </Authenticator>
    </div>
  )
}

export default App
