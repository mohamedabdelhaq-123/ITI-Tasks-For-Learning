# React State Management — My Study Notes 📻
### From useState to useReducer to Context API to Redux

> *Understanding the data flow is more important than memorizing syntax. Every tool here exists because the previous one had a pain point. Learn the pain first, then the solution clicks.*

---

## Table of Contents

1. [The Problem — Why State Management Exists](#1-the-problem)
2. [useState — The Starting Point](#2-usestate)
3. [The Prop Drilling Problem](#3-the-prop-drilling-problem)
4. [Context API — The Station](#4-context-api)
5. [useReducer — The Bank Teller](#5-usereducer)
6. [useReducer Best Practices](#6-usereducer-best-practices)
7. [Why Not Just Mix Context API + useReducer?](#7-why-not-the-mix)
8. [Redux — The Full System](#8-redux)
9. [The Full Thread — How Everything Connects](#9-the-full-thread)
10. [When To Use What](#10-when-to-use-what)

---

## 1. The Problem

Imagine you have a React app with many components — a Navbar, ProductCard, Footer, and more. Some of these components need to share the same data, like whether the user is logged in or how many items are in a cart.

The naive approach is to pass data from parent → child → grandchild through props. This gets messy fast. That messiness has a name: **prop drilling**.

Every tool in this guide exists to solve a version of this problem. Each one is better than the previous in a specific situation. Understanding *why* each exists makes everything else click.

---

## 2. useState — The Starting Point

`useState` is the most basic way to hold data in a React component.

```jsx
const [theme, setTheme] = useState('light');
```

It returns two things: the current value and a setter function to change it. Simple, clean, works great for independent values.

### When useState starts hurting

The pain appears when you have **related states that must always move together**:

```jsx
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const addItem = (product) => {
    setItems(prev => [...prev, product]);
    setTotalPrice(prev => prev + product.price);  // must update manually
    setTotalItems(prev => prev + 1);              // must update manually
  };

  const removeItem = (product) => {
    setItems(prev => prev.filter(i => i.id !== product.id));
    setTotalPrice(prev => prev - product.price);  // must update manually
    setTotalItems(prev => prev - 1);              // must update manually
  };

  const clearCart = () => {
    setItems([]);
    setTotalPrice(0);   // must update manually
    setTotalItems(0);   // must update manually
  };
}
```

Every operation — add, remove, clear — has to remember to update `totalPrice` AND `totalItems` manually. If a new developer adds a new operation and forgets one update? **Silent bug. Wrong data. No warning from React.**

> ⚠️ React batches all `useState` calls inside one event handler into a **single re-render** — so calling 3 setters doesn't cause 3 re-renders. The real problem here is not performance, it's **forgotten updates causing wrong data.**

This is exactly the pain `useReducer` was built to solve. But first — the other problem with `useState`: it's **local**. It lives inside one component. What if another component far away in the tree needs that same data?

That's the prop drilling problem.

---

## 3. The Prop Drilling Problem

```
App
 └── Navbar         ← needs: isLoggedIn
      └── UserMenu  ← needs: isLoggedIn
           └── Avatar ← needs: isLoggedIn
```

To get `isLoggedIn` to `Avatar`, you'd pass it as a prop through `Navbar` → `UserMenu` → `Avatar` — even though `Navbar` and `UserMenu` don't use it at all. They're just middlemen.

This is **prop drilling**. It's not a bug — it works — but it becomes messy and hard to maintain as the app grows. Adding a new prop means touching every layer in between.

**Context API solves this.** Instead of passing through the chain, you store the data in a central place and let any component access it directly.

---

## 4. Context API — The Station 📻

### The Idea

Context API lets you create a **central station** that holds data. Any component in the whole app can tune in directly — no middlemen, no prop chains.

Three players run the whole system:

| Player | Tool | Role |
|---|---|---|
| The Station | `createContext()` | Creates the empty channel — no data yet, just an identity |
| The Broadcaster | `<Context.Provider>` | Fills the station with real data, wraps the app |
| The Radio | `useContext()` | Any child that tunes in and receives the data |

### What Context API is NOT

> ❌ Context API is **not** a performance tool. It's about **clean, maintainable code**.
> It can actually cause *more* re-renders if misused — if the context value changes, every component using `useContext` re-renders, even if it only uses a part of the data that didn't change.

---

### Step 1 — Create the Station

`createContext()` creates the empty channel. No data yet — just an identity. Like buying a SIM card: it exists, but has no signal yet.

```jsx
// station.js
import { createContext } from 'react';

// The empty station — no data yet, just an identity
export const Station = createContext();
```

> 💡 Create it **outside any component** so it stays stable across re-renders. Export it so the Broadcaster and Radios can import it.

The optional argument `createContext(null)` sets a default value — only used when a component tries to read context without being wrapped in a Provider.

---

### Step 2 — Build the Broadcaster

The Broadcaster is a wrapper component that fills the station with real data. The data lives inside `useState` — which holds both the current value AND the setter. Both get passed through the `value` prop so any Radio can read OR change the data.

```jsx
// station.js (continued)
import { createContext, useState } from 'react';

export const Station = createContext();

export function Broadcaster({ children }) {
  // The real data lives here — both data and setter
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    // value = what gets broadcast to all Radios
    // pass BOTH data AND setter so any Radio can read OR change
    <Station.Provider value={{ theme, toggleTheme }}>
      {children} {/* every component inside here is under the umbrella */}
    </Station.Provider>
  );
}
```

> 💡 The double curly braces `{{ }}` — the outer `{}` tells JSX "this is JavaScript", the inner `{}` creates a JavaScript object.

> 💡 **Analogy:** The Broadcaster is an umbrella. Any component standing under it (`children`) can access the shared data. Anything outside the umbrella is in the dark.

---

### Step 3 — Wrap the Whole App

```jsx
// main.jsx
import { Broadcaster } from './station';

createRoot(document.getElementById('root')).render(
  <Broadcaster>
    <App /> {/* every child and sub-child is now under the umbrella */}
  </Broadcaster>
);
```

By wrapping `<App />`, every single component in your app can access the station.

---

### Step 4 — The Radio (Consuming the Context)

Any component that needs the data calls `useContext` to tune in:

```jsx
// ThemeButton.jsx
import { useContext } from 'react';
import { Station } from './station';

function Radio() {
  // Tune in to the station — destructure only what you need
  const { theme, toggleTheme } = useContext(Station);

  // This Radio can BOTH read the data (theme) AND change it (toggleTheme)
  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'dark' ? '#222' : '#fff',
        color: theme === 'dark' ? '#fff' : '#222',
      }}
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
```

> ⚠️ **Common pitfall:** If you forget to wrap the component in a Provider, `useContext` returns the default value from `createContext()` — usually `null`. This causes "Cannot read property of null" errors.

---

### The Chain Reaction

```
Radio calls toggleTheme()
        ↓
setTheme() runs → useState in Broadcaster updates
        ↓
Broadcaster re-renders with new value
        ↓
Every Radio (useContext) re-renders automatically ✅
```

---

### The 4 Setup Steps — Summary

1. `createContext()` — build the empty station (outside any component)
2. Build the Broadcaster — `useState` lives here, both data + setter go into `value`
3. Wrap `<App />` with the Broadcaster in `main.jsx`
4. Call `useContext(Station)` inside any Radio that needs to tune in

---

### The One Sentence

> *Create the station, fill it with live data in the Broadcaster, wrap the app, and any Radio can tune in — read or change the data freely.*

---

## 5. useReducer — The Bank Teller 🏦

### Why It Exists

Remember the shopping cart pain from `useState`? Related states forced you to update each one manually in every operation. Forget one — silent bug.

`useReducer` solves this by giving you **one combined state object** and **one teller function** that handles all operations in one place. Nothing can be forgotten because everything lives together.

---

### The Three Players

| Player | What it is | Role |
|---|---|---|
| `initialState` | Plain object | The starting balance of the safe |
| `reducer` | Plain function | The bank teller — receives action, returns new state |
| `dispatch` | Function from React | You use it to tell the teller what you want done |

---

### The Reducer — The Teller's Rulebook

The reducer always has the same shape — two arguments in, new state out:

```jsx
function reducer(currentState, action) {
  switch (action.type) {

    case 'ADD_ITEM':
      return {
        items: [...currentState.items, action.payload],
        totalPrice: currentState.totalPrice + action.payload.price,
        totalItems: currentState.totalItems + 1,
      };

    case 'REMOVE_ITEM':
      return {
        items: currentState.items.filter(item => item.id !== action.payload.id),
        totalPrice: currentState.totalPrice - action.payload.price,
        totalItems: currentState.totalItems - 1,
      };

    case 'CLEAR_CART':
      return {
        items: [],
        totalPrice: 0,
        totalItems: 0,
      };

    default:
      return currentState; // unknown action? return state unchanged — never return undefined
  }
}
```

---

### The Action — What You Send via Dispatch

The action is a plain object with two things:
- `type` — what you want to do (`'ADD_ITEM'`, `'CLEAR_CART'`)
- `payload` — the data needed to do it (the product, the id, etc.)

```jsx
dispatch({ type: 'ADD_ITEM', payload: product });
// no payload needed when there's no data required
dispatch({ type: 'CLEAR_CART' });
```

---

### Who Passes the Arguments to the Reducer?

**You don't. React does.**

When you call `useReducer(reducer, initialState)`, you're telling React:
> *"Here's my teller and here's the starting balance. You manage it from now on."*

React holds the current state internally. When you call `dispatch`, React intercepts it and does:

```jsx
// React does this behind the scenes — you never write this yourself
reducer(currentState, { type: 'ADD_ITEM', payload: product });
```

> **You own the reducer function. React owns the calling of it.**

---

### The Full Shopping Cart with useReducer

```jsx
import { useReducer } from 'react';

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};

function reducer(currentState, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [...currentState.items, action.payload],
        totalPrice: currentState.totalPrice + action.payload.price,
        totalItems: currentState.totalItems + 1,
      };
    case 'REMOVE_ITEM':
      return {
        items: currentState.items.filter(item => item.id !== action.payload.id),
        totalPrice: currentState.totalPrice - action.payload.price,
        totalItems: currentState.totalItems - 1,
      };
    case 'CLEAR_CART':
      return { items: [], totalPrice: 0, totalItems: 0 };
    default:
      return currentState;
  }
}

function ShoppingCart() {
  const [cart, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h2>Total Items: {cart.totalItems}</h2>
      <h2>Total Price: ${cart.totalPrice}</h2>

      {cart.items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item })}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Book', price: 20 } })}>
        Add Book
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear Cart</button>
    </div>
  );
}
```

---

### The Chain Reaction

```
User clicks button
        ↓
dispatch({ type, payload }) is called
        ↓
React passes currentState + action into reducer
        ↓
Reducer returns brand new state object
        ↓
React re-renders with new state ✅
```

---

### The 4 Setup Steps — Summary

1. Define `initialState` — all related values combined in one object
2. Write the `reducer` — one function, one switch, every operation in one place
3. Call `useReducer(reducer, initialState)` — hand React your teller and starting balance
4. Use `dispatch` in your component — describe what you want, React + reducer handle the rest

---

### The One Sentence

> *When states are related and must move together, stop managing them separately — combine them in one object, write one teller that handles all operations, and dispatch actions instead of setting values directly.*

---

## 6. useReducer Best Practices

### 1. Never Mutate — Always Return a New Object

React compares state by **reference**. Same object reference = React thinks nothing changed = no re-render. Silent bug, stale UI.

```jsx
// ❌ dangerous — same reference, React won't re-render
case 'ADD_ITEM':
  currentState.items.push(action.payload);
  return currentState;

// ✅ correct — brand new object, React detects the change
case 'ADD_ITEM':
  return {
    ...currentState,
    items: [...currentState.items, action.payload],
  };
```

### 2. Always Have a Default Case

Without it, an unknown action returns `undefined` and your whole state is gone 💀

```jsx
default:
  return currentState;
```

### 3. Keep the Reducer Pure

A pure function means: same input always gives same output, no side effects. Never do these inside a reducer:

```jsx
// ❌ wrong — side effects inside reducer
case 'ADD_ITEM':
  fetch('/api/cart', ...);   // no API calls
  Math.random();             // no randomness
  Date.now();                // no timestamps
  setTimeout(() => {}, 0);  // no timers
```

Do those things **before** calling `dispatch`, inside your component.

### 4. Keep Payload Minimal

Only send the data the reducer actually needs:

```jsx
// ❌ messy — too much unnecessary data
dispatch({ type: 'REMOVE_ITEM', payload: { item, index, timestamp, user } });

// ✅ clean — just what the reducer needs
dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id, price: item.price } });
```

### 5. Use Action Type Constants — Avoid Typo Bugs

```jsx
// ❌ risky — a typo silently breaks everything, no error thrown
dispatch({ type: 'ADD_ITEN' }); // typo!

// ✅ safe — a typo in a constant throws a real error immediately
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
};

dispatch({ type: ACTIONS.ADD_ITEM, payload: product });
```

---

### The One Sentence

> *The reducer is a pure, predictable teller — give it the same situation and the same action, it always makes the same decision. No surprises, no side effects, no mutations.*

---

## 7. Why Not Just Mix Context API + useReducer?

You actually **can** mix them — and many real apps do. It's a legitimate pattern:

```jsx
// Context API carries the state globally
// useReducer manages the state cleanly
const [cart, dispatch] = useReducer(reducer, initialState);

return (
  <Station.Provider value={{ cart, dispatch }}>
    {children}
  </Station.Provider>
);
```

Any Radio can now dispatch actions AND read the combined state. Clean, works well for small-medium apps.

### So Why Does Redux Exist?

The mix starts hurting when your app grows. Imagine 10 features — 10 contexts, 10 reducers, scattered across 10 files. Two real problems appear:

**Problem 1 — Debugging becomes blind:**
Something breaks. A wrong action gets dispatched somewhere. You have to open 10 files, read through 10 reducers, and trace which dispatch in which component triggered which reducer. Manually. With no tools helping.

**Problem 2 — No structure:**
Every developer on your team manages their slice differently. No enforced pattern, no predictability.

Redux solves both with:
- **One single store** — instead of 10 scattered stations
- **Redux DevTools** — a browser panel showing every action dispatched in order, the state before and after each one, and **time travel** to replay bugs

> *Context API + useReducer works. Redux is for when "works" isn't enough and you need visibility, structure, and control.*

---

## 8. Redux — The Full System 🏪

### The 4 Players

| Player | Tool | Role |
|---|---|---|
| The Station | `configureStore()` | One single store for the whole app |
| The Slice | `createSlice()` | Independent block owning one feature's state + reducer + actions |
| The Broadcaster | `<Provider store={store}>` | Wraps the app, carries the store to every component |
| The Radio | `useSelector` / `useDispatch` | Components read and dispatch from anywhere |

---

### The Store — One Station, All Features

The store is the one central station for the whole app. But it doesn't magically know about your features. Each feature's reducer must be **registered** into the store.

Think of it like this: the store receives `dispatch({ type: 'cart/addItem' })` — without registration, nobody is home to handle it.

```jsx
// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,   // cart section → handled by cartReducer
    auth: authReducer,   // auth section → handled by authReducer
  }
});

export default store;
```

---

### The Slice — The Independent Block

> **A slice is one independent block that contains a reducer handling specific actions for a specific feature.**

Like slices of one pizza — one pizza (store), multiple slices (features). Each slice owns its feature's initialState, reducer functions, and auto-generated actions. All in one file.

Redux Toolkit's `createSlice()` bundles everything together:

```jsx
// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',          // auto-generates action types like 'cart/addItem'
  
  initialState: {
    items: [],
    totalPrice: 0,
    totalItems: 0,
  },

  reducers: {
    // one function per action — no switch needed, createSlice builds it internally
    // Immer is built in — write mutation style, it safely returns a new object ✅

    addItem: (state, action) => {
      state.items.push(action.payload);
      state.totalPrice += action.payload.price;
      state.totalItems += 1;
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      state.totalPrice -= action.payload.price;
      state.totalItems -= 1;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    },
  }
});

// export actions → goes OUT to components so they can dispatch
export const { addItem, removeItem, clearCart } = cartSlice.actions;

// export reducer → goes UP to the store so it knows who handles cart actions
export default cartSlice.reducer;
```

**Two exports, two directions:**
- `cartSlice.actions` → components use these with `dispatch`
- `cartSlice.reducer` → the store registers this to know who handles cart actions

---

### What is Immer?

You know that mutating state directly is dangerous — React won't detect the change because the reference stays the same.

But spread operators get ugly fast with nested objects:

```jsx
// ✅ correct but ugly
return {
  ...currentState,
  nested: {
    ...currentState.nested,
    deep: { ...currentState.nested.deep, value: 'updated' }
  }
};
```

**Immer lets you write mutation-style code while secretly returning a brand new object.**

```jsx
// you write this — looks dangerous
state.items.push(action.payload);

// Immer secretly does this — safe ✅
return { ...state, items: [...state.items, action.payload] };
```

React sees a new reference → detects the change → re-renders. You get clean code AND correct behaviour.

> ⚠️ Immer only works inside `createSlice` reducer functions. Never write mutation-style code in regular `useState` or outside a slice.

---

### How Dispatch Works in Redux

Dispatch works the same way you already know from `useReducer` — you send an action, Redux figures out which slice handles it:

```
dispatch({ type: 'cart/addItem', payload: product })
        ↓
    whole store receives it
        ↓
cart slice reducer   → recognizes 'cart/addItem' → updates ✅
auth slice reducer   → doesn't recognize it → returns unchanged
```

The `cart/` prefix in the action type is auto-generated from the slice's `name` field — that's how Redux routes the action to the right slice.

---

### The Broadcaster — Same Idea as Context API

```jsx
// main.jsx
import { Provider } from 'react-redux';
import store from './store';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

Same umbrella pattern as Context API — but now carrying the whole Redux store instead of a single context value.

---

### The Radio — Reading and Dispatching in Components

Two hooks replace `useContext`:

| Hook | Role | Analogy |
|---|---|---|
| `useSelector` | Read data from the store | Eyes — watching the store |
| `useDispatch` | Send actions to the store | Hands — pressing the button |

```jsx
// ShoppingCart.jsx
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart } from './cartSlice';

function ShoppingCart() {
  // state.cart → matches the key registered in configureStore
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Total Items: {cart.totalItems}</h2>
      <h2>Total Price: ${cart.totalPrice}</h2>

      {cart.items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => dispatch(removeItem({ id: item.id, price: item.price }))}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={() => dispatch(addItem({ id: 1, name: 'Book', price: 20 }))}>
        Add Book
      </button>
      <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
    </div>
  );
}
```

---

### The Full Chain Reaction

```
User clicks "Add Book"
        ↓
dispatch(addItem({ id: 1, name: 'Book', price: 20 }))
        ↓
Store receives action 'cart/addItem'
        ↓
Store finds cartReducer is registered for 'cart/*' actions
        ↓
Immer creates draft, addItem runs, new state object returned
        ↓
Store updates to new state
        ↓
useSelector detects the change → component re-renders ✅
```

---

### The 5 Setup Steps — Summary

1. `createSlice()` — define name, initialState, and reducer functions for one feature
2. Export `cartSlice.actions` (for components) and `cartSlice.reducer` (for the store)
3. `configureStore()` — register all slice reducers into one store
4. Wrap `<App />` with `<Provider store={store}>` in `main.jsx`
5. Use `useSelector` to read and `useDispatch` to dispatch in any component

---

### The One Sentence

> *One station for the whole app, organized into independent slices — each owning its feature's state and teller — with every component able to read or dispatch from anywhere, and full visibility into every action that ever fired.*

---

## 9. The Full Thread — How Everything Connects

This is not four separate tools. It's one evolving solution to one evolving problem:

```
useState
  → Simple, works great for independent values
  → Pain: related states must be updated manually → silent bugs
        ↓
useReducer
  → Combines related states into one object
  → One teller (reducer) handles all operations together
  → Pain: state is still local to one component
        ↓
Context API
  → Creates a central station any component can tune into
  → Broadcaster wraps the app, Radios read and update freely
  → Pain: at scale — 10 contexts, 10 reducers, debugging is blind
        ↓
Redux
  → Merges useReducer + Context API into one structured system
  → One store, organized into slices, full DevTools visibility
  → The final form ✅
```

---

## 10. When To Use What

| Situation | Use |
|---|---|
| Simple, independent value in one component | `useState` |
| Related states that must update together | `useReducer` |
| Sharing data across a few components | Context API |
| Themes, auth status, language settings | Context API |
| Complex app with many features sharing state | Redux |
| Need time-travel debugging | Redux |
| Team project needing enforced structure | Redux |

### The Simple Rule

- **Context API** — when you need to share data across components (theme, user info, language)
- **Redux** — when many parts of your app change the same data, or when you need predictable, debuggable state management at scale

---

*Happy coding. The mental model is everything — once station → broadcaster → radio clicks, once teller → dispatch → action clicks, the syntax is just details.*