# ⚔️ React Pitfalls & Battle-Tested Patterns
> Every mistake below was made in real code. Learn it once, never repeat it.

---

## 🗂️ Index
1. [React Router](#1-react-router)
2. [Hooks Rules](#2-hooks-rules)
3. [State Management](#3-state-management)
4. [Redux Toolkit](#4-redux-toolkit)
5. [Context API](#5-context-api)
6. [API Fetching](#6-api-fetching)
7. [Forms — Formik + Yup](#7-forms--formik--yup)
8. [JSX Rules](#8-jsx-rules)
9. [General Patterns](#9-general-patterns)
10. [Master Cheatsheets](#10-master-cheatsheets)

---

## 1. React Router

### ❌ Pitfalls

```jsx
// WRONG — redirect() is for loaders/actions only
<Route path="/" element={() => { redirect("/products") }} />

// WRONG — hook inside JSX
<Route path="/" element={() => { useNavigate("/products") }} />

// WRONG — function with no return
<Route path="/" element={() => { <Navigate to="/products" replace /> }} />

// CORRECT
<Route path="/" element={<Navigate to="/products" replace />} />
```

### 🔥 `replace` — why it matters
```
WITHOUT replace:           WITH replace:
history: ["/", "/products"] history: ["/products"]
↑ back button loops        ↑ back works cleanly
```

### 📐 `<Navigate>` vs `useNavigate`
```
On render automatically → <Navigate to="/products" replace />
On user event (click)   → const navigate = useNavigate()
                          onClick={() => navigate("/products")}
```

### 📐 `NavLink` vs `Link` vs `<a>`
```
<a href="/products">      → full page refresh        ❌
<Link to="/products">     → SPA nav, no active state ✅
<NavLink to="/products">  → SPA nav + active state   ✅
```

### 📐 `end` prop
```
WITHOUT end: /products/123 → NavLink("/products") = ACTIVE   ❌ prefix match
WITH end:    /products/123 → NavLink("/products") = inactive ✅ exact match
```

### 📐 Layout pattern
```
App.jsx
├── <NavBar />           ← always visible
├── <Routes>             ← only this swaps
│   ├── / → redirect
│   ├── /products
│   ├── /products/:id
│   └── *  → NotFound
└── <Footer />           ← always visible
```

### 📐 `useParams`
```jsx
// Route: /products/:id
// URL:   /products/42
const { id } = useParams(); // "42"
```

---

## 2. Hooks Rules

### ❌ The Hard Rules — Never Break These
```jsx
// WRONG — hook in callback
onClick={() => useNavigate("/products")}

// WRONG — hook in JSX
<button onClick={useNavigate("/products")}>

// WRONG — hook in condition
if (something) { useEffect(...) }

// CORRECT — always top level
function MyComponent() {
  const navigate = useNavigate(); // ← TOP LEVEL
  return <button onClick={() => navigate("/products")}>Go</button>
}
```

> **Why?** React tracks hooks by call order every render.
> If a hook is inside a callback → might not run every render → React loses track → 💥

### 📐 Hook Decision Tree
```
Need to navigate on render?  → <Navigate to="..." replace />
Need to navigate on event?   → useNavigate() hook
Need store value?            → useSelector()
Need to dispatch action?     → useDispatch()
Need context value?          → useContext()
Need side effect?            → useEffect()
Need local UI state?         → useState()
```

---

## 3. State Management

### ❌ Plain variables don't re-render
```jsx
// WRONG — changing this won't re-render
const loading = false;
loading = true; // React doesn't know

// CORRECT
const [loading, setLoading] = useState(false);
setLoading(true); // React re-renders ✅
```

### 📐 Initial state shape matters
```jsx
useState([])    → for lists    → map() safe on first render ✅
useState(null)  → for objects  → guard with && before accessing ✅
useState(false) → for booleans
useState('')    → for strings

// DANGER: useState(null) + no guard
product.title   // 💥 Cannot read property of null

// SAFE
{product && <div>{product.title}</div>}
```

### 📐 Derived vs Stored state
```jsx
// DON'T store what you can calculate
const [items, setItems] = useState([]);
const [count, setCount] = useState(0); // ❌ redundant

// DERIVE IT
const count = items.length; // ✅ always in sync
```

---

## 4. Redux Toolkit

### 📐 File Structure
```
src/store/
├── store.js        ← configureStore
└── cartSlice.js    ← one slice per file
```

### 📐 Slice anatomy
```javascript
const cartSlice = createSlice({
  name: "cart",                    // ← slice name (used in action types)
  initialState: {                  // ← replaces useState
    items: [],
    totalPrice: 0
  },
  reducers: {
    addItem(currentState, action) {
      // action.payload = data you dispatched
      // currentState = current store state
      // Immer lets you mutate directly ✅
      currentState.items.push(action.payload);
    }
  }
})

export default cartSlice.reducer           // ← for store.js
export const { addItem } = cartSlice.actions // ← for components
```

### ❌ Pitfalls
```javascript
// WRONG — destructuring a single value
export const { cartReducer } = cartSlice.reducer

// CORRECT
export default cartSlice.reducer

// WRONG — filter condition backwards
currentState.items.filter(item => item.id === action.payload.id) // keeps matched

// CORRECT — keep everything EXCEPT matched
currentState.items.filter(item => item.id !== action.payload.id)

// WRONG — sequential if blocks (both run)
if (qty === 1) { filter... }
map(...)  // ← still runs even after filter

// CORRECT — exclusive branches
if (qty === 1) {
  filter...
} else {
  map...
}

// WRONG — accessing payload before awaiting
action.payload.products  // on a Promise

// WRONG — totalPrice ignores quantity on remove
totalPrice -= item.price  // ❌ if qty=3, only subtracts once

// CORRECT
totalPrice -= item.price * item.quantity
```

### 📐 `useSelector` & `useDispatch`
```jsx
// Read from store
const items = useSelector((state) => state.cart.items);
//                         ↑ whole store   ↑ your slice

// Dispatch action
const dispatch = useDispatch();
dispatch(addItem(product));
// creates: { type: "cart/addItem", payload: product }
// → store finds reducer → runs addItem → state updates → re-renders
```

### 📐 `store.js`
```javascript
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer   // ← state.cart in useSelector
  }
})

export default store;
```

### 📐 Wire in `main.jsx`
```jsx
<Provider store={store}>  // ← makes store accessible everywhere
  <App />
</Provider>
```

---

## 5. Context API

### 📐 vs Redux
```
Context    → simple shared values (lang, theme, current user)
Redux      → complex state with many actions, middleware, devtools
```

### 📐 Pattern
```jsx
// LangContext.jsx
export const LangContext = createContext(null);  // ← named export

function LangProvider({ children }) {           // ← default export
  const [lang, setLang] = useState('en');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}                               // ← no extra div needed
    </LangContext.Provider>
  );
}
export default LangProvider;
```

```jsx
// In any child
const { lang, setLang } = useContext(LangContext);
```

### 📐 RTL/LTR — apply ONCE not everywhere
```jsx
// WRONG — checking lang in every component ❌

// CORRECT — one place, all children get it
function App() {
  const { lang } = useContext(LangContext);
  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      ...
    </div>
  );
}
```

---

## 6. API Fetching

### 📐 The 3-State Pattern — Always Use This
```jsx
const [data,    setData]    = useState([]);
const [loading, setLoading] = useState(true);
const [error,   setError]   = useState(false);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError(false);                          // reset on retry
      const res = await fetch(URL);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json.KEY);                        // check actual response shape
    } catch(e) {
      setError(true);
    } finally {
      setLoading(false);                        // always runs ✅
    }
  }
  fetchData();
}, [/* dependencies */]);
```

### ❌ Pitfalls
```javascript
// WRONG — accessing .products on a Promise
setProducts(await data.json().products)

// CORRECT — await first, then access key
setProducts((await data.json()).products)

// WRONG — setLoading(false) missing in catch
// → spinner never stops on error

// WRONG — condition backwards
{loading && products.map(...)}   // shows during loading ❌

// CORRECT
{!loading && !error && products.map(...)}

// WRONG — useState(null) + no guard on map
null.map(...)  // 💥

// CORRECT
useState([])   // map-safe always ✅
```

### 📐 Dependency array
```jsx
useEffect(() => { fetch(URL) }, []);    // run once on mount
useEffect(() => { fetch(URL) }, [id]);  // re-run when id changes
```

### 📐 Always check API response shape
```json
// dummyjson returns:
{ "products": [...], "total": 100 }
// NOT just an array — need .products key
```

---

## 7. Forms — Formik + Yup

### 📐 Mental Model
```
Formik  → manages form state, handleChange, handleBlur,
          handleSubmit, errors, touched
Yup     → defines validation rules → returns errors to Formik
          connected via validationSchema in useFormik
```

### 📐 Boilerplate — copy every time
```jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';

function MyForm() {
  const schema = Yup.object({
    email: Yup.string().email("Invalid").required("Required"),
    password: Yup.string().min(8).required("Required"),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      // handle submit
      resetForm(); // ← resets to initialValues
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="email"           // ← must match initialValues key EXACTLY
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.errors.email && formik.touched.email && (
        <div>{formik.errors.email}</div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### ❌ Pitfalls
```jsx
// WRONG — onSubmit is an object
onSubmit: {}

// WRONG — <Navigate> inside onSubmit (declarative in imperative)
onSubmit: (values) => { <Navigate to="/products" /> }

// WRONG — hook inside onSubmit
onSubmit: (values) => { useNavigate('/products') }

// CORRECT — useNavigate at top, use function inside
const navigate = useNavigate();
onSubmit: (values) => { navigate('/products') }

// WRONG — name mismatch (Formik silently fails)
initialValues: { userName: '' }
<input name="username" />   // ← different case!

// WRONG — showing errors without checking touched
{formik.errors.email && <div>...</div>}
// → shows errors on ALL fields before user types anything ❌

// CORRECT
{formik.errors.email && formik.touched.email && <div>...</div>}
```

### 📐 Common Yup validators
```javascript
Yup.string().required('msg')
Yup.string().email('msg')
Yup.string().min(8, 'msg')
Yup.string().max(500, 'msg')
Yup.string().matches(/regex/, 'msg')
Yup.string().oneOf([Yup.ref('password')], 'msg') // confirm password
// Optional field — just omit .required()
```

### 📐 `touched` explained
```
Without touched check → errors show on ALL fields on page load ❌
With touched check    → errors show only after user visits field ✅

formik.touched.email = true  → user clicked into & out of email field
```

### 📐 Success message pattern
```jsx
// Success message = UI state → useState, not Formik
const [success, setSuccess] = useState('');

onSubmit: (values, { resetForm }) => {
  setSuccess("We will get back to you soon");
  resetForm();
  setTimeout(() => setSuccess(''), 3000);
}
```

---

## 8. JSX Rules

### ❌ Can't use `if` directly in JSX
```jsx
// WRONG
return (
  <div>
    {if (loading) <p>Loading</p>}  // ❌ syntax error
  </div>
)

// CORRECT — ternary
{loading ? <p>Loading</p> : null}

// CORRECT — &&
{loading && <p>Loading</p>}
```

### 📐 `&&` order matters
```jsx
{loading && map(...)}   // shows during loading ❌
{!loading && map(...)}  // shows after loading  ✅

// Multiple conditions
{!loading && !error && data.map(...)}
```

### 📐 Component naming
```
lowercase → React treats as HTML element  ❌ <stateUI />
Uppercase → React treats as component     ✅ <StateUI />
```

### 📐 `element` prop takes JSX, not a function
```jsx
// WRONG
element={() => { <Navigate to="/products" /> }}  // function, no return

// CORRECT
element={<Navigate to="/products" replace />}    // direct JSX
```

---

## 9. General Patterns

### 📐 Naming = Responsibility
```
ProductCard.jsx    → displays one card in the list
ProductDetails.jsx → full page for single product
LangProvider       → provides context values
LangContext        → the context object itself
```

### 📐 Scope discipline
```
Build ONLY what's in the current requirements.
Adding Cart/Login before they're required = wasted effort + bugs.
Ask: "Is this in scope?" before every addition.
```

### 📐 `filter` vs `map` — pick the right one
```javascript
filter → removes/keeps items → returns new array
map    → transforms items   → returns same-length array

// Use filter to remove
items.filter(item => item.id !== id)

// Use map to update
items.map(item => item.id === id ? {...item, qty: item.qty+1} : item)
```

### 📐 `finally` > try+catch duplication
```javascript
// AVOID — duplicated cleanup
try {
  setLoading(false); // ← here
} catch(e) {
  setLoading(false); // ← and here
}

// BETTER — runs regardless
} finally {
  setLoading(false); // ← once ✅
}
```

---

## 10. Master Cheatsheets

### 📐 Project Setup Order
```
1. npm install react-router-dom
2. npm install @reduxjs/toolkit react-redux
3. npm install formik yup
4. Wrap main.jsx: StrictMode > BrowserRouter > Provider > LangProvider > App
5. Create store.js + slices
6. Create contexts
7. Build pages
```

### 📐 `main.jsx` wrapper order
```jsx
<StrictMode>
  <BrowserRouter>       ← routing features
    <Provider store={store}>   ← redux store
      <LangProvider>    ← context
        <App />
      </LangProvider>
    </Provider>
  </BrowserRouter>
</StrictMode>
```

### 📐 Navigation decision
```
Render → redirect    → <Navigate to="..." replace />
Event  → navigate    → const nav = useNavigate(); nav('/path')
Link   → no active   → <Link>
Link   → with active → <NavLink className={({isActive}) => ...}>
```

### 📐 State ownership
```
Form fields, errors, touched  → Formik
Complex shared state + actions → Redux
Simple shared value (lang, theme) → Context
Local UI state (modal, message) → useState
List/single API data → useState + useEffect
```

### 📐 Self-Check Before Every PR
- [ ] All hooks at top level of component?
- [ ] All `name` attrs match `initialValues` keys exactly?
- [ ] `errors && touched` before showing form errors?
- [ ] `finally` block for `setLoading(false)`?
- [ ] API response shape checked — correct key accessed?
- [ ] `!loading && !error &&` before rendering data?
- [ ] No unused imports?
- [ ] Component named after its responsibility?
- [ ] Is this feature in scope?
- [ ] `export default` reducer + `export const` actions from slice?
