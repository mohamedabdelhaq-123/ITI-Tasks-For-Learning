import React from 'react'

function TaskItem({ task, deleteTask, toggleTask }) { // display each task independently
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200">
      
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => toggleTask(task.id)}
          className="cursor-pointer"
        />
        <p className={task.completed ? "line-through text-gray-400" : "text-gray-800"}>
          {task.text}
        </p>
      </div>

      <button 
        onClick={() => deleteTask(task.id)}
        className="text-red-500 hover:text-red-700 font-medium text-sm"
      >
        Delete
      </button>
      
    </div>
  )
}

export default TaskItem