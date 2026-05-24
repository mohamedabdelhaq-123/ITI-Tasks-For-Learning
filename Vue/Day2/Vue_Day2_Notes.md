# Vue.js — Day 2 Study Notes
> Builds directly on Day 1. Focus: **Vue Router**, **Lifecycle Hooks**, **Watchers**, **Component Composition Patterns**, and **VueUse intro**.
> All code examples are derived from the instructor's session project — a product details SPA called **ShopDash**.

---

## Table of Contents

1. [The Big Picture — What We Built](#1-the-big-picture--what-we-built)
2. [Views vs Components — The Architecture Pattern](#2-views-vs-components--the-architecture-pattern)
3. [Vue Router — Core Concepts](#3-vue-router--core-concepts)
4. [Dynamic Routes & Regex Matching](#4-dynamic-routes--regex-matching)
5. [Passing Route Params as Props](#5-passing-route-params-as-props)
6. [Route Meta Fields](#6-route-meta-fields)
7. [Lazy Loading Routes](#7-lazy-loading-routes)
8. [Wildcard Routes & 404 Handling](#8-wildcard-routes--404-handling)
9. [RouterLink & RouterView in Templates](#9-routerlink--routerview-in-templates)
10. [Navigation Guards — Preview (Day 3 Topic)](#10-navigation-guards--preview-day-3-topic)
11. [Lifecycle Hooks](#11-lifecycle-hooks)
12. [Watchers — watch() and watchEffect()](#12-watchers--watch-and-watcheffect)
13. [The Computed vs Ref + Watch Pattern — A Critical Decision](#13-the-computed-vs-ref--watch-pattern--a-critical-decision)
14. [Component Composition — Building a Hierarchy](#14-component-composition--building-a-hierarchy)
15. [Using the Intl API for Formatting](#15-using-the-intl-api-for-formatting)
16. [Programmatic Navigation](#16-programmatic-navigation)
17. [VueUse — What It Is and Why It Matters](#17-vueuse--what-it-is-and-why-it-matters)
18. [Quick Reference Cheatsheet](#18-quick-reference-cheatsheet)

---

## 1. The Big Picture — What We Built

Day 2 introduced **Vue Router** and built a real multi-page product app called **ShopDash**. The key architectural evolution from Day 1:

```
Day 1 mindset:  One component, manual v-if toggling between "pages"
Day 2 mindset:  Proper routing — URL changes drive what gets rendered
```

Looking at the commented-out code in `App.vue`, you can literally see the evolution the instructor walked through:

```vue
<!-- App.vue — What we started with (Day 1 thinking) -->
<!-- <button @click="toggle">Toggle a view</button> -->
<!-- <ProductDetailsView v-if="toggleView" /> -->

<!-- App.vue — What routing gives us instead -->
<RouterView />   <!-- One line replaces all the manual toggling -->
```

The final project structure renders like this:

```
URL: /product/101
  App.vue (shell — always rendered)
  ├── AppHeader.vue          ← always visible
  ├── <RouterView />         ← renders ProductDetailsView for this URL
  │   ├── ProductHeroSection.vue
  │   │   └── ProductView.vue
  │   └── RelatedProducts.vue
  │       └── ProductCard.vue (× 3 other products)
  └── AppFooter.vue          ← always visible

URL: /anything-unknown
  App.vue (shell)
  ├── AppHeader.vue
  ├── <RouterView /> → NotFoundView.vue
  └── AppFooter.vue
```

---

## 2. Views vs Components — The Architecture Pattern

Day 1 introduced the naming convention. Day 2 shows it in practice. Here's the distinction made concrete:

| | `components/` | `views/` |
|---|---|---|
| **Role** | Reusable UI brick | Route-level screen |
| **Knows about routing?** | ❌ No | ✅ Yes |
| **Receives data via** | Props from parent | Props from route OR fetches its own |
| **Examples (session)** | `ProductCard`, `AppHeader`, `RelatedProducts` | `ProductDetailsView`, `NotFoundView` |
| **Naming** | `ProductCard.vue` | `ProductDetailsView.vue` |

**Mental model:** A **view** is the conductor of an orchestra. It knows what's playing (which route), it receives the score (route params), and it hands out parts (props) to the individual musicians (components). The musicians don't care what piece is playing — they just play their part.

```
ProductDetailsView.vue (view — knows productId from route)
  ↓ passes :product prop
ProductHeroSection.vue (component — doesn't know about routing)
  ↓ passes :product prop
ProductView.vue (component — purely presentational)
```

---

## 3. Vue Router — Core Concepts

📖 [Vue Router Docs — Getting Started](https://router.vuejs.org/guide/)

### What is Vue Router?

Vue Router is the official routing library for Vue. It maps URLs to components so that navigating to `/product/101` renders a specific view without a full page reload. It's what makes a Vue app a true **SPA**.

**Compared to React / Angular:**

| | Vue | React | Angular |
|---|---|---|---|
| **Router** | Vue Router (official, by same team) | React Router (third-party) | Angular Router (built-in) |
| **Setup** | `app.use(router)` | `<BrowserRouter>` wrapper | `RouterModule.forRoot(routes)` |
| **Route outlet** | `<RouterView />` | `<Outlet />` / `<Routes>` | `<router-outlet>` |
| **Navigation link** | `<RouterLink>` | `<Link>` | `<a routerLink="...">` |

### Setting Up the Router (`router/index.js`)

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import ProductDetailsView from "@/views/ProductDetailsView.vue";

const routes = [
  {
    path: "/product/:productId(\\d+)", // regex: only match digits
    name: "product",                   // named routes — use this instead of hardcoded paths
    component: ProductDetailsView,     // eagerly loaded (imported at the top of the file)
    props: (route) => ({ productId: Number(route.params.productId) }),
    meta: {
      auth: true,
      requiredPermissions: ["product.read", "product.write"],
    },
  },
  {
    path: "/:catchAll(.*)",            // wildcard — catches ALL unmatched routes
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"), // lazily loaded
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // ↑ HTML5 History mode: clean URLs like /product/101 (no # symbol)
  // Alternative: createWebHashHistory() → /#!/product/101 (old-school, no server config needed)
  routes,
});

export default router;
```

### Registering the Router in `main.js`

```javascript
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";  // import the router instance

const app = createApp(App);

app.use(router)  // register the plugin
   .mount("#app");

// ↑ Chaining .use().mount() is valid — use() returns the app instance
```

### `createWebHistory` vs `createWebHashHistory`

> This is a question beginners commonly face when their app works on `localhost` but breaks when deployed.

| | `createWebHistory` | `createWebHashHistory` |
|---|---|---|
| **URL looks like** | `/product/101` | `/#/product/101` |
| **Requires server config?** | ✅ Yes — server must redirect all routes to `index.html` | ❌ No — hash part never reaches server |
| **SEO-friendly?** | ✅ Better | ❌ Worse |
| **Use for** | Production apps with proper server setup | Quick prototypes, GitHub Pages |

In development with Vite, `createWebHistory` works perfectly. For deployment, your hosting server (Nginx, Apache, Vercel) needs to be configured to serve `index.html` for all routes.

---

## 4. Dynamic Routes & Regex Matching

📖 [Vue Router Docs — Dynamic Route Matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html)

A **dynamic route** is one where part of the URL is a variable — like a product ID or a username.

### Basic Dynamic Segment

```javascript
// Matches: /product/101  /product/abc  /product/anything
path: "/product/:productId"
//           ↑ colon prefix = dynamic segment
//              Accessible as route.params.productId (always a string)
```

### With Regex Constraint (what the instructor used)

```javascript
// Matches ONLY: /product/101  /product/99  (digits only)
// Does NOT match: /product/abc  /product/abc123
path: "/product/:productId(\\d+)"
//                         ↑ regex inside () — \d+ means "one or more digits"
//                         Note the double backslash: \\ in JS string = \ in regex
```

**Why use regex constraints?**
- Prevents your component from receiving invalid data like `productId = "abc"`
- Unmatched routes fall through to the next route in the list (like the wildcard `/:catchAll(.*)`)
- Avoids needing to manually validate `productId` inside the component

### Regex in Routes: Non-Regex vs Regex Comparison

```
URL: /product/abc

With path: "/product/:productId"       → MATCHES (productId = "abc")
With path: "/product/:productId(\\d+)" → NO MATCH → falls to next route → 404 page ✅
```

**Compared to React Router:** React Router uses loaders and type coercion manually. Vue Router's regex constraint is cleaner for simple type enforcement.

---

## 5. Passing Route Params as Props

📖 [Vue Router Docs — Passing Props to Routes](https://router.vuejs.org/guide/essentials/passing-props.html)

This is one of the most important patterns in Vue Router — it **decouples your view component from the router**.

### The Problem Without Props Mode

```vue
<!-- ❌ Tight coupling — this component only works when used with Vue Router -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = Number(route.params.productId)  // component knows it's in a route
</script>
```

The component now depends on `useRoute()` — you can't reuse it outside a routing context, and testing it is harder.

### Method 1: `props: true` (simple pass-through)

```javascript
{
  path: "/product/:productId",
  component: ProductDetailsView,
  props: true,
  // ↑ Passes ALL route.params as props to the component
  // productId arrives as a String (always — URL params are strings)
}
```

```vue
<script setup>
const props = defineProps({
  productId: { type: String, required: true }  // String, not Number
})
</script>
```

### Method 2: `props: (route) => ({...})` — Function Mode (what the instructor used)

```javascript
{
  path: "/product/:productId(\\d+)",
  component: ProductDetailsView,
  props: (route) => ({ productId: Number(route.params.productId) }),
  //              ↑ Transform function: converts the string "101" → number 101
  //                before it reaches the component as a prop
}
```

```vue
<!-- ProductDetailsView.vue — now receives a Number, not a String -->
<script setup>
const props = defineProps({
  productId: {
    type: Number,   // ✅ Already a number — no conversion needed in component
    required: true,
  },
})
</script>
```

**Why function mode is better:**
- You control the exact shape of the props
- Type conversions happen at the router level, not scattered in components
- The component stays pure — it just receives a properly typed Number

### Mental Model

```
URL:  /product/101
Router:  params = { productId: "101" }  (always strings from URL)
  ↓
props function: ({ productId: Number("101") }) → { productId: 101 }
  ↓
Component: receives productId = 101 (Number) ✅
```

---

## 6. Route Meta Fields

📖 [Vue Router Docs — Route Meta Fields](https://router.vuejs.org/guide/advanced/meta.html)

`meta` is a custom object you attach to a route to carry metadata that navigation guards and other logic can read. It's like tags on a route.

```javascript
{
  path: "/product/:productId(\\d+)",
  name: "product",
  component: ProductDetailsView,
  meta: {
    auth: true,                                         // Requires authentication?
    admin: true,                                        // Requires admin role?
    requiredPermissions: ["product.read", "product.write"],  // Specific permissions
  },
}
```

`meta` doesn't do anything on its own — it's data you read inside navigation guards (covered below and in Day 3) to make decisions:

```javascript
// Example: reading meta in a guard
router.beforeEach((to, from) => {
  if (to.meta.auth && !isLoggedIn()) {
    return { path: "/login" }
  }
})
```

**Mental model:** `meta` is the route's "label" or "badge" — it tells your guards what kind of route this is, without the guard needing to hardcode specific route names.

---

## 7. Lazy Loading Routes

📖 [Vue Router Docs — Lazy Loading Routes](https://router.vuejs.org/guide/advanced/lazy-loading.html)

By default, all components are bundled together and downloaded when the user first loads the app. **Lazy loading** splits the bundle so each route's component is only downloaded when that route is visited.

```javascript
// ❌ Eager loading — always bundled and downloaded upfront
import ProductDetailsView from "@/views/ProductDetailsView.vue";

const routes = [
  { path: "/product/:productId", component: ProductDetailsView }
]

// ✅ Lazy loading — downloaded only when user visits this route
const routes = [
  {
    path: "/product/:productId",
    component: () => import("@/views/ProductDetailsView.vue")
    //         ↑ Arrow function returning a dynamic import()
    //           Vite creates a separate chunk file for this
  }
]
```

### Eager vs Lazy — When to Use Which

In the session, `ProductDetailsView` was **eagerly loaded** and `NotFoundView` was **lazily loaded**. Here's the reasoning:

| | Eager (static import) | Lazy (dynamic import) |
|---|---|---|
| **Download timing** | Always, on app load | Only when route is visited |
| **Use for** | Routes visited by almost everyone (home, main page) | Rarely visited routes (404, admin panel, settings) |
| **Session example** | `ProductDetailsView` (main feature) | `NotFoundView` (rarely needed) |

```javascript
// The session's hybrid approach — perfectly valid
import ProductDetailsView from "@/views/ProductDetailsView.vue"; // eager

const routes = [
  { component: ProductDetailsView },                          // eager — main route
  { component: () => import("@/views/NotFoundView.vue") },  // lazy — rarely visited
]
```

---

## 8. Wildcard Routes & 404 Handling

📖 [Vue Router Docs — Catch-All Routes](https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route)

A wildcard route catches any URL that didn't match any previous route. It **must be the last route** in your array.

```javascript
const routes = [
  { path: "/product/:productId(\\d+)", component: ProductDetailsView },
  // ... other routes ...
  
  {
    path: "/:catchAll(.*)",   // .* = match literally anything
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
  },
  // ↑ MUST be last. Routes are matched in order — first match wins.
]
```

**Vue Router 4 syntax vs older versions:**

```javascript
// Vue Router 3 (old) — simple asterisk
{ path: "*" }

// Vue Router 4 (current) — explicit named catch-all
{ path: "/:catchAll(.*)" }
```

### The 404 Component Strategy

Looking at `NotFoundView.vue`, the instructor used **programmatic navigation** on mount to redirect to a proper `/not-found` URL (discussed in [Section 16](#16-programmatic-navigation)):

```vue
<!-- NotFoundView.vue -->
<script setup>
import router from "@/router";
import { onMounted } from "vue";

onMounted(() => {
  router.replace({ path: "/not-found" })
  // replace() instead of push() → doesn't add to browser history
  // So the user can't hit "back" to return to the invalid URL
})
</script>
<template>404</template>
```

> **Why `replace` and not `push`?** If a user visits `/abc123` (invalid), you redirect them to `/not-found`. With `push()`, pressing Back would take them to `/abc123` again — infinite redirect loop. `replace()` swaps the history entry instead of adding a new one.

---

## 9. RouterLink & RouterView in Templates

📖 [Vue Router Docs — RouterLink](https://router.vuejs.org/api/interfaces/RouterLinkProps.html) | [RouterView](https://router.vuejs.org/api/interfaces/RouterViewProps.html)

### `<RouterView />` — The Render Outlet

`RouterView` is where Vue Router renders the matched route's component. You place it once in `App.vue` (or inside a layout):

```vue
<!-- App.vue -->
<template>
  <AppHeader />

  <main>
    <RouterView />   <!-- The matched route component renders here -->
  </main>

  <AppFooter />
</template>
```

Think of `<RouterView />` as a "slot" that the router fills in. `AppHeader` and `AppFooter` always stay — only the `RouterView` content changes as the user navigates.

**Compared to React:** `<Outlet />` in React Router 6
**Compared to Angular:** `<router-outlet>`

### `<RouterLink>` — Navigation Without Full Reload

```vue
<!-- ProductCard.vue — the instructor's code -->
<RouterLink :to="`/product/${product.id}`">
  <button class="btn btn-sm btn-primary">View Product</button>
</RouterLink>
```

`RouterLink` renders as an `<a>` tag but intercepts the click and navigates via JavaScript — no full page reload.

**Compared to a plain `<a>` tag:**

```html
<!-- ❌ Plain anchor — full page reload, loses all Vue state -->
<a href="/product/101">View</a>

<!-- ✅ RouterLink — SPA navigation, instant, preserves state -->
<RouterLink to="/product/101">View</RouterLink>
```

### Named Routes with RouterLink

Instead of hardcoding paths, use the route's `name` for cleaner, refactor-safe navigation:

```vue
<!-- ❌ Hardcoded path — breaks if you ever rename the route path -->
<RouterLink :to="`/product/${product.id}`">View</RouterLink>

<!-- ✅ Named route — survives path changes -->
<RouterLink :to="{ name: 'product', params: { productId: product.id } }">
  View
</RouterLink>
```

---

## 10. Navigation Guards — Preview (Day 3 Topic)

📖 [Vue Router Docs — Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)

The instructor left `router.beforeEach` commented out with "TBC in Day 3 with auth store":

```javascript
// router/index.js — commented out, coming in Day 3

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.auth)) {
//     next("/login");   // redirect to login if route requires auth
//   } else {
//     next();           // proceed normally
//   }
// });
```

**What is a navigation guard?** A function that runs before every route change, letting you cancel, redirect, or allow navigation. It's Vue Router's equivalent of Angular's `CanActivate` route guards or React Router's `loader` functions.

The full guard system runs in this order:
```
User clicks link
  → router.beforeEach()       ← global guard (auth checks)
  → route's beforeEnter()     ← per-route guard
  → component's onBeforeRouteUpdate()  ← if same component, different params
  → router.afterEach()        ← runs after navigation confirmed (analytics, etc.)
```

You'll implement this in Day 3 once the Pinia auth store is built. For now, just understand the `meta` fields on routes are the data that guards will read.

---

## 11. Lifecycle Hooks

📖 [Vue.js Docs — Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)

### Mental Model

Every Vue component goes through a series of life stages — creation, mounting to the DOM, updating when state changes, and unmounting when it's removed. **Lifecycle hooks** are functions you register to run at specific stages.

```
Component created in memory
        ↓
  onBeforeMount()   ← reactive state set up, but no DOM yet
        ↓
   DOM created
        ↓
   onMounted()      ← DOM exists. Safe to access DOM, fetch data, start timers.
        ↓
  State changes → DOM re-renders
        ↓
   onUpdated()      ← after each DOM update (rarely needed directly)
        ↓
  Component removed from DOM
        ↓
  onUnmounted()     ← cleanup: clear intervals, cancel requests, remove listeners
```

### The Two You'll Use Most — `onMounted` and `onUnmounted`

```vue
<!-- ProductDetailsView.vue — session code -->
<script setup>
import { onMounted, onUnmounted } from "vue"  // must import from 'vue'

onMounted(() => {
  getPageData()                    // ← fetch data, initialize things
  console.log("Page mounted")
})

onUnmounted(() => {
  console.log("Page unmounted")   // ← cleanup
  // clearInterval(timer)
  // cancelSubscription()
  // controller.abort()  (for fetch cancellation)
})
</script>
```

**Why not just run code at the top of `<script setup>`?**

```vue
<script setup>
// This runs during component creation — before the DOM exists
// Fine for: setting up refs, computed values, watchers
// NOT safe for: accessing DOM elements (they don't exist yet)

const data = ref(null)           // ✅ Fine at top level
data.value = fetchData()        // ✅ Fine

// document.getElementById('app') // ❌ May be null — DOM not ready yet
</script>
```

`onMounted` guarantees the DOM exists and the component is fully rendered.

**Compared to React:** `useEffect(() => { ... }, [])` with empty dependency array
**Compared to Angular:** `ngOnInit()` for mounting, `ngOnDestroy()` for cleanup

### Lifecycle Hooks Comparison Table

| Vue 3 (Composition API) | React | Angular |
|---|---|---|
| `onBeforeMount` | — | `ngOnInit` (before render) |
| `onMounted` | `useEffect(() => {}, [])` | `ngAfterViewInit` |
| `onUpdated` | `useEffect(() => {})` (no deps) | `ngAfterViewChecked` |
| `onUnmounted` | `useEffect` cleanup `return () => {}` | `ngOnDestroy` |

### Common Beginner Mistakes with Lifecycle Hooks

```javascript
// ❌ Mistake 1: Forgetting to import
onMounted(() => { ... })   // ReferenceError: onMounted is not defined
// Fix:
import { onMounted } from 'vue'

// ❌ Mistake 2: Trying to fetch data at script top level and use it in the template immediately
const product = await fetch('/api/product/1')  // Can't use top-level await in <script setup>
                                               // without Suspense wrapping
// Fix: use onMounted + a ref initialized to a safe empty value
const product = ref(null)
onMounted(async () => {
  product.value = await fetchProduct()
})

// ❌ Mistake 3: Not cleaning up (memory leaks)
onMounted(() => {
  window.addEventListener('resize', handleResize)
  // If you don't remove this, it stays even after the component is gone
})
// Fix:
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

---

## 12. Watchers — `watch()` and `watchEffect()`

📖 [Vue.js Docs — Watchers](https://vuejs.org/guide/essentials/watchers.html)

### Mental Model

Watchers are for **side effects** triggered by reactive state changes. A "side effect" is anything that reaches outside Vue's reactivity system — API calls, logging, modifying localStorage, DOM manipulation.

```
Rule of thumb:
  Deriving a new value from state? → computed()
  Reacting to a state change with a side effect? → watch()
```

### `watch()` — Explicit, Controlled, Lazy

`watch()` explicitly declares what to watch and only fires when that specific thing changes.

```vue
<!-- ProductDetailsView.vue — from the session -->
<script setup>
import { watch } from "vue"

// Watching a prop (must use a getter function)
watch(
  () => props.productId,    // ← getter: a function that returns the watched value
  getPageData,              // ← callback: runs when productId changes
  { immediate: false }      // ← options: don't run on mount (we have onMounted for that)
)
</script>
```

**Why a getter function `() => props.productId` and not just `props.productId`?**

```javascript
// ❌ This doesn't work for props — loses reactivity
watch(props.productId, callback)
// At the moment watch() is called, props.productId evaluates to 101 (a plain number)
// watch() receives 101, not a reactive reference — it can't track changes

// ✅ Getter function — evaluated lazily, maintains reactivity
watch(() => props.productId, callback)
// watch() receives the function itself, calls it on each check to get the current value
```

This is one of the most confusing Vue beginner mistakes. Always use a getter `() => props.x` when watching props.

### `watch()` with Options

```javascript
import { watch, ref } from 'vue'

const productId = ref(101)

watch(
  () => productId.value,         // source: what to watch
  (newValue, oldValue) => {      // callback: receives new AND old values
    console.log(`Changed from ${oldValue} to ${newValue}`)
    fetchProduct(newValue)
  },
  {
    immediate: true,   // Run the callback immediately on mount (don't wait for a change)
    deep: true,        // Watch nested properties inside objects
  }
)

// immediate: false (the session's choice) means:
// "Don't run on mount — onMounted handles the first load.
//  Only react when productId actually changes."
```

### `watchEffect()` — Implicit, Always Immediate

`watchEffect()` automatically tracks any reactive value accessed inside it and re-runs whenever any of them change. No need to declare what you're watching.

```javascript
import { watchEffect } from 'vue'

// Automatically tracks: productId (because it's read inside)
watchEffect(() => {
  console.log(`Fetching product ${productId.value}`)
  fetchProduct(productId.value)
})
// Runs immediately on mount AND whenever productId.value changes
```

### `watch` vs `watchEffect` — Decision Table

| | `watch` | `watchEffect` |
|---|---|---|
| **Dependencies** | You declare them explicitly | Auto-tracked (anything accessed inside) |
| **Runs on mount?** | ❌ No (lazy) unless `immediate: true` | ✅ Always immediately |
| **Gets old value?** | ✅ Yes `(newVal, oldVal)` | ❌ No |
| **Control** | More explicit and precise | More convenient, less control |
| **Use when** | You need old value, or lazy triggering | Simple side effects, auto-tracking |
| **Session example** | `watch(() => props.productId, getPageData, { immediate: false })` | — |

### Common Beginner Mistakes with Watchers

```javascript
// ❌ Mistake 1: Watching a prop directly (not a getter)
watch(props.productId, callback)   // Doesn't react to changes!
watch(() => props.productId, callback)  // ✅ correct

// ❌ Mistake 2: Putting async operations directly without handling loading state
watch(() => props.id, async (newId) => {
  const data = await fetch(`/api/product/${newId}`)
  // If user navigates quickly (101 → 102 → 103), multiple fetches run simultaneously
  // The slowest one might arrive last and overwrite the correct data
})
// Fix: use an abort controller or track the current request (the instructor's comment
// about "isLoading, data, error refs" hints at this pattern)

// ❌ Mistake 3: Putting computed logic inside watch
watch(source, () => {
  total.value = items.value.reduce(...)  // This should be computed(), not watch()
})
```

---

## 13. The Computed vs Ref + Watch Pattern — A Critical Decision

This is the most instructionally rich part of the session. The instructor's commented-out code shows three approaches to the same problem — and explains why only one works correctly for this use case.

**The problem:** Given a `productId` prop that can change (when user navigates from one product to another), derive `featuredProduct` and `relatedProducts`.

### Approach 1 — `computed()` ✅ (correct for simple derivation)

```javascript
// From the instructor's commented code — this WORKS
const featuredProduct = computed(() =>
  products.value.find((p) => p.id === props.productId)
)
const relatedProducts = computed(() =>
  products.value.filter((p) => p.id !== props.productId)
)
```

**Why it works:** `computed()` tracks `props.productId` as a dependency. When `productId` changes (user navigates to a different product), the computed re-runs automatically. No `watch` needed.

**Why the instructor commented it out anyway:** In a real app, `products` wouldn't be a local `ref` — it would come from an **async API call**. `computed()` cannot be async. So the instructor set up the async-ready pattern instead.

### Approach 2 — Plain `ref()` Initialized from Props ❌ (this won't work)

```javascript
// The instructor explicitly commented: "This won't work.....why?"
const featuredProduct = ref(
  products.value.find((p) => p.id === props.productId)
)
const relatedProducts = ref(
  products.value.filter((p) => p.id !== props.productId)
)
```

**Why it doesn't work:** `ref()` is called once at setup time. It captures the **initial value** of the expression — but doesn't track `props.productId` reactively. When `productId` changes, `featuredProduct` and `relatedProducts` stay stale forever.

```
Initial render: productId = 101  → ref initialized with product 101's data  ✅
User navigates: productId = 102  → ref still has product 101's data          ❌ stale!
```

### Approach 3 — `ref` + `onMounted` + `watch` ✅ (the async-ready pattern)

```javascript
// The instructor's chosen approach — works for both sync and async data fetching
const featuredProduct = ref({})    // safe initial value — won't crash template
const relatedProducts = ref([])    // safe initial value — v-for on [] renders nothing

// Load data function — can be made async for real API calls
const getPageData = () => {
  featuredProduct.value = products.value.find((p) => p.id === props.productId)
  relatedProducts.value = products.value.filter((p) => p.id !== props.productId)
}

// 1. Run on initial mount
onMounted(() => {
  getPageData()
})

// 2. Re-run whenever productId changes (user navigates product → product)
watch(() => props.productId, getPageData, { immediate: false })
//                                                  ↑ false because onMounted already handles first load
```

**Why `{ immediate: false }`?** If you set `immediate: true`, `getPageData` runs twice on mount — once from `watch` (immediate) and once from `onMounted`. Using `false` keeps responsibilities clear: `onMounted` handles the first load, `watch` handles subsequent changes.

### The Full Decision Tree

```
Do you need to derive a value from state?
  ↓
  Can it be synchronous?
    → YES → use computed()  (simplest, auto-tracked, cached)
    → NO (async API call) → use ref + onMounted + watch pattern

Does the derived value need to react to prop changes?
  → computed() handles this automatically
  → ref() does NOT — you need watch()
```

### What the Instructor's Comment Hints At (Async Pattern)

```javascript
/**
 * async fetchSomething
 *
 * data ref
 * isLoading ref
 * error ref
 */
```

This is the standard async data fetching pattern in Vue. Here's what Day 3 will likely build:

```javascript
// The pattern hinted at in the comments
const product = ref(null)
const isLoading = ref(false)
const error = ref(null)

const fetchProduct = async (id) => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(`/api/products/${id}`)
    product.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchProduct(props.productId))
watch(() => props.productId, fetchProduct, { immediate: false })
```

This triplet (`data`, `isLoading`, `error`) is so common in Vue apps that VueUse ships a ready-made composable for it — more on that in [Section 17](#17-vueuse--what-it-is-and-why-it-matters).

---

## 14. Component Composition — Building a Hierarchy

Day 2 builds a real component hierarchy. Understanding how data flows through it cements the prop-down pattern from Day 1.

```
ProductDetailsView.vue    ← owns state: featuredProduct, relatedProducts
    │
    ├── ProductHeroSection.vue  [:product, :cta-label]
    │       │
    │       └── ProductView.vue  [:product, :cta-label]
    │           (formatted price, stock badge, buy button)
    │
    └── RelatedProducts.vue  [:title, :products, :action-label]
            │
            └── ProductCard.vue × N  [:product, :action-label]
                (card with RouterLink to /product/:id)
```

### Key Composition Insights from the Code

**1. Wrapper components that just pass props through**

`ProductHeroSection` is a layout wrapper — it arranges the image and the product info side by side, and delegates all data display to `ProductView`:

```vue
<!-- ProductHeroSection.vue — pure layout + delegation -->
<script setup>
import ProductView from "./ProductView.vue"

defineProps({
  product: { type: Object, required: true },
  ctaLabel: { type: String, default: "Buy Now" },
})
</script>

<template>
  <section class="card ...">
    <figure>...</figure>
    <div>
      <!-- Passes the exact same props it received down to ProductView -->
      <ProductView :product="product" :cta-label="ctaLabel" />
    </div>
  </section>
</template>
```

This is the **Single Responsibility Principle** in Vue: `ProductHeroSection` handles *layout*, `ProductView` handles *display logic*. Neither does both.

**2. CamelCase props become kebab-case in templates**

```vue
<!-- In defineProps — camelCase -->
defineProps({ ctaLabel: String })

<!-- In parent template — Vue auto-converts to kebab-case -->
<ProductView :cta-label="buyNowLabel" />  <!-- both :cta-label and :ctaLabel work -->
```

**3. The `<article>` semantic HTML pattern**

The instructor used `<article>` for `ProductView` and `ProductCard`, not `<div>`. Semantic HTML matters for accessibility and SEO — an `<article>` represents a self-contained piece of content.

---

## 15. Using the Intl API for Formatting

The session introduced JavaScript's built-in `Intl.NumberFormat` for currency formatting via `computed()`. This is pure JavaScript (not Vue-specific), but worth documenting as a best practice.

```javascript
// ProductCard.vue and ProductView.vue — both use this pattern

const formattedPrice = computed(() =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(props.product.price)
)
// Converts 129.99 → "$129.99"
// Converts 89.5   → "$89.50"
// Converts 149    → "$149.00"
```

**Why `computed()` for formatting?**
- It's derived from `props.product.price` — it should recalculate if price changes
- The result is cached — `Intl.NumberFormat` doesn't run on every render
- Alternative: a plain function called in the template `{{ formatPrice(product.price) }}` — works but recalculates on every render without caching

**The stock label and class pattern (same computed idea):**

```javascript
const stockLabel = computed(() =>
  props.product.stock > 0 ? `${props.product.stock} in stock` : "Out of stock"
)

const stockClass = computed(() =>
  props.product.stock > 0 ? "badge-success" : "badge-error"
  //                         ↑ DaisyUI classes — green badge vs red badge
)
```

```vue
<template>
  <!-- Dynamic class and content from computed -->
  <span class="badge" :class="stockClass">{{ stockLabel }}</span>
  <!--  ↑ static "badge" class always applied, stockClass added dynamically -->
</template>
```

---

## 16. Programmatic Navigation

📖 [Vue Router Docs — Programmatic Navigation](https://router.vuejs.org/guide/essentials/navigation.html)

Sometimes you need to navigate from JavaScript code, not from a `<RouterLink>` click. Vue Router provides `useRouter()` for this.

### `push()` vs `replace()`

```javascript
import { useRouter } from 'vue-router'
// OR: import router from '@/router'   (direct import — what the instructor used in NotFoundView)

const router = useRouter()  // composable — preferred in components

// push() — adds to history stack (user can go Back)
router.push('/product/101')
router.push({ name: 'product', params: { productId: 101 } })

// replace() — replaces current history entry (user cannot go Back to this URL)
router.replace({ path: '/not-found' })
// ↑ Used in NotFoundView to avoid "Back" looping to the invalid URL
```

### `useRouter()` vs Direct Import

```javascript
// In a component — use the composable
import { useRouter } from 'vue-router'
const router = useRouter()

// Outside a component (e.g., in a Pinia store, a utility) — direct import
import router from '@/router'
router.push('/login')
```

The instructor imported `router` directly in `NotFoundView.vue`. Inside `<script setup>` this works fine, but `useRouter()` is the preferred approach inside components because it's more testable and doesn't create circular dependency risks.

---

## 17. VueUse — What It Is and Why It Matters

📖 [VueUse Docs](https://vueuse.org/) | [Getting Started](https://vueuse.org/guide/)

### What is VueUse?

VueUse is a collection of **200+ ready-made composables** that wrap common browser APIs and patterns into reactive Vue utilities. Think of it as "a standard library for Vue Composition API" — things you'd otherwise write yourself over and over again.

```bash
npm install @vueuse/core
```

### Why Does It Exist?

Remember the `data / isLoading / error` pattern hinted at in the session comments? You'd write that in every component that fetches data. VueUse's `useFetch` does it for you, already reactive and production-ready.

### Composables You'll Use Most (Relevant to Session Patterns)

**`useFetch`** — The async data fetching pattern the instructor hinted at, done right:

```javascript
import { useFetch } from '@vueuse/core'

// Instead of writing: const data = ref(null), isLoading = ref(false), error = ref(null)...
const { data: product, isFetching, error } = useFetch(`/api/products/${productId}`)
  .get()
  .json()

// data, isFetching, and error are all reactive refs ✅
// Automatically handles loading state and errors
```

**`useLocalStorage`** — Reactive localStorage (great for persisting cart items, user preferences):

```javascript
import { useLocalStorage } from '@vueuse/core'

// Persists to localStorage automatically, reactive like a ref
const cartItems = useLocalStorage('cart', [])
cartItems.value.push({ id: 101, qty: 1 })  // Automatically saved to localStorage
```

**`useEventListener`** — Adds AND removes event listeners automatically on unmount (solves the cleanup mistake):

```javascript
import { useEventListener } from '@vueuse/core'

// Instead of: onMounted → addEventListener + onUnmounted → removeEventListener
useEventListener(window, 'resize', handleResize)
// Automatically removed when component unmounts ✅
```

### Mental Model for VueUse

VueUse composables follow the exact same pattern as Vue's built-in `ref` and `computed`:

```javascript
// Vue's pattern:
const count = ref(0)         // reactive value
count.value++                // mutate it

// VueUse follows the same idea:
const { x, y } = useMouse()  // reactive values from mouse position
// x.value and y.value update automatically as the mouse moves
```

VueUse isn't magic — it's composables built with the same tools you already know (`ref`, `watch`, `onMounted`, `onUnmounted`). Understanding Day 1 + Day 2 concepts means you can already understand how VueUse works under the hood.

> VueUse is mentioned here because the instructor referenced the docs. It's not used in Day 2's code yet — it's likely coming in Day 3 when async data fetching is introduced.

---

## 18. Quick Reference Cheatsheet

### Router Setup

```javascript
// router/index.js
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/product/:id(\\d+)",          // dynamic + regex
      name: "product",                      // named route
      component: ProductView,               // eager load
      props: (route) => ({ id: Number(route.params.id) }), // function props
      meta: { auth: true },                 // route metadata
    },
    {
      path: "/:catchAll(.*)",               // wildcard 404
      component: () => import("./NotFound.vue"),  // lazy load
    },
  ],
})
```

### Lifecycle Hooks

```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // DOM ready. Fetch data, initialize, start timers.
})

onUnmounted(() => {
  // Cleanup: clear timers, remove listeners, cancel requests.
})
```

### Watchers

```javascript
import { watch, watchEffect } from 'vue'

// Explicit, lazy, gets old value
watch(
  () => props.id,           // getter (always use getter for props)
  (newVal, oldVal) => { },  // callback
  { immediate: false }      // options
)

// Auto-tracked, always immediate
watchEffect(() => {
  console.log(count.value)  // count is auto-tracked
})
```

### Router in Templates

```vue
<template>
  <!-- Navigation link (no page reload) -->
  <RouterLink :to="{ name: 'product', params: { productId: 101 } }">
    View Product
  </RouterLink>

  <!-- Route outlet (where matched component renders) -->
  <RouterView />
</template>
```

### Programmatic Navigation

```javascript
import { useRouter } from 'vue-router'
const router = useRouter()

router.push({ name: 'product', params: { productId: 101 } })  // add to history
router.replace({ path: '/not-found' })                         // replace history entry
```

---

### Useful Links

| Topic | Official Doc |
|---|---|
| Vue Router — Getting Started | [router.vuejs.org/guide](https://router.vuejs.org/guide/) |
| Dynamic Route Matching | [router.vuejs.org/guide/essentials/dynamic-matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html) |
| Passing Props to Routes | [router.vuejs.org/guide/essentials/passing-props](https://router.vuejs.org/guide/essentials/passing-props.html) |
| Route Meta Fields | [router.vuejs.org/guide/advanced/meta](https://router.vuejs.org/guide/advanced/meta.html) |
| Navigation Guards | [router.vuejs.org/guide/advanced/navigation-guards](https://router.vuejs.org/guide/advanced/navigation-guards.html) |
| Lazy Loading Routes | [router.vuejs.org/guide/advanced/lazy-loading](https://router.vuejs.org/guide/advanced/lazy-loading.html) |
| Programmatic Navigation | [router.vuejs.org/guide/essentials/navigation](https://router.vuejs.org/guide/essentials/navigation.html) |
| Vue Lifecycle Hooks | [vuejs.org/guide/essentials/lifecycle](https://vuejs.org/guide/essentials/lifecycle.html) |
| Lifecycle API Reference | [vuejs.org/api/composition-api-lifecycle](https://vuejs.org/api/composition-api-lifecycle.html) |
| Watchers | [vuejs.org/guide/essentials/watchers](https://vuejs.org/guide/essentials/watchers.html) |
| Composables | [vuejs.org/guide/reusability/composables](https://vuejs.org/guide/reusability/composables.html) |
| VueUse Getting Started | [vueuse.org/guide](https://vueuse.org/guide/) |
| VueUse Function List | [vueuse.org/functions](https://vueuse.org/functions.html) |

---

> **Day 3 Preview (based on commented code):** Navigation guards with auth (`router.beforeEach`), Pinia auth store, and likely async data fetching with the `data / isLoading / error` pattern — possibly using VueUse's `useFetch`.
