# ⚛️ React Learning — Session 5 Deep Notes
### Forms, Custom Hooks, Code Splitting, React Query & Environment Variables


---

## 📚 Table of Contents

1. [Forms in React — The Three Tiers](#1-forms-in-react--the-three-tiers)
2. [Native Form Handling — Controlled Inputs](#2-native-form-handling--controlled-inputs)
3. [Form Validation — Writing Your Own Rules](#3-form-validation--writing-your-own-rules)
4. [Third-Party Form Libraries — When Native Isn't Enough](#4-third-party-form-libraries--when-native-isnt-enough)
5. [Code Splitting — Stop Shipping Everything At Once](#5-code-splitting--stop-shipping-everything-at-once)
6. [Custom Hooks — Extract, Reuse, Simplify](#6-custom-hooks--extract-reuse-simplify)
7. [React Query — Server State, Solved](#7-react-query--server-state-solved)
8. [React Query DevTools — See Everything](#8-react-query-devtools--see-everything)
9. [Environment Variables in Vite](#9-environment-variables-in-vite)
10. [Quick Reference — All Traps & Memory Hooks](#10-quick-reference--all-traps--memory-hooks)
11. [🗺️ Master Summary Flow — Session 5](#11-️-master-summary-flow--session-5)


---

## 1. Forms in React — The Three Tiers

### ⚡ Core Idea
React gives you three levels of form handling, each more powerful than the last. You pick the tier based on how complex your form needs are — and you never use a bazooka to kill a fly.

### 🎯 Problem It Solves
Forms are the primary way users send data to your app. Getting them right means handling: input state, validation rules, error messages, submission, and server feedback — all without your component collapsing into spaghetti.

### The Three Tiers at a Glance

| Tier | Tool | Use When |
|---|---|---|
| **1 — Native** | `useState` + `onSubmit` | Simple forms, 2–5 fields, learning projects |
| **2 — Native + Validation** | `useState` + custom validation logic | Medium complexity, need specific error rules |
| **3 — Library** | Formik + Yup / React Hook Form + Zod | Complex forms, shared validation schema, team projects |

> 🧠 **Memory Hook:** Tier 1 = you do everything. Tier 3 = the library does everything. Pick your tax.

---

## 2. Native Form Handling — Controlled Inputs

### ⚡ Core Idea
A **controlled input** is an input whose value is fully driven by React state — not by the DOM. You own the value; the DOM is just the display.

### 🎯 Problem It Solves
Without controlled inputs, the form data lives in the DOM, not in React. You can't validate it on the fly, can't reset it programmatically, and can't pre-fill it from an API. Controlled inputs give React full ownership of the form data at all times.

### ⏳ Before → After

| | Uncontrolled (DOM owns data) | Controlled (React owns data) |
|---|---|---|
| **How to read value** | `document.getElementById('email').value` | `formData.email` — already in state |
| **How to reset** | Manually clear each DOM element | `setFormData(initialState)` — one line |
| **Validation timing** | Only on submit, awkward | Any time — on change, on blur, or on submit |
| **Pre-fill from API** | Painful | `setFormData(apiResponse)` — instant |

---

### The Controlled Input Pattern

```jsx
import { useState } from 'react';

const LoginForm = () => {
  // One object holds ALL form fields — avoids 5 separate useState calls
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ONE generic handler for ALL inputs — uses e.target.name to know which field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,        // ← spread first: keep all other fields intact
      [name]: value,  // ← [name] is a computed key: updates only the changed field
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ← CRITICAL: prevents the default HTML page reload
    console.log("Submitted:", formData);
    // send formData to your API here
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"           // ← name must match the key in formData
        value={formData.email} // ← value comes FROM state (controlled)
        onChange={handleChange} // ← every keystroke updates state
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### Why `e.preventDefault()` Is Non-Negotiable

```jsx
const handleSubmit = (e) => {
  // ❌ If you forget this, the browser reloads the page on submit.
  // All your React state is wiped. Your SPA (Single Page App) ceases to be one.

  e.preventDefault(); // ✅ Stops the browser. React takes over from here.

  // Now you control what happens: validate, call API, redirect, etc.
};
```

### The `name` Attribute Is the Bridge

```jsx
// The name attribute on the input MUST match the key in your state object.
// That's how the single handleChange knows which field to update.

// State key:     "email"
// Input name:    name="email"   ← must match
// Computed key:  [e.target.name] = [e.target.name] → resolves to "email"

// If they don't match — silent bug. The field never updates.
```

> 💡 **Why controlled inputs:** React's reconciler needs to own the value to diff and update the virtual DOM correctly. Reading values from the DOM directly (via `document.getElementById` or an uncontrolled ref) bypasses React's render cycle — conditional rendering, pre-filling from an API, and instant validation all break because React doesn't know the value has changed.

### Angular vs React — Controlled Inputs

| | Angular | React |
|---|---|---|
| **Two-way binding** | `[(ngModel)]="field"` | `value={field} onChange={e => setField(e.target.value)}` |
| **Form submission** | `(ngSubmit)="onSubmit()"` | `onSubmit={handleSubmit}` on the `<form>` tag |
| **Prevent default** | Angular handles it automatically via `(ngSubmit)` | `e.preventDefault()` called manually inside the handler |
| **Disable button** | `[disabled]="form.invalid"` | `disabled={!isValid}` — computed from your state |
| **Read field value** | `this.form.get('email').value` | `formData.email` — already in React state |

> ⚠️ **Trap:** Forgetting `name=""` on an input. The `handleChange` function uses `e.target.name` to figure out which state key to update. Without `name`, `e.target.name` is an empty string and no field gets updated — no error, just a frozen input.

> ⚠️ **Trap:** Mutating state directly: `formData.email = "test"`. This changes the data but React never knows, so the UI never updates. Always use the setter with the spread pattern.

> 🧠 **Memory Hook:** The `name` attribute is the bridge between your input and your state object. No bridge = no update.

---

## 3. Form Validation — Writing Your Own Rules

### ⚡ Core Idea
Validation is just a function that takes your `formData` and returns an **errors object** — one key per field, one message per rule broken. Empty errors object = form is valid.

### 🎯 Problem It Solves
Without validation, a user can submit empty fields, wrong email formats, or a password of "1". Validation catches those problems before they reach your server, and shows the user exactly what to fix.

### The Validation Function Pattern

```jsx
// A pure function: takes the data, returns the problems
const validate = (data) => {
  const errors = {};

  // Email: required + format
  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    // ↑ regex: must have something @ something . something
    errors.email = "Please enter a valid email address.";
  }

  // Name: required
  if (!data.name.trim()) {
    errors.name = "Name is required.";
  }

  // Username: required + no spaces
  if (!data.username) {
    errors.username = "Username is required.";
  } else if (/\s/.test(data.username)) {
    // ↑ regex: \s matches any whitespace character
    errors.username = "Username cannot contain spaces.";
  }

  // Password: required + min 8 chars + at least one uppercase
  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(data.password)) {
    // ↑ regex: [A-Z] checks if any uppercase letter exists
    errors.password = "Password must contain at least one uppercase letter.";
  }

  // Confirm password: must match
  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors; // empty = valid, has keys = invalid
};
```

### Wiring Validation to the Form

```jsx
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "", name: "", username: "", password: "", confirmPassword: "",
  });

  // Errors live in state so the UI can display them reactively
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors); // push errors into state → triggers re-render

    // Only proceed if there are zero errors
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid — proceed to API call");
      // navigate('/home'); or call your API
    }
    // If there ARE errors — the re-render shows them. Done.
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      {/* ↓ Only render the error message if it exists */}
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

      <button type="submit">Register</button>
    </form>
  );
};
```

### The Regex Cheat Sheet for Common Validations

| Rule | Regex | What It Checks |
|---|---|---|
| Valid email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | Has `@` and a `.` in the right places |
| Has uppercase | `/[A-Z]/` | At least one capital letter exists |
| Has no spaces | `/\s/` | Any whitespace character (space, tab, newline) |
| Min length | `str.length >= 8` | No regex needed — just a comparison |
| Passwords match | `str1 === str2` | No regex needed — strict equality |

> 💡 **Validate-on-blur UX pattern:** Validating on every keystroke (`onChange`) shows errors before the user has finished typing — noisy and frustrating. Validating only on submit is too late and forces the user to scroll back up to find problems. Validating on blur (when the user leaves the field) is the sweet spot — it fires after the user is done with a field, not while they're still in it.

### Angular vs React — Form Validation

| | Angular | React |
|---|---|---|
| **Validation setup** | Built-in `Validators` in `ReactiveFormsModule` | Manual `validate()` function — you write the rules |
| **Required rule** | `Validators.required` | `if (!data.field)` check inside validate function |
| **Email rule** | `Validators.email` | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)` regex |
| **Min length rule** | `Validators.minLength(8)` | `value.length < 8` comparison |
| **Errors object** | `formControl.errors` — populated automatically | `errors` state object — built manually in validate() |
| **Touched state** | `formControl.touched` — tracked automatically | Manual `touched` state or show all errors on submit |

> ⚠️ **Trap:** Checking `if (errors)` instead of `if (Object.keys(errors).length === 0)`. An empty object `{}` is **truthy** in JavaScript — `if ({})` evaluates to `true`. Always check the number of keys, not the object itself.

> ⚠️ **Trap:** Showing all errors only on submit but your `errors` state resets when the user starts typing (because you call `setErrors({})` on every change). Keep errors visible until the user fixes them — re-validate in `handleChange` if needed, or only clear individual field errors when that field changes.

> 🧠 **Memory Hook:** Validation = a function that maps data → problems. Empty problems = go. Has problems = show and stop.

---

## 4. Third-Party Form Libraries — When Native Isn't Enough

### ⚡ Core Idea
Native forms work well up to a point. When forms get large (10+ fields), require complex cross-field validation, need async server-side checks, or are shared across a big team, you reach for a library. Two are industry standard: **Formik + Yup** and **React Hook Form + Zod**.

### 🎯 Problem It Solves
Native forms force you to write the same boilerplate for every project: a state object, a generic change handler, a validation function, error wiring, touched states. Libraries absorb all of that so you focus on *what* to validate, not *how* to plumb it.

### The Two Industry-Standard Pairs

| | **Formik + Yup** | **React Hook Form + Zod** |
|---|---|---|
| **Philosophy** | Controlled inputs — React owns everything | Uncontrolled inputs — DOM owns values, refs used |
| **Re-renders** | Re-renders on every keystroke | Minimal re-renders (huge performance edge) |
| **Validation** | Yup schema — declarative, readable | Zod schema — TypeScript-first, type inference |
| **Best for** | Beginners, straightforward forms | Production apps, performance-critical, TypeScript |
| **Docs** | [formik.org](https://formik.org) | [react-hook-form.com](https://react-hook-form.com) |

### What a Yup Validation Schema Looks Like

```jsx
import * as Yup from 'yup';

// You describe the RULES — Formik runs them for you automatically
const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Must be a valid email"),            // ← built-in format check

  password: Yup.string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Must contain an uppercase letter"),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref('password')], "Passwords must match"), // ← cross-field rule
});
// Notice: no if/else, no regex written by hand, no errors object built manually
```

### What a Zod Schema Looks Like (React Hook Form)

```jsx
import { z } from 'zod';

const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "At least 8 characters"),
  username: z.string().regex(/^\S+$/, "No spaces allowed"), // \S+ = no whitespace
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

// TypeScript bonus: z.infer<typeof schema> gives you the form's type for free
```

> 💡 **React vs Angular approach to forms infrastructure:** Angular ships form infrastructure as a first-party module — you never install a third party to build complex forms. React intentionally leaves this to the ecosystem, which means more choice but also more decisions. In a team project, agree on one library upfront to avoid mixing patterns.

### Angular vs React — Third-Party Form Libraries

| | Angular | React |
|---|---|---|
| **Forms infrastructure** | Built into the framework — `ReactiveFormsModule` ships with Angular | Not built-in — choose Formik, React Hook Form, or native |
| **Form group** | `FormBuilder.group({ email: ['', Validators.required] })` | `useForm()` from RHF or `useFormik()` from Formik |
| **Validation schema** | `Validators.compose([...])` inline in FormGroup | Separate Yup or Zod schema object |
| **Error access** | `form.get('email').errors` | `errors.email` from `formState.errors` (RHF) or Formik |
| **Submit handler** | `(ngSubmit)` + check `form.valid` | `handleSubmit(onSubmit)` wraps your handler automatically |

> 💡 **Which one to learn first?** Start with native forms (Sections 2–3) until you feel the pain. Then move to React Hook Form + Zod — it's the modern industry default and has significantly better performance at scale.

> 🧠 **Memory Hook:** Libraries = you describe the rules in a schema. The library wires them to the form. You write *what*, they handle *how*.

---

## 5. Code Splitting — Stop Shipping Everything At Once

### ⚡ Core Idea
By default, Vite/webpack bundles your **entire app** into one JavaScript file. When the user visits your site, their browser downloads that entire file before anything renders. Code splitting lets you break that file into smaller pieces that load **only when needed**.

### 🎯 Problem It Solves
As your app grows — more pages, more components, more third-party libraries — the bundle grows too. A 2MB bundle on a slow mobile connection means a 5-second blank screen before anything appears. Code splitting fixes this by deferring the cost until the user actually navigates to a page.

### ⏳ Before → After

| | Without Code Splitting | With Code Splitting |
|---|---|---|
| **Bundle size** | Everything, shipped at once | Only what the current page needs |
| **Initial load** | Slow — entire app downloads upfront | Fast — only the entry page loads |
| **Rarely-used pages** | Always downloaded, even if never visited | Only downloaded when the user navigates there |
| **How it works** | Static `import` at the top of every file | Dynamic `import()` — loads on demand |

---

### Step 1 — Dynamic `import()` — The Engine

The key insight is the difference between a **static import** and a **dynamic import**:

```jsx
// ❌ STATIC import — runs at build time
// The bundler sees this and puts OtherComponent INTO the main bundle
import OtherComponent from './OtherComponent';

// ✅ DYNAMIC import() — runs at runtime, on demand
// The bundler creates a SEPARATE chunk file for OtherComponent
// That chunk only downloads when this line of code actually executes
import('./OtherComponent');
// Returns a Promise — resolves when the chunk has loaded
```

### Step 2 — `React.lazy()` — Wrap the Dynamic Import

`React.lazy` bridges the dynamic import Promise to something React can actually render as a component:

```jsx
import { lazy } from 'react';

// ❌ Before — every page is in the main bundle, always shipped
import HomePage      from './pages/HomePage';
import ProductsPage  from './pages/ProductsPage';
import ContactPage   from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard'; // huge, rarely visited!

// ✅ After — each page is its own chunk, loads only when navigated to
const HomePage       = lazy(() => import('./pages/HomePage'));
const ProductsPage   = lazy(() => import('./pages/ProductsPage'));
const ContactPage    = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
// Admin's 200KB of chart libraries? Only downloaded when an admin logs in.
```

### Step 3 — `<Suspense>` — The Loading Safety Net

A lazy component hasn't loaded yet when React first tries to render it. `<Suspense>` catches that and shows a **fallback** (a spinner, a skeleton) while the chunk downloads:

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage     = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));

function App() {
  return (
    // Suspense wraps all lazy components — shows fallback while any chunk loads
    <Suspense fallback={<div>Loading...</div>}>
      {/*              ↑ shown while the chunk file is downloading */}
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </Suspense>
    // Once the chunk loads, Suspense replaces the fallback with the real component ✅
  );
}
```

### The Chain Reaction

```
User navigates to /products
        ↓
React tries to render <ProductsPage />
        ↓
ProductsPage is lazy — its chunk hasn't loaded yet
        ↓
Suspense catches it → shows <div>Loading...</div>
        ↓
Browser fetches products-page-chunk.js in the background
        ↓
Chunk loads → Suspense hides fallback → ProductsPage renders ✅
```

### The 3 Setup Steps — Summary

1. Replace static `import` with `const X = lazy(() => import('./X'))`
2. Wrap your routes (or any lazy components) in `<Suspense fallback={...}>`
3. Done — Vite/webpack automatically splits the bundle at every `lazy()` boundary

> 💡 **Chunk files and cache-busting:** Vite generates a separate hashed `.js` chunk file for every `lazy()` boundary automatically. You can inspect these in the `dist/` folder after `npm run build`. The hash in the filename (e.g. `ProductsPage-3f9a2b.js`) changes only when that file's content changes — so browsers serve cached chunks for unchanged pages and only download fresh chunks for what actually changed in a deployment.

### Angular vs React — Code Splitting

| | Angular | React |
|---|---|---|
| **Lazy load a route** | `loadChildren: () => import('./page/page.module')` in the router config | `const Page = lazy(() => import('./Page'))` at the top of the file |
| **Loading fallback** | Angular Router shows nothing by default — configure a resolver | `<Suspense fallback={<div>Loading...</div>}>` wraps the lazy component |
| **Chunk generation** | Angular CLI generates chunks automatically per lazy-loaded module | Vite generates chunks automatically at every `lazy()` boundary |
| **Route placeholder** | `<router-outlet>` renders the lazy module when the route is matched | `<Routes>` + `<Route element={<LazyPage />}>` inside `<Suspense>` |

> ⚠️ **Trap:** Using `React.lazy()` for components that are always visible on the page (like a `<Navbar />` or `<Footer />`). Code splitting only helps for components that aren't needed on initial load. Lazy-loading a Navbar just adds a layout flash and zero benefit.

> ⚠️ **Trap:** Forgetting `<Suspense>`. Without it, React throws an error when a lazy component hasn't loaded yet — "A React component suspended while rendering." Always have a Suspense boundary wrapping your lazy components.

> 🧠 **Memory Hook:** `lazy()` = promise for a component. `Suspense` = the waiting room while the promise resolves.

---

## 6. Custom Hooks — Extract, Reuse, Simplify

### ⚡ Core Idea
A **custom hook** is a regular JavaScript function whose name starts with `use`, and which calls other hooks inside it. It's how you extract repeated stateful logic out of components and into a reusable unit.

### 🎯 Problem It Solves
Imagine you have 5 pages — Products, Users, Orders, Categories, Reviews — and each one fetches data from an API. Without custom hooks, every single page component contains the exact same 15 lines: `useState` for data, `useState` for loading, `useState` for error, a `useEffect`, a try/catch, an axios call. That's 75 lines of duplicated logic. One bug means fixing it in 5 places.

### ⏳ Before → After

| | Without Custom Hook | With Custom Hook |
|---|---|---|
| **Logic location** | Copied into every component that needs it | Defined once, imported wherever needed |
| **Bug fix** | Fix in 5 places | Fix in 1 place |
| **Component size** | 50 lines of logic + 20 lines of JSX | 5 lines of logic + 20 lines of JSX |
| **Testing** | Must test through the component | Hook can be tested in isolation |

---

### The Naming Rule — Non-Negotiable

```jsx
// ✅ Custom hooks MUST start with "use"
function useGetData(url) { ... }
function useLocalStorage(key) { ... }
function useDebounce(value, delay) { ... }

// ❌ Does NOT start with "use" — React won't treat it as a hook
// The Rules of Hooks won't apply — you'll get confusing bugs
function getData(url) { ... }        // WRONG — even if it uses useState inside
function fetchHelper(url) { ... }    // WRONG
```

> 💡 The `use` prefix is not just convention — React uses it to identify hooks and enforce the Rules of Hooks (always call at top level, not in conditions or loops). Breaking the naming rule means breaking the rules silently.

### The `useGetData` Custom Hook — From the Session

```jsx
// useGetData.js — a reusable data-fetching hook
import axios from "axios";
import { useEffect, useState } from "react";

const useGetData = (url) => {
  // The three states every fetch operation needs
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url);   // ← url comes from the caller
        setData(response.data.products);
      } catch (err) {
        setError(err);                           // ← capture what went wrong
      } finally {
        setLoading(false);                       // ← always runs — success OR failure
      }
    };

    getProducts();
  }, [url]); // ← re-runs whenever the url prop changes

  // Return everything the consumer might need
  return { data, setData, loading, error };
};

