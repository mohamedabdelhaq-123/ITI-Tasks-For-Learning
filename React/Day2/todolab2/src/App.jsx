import React, { useState } from 'react'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList';

// const Tasks= []

function App() {

  const [tasks,setTasks] = useState([]); // insted of Tasks 

  function addTask(recivedText){
    // Tasks.push(task); => won't work bec same ref. so need to use usestate
    const newTask = [...tasks,{ id: Date.now(), text: recivedText, completed: false }]; 
    setTasks(newTask);
    // console.log(tasks); // usestate is async so updates won't be seen imediatly.
    // therefore(tasks=> inside any function => snapshot not live var)
    console.log([...tasks,newTask]); // this is the new state will be
  } // clone the past tasks and add new one to them

  function deleteTask(id){
    setTasks(tasks.filter((task)=> task.id!==id));
  } // filter and settasks that are filtered in the state array

  function toggleTask(id){
    setTasks(tasks.map((task)=> {
      if(task.id===id) return {...task,completed: !task.completed}; // ret new obj. with updated val. 
        return task;
    }))
  }

  return (
    <div>
      <TaskInput  sendToAppInputDataFunc={addTask}/>
      <TaskList tasks={tasks} deleteTask={deleteTask} toggleTask={toggleTask} />
    </div>
  )
}

export default App



// 
// useState → stores and watches data
// Props → parent to child data flow
// Functions as props → child to parent data flow
// .map() → rendering lists in JSX
// key → helps React track list items
// Controlled inputs → React owns the input value
// Immutability → never mutate state directly

