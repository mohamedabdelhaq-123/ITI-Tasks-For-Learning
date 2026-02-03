
---

# ✅ Full Mentoring Breakdown — Mini Project

---

## 🧭 BLOCK DIAGRAM — Full Project Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│                        ENTRY POINT                              │
│                     main / App root                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │ mounts
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ROUTER (client-side)                       │
│                                                                 │
│   /            ──────► REDIRECT ──────► /products               │
│   /products    ──────► ProductsPage                             │
│   /login       ──────► LoginPage                                │
│   /register    ──────► RegisterPage                             │
│   /cart        ──────► CartPage                                 │
│   /product/:id ──────► ProductDetailPage                        │
│   *            ──────► NotFoundPage                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │ every route renders inside a layout
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        LAYOUT SHELL                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                        NAVBAR                           │    │
│  │  [Products]   [Login]   [Register]   [Cart]             │    │
│  │       ↑ active link highlighted (based on route)        │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   PAGE CONTENT AREA                    │    │
│  │          (component matched by the router)              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │ (on /products)                    │ (on /product/:id)
          ▼                                   ▼
┌─────────────────────┐          ┌─────────────────────────┐
│   PRODUCTS PAGE     │          │   PRODUCT DETAIL PAGE   │
│  loops over data    │          │  reads :id from URL     │
│  renders N cards    │          │  finds product in data  │
└────────┬────────────┘          │  displays full details  │
         │ renders                └─────────────────────────┘
         ▼                                   ▲
┌─────────────────────┐                      │ click on card
│   PRODUCT CARD      │ ────────────────────►│ navigates to
│   (reusable)        │     /product/:id     │ /product/:id
│  image, name, price │                      │
│  stock badge        │                      │
│  add to cart btn    │                      │
└─────────────────────┘                      │

┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER (static)                        │
│                                                                 │
│   products[] ──► typed by ──► Product interface                │
│   (single source of truth, imported where needed)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 TASK BREAKDOWN

---

## 🔹 PHASE 1 — Project Scaffold & Routing

### **Task A1 — Bootstrap the project**

**Goal**
A running development server with a visible render.

**Verify**

* App loads in the browser
* Something renders (even placeholder text)
* No console errors

---

### **Task A2 — Wire up the router**

**Goal**
The routing system is installed and connected, but routes are not defined yet.

**Verify**

* App still runs
* Router is active
* No crashes or blank-screen errors

---

### **Task A3 — Create stub page components**

**Goal**
Create one minimal component per page:

* Products
* Login
* Register
* Cart
* Product Detail
* Not Found

Each component displays **only its page name**.

**Verify**

* Each page renders unique text
* Components are not routed yet

---

### **Task A4 — Define all routes**

**Goal**

* `/` redirects to `/products`
* All routes map correctly
* Unknown routes go to Not Found

**Verify**

* `/` → Products page
* `/login`, `/register`, `/cart` → correct stubs
* `/product/123` → Product Detail stub
* Invalid URL → Not Found
* Test trailing slash behavior (`/products/`)

---

## 🔹 PHASE 2 — Navbar

### **Task B1 — Create Navbar links**

**Goal**
Navbar contains links to:

* Products
* Login
* Register
* Cart

**Verify**

* Clicking links navigates correctly
* Page text changes accordingly

---

### **Task B2 — Make Navbar global**

**Goal**
Navbar appears on **all pages** via a shared layout.

**Verify**

* Navbar persists across route changes
* Only page content changes
* No flickering or duplication

---

### **Task B3 — Active link highlighting**

**Goal**
The current route’s link is visually distinct.

**Verify**

* Products highlighted on `/products`
* Login highlighted on `/login`
* Refresh preserves active state
* Only one link highlighted at a time

---

## 🔹 PHASE 3 — Data Layer

### **Task C1 — Define Product interface**

**Goal**
A single interface exactly matching the `products` array structure.

**Verify**

* All keys in data are represented
* No extra or missing fields

---

### **Task C2 — Type the products array**

**Goal**
Data is strongly typed using the interface.

**Verify**

* Invalid property access is flagged by tooling
* Errors appear at edit-time, not runtime

---

## 🔹 PHASE 4 — Products Listing Page

### **Task D1 — Render product names only**

**Goal**
Confirm data flow by listing product names as plain text.

**Verify**

* Number of names equals array length
* No duplicates or missing entries

---

### **Task D2 — Build Product Card (static)**

**Goal**
Reusable card displaying:

* Image
* Name
* Price (`XX EGP`)
* Stock text (no color yet)

**Verify**

* All fields render correctly
* Price format is exact

---

### **Task D3 — Add stock logic + color**

**Goal**

* `stock > 0` → **In Stock** (green)
* `stock = 0` → **Out of Stock** (red)

**Verify**

* Correct color + text per product
* Edge cases: stock = 0, stock = 1

---

### **Task D4 — Add “Add to Cart” button**

**Goal**
Button exists visually (no logic required).

**Verify**

* Button renders on every card
* Clicking causes no errors

---

### **Task D5 — Render cards dynamically**

**Goal**
Replace text list with mapped Product Cards.

**Verify**

* One card per product
* No crashes if array is empty
* No duplicated cards

---

## 🔹 PHASE 5 — Product Details Page

### **Task E1 — Make cards navigable**

**Goal**
Clicking a card navigates to `/product/:id`.

**Verify**

* URL updates with correct ID
* Lands on Product Detail page

---

### **Task E2 — Read ID from URL**

**Goal**
Extract and display the `id` from the route.

**Verify**

* `/product/3` → displays `3`
* `/product/99` → displays `99`

---

### **Task E3 — Render full product details**

**Goal**
Find product by ID and display:

* Image
* Title
* Category
* Brand
* Rating
* Description

**Verify**

* Correct data shown per product
* Navigating between IDs updates content
* Back/forward navigation works

---

### **Task E4 — Handle invalid IDs**

**Goal**
Invalid or missing IDs fail safely.

**Verify**

* `/product/9999` → no crash
* `/product/abc` → safe fallback
* `/product/` → handled by router or 404

---

## 🔹 PHASE 6 — Final Validation Walkthrough

1. Open `/` → redirects to `/products`
2. Navbar visible, Products highlighted
3. Stock badges and prices correct
4. Click product → correct detail page
5. Navigate between products
6. Visit `/login`, `/register`, `/cart`
7. Invalid URL → Not Found
8. Refresh any page → state remains correct

---



