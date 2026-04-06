# ⚛️ React To-Do App — My Learning Journal
> Built from scratch. Burned fingers. Learned deep.

---

## 🗺️ What We Built

```
App  ← 🧠 The Brain (owns all state)
├── TaskInput     ← 📝 Controlled input + Add button
├── TaskList      ← 📋 Loops through tasks
│   └── TaskItem  ← 🃏 One reusable task card (delete + toggle)
```

**Data Flow:**
```
App
 ├──[tasks, deleteTask, toggleTask]──► TaskList
 │                                        └──[task, deleteTask, toggleTask]──► TaskItem
 └──[addTask]──► TaskInput
                    └── addTask(text) ──────────────────────────────────────► App
```

---

## 💥 Pitfall #1 — `{}` vs `[]` in useState

```js
// ❌ WRONG — {} means object destructuring
const { input, setInput } = useState("")

// ✅ CORRECT — useState returns an ARRAY [value, setter]
const [input, setInput] = useState("")
```

> **Why?** `useState("")` returns `["", function]` — an array, not an object.

---

## 💥 Pitfall #2 — Mutating State Directly

```js
// ❌ WRONG — push() mutates the same array reference
Tasks.push(newTask)
setTasks(Tasks)  // React sees same ref → no re-render!

// ✅ CORRECT — spread creates a NEW array reference
setTasks([...tasks, newTask])  // React sees new ref → re-renders ✅
```

```
❌  [task1, task2]  ──push──►  [task1, task2, task3]   same reference
                                                          React: "nothing changed"

✅  [task1, task2]  ──spread──► [task1, task2, task3]  NEW reference
                                                          React: "update! re-render"
```

> **Rule:** Never use `push()`, `splice()`, or direct assignment on state arrays.

---

## 💥 Pitfall #3 — setState is Async (The Snapshot Problem)

```js
function addTask(text) {
  setTasks([...tasks, { id: Date.now(), text, completed: false }])
  console.log(tasks)  // ❌ Still shows OLD value!
}
```

```
You type "Buy milk" → click Add
         ↓
    setTasks() called  →  React schedules update
         ↓
    console.log(tasks) →  prints OLD array  ← you're here
         ↓
    React re-renders   →  NOW tasks is updated
```

**Fix — log what you're actually setting:**
```js
const newTask = { id: Date.now(), text, completed: false }
setTasks([...tasks, newTask])
console.log([...tasks, newTask])  // ✅ This is the real new state
```

> **Mental model:** `tasks` inside a function = a **snapshot** frozen at render time, not a live variable.

---

## 💥 Pitfall #4 — Calling Functions Immediately in onClick

```jsx
// ❌ WRONG — executes deleteTask() RIGHT NOW on render, not on click
<button onClick={deleteTask(task.id)}>Delete</button>

// ✅ CORRECT — wraps it, runs only on click
<button onClick={() => deleteTask(task.id)}>Delete</button>
```

```
❌  onClick={deleteTask(task.id)}   →  "Call deleteTask NOW"  (on every render!)
✅  onClick={() => deleteTask(task.id)}  →  "Give React a function to call LATER"
```

> **Rule:** If you need to pass arguments to an event handler → always wrap in `() =>`

---

## 💥 Pitfall #5 — toggleTask Mutation

```js
// ❌ WRONG — mutates the existing object directly
function toggleTask(id) {
  task.completed = !task.completed  // direct mutation!
}

// ✅ CORRECT — map() creates new array, spread creates new object
function toggleTask(id) {
  setTasks(tasks.map((task) => {
    if (task.id === id) return { ...task, completed: !task.completed }
    return task
  }))
}
```

```
tasks.map() →  loops every task
                 ├── id matches?  →  return NEW object { ...task, completed: flipped }
                 └── no match?   →  return same task unchanged
              →  returns brand NEW array ✅
```

---

## 💥 Pitfall #6 — Passing Functions Without Connecting Them

```jsx
// ❌ Disconnected — TaskList has no data, can't do anything
<TaskList />

// ✅ Connected — TaskList gets everything it needs
<TaskList tasks={tasks} deleteTask={deleteTask} toggleTask={toggleTask} />
```

> **Rule:** Every prop a component needs must be **explicitly passed**. React doesn't auto-wire anything.

---

## 🧠 New Concept #1 — Controlled Input

```jsx
// React OWNS the input value at all times
const [input, setInput] = useState("")

<input
  value={input}               // ← React controls what's shown
  onChange={(e) => setInput(e.target.value)}  // ← React updates on every keystroke
/>
```

```
User types "B"
     ↓
onChange fires → e.target.value = "B"
     ↓
setInput("B") called
     ↓
React re-renders → input shows "B"
```

| Angular | React |
|---------|-------|
| `[(ngModel)]="task"` (two-way) | `value={input}` + `onChange` (manual) |

---

