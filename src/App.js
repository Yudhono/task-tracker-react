import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
import Footer from './components/Footer'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

    //fetch tasks, get all tasks from json server
    const fetchTasks = async () => {
      const res = await fetch('https://my-json-server.typicode.com/yudhono/db.json/tasks');
      const data = await res.json();

      return data;
    }

    // fetchtask, get single task from json server
    const fetchTask = async (id) => {
      const res = await fetch(`https://my-json-server.typicode.com/yudhono/db.json/tasks/${id}`);
      const data = await res.json();

      return data;
    }

    // Delete Task
    const deleteTask = async (id) => {
      await fetch(`https://my-json-server.typicode.com/yudhono/db.json/tasks/${id}`, {
        method: 'DELETE',
      })

      setTasks(tasks.filter((task) => task.id !== id))
    }

    // Add task
    const addtask = async (task) => {
      
        const res = await fetch ('https://my-json-server.typicode.com/yudhono/db.json/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        })
      

      const data = await res.json();

      setTasks([...tasks, data]);
      // const id = Math.floor(Math.random() * 10000) + 1;
      // const newTask = {id, ...task}
      // setTasks([...tasks, newTask])
    }

    // Toggle Reminder
    const toggleReminder = async (id) => {
      const taskToToggle = await fetchTask(id)
      const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

      const res = await fetch(`https://my-json-server.typicode.com/yudhono/db.json/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updTask),
      })

      const data = await res.json();

      setTasks(
        tasks.map((task) => 
                  task.id === id ? {...task, reminder: data.reminder} : task
                )
        )
    }

  return (
    <Router>
    <div className="container">
      <h1></h1>
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd = {showAddTask}/>
      
      <Route path='/' exact render = {(props) =>
        (
          <>
              {showAddTask && <AddTask onAdd = {addtask} />}
              {tasks.length > 0 ? 
                (<Tasks tasks={tasks} onDelete = {deleteTask} onToggle = {toggleReminder} />) 
                  : 
                ('No Tasks for today')
              }
          </>
        )
      } />
      <Route path='/about' component={About} />
      <Footer />
    </div>
    </Router>
  );
}

export default App;
