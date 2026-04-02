
import { useState } from 'react'

function TaskInput({sendToAppInputDataFunc}) {

    const [input,setInput] =useState(""); // value, function to udpate it

    function doChange(e){
        setInput(e.target.value); // when onchange is fired => doChange is called=> setinput takes the data => react re-render the component to show updated state 
        // console.log(e.target.value);
    }

    function handler(){ // data is sent as text
        sendToAppInputDataFunc(input); // prop is a function passed to child (Prop [Parent->Child]), to let data transfer from child to parent
        setInput("");
    }

  return (
    <div className="flex gap-2 mb-6">
      <input 
        type="text" 
        value={input} 
        onChange={doChange}
        placeholder="Add a new task..."
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <button 
        onClick={handler}
        className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Add TODO
      </button>
    </div>
  )
}

export default TaskInput
