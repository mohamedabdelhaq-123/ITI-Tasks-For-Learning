## Engineering Strategy — Day 3 Lab

---

## Debugging Foundation — Read This First

Before any phase, set up your debugging environment:

**Vue DevTools** — install the browser extension. You will use it to:
- Watch store state change in real time
- Verify reactivity without console.log
- See exactly what props components receive

**Your debugging rule for this lab:**
```
symptom → isolate → verify one thing → fix → move on
```

Never debug two things at once. If something breaks, comment out the last thing you added and verify the previous state still works.

---

## Phase 1 — Pinia Setup

### What to learn
How Pinia integrates into a Vue app at the root level and what `defineStore` with the Composition API style means.

### Where to search
Vue docs → search **"Pinia"** → it redirects to `pinia.vuejs.org`
Read only: **Introduction** and **Defining a Store** → **Setup Stores** section specifically.

### Why this concept is needed
Every store in this lab uses `defineStore`. If you misunderstand the setup store pattern, every store you write will have reactivity bugs.

### Small implementation goal
Install Pinia, register it in `main.js`, create an empty `productStore.js` that exports a store with one empty `ref([])` called `products`. Nothing else.

### Isolation test
In any component temporarily write:
```js
const store = useProductStore()
console.log(store.products)
```
If you see an empty array in the console — Pinia is wired correctly.

### Refactor checkpoint
None yet. Move on immediately.

### Common bugs
- Forgetting `app.use(pinia)` in `main.js` — store will be undefined everywhere
- Using Options Store style (`state: () => ({})`) instead of Setup Store style — the lab uses composables inside stores which only works in Setup Store style
- Not returning state/getters/actions from the setup store — they become invisible to components

---

## Phase 2 — useLocalStorage Composable

### What to learn
What a composable is, how `ref` and `watch` with `deep: true` work together, and how `JSON.parse/stringify` bridges localStorage and Vue reactivity.

### Where to search
Vue docs → **Reusability** → **Composables**
Read the entire page — it's short. Focus on the pattern: a function that returns reactive refs.
Then Vue docs → search **"watch"** → read the `deep` option section specifically.

### Why this concept is needed
This is the foundation of `cartStore`. If the composable has a reactivity bug, the cart will appear to work but silently fail to persist. Better to isolate and verify this before cart logic touches it.

### Small implementation goal
Create `useLocalStorage.js`. It accepts a key and default value. Returns one reactive ref. On init it reads from localStorage if a value exists. Uses `watch` deep to write back on any change.

### Isolation test
In a temporary component:
```js
const name = useLocalStorage('test-key', 'hello')
name.value = 'world'
```
Then refresh the page. Open DevTools → Application → localStorage. Verify `test-key` holds `"world"`. Then verify `name.value` on mount reads `"world"` not `"hello"`.

### Refactor checkpoint
Once `cartStore` is fully working, come back and verify: does clearing the cart also clear localStorage? If yes, the composable is correct.

### Common bugs
- Forgetting `JSON.stringify` on write → stores `[object Object]` string
- Forgetting `JSON.parse` on read → gives you a string instead of an array
- Not using `deep: true` → nested changes inside arrays/objects won't trigger the watch
- Initializing the ref with the default before checking localStorage → you lose persisted data on every mount

---

## Phase 3 — useApi Composable

### What to learn
How to wrap `fetch` in a function that exposes reactive `loading`, `error`, and `data` refs. How `async/await` interacts with Vue reactivity. How `try/catch/finally` guarantees `loading` resets even on error.

### Where to search
Vue docs → **Composables** page again — re-read the async composable section.
MDN → search **"fetch API"** → read the basic usage and the PUT request example.

### Why this concept is needed
Every HTTP call in the lab goes through this composable. If `loading` doesn't reset on error, your UI will show a spinner forever. If errors are swallowed silently, you'll have no idea why data isn't loading.