export default useGetData;
```

### Using the Custom Hook in Any Component

```jsx
// ProductsPage.jsx — clean, zero fetch logic visible here
import useGetData from '../hooks/useGetData';

const ProductsPage = () => {
  // One line replaces 15+ lines of fetch boilerplate
  const { data, loading, error } = useGetData("https://dummyjson.com/products");

  if (loading) return <div>Loading products...</div>;
  if (error)   return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(product => <li key={product.id}>{product.title}</li>)}
    </ul>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// UsersPage.jsx — SAME hook, different URL. Zero duplication.
import useGetData from '../hooks/useGetData';

const UsersPage = () => {
  const { data, loading, error } = useGetData("https://dummyjson.com/users");
  // Same pattern, different data — the hook doesn't care what the URL returns
  // ...
};
```

> 💡 **Hook instances are NOT shared:** Two components both calling `useGetData(url)` each get their own completely independent `data`, `loading`, and `error` state. This is the opposite of Angular Services, which are singletons shared across the whole app. If you need shared server state across components, use React Query (Section 7). If you need shared client state, use Context API.

### Angular vs React — Custom Hooks vs Services

| | Angular | React |
|---|---|---|
| **Shared logic unit** | `@Injectable() Service` — singleton, injected via DI | Custom Hook — new instance created per component call |
| **Register it** | `providedIn: 'root'` or in a module's `providers` array | No registration — just import and call the function |
| **Use it** | `constructor(private svc: DataService) {}` | `const { data, loading } = useGetData(url)` |
| **State sharing** | One service instance shared across the whole app | Each component gets its own independent state copy |
| **Side effects** | Methods inside the service, called manually | `useEffect` inside the hook, runs automatically |

> ⚠️ **Trap:** Putting the hook call inside a condition or loop. Custom hooks follow the same Rules of Hooks as built-in hooks — always call at the top level of the component, unconditionally.

> ⚠️ **Trap:** Forgetting to include `url` in the `useEffect` dependency array. If the url changes (e.g., paginated routes), the effect won't re-run, and you'll be stuck showing the old page's data.

> 🧠 **Memory Hook:** Custom hook = copy-paste logic, but extracted into a function that starts with `use`. Write the messy bits once, call the clean interface everywhere.

---

## 7. React Query — Server State, Solved

### ⚡ Core Idea
React Query is a library that manages **server state** — data that lives on a server and needs to be fetched, cached, synchronized, and updated. It replaces the entire `useEffect + useState + axios` pattern with a single `useQuery` hook that does all of that automatically, plus caching, background refetching, deduplication, and more.

### 🎯 Problem It Solves
The custom hook from Section 6 is a great step forward. But it still has blind spots: if you navigate away and come back, it re-fetches from scratch (no caching). If two components both call `useGetData` with the same URL, it fires two separate network requests (no deduplication). If the network drops, nothing retries automatically. React Query solves all of these problems out of the box.

### ⏳ Before → After

| | Custom Hook (manual) | React Query (`useQuery`) |
|---|---|---|
| **Caching** | None — re-fetches every mount | Built-in — returns cached data instantly |
| **Background refresh** | Never | Automatically re-fetches when window regains focus |
| **Deduplication** | Two components = two requests | Same query key = one request, shared result |
| **Retries on error** | Never | Automatically retries 3 times |
| **Loading/Error state** | Manual `useState` | Included: `isLoading`, `isError`, `error` |
| **Boilerplate** | ~15 lines per fetch | ~3 lines |

---

### The 4 Players

| Player | What it is | Role |
|---|---|---|
| `QueryClient` | Configuration object | Brain — holds all cache settings and the cache itself |
| `QueryClientProvider` | Context wrapper | Broadcaster — makes the client available to the whole app |
| `useQuery` | Hook | Radio — any component tunes in to fetch and receive data |
| `queryKey` | Unique array identifier | Cache address — React Query uses this to store and look up data |

---

### Step 1 — Install

```bash
npm install @tanstack/react-query
```

---

### Step 2 — Set Up the Provider in `main.jsx`

The `QueryClientProvider` is the same broadcaster pattern from Context API and Redux — it wraps the entire app:

```jsx
// main.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create the client — this is the brain that holds all the cache
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    {/*              ↑ every component inside can now use useQuery */}
    <App />
  </QueryClientProvider>
);
```

---

### Step 3 — Write the Fetch Function + Custom Hook

React Query separates the *what to fetch* (your async function) from the *when and how* (React Query's job):

```jsx
// useGetProducts.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 1. A plain async function — just fetches and returns data. No state, no useEffect.
const getProducts = async () => {
  const res = await axios.get("https://dummyjson.com/products");
  return res.data; // ← return the data directly — React Query stores it
};

