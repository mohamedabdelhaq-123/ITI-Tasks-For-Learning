import React from 'react'
import TaskItem from './TaskItem'

function TaskList({tasks,deleteTask,toggleTask}) { // loop through the whole array

  return (
    <div>
      {tasks.map((task)=>{
        return <TaskItem key={task.id} task={task} deleteTask={deleteTask} toggleTask={toggleTask} />
      } )}
    </div>
  )
}

export default TaskList