### Small implementation goal
Create `useApi.js` that accepts a `baseUrl`. Exposes `loading`, `error`, `data` refs. Implements `getAll()` only first. `getAll` does a GET request to `baseUrl` and populates `data.value`.

### Isolation test
Call `useApi('http://localhost:3000/products')` in a temporary component. Call `getAll()` on mount. Log `data.value`. Verify you see your products array from json-server before writing any store code.

If you see `null` — check: is json-server running? Is the URL correct? Open `http://localhost:3000/products` directly in the browser first.

### Refactor checkpoint
After `productStore` works, add the `update` (PUT) method to `useApi`. Only add it when you need it — not before.

### Common bugs
- Not setting `loading.value = false` in a `finally` block → if fetch throws, loading stays true forever
- Not setting `error.value = null` at the start of each call → old errors persist into new requests
- Using `data.value = await fetch(...)` instead of `data.value = await response.json()` → you store a Response object, not actual data

---

## Phase 4 — productStore

### What to learn
How Pinia actions work in a Setup Store, how to call a composable from inside a store, and how `computed` inside a store becomes a getter.

### Where to search
Pinia docs → **Defining a Store** → **Setup Stores**
Pinia docs → **Actions** section
Pinia docs → **Getters** section — specifically the computed example in Setup Stores

### Why this concept is needed
`productStore` is the single source of truth for all product data. If `fetchProducts` doesn't properly populate `products`, every component that reads from the store will show nothing.

### Small implementation goal
Create `productStore.js`. Use `useApi` internally. Implement `fetchProducts` that calls `getAll` and sets `products`. Add `getProductById` as a computed getter. Do not implement `decreaseStock` yet.

### Isolation test
In `HomeView`, import the store, call `fetchProducts` in `onMounted`, log `store.products` after the call. Open Vue DevTools → Pinia tab → verify products array is populated with your json-server data.

Then verify `getProductById(1)` returns the correct product before connecting it to any template.

### Refactor checkpoint
After the cart is working, come back and implement `decreaseStock`. It needs `useApi`'s `update` method which you haven't written yet — this is intentional sequencing.

### Common bugs
- Calling `useApi` outside the store function → composable refs aren't scoped to the store, causes shared state across stores
- Using `store.products = result` instead of `store.products.value = result` inside the store → assignments don't trigger reactivity in Setup Stores
- `getProductById` as a regular function instead of `computed` → it won't be reactive, UI won't update when products change

---

## Phase 5 — HomeView wired to productStore

### What to learn
How to consume a Pinia store in a component, how to show loading and error states reactively, and how `storeToRefs` preserves reactivity when destructuring.

### Where to search
Pinia docs → **Using the Store** → specifically the `storeToRefs` section

### Why this concept is needed
Destructuring a store without `storeToRefs` breaks reactivity silently — the most common Pinia beginner bug.

### Small implementation goal
Remove all product props from `HomeView`. Import `productStore`. Call `fetchProducts` on mount. Show a loading spinner while `store.loading` is true. Show an error message if `store.error` is not null. Render products when loaded.

### Isolation test
Artificially slow down your fetch by adding `await new Promise(r => setTimeout(r, 2000))` inside `fetchProducts`. Verify the loading state appears for 2 seconds then disappears. Remove the delay after.

Then disconnect json-server (stop the terminal). Reload the page. Verify the error state appears.

### Refactor checkpoint
Once confirmed working, clean up any remaining product props from `App.vue`. Verify `App.vue` now passes nothing to views.

### Common bugs
- `const { products } = store` instead of `const { products } = storeToRefs(store)` → products is a plain value, template never updates
- Calling `fetchProducts` without `await` → loading state flickers incorrectly
- Not handling the case where products is empty array vs still loading → UI shows "no products" during load

---

## Phase 6 — cartStore

### What to learn
How one Pinia store can call another store's action (`productStore.decreaseStock`), and how `computed` getters derive values from reactive state.