// 2. A custom hook that wraps useQuery
const useGetProducts = () => {
  const query = useQuery({
    queryKey: ["products"],  // ← unique cache key — like a variable name for this data
    queryFn: getProducts,    // ← the async function to call
  });

  return query; // ← returns { data, isLoading, isError, error, ... }
};

export default useGetProducts;
```

### Understanding `queryKey`

```jsx
// queryKey is React Query's cache address — think of it as the key in localStorage
// It's always an array. Can be simple or dynamic:

useQuery({ queryKey: ["products"],          queryFn: getProducts })
// ↑ All products — one cache slot

useQuery({ queryKey: ["products", id],      queryFn: () => getProduct(id) })
// ↑ Specific product — different cache slot per id

useQuery({ queryKey: ["products", filters], queryFn: () => getFiltered(filters) })
// ↑ Filtered products — React Query re-fetches when filters change (it's in the key)
```

---

### Step 4 — Use the Hook in a Component

```jsx
// ProductsPage.jsx
import useGetProducts from '../hooks/useGetProducts';

function ProductsPage() {
  const { data, isLoading, isError, error } = useGetProducts();

  // React Query gives you these booleans — no manual state needed
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {data.products.map(item => (
        <p key={item.id}>{item.title}</p>
      ))}
    </>
  );
}

