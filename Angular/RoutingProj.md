# E-Commerce Project - Mentoring Session Summary

## Final Refined Requirements

1. **Routing Structure**
   - `/` redirects to `/products`
   - `/products` → Products listing page (default landing)
   - `/login` → Login page (stub)
   - `/register` → Register page (stub)
   - `/cart` → Cart page (stub)
   - `/product/:id` → Product details page (dynamic)
   - `*` → Not Found page (catch-all)

2. **Navbar**
   - Appears on every page
   - Contains links to: Products, Login, Register, Cart
   - Active link highlighted (e.g., orange) based on current URL
   - Highlighting persists on refresh (reads from URL, not click state)

3. **Data Layer**
   - Create Product interface defining all product fields
   - Products array typed with this interface
   - Both live in a plain data file (not inside a component)
   - Can be imported wherever needed

4. **Products Page**
   - Renders one Product Card per product
   - Each card shows: image, name, price (XX EGP), stock badge, Add to Cart button
   - Stock badge: `stock = 0` → "Out of Stock" (red), `stock > 0` → "In Stock" (green)

5. **Product Details Page**
   - Clicking a card navigates to `/product/:id`
   - Reads `:id` from URL using ActivatedRoute
   - Finds matching product from array
   - Displays: image, title, category, brand, rating, description
   - If ID doesn't exist → show Not Found page

## Key Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| Default route | `/` redirects to `/products` | Products lives at `/products`, not `/` |
| Not Found trigger | Any undefined route | Standard behavior |
| Invalid product ID | Show Not Found page | Reuse existing page |
| Navbar scope | Every page | Consistent navigation |
| Active link persistence | Yes (URL-based) | Easiest and survives refresh |

## Product Interface Fields

Based on requirements analysis:
- `id` (number) - for routing
- `name` (string) - display name (NOT "title")
- `price` (number) - in EGP
- `stock` (number) - quantity available
- `image` (string) - image URL (NOT "images" plural)
- `category` (string) - product category
- `brand` (string) - product brand
- `rating` (number) - product rating
- `description` (string) - product description

## Technical Implementation Notes

### Bootstrap Setup
- Add Bootstrap CSS CDN in `<head>` of `index.html`
- Add Bootstrap JS CDN at bottom of `<body>` in `index.html`
- JS needed for toggler button collapse/expand behavior
- Use `bg-success` not `bg-body-success` for green background

### Route Definition
```typescript
// Correct order matters - wildcard must be last
{ path: "", redirectTo: "products", pathMatch: "full" }
{ path: "products", component: ProductsComponent }
{ path: "product/:id", component: ProductDetailComponent } // BEFORE wildcard
{ path: "**", component: NotFoundComponent } // MUST be last
```

### Dynamic Routing Pattern
1. **Read the ID from URL** - Use `ActivatedRoute` service
   - `inject(ActivatedRoute).snapshot.params['id']`
   - The key name matches what comes after `:` in route definition

2. **Access the products array** 
   - Import from plain data file (not from component)
   - Store in component class property so template can access it
   - Template can only see class properties, not file-level imports

3. **Find the matching product**
   - Use array `.find()` method
   - Match product.id with the ID from URL
   - Handle case where no match found (show Not Found)

### Component Data Access
- **Wrong**: Importing data at file level doesn't make it available to template
- **Correct**: Assign imported data to a class property
- Templates read from component class, not file-level imports

## Common Pitfalls Resolved

1. **Redirect target** - Was redirecting to `/login` instead of `/products`
2. **Missing route** - Forgot `/product/:id` dynamic route entirely
3. **Route order** - Dynamic routes must come before `**` wildcard
4. **Bootstrap JS** - CSS alone isn't enough, need JS for interactive components
5. **Invalid class names** - `bg-body-success` isn't valid Bootstrap, use `bg-success`
6. **Data access** - Can't import data from inside component class, needs plain export
7. **Template visibility** - Imported data must be assigned to class property to be template-accessible

## Next Steps
1. Move products array to plain data file with interface
2. Import and assign to class property in components
3. Implement array `.find()` in Product Details to locate single product
4. Handle case where product ID doesn't exist
5. Test all routes and edge cases from Phase 6 checklist