### Where to search
Pinia docs → **Using Stores Outside Components** — specifically the section on cross-store interactions

### Why this concept is needed
`addToCart` must trigger `decreaseStock` in `productStore`. If you call it wrong, stock decreases in the UI but the store state becomes inconsistent.

### Small implementation goal
Create `cartStore.js`. Use `useLocalStorage('cart', [])` for the items ref. Implement `addToCart` only — if product exists increase qty, if not push with qty 1. Implement `totalItems` computed. Do not implement `removeFromCart` or `clearCart` yet.

### Isolation test
In any component call `cartStore.addToCart(someProduct)` manually. Open DevTools → Application → localStorage → verify `cart` key exists with correct data. Refresh the page. Open Vue DevTools → Pinia → cartStore → verify items are still there after refresh.

Then call `addToCart` with the same product twice. Verify quantity becomes 2, not two separate entries.

### Refactor checkpoint
After `CartView` is built, add `removeFromCart` and `clearCart`. Only then add `decreaseStock` call inside `addToCart`.

### Common bugs
- Importing `productStore` at the top level of `cartStore` file instead of inside the action — causes circular dependency errors
- Mutating `items` directly without going through the ref → localStorage watch doesn't fire
- `totalItems` as a regular function instead of `computed` → navbar count won't update automatically

---

## Phase 7 — CartView

### What to learn
How to display and interact with store state directly in a component, and how computed totals stay in sync automatically.

### Where to search
Vue docs → **Template Syntax** → **List Rendering** — review `v-for` on store arrays
Vue docs → **Reactivity Fundamentals** — verify you understand why template updates automatically

### Small implementation goal
Create `CartView.vue`. Import `cartStore`. Display items list with name, price, quantity, subtotal per item. Show `totalPrice`. Show empty state when `items.length === 0`. Add remove button per item.

### Isolation test
Add 3 different products to cart via `ProductCard`. Navigate to `/cart`. Verify all 3 appear. Remove one. Verify it disappears and total updates instantly. Refresh. Verify remaining 2 are still there.

### Common bugs
- Computing `totalPrice` in the component instead of the store — breaks the single source of truth rule
- Using `index` as `v-for` key instead of `product.id` — causes wrong items to be removed

---

## Phase 8 — decreaseStock + PUT request

### What to learn
How `PUT` differs from `PATCH`, why json-server requires the full object on PUT, and how to implement the `update` method in `useApi`.

### Where to search
MDN → search **"fetch PUT request"**
json-server GitHub README → search **"PUT"**

### Small implementation goal
Add `update(id, body)` to `useApi`. Add `decreaseStock(productId)` to `productStore`. Call `decreaseStock` inside `cartStore.addToCart`. Verify json-server's `db.json` file actually changes after a purchase.

### Isolation test
Buy a product. Open `db.json` directly in VS Code. Verify the stock number decreased. Restart json-server. Reload the app. Verify the decreased stock is still there — it came from the file, not memory.

### Common bugs
- Sending only `{ stock: newValue }` instead of the full product object → json-server replaces the product with just the stock field, you lose all other data
- Not finding the product in the store before sending the PUT → sending stale data
- Not updating `products.value` in the store after the PUT → UI shows old stock until next fetch

---

## General Debugging Rules for This Lab

**Reactivity not updating?**
Open Vue DevTools → check if the store state actually changed. If store changed but UI didn't — you broke reactivity by destructuring without `storeToRefs`. If store didn't change — your action has a bug.

**localStorage not persisting?**
Open DevTools → Application → localStorage before and after the action. If key doesn't exist — `setItem` never ran. If key exists but holds wrong value — `JSON.stringify` issue.

**fetch not working?**
Always test the URL directly in the browser first. If browser shows data but fetch fails — check CORS, check the URL string in code exactly.

**"Everything broke and I don't know why"**
Stop. Use `git diff` or manually undo your last change. Verify the previous state works. Add back one thing at a time. Never debug more than one change at a time.