## 🧠 New Concept #2 — Props: Down ↓ & Up ↑

```
          App
         /   \
   [addTask] [tasks]
       ↓         ↓
  TaskInput   TaskList
      ↑
  addTask("Buy milk")  ← child calls the function → data travels UP
```

```jsx
// Parent passes function DOWN as prop
<TaskInput sendToAppInputDataFunc={addTask} />

// Child receives and calls it → data goes UP
function TaskInput({ sendToAppInputDataFunc }) {
  function handler() {
    sendToAppInputDataFunc(input)  // 🚀 data travels up to App
  }
}
```

| Angular | React |
|---------|-------|
| `@Input()` | props (parent → child) |
| `@Output()` + EventEmitter | function passed as prop (child → parent) |

---

## 🧠 New Concept #3 — Rendering Lists with .map()

```jsx
// Manual (impossible if 100 tasks):
<TaskItem task={tasks[0]} ... />
<TaskItem task={tasks[1]} ... />
<TaskItem task={tasks[2]} ... />

// With .map() (scales to any size):
{tasks.map((task) => (
  <TaskItem key={task.id} task={task} deleteTask={deleteTask} toggleTask={toggleTask} />
))}
```

```
tasks array:  [taskA,  taskB,  taskC]
                 ↓       ↓       ↓
.map() returns: [<TaskItem/>, <TaskItem/>, <TaskItem/>]
                    ↓
              React renders them all 🎉
```

| Angular | React |
|---------|-------|
| `*ngFor="let task of tasks; trackBy: trackById"` | `tasks.map()` + `key={task.id}` |

---

## 🧠 New Concept #4 — The `key` Prop

```jsx
// ❌ No key — React gets confused, causes bugs + warning
tasks.map((task) => <TaskItem task={task} />)

// ✅ With key — React knows exactly which item changed
tasks.map((task) => <TaskItem key={task.id} task={task} />)
```

```
Without key:   React re-renders the ENTIRE list on every change 🐌
With key:      React re-renders ONLY the changed item 🚀
```

> **Analogy:** Same as a **primary key** in SQL — uniquely identifies each row.

---

## 🧠 New Concept #5 — Immutability (The Core Rule)

```
React's Golden Rule:
┌─────────────────────────────────────────────────────┐
│  NEVER modify state directly.                       │
│  ALWAYS create a new copy with the change in it.   │
└─────────────────────────────────────────────────────┘
```

| Operation | ❌ Mutation | ✅ Immutable |
|-----------|------------|-------------|
| Add item | `arr.push(x)` | `[...arr, x]` |
| Remove item | `arr.splice(i, 1)` | `arr.filter(item => item.id !== id)` |
| Update item | `item.prop = val` | `arr.map(item => item.id === id ? {...item, prop: val} : item)` |

---

## 📐 Final App Architecture

```jsx
// App.jsx — The Brain
const [tasks, setTasks] = useState([])

addTask(text)    →  setTasks([...tasks, { id: Date.now(), text, completed: false }])
deleteTask(id)   →  setTasks(tasks.filter(task => task.id !== id))
toggleTask(id)   →  setTasks(tasks.map(task =>
                       task.id === id ? { ...task, completed: !task.completed } : task
                    ))

return (
  <TaskInput sendToAppInputDataFunc={addTask} />
  <TaskList tasks={tasks} deleteTask={deleteTask} toggleTask={toggleTask} />
)
```

```jsx
// TaskList.jsx — The Repeater
function TaskList({ tasks, deleteTask, toggleTask }) {
  return tasks.map((task) => (
    <TaskItem key={task.id} task={task} deleteTask={deleteTask} toggleTask={toggleTask} />
  ))
}
```

```jsx
// TaskItem.jsx — The Card
function TaskItem({ task, deleteTask, toggleTask }) {
  return (
    <div>
      <p className={task.completed ? "line-through" : ""}>{task.text}</p>
      <button onClick={() => toggleTask(task.id)}>Complete</button>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  )
}
```

---

## 🎯 Quick Reference Cheatsheet

```
useState      →  [value, setValue] = useState(initialValue)
props down    →  <Child data={value} />
props up      →  <Child func={myFunction} />  then child calls func(data)
list render   →  array.map((item) => <Component key={item.id} ... />)
delete        →  filter((item) => item.id !== id)
update field  →  map((item) => item.id === id ? {...item, field: newVal} : item)
conditional   →  className={condition ? "class-a" : "class-b"}
event handler →  onClick={() => myFunc(args)}  ← always wrap with () => if passing args
```

---

## 🚀 Your Next Challenge

> **Add an Edit feature** — allow editing a task's text after creation.

Think through:
1. Which component needs an "edit mode" state?
2. How does the edited text travel back to `App`?
3. What new function does `App` need?

*You know everything you need to solve this. Go build it.*

---
*Built with React + Vite · Styled with Tailwind CDN · Learned the hard way 💪*