export default ProductsPage;
```

### The Chain Reaction

```
Component mounts → useQuery fires
        ↓
Is "products" key already in cache?
  YES → return cached data immediately (no loading state!) → re-fetch in background
  NO  → set isLoading: true → call queryFn (getProducts)
        ↓
        Network request completes
        ↓
React Query stores result under key ["products"]
        ↓
isLoading → false, data → populated → component re-renders with data ✅
        ↓
User leaves page, comes back → data from cache shown instantly
Background re-fetch runs silently → cache updated if server data changed ✅
```

### The 4 Setup Steps — Summary

1. `npm install @tanstack/react-query`
2. Create `QueryClient`, wrap `<App />` with `<QueryClientProvider client={queryClient}>` in `main.jsx`
3. Write a plain async fetch function + wrap it in a custom hook using `useQuery({ queryKey, queryFn })`
4. Call your custom hook in any component — destructure `{ data, isLoading, isError }`

### The One Sentence

> *React Query takes the entire fetch → load → error → cache → retry lifecycle off your hands — you write the fetch function, it handles everything else.*

> 💡 **`isLoading` vs `isFetching`:** `isLoading` is `true` only on the very first fetch when there is no cached data yet — use this to show a full-page loading screen. `isFetching` is `true` on every fetch including silent background refetches on already-cached data — use this to show a subtle spinner or a "Refreshing…" badge without hiding the existing content.

> 💡 **`staleTime` and the default of `0`:** With `staleTime: 0` (the default), React Query considers cached data immediately stale — so it fires a background refetch every time a component mounts, even if the data was fetched one second ago. For data that doesn't change often (product lists, categories), set `staleTime: 1000 * 60 * 5` (5 minutes) to prevent unnecessary network requests.

```jsx
useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
  staleTime: 1000 * 60 * 5, // ← cache is "fresh" for 5 minutes — no background refetch
})
```

### Angular vs React — Server State / Data Fetching

| | Angular | React |
|---|---|---|
| **HTTP client** | `HttpClient` — built-in, no install needed | `axios` or `fetch` — you choose, React Query wraps it |
| **Caching** | No built-in cache — add `shareReplay(1)` on Observables manually | Automatic — built into `useQuery` via `queryKey` |
| **Loading state** | `async pipe` + manual `isLoading` flag | `isLoading` and `isFetching` — provided automatically |
| **Error state** | `catchError` in the pipe + manual error flag | `isError` + `error` — provided automatically |
| **Background refetch** | Never — you trigger fetches manually | Automatic on window focus re-entry (configurable) |
| **Retry on failure** | Never by default — implement manually | Automatic — retries 3 times before setting `isError` |

> ⚠️ **Trap:** Using `data` without checking `isLoading` first. When the component first mounts, `data` is `undefined`. Accessing `data.products` before the fetch completes throws `Cannot read properties of undefined`. Always guard with `if (isLoading)` first.

> ⚠️ **Trap:** Putting a plain object or inline array as `queryKey` — `queryKey: { type: "products" }` or `queryKey: ["products", { id }]` on every render. React Query compares keys by deep equality, but a new object reference on every render can confuse it. Keep keys simple and stable.

> 🧠 **Memory Hook:** `queryKey` = the cache address. `queryFn` = what to fetch. React Query = everything else.

---

## 8. React Query DevTools — See Everything

### ⚡ Core Idea
React Query ships with a browser panel — the DevTools — that shows every active query, its cache state, last fetch time, and data payload. It's the equivalent of Redux DevTools but for server state.

### Install + Setup

```bash
# Install the devtools package separately
npm i @tanstack/react-query-devtools
```

```jsx
// main.jsx — add ReactQueryDevtools inside the provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* ↓ Adds a floating panel at the bottom of your browser — dev only */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </BrowserRouter>
);
```

> 💡 The DevTools panel only appears in development mode — it's automatically stripped from production builds. No code change needed to remove it before deploying.

### What You Can See in the DevTools Panel

| Info Shown | Why It's Useful |
|---|---|
| **Query key** | Confirm your key is correct and unique |
| **Status** (fresh / stale / fetching / error) | Understand exactly what React Query is doing |
| **Last updated time** | See how stale the cached data is |
| **Data payload** | Inspect what the server returned without console.log |
| **Manual refetch button** | Trigger a re-fetch without interacting with the UI |

---

## 9. Environment Variables in Vite

### ⚡ Core Idea
Environment variables let you store configuration values (like API base URLs, API keys, feature flags) **outside your code** — in a `.env` file. Different environments (development, staging, production) can use different values without changing a single line of code.

### 🎯 Problem It Solves
If you hardcode `"https://api-dev.myapp.com"` in 30 different files, switching to production means finding and replacing every single one. With env variables, you change one line in `.env`, and every file updates automatically.

### ⏳ Before → After

| | Hardcoded Values | Environment Variables |
|---|---|---|
| **URL in code** | `axios.get("https://api-dev.myapp.com/products")` | `axios.get(import.meta.env.VITE_API_BASE_URL + "/products")` |
| **Switching to prod** | Find + replace in 30 files (risky, error-prone) | Change one line in `.env.production` |
| **Secrets in code** | Visible to anyone who reads the repo | Kept in `.env`, excluded from git |

---

### The 3 Rules for Vite Env Variables

```
1. Create a .env file at the ROOT of your project — same level as src/, not inside it.

   my-project/
   ├── src/
   ├── public/
   ├── .env          ← HERE (root level)
   └── package.json

2. Every variable name MUST start with VITE_
   (Vite strips variables without this prefix for security — they stay server-side only)

3. Access variables in code using import.meta.env (not process.env — that's Node/webpack)
```

### The `.env` File

```bash
# .env  (root of project — commit to git only if NO secrets inside)
VITE_APP_BASE_URL=https://api-dev.myapp.com
VITE_APP_NAME=MyShopApp

# .env.production  (used automatically when you run: npm run build)
VITE_APP_BASE_URL=https://api.myapp.com

# ⚠️ NEVER put API keys with billing access in VITE_ variables
# They appear in the browser's JavaScript — anyone can read them
# VITE_STRIPE_SECRET_KEY=sk_live_...  ← ❌ DANGEROUS
```

### Using Variables in Your Code

```jsx
// Any component or utility file
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
//               ↑ import.meta.env is Vite's way of exposing env variables to the browser
//               ↑ NOT process.env — that's Node.js / Create React App

// In practice:
const getProducts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/products`);
  return res.data;
};

// Or in JSX:
<h1>{import.meta.env.VITE_APP_NAME}</h1>
```

### The `.gitignore` Rule

```bash
# .gitignore — always exclude .env files that contain real secrets
.env.local
.env.production
.env.staging

# Commit ONLY the template file that shows what variables are needed (no real values)
# .env.example is safe to commit — it shows the keys, not the values
```

> 💡 **Why Vite strips the `VITE_` prefix:** Vite strips variables without the `VITE_` prefix intentionally — it is a security feature, not a limitation. Anything without the prefix stays out of the browser bundle entirely, so server-only secrets (database passwords, private API keys) can never accidentally leak into client-side code even if they live in the same `.env` file.

### Angular vs React — Environment Variables

| | Angular | React (Vite) |
|---|---|---|
| **Config files** | `src/environments/environment.ts` + `environment.prod.ts` | `.env` + `.env.production` at the project root |
| **Access in code** | `environment.apiUrl` — imported as a typed TS object | `import.meta.env.VITE_API_URL` — string, no type safety by default |
| **Swap on build** | `ng build --configuration=production` swaps the file | `npm run build` automatically loads `.env.production` |
| **Naming rule** | Any property name — no prefix required | Must start with `VITE_` — variables without it are stripped |
| **Type safety** | Full TypeScript interface on the environment object | None by default — add `vite-env.d.ts` to get autocomplete |

> ⚠️ **Trap:** Using `process.env.VITE_APP_BASE_URL` — this is `undefined` in Vite. Vite uses `import.meta.env`, not `process.env`. This is a common mistake for developers coming from Create React App.

> ⚠️ **Trap:** Naming a variable `MY_API_URL` without the `VITE_` prefix. Vite will intentionally not expose it to the browser — it'll be `undefined` in your code. This is a security feature, not a bug.

> 🧠 **Memory Hook:** In Vite, it's always `import.meta.env.VITE_YOUR_VARIABLE`. If it's `undefined`, check: (1) does it start with `VITE_`? (2) did you restart the dev server after editing `.env`?

---

## 10. Quick Reference — All Traps & Memory Hooks

| Section | ⚠️ Trap | 🧠 Memory Hook |
|---|---|---|
| **Native Forms** | Forgetting `name=""` on input → silent freeze | `name` attribute = bridge between input and state key |
| **Native Forms** | Forgetting `e.preventDefault()` → page reloads | No preventDefault = your SPA stops being an SPA |
| **Validation** | `if (errors)` is always truthy — use `Object.keys(errors).length === 0` | Empty object ≠ falsy in JavaScript |
| **Code Splitting** | Lazy-loading always-visible components (Navbar) → layout flash, zero benefit | Split what you defer, not what you always show |
| **Code Splitting** | Forgetting `<Suspense>` → React throws an error | Lazy = promise. Suspense = waiting room |
| **Custom Hooks** | Hook not starting with `use` → Rules of Hooks not enforced | No `use` prefix = React doesn't know it's a hook |
| **Custom Hooks** | Missing `url` in useEffect dependency array → stale data | Every value the effect uses must be in the deps array |
| **React Query** | Accessing `data.products` before `isLoading` check → `undefined` crash | Guard with `if (isLoading)` before touching data |
| **React Query** | Wrong `queryKey` shape → cache misses or duplicate requests | queryKey = cache address. Same address = same cache slot |
| **Env Variables** | Using `process.env` instead of `import.meta.env` → undefined | Vite ≠ CRA. It's `import.meta.env`, always |
| **Env Variables** | Missing `VITE_` prefix → variable intentionally hidden | No prefix = Vite keeps it server-side only |

---

## 11. 🗺️ Master Summary Flow — Session 5

```
FORMS
  → Native: useState + controlled inputs + e.preventDefault + validate()
  → The pain: boilerplate explodes at scale
        ↓
  → Third-party: Formik+Yup or React Hook Form+Zod
  → Validation schema replaces all the if/else logic
        ↓

CODE SPLITTING
  → Problem: one huge bundle = slow first load
  → Solution: React.lazy() + dynamic import() + <Suspense>
  → Result: each page is its own chunk, loaded on demand
        ↓

CUSTOM HOOKS
  → Problem: fetch boilerplate copy-pasted into every component
  → Solution: extract into a function named useX that calls hooks
  → Result: one place to fix bugs, clean components
        ↓

REACT QUERY
  → Problem: custom hook still has no caching, no retry, no dedup
  → Solution: useQuery({ queryKey, queryFn })
  → Result: cache + background refresh + retry + dedup — all automatic
        ↓

ENV VARIABLES
  → Problem: hardcoded URLs → change in 30 places per environment
  → Solution: VITE_ prefix in .env + import.meta.env in code
  → Result: one file change swaps the entire environment
```

---


### 📊 Concept Map — What Each Session 5 Topic Solves

| Topic | Pain It Solves | Section(s) |
|-------|---------------|------------|
| Native Forms | How to capture and own user input in React | §2 |
| Validation | How to enforce rules and show errors before bad data reaches the server | §3 |
| Form Libraries | How to eliminate form boilerplate at scale | §4 |
| Code Splitting | How to stop shipping the entire app on first load | §5 |
| Custom Hooks | How to stop copy-pasting fetch logic into every component | §6 |
| React Query | How to get caching, retry, and dedup without writing a single line of it | §7 |
| Env Variables | How to change configuration across environments without touching code | §9 |

---

## 📖 Go Deeper — Official Docs & Resources

> Read these after you're comfortable with the notes above — not before. The notes are self-contained. These are for when you want to go beyond what was covered in session.

| Topic | Resource |
|---|---|
| **React Forms — native** | [React docs — input](https://react.dev/reference/react-dom/components/input) |
| **React Hook Form** | [react-hook-form.com](https://react-hook-form.com/) |
| **Formik** | [formik.org](https://formik.org/) |
| **Zod** | [zod.dev](https://zod.dev/) |
| **Yup** | [github.com/jquense/yup](https://github.com/jquense/yup) |
| **Code Splitting** | [React docs — lazy](https://react.dev/reference/react/lazy) |
| **TanStack React Query** | [tanstack.com/query/latest](https://tanstack.com/query/latest) |
| **Vite Env Variables** | [vite.dev/guide/env-and-mode](https://vite.dev/guide/env-and-mode) |
