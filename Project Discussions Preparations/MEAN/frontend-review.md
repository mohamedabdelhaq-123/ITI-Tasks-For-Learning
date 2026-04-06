# Frontend Codebase Review — Angular E-Commerce Bookstore

---

## Table of Contents
1. [App Bootstrap & Configuration](#1-app-bootstrap--configuration)
2. [Routing & Lazy Loading](#2-routing--lazy-loading)
3. [Auth Interceptor](#3-auth-interceptor)
4. [Route Guards](#4-route-guards)
5. [AuthService](#5-authservice)
6. [Interfaces & Type System](#6-interfaces--type-system)
7. [BookService & CartService](#7-bookservice--cartservice)
8. [OrderService & ReviewService](#8-orderservice--reviewservice)
9. [AdminUserService & AuthorService & CategoryService](#9-adminuserservice--authorservice--categoryservice)
10. [Shared UI Components](#10-shared-ui-components)
11. [Auth Pages (Login & Register)](#11-auth-pages-login--register)
12. [Explore & Book Details Pages](#12-explore--book-details-pages)
13. [Cart & Checkout Pages](#13-cart--checkout-pages)
14. [Order History & Order Confirmation](#14-order-history--order-confirmation)
15. [Admin Pages](#15-admin-pages)
16. [Profile Pages](#16-profile-pages)
17. [Form Validators Utility](#17-form-validators-utility)
18. [SSR Configuration](#18-ssr-configuration)
19. [Cross-Repo Integration Points](#cross-repo-integration-points)
20. [Top 20 Q&A Cheat Sheet](#top-20-qa-cheat-sheet)

---

## 1. App Bootstrap & Configuration

### App Bootstrap & Configuration

**What it does:** `main.ts` bootstraps the standalone Angular app using `bootstrapApplication`. `app.config.ts` is the single source of truth for all application-level providers: routing (with in-memory scroll restoration), client hydration with event replay, and the HTTP client configured with the `fetch` API and the `authInterceptor`. `main.server.ts` and `app.config.server.ts` merge server-specific providers (SSR rendering) on top of the base config.

**Design Decisions:**
- Uses Angular's modern standalone/functional API instead of `NgModule` — reduces boilerplate and enables direct tree-shaking.
- `withFetch()` replaces the default `XMLHttpRequest` transport to align with SSR's server-side fetch.
- `provideClientHydration(withEventReplay())` retains DOM events fired during SSR hydration so they replay once the client-side app takes over.
- `withInMemoryScrolling` is configured globally so every route transition restores scroll position.
- `mergeApplicationConfig` in `app.config.server.ts` keeps server-only providers isolated.

**Interview & Discussion Questions:**

1. **Why is `withFetch()` important for SSR?**
   Angular's default `HttpClient` uses `XMLHttpRequest`, which is a browser API unavailable on the Node.js server. `withFetch()` switches the transport to the standard `fetch` API, which is polyfilled by Node and works identically server-side, preventing runtime errors during SSR.

2. **What does `withEventReplay()` do and why is it used here?**
   During SSR, the browser receives fully rendered HTML and the user can interact immediately. Before Angular bootstraps on the client, events like clicks are captured by the Event Replay mechanism and re-dispatched once hydration is complete, preventing lost interactions.

3. **Why are `authInterceptor` and `routes` provided at the app level rather than inside feature modules?**
   With standalone components there are no feature `NgModule`s. Providing them in `appConfig` ensures they are available globally in the injector tree from application startup, making them active for every HTTP request and every route.

4. **What would break if you removed `mergeApplicationConfig` and just used `appConfig` directly in `app.config.server.ts`?**
   You would lose the base providers (router, HTTP client, hydration, interceptor). The server render would fail because it has no router to match routes and no HTTP client to make requests during SSR pre-rendering.

5. **What is `provideBrowserGlobalErrorListeners()` and when was it introduced?**
   It is an Angular v17+ provider that attaches global unhandled error and unhandled promise rejection listeners in the browser, routing those to Angular's `ErrorHandler`. Without it, unhandled async errors may surface as blank screens rather than being caught and handled gracefully.

**Cross-Topic Questions:**
- How does `withInterceptors([authInterceptor])` relate to the functional interceptor pattern vs. class-based `HTTP_INTERCEPTORS`? The functional form is used here, which is the Angular v15+ approach — it is type-safe, tree-shakeable, and simpler.
- Does `withInMemoryScrolling` interact with SSR? On the server there is no scroll state, but on the client it reads the router's scroll position events; this is benign during SSR.

**Pitfalls & Issues:**

- **Pattern:** `provideClientHydration(withEventReplay())` is present, but `app.routes.server.ts` sets `renderMode: RenderMode.Client` for ALL routes (`path: '**'`). This means SSR is effectively disabled — all pages render on the client. Hydration configuration is therefore never exercised. **Fix:** Set specific routes to `RenderMode.Server` or `RenderMode.Prerender` for pages that benefit from it (e.g., `/explore`, `/book/:id`).
- **Pattern:** `environment.development.ts` is imported directly inside some service files (`import … from '../../../environments/environment.development'`). **Fix:** Always import from `environment` (the production alias), never from `environment.development` directly, so Angular's file replacement mechanism works correctly at build time.

**Quick-Recall Cheat Sheet:**
- `bootstrapApplication` + `appConfig` = standalone app, no root `NgModule`
- `withFetch()` = required for SSR-compatible HTTP
- `withEventReplay()` = captures events during hydration gap
- `mergeApplicationConfig` = layers server config on top of base config
- `RenderMode.Client` on `**` = SSR is declared but never actually used

---

## 2. Routing & Lazy Loading

### Routing & Lazy Loading

**What it does:** `app.routes.ts` defines all application routes. Every route uses `loadComponent` (lazy loading) so each page's JavaScript bundle is only fetched when the user navigates to it. Routes are guarded with combinations of `authGuard`, `adminGuard`, `guestGuard`, and `userGuard`. The admin section uses nested child routes under the `/admin` parent.

**Design Decisions:**
- Lazy loading is applied to every route, not just admin — this is correct and keeps the initial bundle small.
- Separate `authGuard` + `userGuard` on user routes vs. a single `adminGuard` on the admin route mirrors the backend's `auth` + `admin` middleware chain.
- Admin children default to `/admin/books` via an empty-path redirect.
- The `canActivate` array on user routes combines two guards (`[authGuard, userGuard]`). Angular runs them in order and short-circuits on the first false.

**Interview & Discussion Questions:**

1. **What is the difference between `authGuard` and `userGuard`, and why do some routes use both?**
   `authGuard` checks only whether a token exists (is logged in). `userGuard` additionally fetches the user profile if not already in memory and then blocks admins from user-only pages (redirecting them to `/admin/books`). Using both gives a fast token check first, then a role check second.

2. **Why does the `admin` route only have `adminGuard` and not also `authGuard`?**
   `adminGuard` already includes the logged-in check inside its logic (`if (!authService.isLoggedIn())`), making a separate `authGuard` redundant. `authGuard` is a subset of `adminGuard`'s behavior.

3. **What would happen if a user navigated to `/admin/users` directly without the child route guard on `/admin`?**
   The `adminGuard` on the parent `/admin` route applies to all children by default in Angular's routing — child routes inherit the parent's guards. So hitting `/admin/users` directly still triggers `adminGuard`.

4. **Why is `pathMatch: 'full'` only applied to the root redirect and the admin child empty-path redirect?**
   Without `full`, `path: ''` would match every URL because every URL starts with an empty string. `full` means the entire URL must match the empty string, restricting the redirect to the exact root path only.

5. **Why does the wildcard `**` route use `loadComponent` instead of a direct import?**
   Consistency and bundle optimization. Even though `NotFound` is small, using `loadComponent` keeps the pattern uniform. It also means the 404 component is not bundled into the main chunk.

**Cross-Topic Questions:**
- How does `guestGuard` on `/login` and `/register` interact with the interceptor? If a user has a token, the guard redirects them away before any HTTP request for those pages occurs — the interceptor is irrelevant here.
- The `/order-confirmation/:id` route uses `authGuard + userGuard`. How does that relate to the backend requiring auth middleware on `GET /order/:id`? They are aligned — both require an authenticated non-admin user.

**Pitfalls & Issues:**

- **Pattern:** `path: 'categories'` in admin children loads `CategoryAdmin` from `components/` not `pages/`. This is an architectural inconsistency — admin route pages should live in `pages/`. **Fix:** Move `CategoryAdmin` to `pages/admin-categories/` or rename the convention.
- **Pattern:** No `resolve` or `data` strategies are used. Every page component is responsible for its own data fetching in `ngOnInit`. For SSR, this means data is never pre-fetched server-side. **Fix:** Add route resolvers for key pages if SSR is enabled.
- **Pattern:** The admin children have no guards of their own — only the parent does. This is fine with Angular's inherited guard behavior, but it is worth documenting explicitly for the team.

**Quick-Recall Cheat Sheet:**
- Every route uses `loadComponent` for lazy loading — no eagerly loaded pages
- `authGuard` = token exists; `userGuard` = token + role check + getMe if needed; `adminGuard` = same but for admin role
- `guestGuard` redirects logged-in users away from auth pages
- Admin children inherit the parent's `adminGuard`
- `CategoryAdmin` is registered as a route but lives in `components/` not `pages/` — architectural inconsistency

---

## 3. Auth Interceptor

### Auth Interceptor

**What it does:** A single functional HTTP interceptor (`authInterceptor`) clones every outbound request and appends an `Authorization: Bearer <token>` header if a token is available in `AuthService`. If there is no token, the request passes through unmodified.

**Design Decisions:**
- Uses the modern Angular functional interceptor pattern (`HttpInterceptorFn`) rather than a class implementing `HttpInterceptor`.
- Reads the token from `AuthService.token()` — a signal — so it always reads the latest value at request time.
- Stateless and side-effect free: no error handling, no token refresh, no retry logic.
- Registered globally via `withInterceptors([authInterceptor])` in `appConfig`.

**Interview & Discussion Questions:**

1. **Why does the interceptor read the token from `AuthService` rather than directly from `localStorage`?**
   Centralization and SSR compatibility. `AuthService` abstracts the storage mechanism and handles the `isPlatformBrowser` check during initialization. The interceptor stays free of platform-specific code.

2. **What happens when the token expires and a 401 is returned from the backend?**
   Currently nothing — the interceptor has no response error handling. The error propagates to the subscriber in the service/component, which must handle it there. The backend uses 15-day JWT expiry so this is low frequency, but there is no automatic logout or retry.

3. **Why is `req.clone()` used instead of mutating `req` directly?**
   `HttpRequest` objects are immutable by design. `clone()` creates a new request with the specified overrides while keeping all other properties unchanged. Mutating the original would throw a runtime error.

4. **What is `setHeaders` vs. `headers.set()`? Which is used here and why?**
   `setHeaders` is a shorthand on `clone()` that merges the provided headers object into the existing headers. `headers.set()` on the `HttpHeaders` object replaces the header value directly. `setHeaders` is cleaner and preferred in interceptors.

5. **If a user logs out and immediately makes a request, could a stale token be sent?**
   No. `AuthService.logout()` calls `this._token.set(null)`, and the interceptor reads `inject(AuthService).token()` which evaluates the signal at call time. Since Angular's `inject()` in a functional interceptor returns the singleton service, the signal's current value (null after logout) is always read fresh.

**Cross-Topic Questions:**
- How does this interceptor relate to the backend's `auth` middleware? The interceptor adds the header; the middleware reads it via `req.headers.authorization`. If the interceptor omits the header on a protected route, the backend returns 401.
- The interceptor does not handle 401 responses. How should the frontend respond to a 401? It should call `authService.logout()` and redirect to `/login`. Currently this only happens in `OrderHistory` via an explicit `instanceof HttpErrorResponse` check.

**Pitfalls & Issues:**

- **Pattern:** No 401 response interceptor. If a token is expired, every protected API call silently fails.
  ```typescript
  // Current: no error handling
  return next(authenticatedReq);
  // Fix: pipe a catchError
  return next(authenticatedReq).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        inject(AuthService).logout();
      }
      return throwError(() => err);
    })
  );
  ```
- **Pattern:** `inject(AuthService)` is called inside the interceptor function body on every request invocation. In Angular's DI system this is valid in a functional interceptor context, but it is slightly wasteful to call `inject` on every request. A minor optimization would be to capture it once with a factory pattern, though Angular's current implementation handles this efficiently.

**Quick-Recall Cheat Sheet:**
- Functional interceptor (`HttpInterceptorFn`) — no class, no token
- Reads `AuthService.token()` signal — always fresh value
- Only adds header if token exists — public routes get no `Authorization` header
- No 401/error response handling — biggest gap
- Registered in `appConfig` via `withInterceptors`

---

## 4. Route Guards

### Route Guards

**What it does:** Four guards control access to routes: `authGuard` (requires login), `adminGuard` (requires login + admin role), `guestGuard` (requires NOT logged in), and `userGuard` (requires login, blocks admins, optionally fetches profile). All guards are `async` functions (`CanActivateFn`) using `firstValueFrom` for Observable-to-Promise conversion. All guards skip logic on the server (SSR) by returning `true` immediately.

**Design Decisions:**
- Guards are `async` functions that use `await Swal.fire()` for user-facing feedback — instead of silent redirects.
- `firstValueFrom(authService.getMe())` is used to fetch the current user when not already in memory, before making access decisions.
- The SSR bypass (`isPlatformBrowser` returning `true` early) is a deliberate trade-off: SSR renders everything, and guards run again on the client during hydration.
- CSS custom properties are read from `document.documentElement` to match the app's brand colors in Swal dialogs.

**Interview & Discussion Questions:**

1. **Why do all guards return `true` during SSR (`!isPlatformBrowser`)? Is this a security concern?**
   No. SSR bypassing guards means the server renders the page shell, but actual route protection runs when Angular hydrates on the client. Protected data is never sent in the SSR response because the page's data fetching is also guarded by auth tokens (which don't exist in SSR). It is purely a UX optimization to avoid SSR crashes from missing browser APIs.

2. **Why is `firstValueFrom` used instead of `.subscribe()` inside the guard?**
   Guards returning a `Promise<boolean | UrlTree>` require a resolved value. `firstValueFrom` converts the Observable to a Promise that resolves with the first emitted value. Using `.subscribe()` inside an async guard would not work because `subscribe` is fire-and-forget and doesn't return a value the guard can await.

3. **Explain the difference in logic between `adminGuard` and `userGuard`.**
   Both check if logged in, both call `getMe()` if user is not in memory. `adminGuard` allows access only if `isAdmin()` is true. `userGuard` allows access only if `isAdmin()` is FALSE — it actively redirects admins to `/admin/books` and only lets regular users through.

4. **What is the risk of using `await Swal.fire()` inside a route guard?**
   Swal dialogs are async and block the navigation event until the user clicks a button. This is intentional UX, but it means the router is in a "pending navigation" state until the dialog resolves. If the user navigates elsewhere during the dialog (e.g., browser back button), the navigation queue could get out of sync.

5. **Why does `guestGuard` not call `getMe()` but `userGuard` and `adminGuard` do?**
   `guestGuard` only needs to know if a token exists — it doesn't need role information. If a token is present, the user is considered logged in and is redirected away from auth pages. Getting the full user profile is unnecessary for this simple check.

**Cross-Topic Questions:**
- The `adminGuard` mirrors the backend's `auth` + `admin` middleware chain exactly. The frontend guard is a UX layer; the backend middleware is the security layer. Never rely solely on frontend guards for security.
- How does `userGuard` interact with `authGuard` when both are in `canActivate`? Angular runs them sequentially. `authGuard` runs first; if it returns `true`, `userGuard` runs next.

**Pitfalls & Issues:**

- **Pattern:** `getComputedStyle(document.documentElement).getPropertyValue(...)` inside guards. This reads CSS variables from the DOM for Swal icon colors. If the guard runs before the stylesheet is applied (uncommon but possible), it falls back to the hardcoded `'#732A10'`. This is acceptable but fragile. **Fix:** Centralize the brand color in a constant.
- **Pattern:** In `userGuard`, if `authService.currentUser()` is null but the user is logged in, `getMe()` is called. If `getMe()` succeeds and the user is an admin, a Swal fires AND a redirect happens. But if the Swal is dismissed (e.g., ESC key), navigation still continues to `/admin/books` because the guard already returned the `UrlTree`. The Swal dismiss is purely visual — the redirect is inevitable. This is fine but may confuse users.
- **Pattern:** No timeout/cancellation on `firstValueFrom(authService.getMe())`. If the backend is slow or offline, the guard hangs indefinitely. **Fix:** Add `firstValueFrom(authService.getMe().pipe(timeout(5000)))`.

**Quick-Recall Cheat Sheet:**
- All guards are `async` functions (functional `CanActivateFn`)
- SSR: always return `true` — guards only enforce on browser
- `firstValueFrom` converts Observable → Promise for async guard
- `userGuard` blocks admins; `adminGuard` blocks non-admins; they are inverses for role checking
- No timeout on `getMe()` — guard can hang if network is slow

---

## 5. AuthService

### AuthService

**What it does:** `AuthService` is the central auth state manager. It holds the JWT token and current user in Angular signals. It exposes `computed` signals for `isLoggedIn` and `isAdmin`. It wraps all auth API calls (register, OTP verify, login, OTP verify, getMe, updateMe, logout) and handles token storage in `localStorage`.

**Design Decisions:**
- Signals for reactive state instead of `BehaviorSubject` — modern Angular pattern.
- `isLoggedIn` and `isAdmin` are `computed` signals, so they are always derived from the source of truth (`_token` and `_currentUser`).
- Two-step OTP flow: `register()` / `login()` return OTP-sent confirmation; `verifyRegisterOtp()` / `verifyLoginOtp()` receive the actual token.
- `handleAuthSuccess` is a private method that stores the token and optionally calls `getMe()` if the register OTP response includes no `user` object (login verify response does include user).
- `getMe()` returns `User` directly (flat response), not `ApiResponse<User>`, because the backend's `GET /auth/me` has no `{ data: ... }` wrapper.

**Interview & Discussion Questions:**

1. **Why are `_token` and `_currentUser` private `signal`s exposed as readonly via `.asReadonly()`?**
   Encapsulation. External consumers (components, guards) can read the signal values reactively but cannot call `.set()` or `.update()` on them. All mutations go through `AuthService` methods, maintaining a single point of truth for auth state changes.

2. **Why does `handleAuthSuccess` call `getMe()` conditionally?**
   The register OTP response (`AuthResponse`) does not include a `user` object in the backend's actual implementation, while the login OTP response does. The code checks `if (res.user)` and skips `getMe()` if the user is already present. In practice, `register/verify-otp` returns only `accessToken`, so `getMe()` is always called after registration to populate `_currentUser`.

3. **What is the `switchMap` doing in `verifyLoginOtp` and `verifyRegisterOtp`?**
   `pipe(switchMap((res) => this.handleAuthSuccess(res)))` — `handleAuthSuccess` itself returns an Observable (`of(res)` or `getMe().pipe(map(...))`). `switchMap` flattens that inner Observable into the outer stream, so the subscriber receives the final `AuthResponse` (with user attached) only after everything is complete.

4. **Why does `isAdmin` use `?? false` in the computed expression?**
   `this._currentUser()?.roles.includes('admin')` returns `undefined` if `_currentUser()` is null (optional chaining returns `undefined`, not `false`). The `?? false` coalesces `undefined` to `false`, ensuring `isAdmin` is always a `boolean`.

5. **What happens if `localStorage` is unavailable (private mode, Safari ITP)?**
   `isPlatformBrowser` is checked once at construction. If in a browser, `localStorage.getItem(TOKEN_KEY)` initializes `_token`. If `localStorage` throws (quota exceeded, blocked by browser), it would throw synchronously in the constructor. No try/catch is present. **This is a bug in Safari private mode.**

**Cross-Topic Questions:**
- `getMe()` returns a flat `User` object because `GET /auth/me` on the backend does not wrap in `{ data: ... }`. All other service methods use `ApiResponse<T>`. This asymmetry is handled by `AuthService` typing `getMe()` as `Observable<User>`.
- How does `AuthService.token()` feed the interceptor? The interceptor calls `inject(AuthService).token()` — a signal read — so it always has the latest token value set by `handleAuthSuccess`.

**Pitfalls & Issues:**

- **Pattern:** `localStorage.getItem('auth_token')` is checked as a fallback: `localStorage.getItem(TOKEN_KEY) || localStorage.getItem('auth_token')`. This suggests a past key rename left a backward-compat check in production code. **Fix:** Remove the `auth_token` fallback after confirming no users have it stored.
- **Pattern:** `updateMe` receives `res.data` and sets `_currentUser` directly, but the backend `PUT /auth/me` might return a `User` shape that differs slightly from `GET /auth/me`. Specifically, `_id` vs `id` is a concern (Book model only maps `_id→id`, not User). **Fix:** Verify the `updateMe` response shape matches the `User` interface.
- **Pattern:** No token expiry check. The token is 15 days; the app never checks `exp` from the JWT payload. A user who logs in and leaves for 16 days will have a stale token that silently fails every protected API call. **Fix:** Add an expiry check in `isLoggedIn` computed or in the interceptor.

**Quick-Recall Cheat Sheet:**
- Token + user stored as private `signal`s; exposed as readonly
- `isLoggedIn` = computed from `_token`; `isAdmin` = computed from `_currentUser.roles`
- Two-step OTP: first call gets OTP email, second call gets JWT
- `getMe()` returns flat `User` (no `{ data }` wrapper) — unique in this codebase
- `handleAuthSuccess` always calls `getMe()` after register, optionally after login

---

## 6. Interfaces & Type System

### Interfaces & Type System

**What it does:** The `interfaces/` directory defines all TypeScript contracts for API request/response shapes, domain models, and UI state. Key files: `api-response.ts` (generic wrapper), `auth.ts`, `book.ts`, `cart.ts`, `order.ts`, `review.ts`, `author.ts`, `categories.ts`, `admin-user.ts`.

**Design Decisions:**
- `ApiResponse<T>` is a generic wrapper for the backend's `{ status, data, message? }` envelope. Pagination metadata (`totalBooks`, `currentPage`, `pageSize`) is added as optional fields on this same interface.
- `Book` has both `_id` and optional `id?` fields because the backend's `Book.toJSON()` maps `_id → id` but the raw Mongoose document still has `_id`. The frontend accommodates both.
- `Order.userId` is typed as `string | PopulatedUser` — a union type handling both unpopulated and populated states. Same pattern for `Review.userId` and `Review.bookId`.
- `AdminUser` has a separate interface from `User` (auth) because admin user management uses `_id`, while the auth `User` uses `id`.
- `AuthResponse` has `user?: User` (optional) because the register-OTP response doesn't include a user object.

**Interview & Discussion Questions:**

1. **Why does `Book` have both `_id: string` and `id?: string`?**
   The backend's `Book` model has a custom `toJSON()` transform that maps `_id → id`. However, when the book is embedded in other documents (e.g., a cart item's `book` field), the transform may not apply. The frontend needs to handle both cases: `book.id || book._id`.

2. **Why does `ApiResponse<T>` have pagination fields as flat optional properties instead of a nested `pagination` object?**
   The backend returns `{ status, data, totalBooks, currentPage, pageSize }` as a flat object. Matching this flat shape is pragmatic. The downside is the interface mixes concerns — generic wrapper + book-specific pagination. **Fix:** Create a separate `PaginatedResponse<T>` interface with a nested `pagination` field.

3. **What is the purpose of the `PopulatedUser` interface appearing in both `order.ts` and `review.ts`?**
   When the backend populates `userId` on orders or reviews, it returns a user object instead of a string ID. `PopulatedUser` models this shape. It is defined once in `order.ts` and imported into `review.ts` — good DRY practice.

4. **Why is `Order.paymentStatus` typed as `'pending' | 'success' | 'paid'`? Is this consistent with the backend?**
   The backend's Order model has `paymentStatus: { type: String, enum: ['pending', 'paid'] }`. The frontend adds `'success'` as an extra option which doesn't exist on the backend. This is a type mismatch and could cause confusion. **Fix:** Align to `'pending' | 'paid'`.

5. **What problem does the `string | ReviewUser | PopulatedUser` union on `Review.userId` cause in practice?**
   Every consumer of `review.userId` must type-narrow before accessing properties. The codebase handles this with `typeof review.userId === 'object'` checks, but it leads to repeated narrowing logic spread across components. **Fix:** Use a discriminated union or always populate the field server-side.

**Cross-Topic Questions:**
- The `ApiResponse.status` field is typed as `string` but could be `'Success' | 'success' | 'Fail'`. Because of the backend's inconsistent casing, the frontend wisely avoids using `status` for control flow — it uses HTTP status codes instead.
- `AdminUser._id` vs `User.id` — these map to the same MongoDB field but are typed differently, reflecting the backend's inconsistency (Book maps `_id→id`, others don't).

**Pitfalls & Issues:**

- **Pattern:** `ApiResponse<T>` has `totalBooks?: number` — a Book-specific field on a generic interface. **Fix:** Create `PaginatedBooksResponse` extending `ApiResponse<Book[]>`.
- **Pattern:** `Order.paymentStatus` includes `'success'` which does not exist in the backend enum. **Fix:** Remove `'success'` from the union.
- **Pattern:** `Book.author` is typed `string | Author` AND `Book.authorId` is also `string | Author`. The backend sends populated author data in `author`, not `authorId`. The dual fields cause confusion in `book-details.ts` (`if (!bookData.author && bookData.authorId) { bookData.author = bookData.authorId; }`). **Fix:** Remove `authorId` from the interface or clarify the backend contract.

**Quick-Recall Cheat Sheet:**
- `Book` has `_id` (required) + `id?` (optional) — handle both with `book.id || book._id`
- `ApiResponse<T>` is used for most endpoints; `getMe()` returns `User` directly (no wrapper)
- Union types (`string | PopulatedUser`) require runtime type narrowing everywhere they're used
- `Order.paymentStatus` has `'success'` which doesn't exist on the backend — type mismatch bug
- `ApiResponse` mixes generic envelope with book-specific pagination fields — design smell

---

## 7. BookService & CartService

### BookService & CartService

**What it does:** `BookService` wraps all CRUD operations for the `/books` endpoint. `CartService` wraps `/cart` CRUD and maintains a global `cartCount` signal used by the navbar badge. Both services use Angular's `HttpClient` with `inject()`.

**Design Decisions:**
- `CartService.cartCount` is a `signal<number>(0)` shared across the app — a lightweight global state alternative to a full state management library.
- `addToCart`, `removeFromCart`, and `updateCartItem` all `.pipe(tap(() => this.loadCartCount().subscribe()))` — they automatically refresh the cart count after every mutation.
- `getCart()` has a `catchError` fallback that returns an empty cart object instead of propagating the error. This prevents the cart page from breaking if the user is not logged in.
- `BookService.getAllBooks()` builds a URL with query string fragments concatenated directly: `?page=${page}&limit=${limit}&${query ?? ''}`.

**Interview & Discussion Questions:**

1. **Why is `cartCount` a `signal` in `CartService` instead of a local state in `NavBar`?**
   Multiple components need the cart count: `NavBar` displays it as a badge, `Cart` page reads it, `BookDetails` page updates it. A service-level signal provides a shared, reactive source of truth without prop drilling or a state store.

2. **Why does `addToCart` call `this.loadCartCount().subscribe()` inside a `tap`? What is the risk?**
   `tap` is for side effects. The inner `subscribe()` creates a nested subscription that is never cleaned up. If the component is destroyed before `loadCartCount` completes, there is no cleanup. **Fix:** Use `switchMap` instead: `pipe(switchMap(() => this.loadCartCount()))` and let the caller subscribe once.

3. **What does the `catchError` in `getCart()` return and why?**
   It returns `of(emptyCartFallback)` — an Observable emitting a fake empty `CartResponse`. This means the cart page's `.subscribe({ next: (res) => ... })` always fires with a valid object (empty cart) even on 401. The spinner stops and the page shows "Your cart is empty."

4. **Why does `BookService.getAllBooks` concatenate the query string manually rather than using `HttpParams`?**
   The query string from the UI components (e.g., `categories=id1&categories=id2&sort=-price`) is built as raw strings in parent components and passed to the service as a single `query` string. Using `HttpParams` would require parsing and re-serializing. While it works, it is fragile and could allow invalid characters. **Fix:** Accept a `params` object and use `HttpParams` throughout.

5. **Why does `CartService` import from `environment.development` while `OrderService` imports from `environment`?**
   Inconsistency. `BookService`, `AuthorService`, and `CategoryService` also import from `environment.development`. Only `AuthService`, `OrderService`, and `ReviewService` correctly import from `environment`. **Fix:** Standardize all services to import from `environment`.

**Cross-Topic Questions:**
- Cart update API uses `PATCH /cart/:bookId` with `{ quantity }`. The `cartService.updateCartItem` uses `item.book.id as string` — explicitly using the `id` field (post-`toJSON` transform from backend). This is the correct handling for the `_id → id` mapping.
- `loadCartCount` calls `GET /cart/count`. The backend route for this is `/cart/count`. The URL is constructed as `${this.apiUrl}/count` = `/cart/count`. This is correct.

**Pitfalls & Issues:**

- **Pattern:** Nested subscriptions in `tap`: `tap(() => this.loadCartCount().subscribe())`. Memory leak risk.
  ```typescript
  // Fix: use switchMap
  addToCart(bookId: string, quantity: number) {
    return this.http.post<CartResponse>(this.apiUrl, { bookId, quantity })
      .pipe(switchMap(() => this.loadCartCount()));
  }
  ```
- **Pattern:** `BookService` imports from `environment.development` instead of `environment`. In a production build, Angular's file replacement replaces `environment.development.ts` with `environment.ts`, so this likely works — but it's semantically wrong and can cause issues in CI environments that don't configure file replacements.
- **Pattern:** `cart.ts` uses `item.book.id as string` — a type assertion. The `Book` interface has `id?` (optional). The `as string` cast bypasses the type system. If `id` is undefined (e.g., for a book returned without the `toJSON` transform), this silently produces `undefined` cast to `string`. **Fix:** Use `item.book.id ?? item.book._id`.

**Quick-Recall Cheat Sheet:**
- `cartCount` signal in `CartService` = global cart badge state
- Every cart mutation auto-refreshes `cartCount` via `tap` + nested subscribe (memory leak risk)
- `getCart()` never throws — returns empty cart on error
- Several services import `environment.development` instead of `environment` — build risk
- Cart uses `book.id` (post-toJSON mapped ID) — must use `id || _id` for safety

---

## 8. OrderService & ReviewService

### OrderService & ReviewService

**What it does:** `OrderService` wraps all order endpoints: create order, get user's orders, get single order, get all orders (admin), update order status, update payment status. `ReviewService` wraps review endpoints: get reviews for a book, get all reviews (admin), add review, delete review.

**Design Decisions:**
- Both services are thin HTTP wrappers with no business logic or caching.
- `OrderService` uses `Observable<ApiResponse<Order>>` for typed responses.
- `ReviewService.deleteReview` returns `Observable<void>` — correct, since the backend DELETE returns no body.
- All methods use `inject(HttpClient)` in the service constructor.

**Interview & Discussion Questions:**

1. **`OrderService.getMyOrders()` hits `GET /order/my`. How does the backend know which user's orders to return?**
   The interceptor attaches `Authorization: Bearer <token>` to the request. The backend's `auth` middleware decodes the token and sets `req.user.id`. The `/order/my` controller queries orders by `userId: req.user.id`.

2. **Why does `ReviewService.deleteReview` return `Observable<void>` but `addReview` returns `Observable<ApiResponse<Review>>`?**
   DELETE requests for reviews return an empty body (204 No Content) or a simple `{ message }` response without a `data` field. Typing it as `void` is honest — the caller gets nothing useful back and is just notified of success. `addReview` returns the created review in `{ data: Review }`.

3. **`OrderService.updateOrderStatus` and `updatePaymentStatus` both use `PATCH`. How are the URLs different?**
   `updateOrderStatus` hits `PATCH /order/:id/status` with `{ status }`. `updatePaymentStatus` hits `PATCH /order/:id/payment` with `{ paymentStatus }`. The backend has separate route handlers for each.

4. **Why doesn't `ReviewService` have a method to update a review?**
   The backend does not expose a `PUT /review/:id` or `PATCH /review/:id` endpoint based on the route summary provided. Reviews appear to be immutable once submitted — a user can delete and re-submit but not edit.

5. **How does `OrderService.createOrder` receive its payload? What does it send to the backend?**
   In `checkout.ts`, a `Partial<Order>` object is built with `items` (array of `{ bookId, quantity }`), `shippingAddress`, and `paymentMethod`. The backend expects exactly this shape (Joi validates it). Using `Partial<Order>` is slightly loose — a dedicated `CreateOrderRequest` interface would be safer.

**Cross-Topic Questions:**
- `getMyOrders` vs `getAllOrders` — both hit the `/order` path but with different HTTP contexts. `getMyOrders` hits `/order/my`; `getAllOrders` hits `/order` (admin route requiring admin middleware). The same `OrderService` class serves both user and admin contexts.
- `ReviewService.getAllReviews()` hits `GET /review` — an admin route. But `ReviewService` is also used by user-facing components. The backend's admin middleware will reject non-admin users who call this.

**Pitfalls & Issues:**

- **Pattern:** `OrderService.createOrder(orderData: Partial<Order>)` accepts a partial order instead of a dedicated create DTO. `Partial<Order>` includes optional fields like `_id`, `createdAt`, `status` that should not be sent in a create request. **Fix:** Create a `CreateOrderPayload` interface.
- **Pattern:** `ReviewService.getAllReviews()` is in the same service as user-facing review methods. If the token doesn't have admin role and this endpoint is called, the backend returns 403. The `AdminReviewsComponent` handles this correctly (admin-only page), but the service itself gives no indication of which methods require admin. **Fix:** Split into `UserReviewService` and `AdminReviewService` or at minimum add JSDoc comments.

**Quick-Recall Cheat Sheet:**
- `OrderService` serves both user (getMyOrders) and admin (getAllOrders) — same service, different endpoints
- `ReviewService.deleteReview` returns `void` — no body from DELETE endpoint
- `createOrder` takes `Partial<Order>` — should be a dedicated `CreateOrderPayload`
- All protected calls auto-get the `Authorization` header via the interceptor
- No caching or memoization anywhere — every navigation triggers a fresh API call

---

## 9. AdminUserService & AuthorService & CategoryService

### AdminUserService & AuthorService & CategoryService

**What it does:** `AdminUserService` wraps CRUD for `/admin/users` — list with pagination/search/filter, create, update, delete. `AuthorService` wraps CRUD for `/authors`. `CategoryService` wraps CRUD for `/categories`. All three are `providedIn: 'root'` singletons using `inject(HttpClient)`.

**Design Decisions:**
- `AdminUserService.getUsers()` uses Angular's `HttpParams` for query string building — the only service in the codebase to do so correctly.
- `AuthorService.updateAuthor` uses `PATCH` (partial update) while `replaceAuthor` uses `PUT` (full replace). Both are defined, but only `updateAuthor` (PATCH) is used in the admin UI.
- `CategoryService` is named `Category` (same as the `Category` interface from `interfaces/categories.ts`), creating a naming collision that forces aliased imports: `import { Category as CategoryService } from '../../services/category/category'`.

**Interview & Discussion Questions:**

1. **Why does `AdminUserService.getUsers` use `HttpParams` but `BookService.getAllBooks` uses raw string concatenation?**
   `AdminUserService` was likely written by a different developer or at a different time. `HttpParams` is the correct approach: it handles encoding, null safety, and is immutable/chainable. The inconsistency is a code quality issue. **Fix:** Migrate all services to `HttpParams`.

2. **What is the naming collision issue with `CategoryService` and how does the codebase work around it?**
   The service class is named `Category` (matching the domain model interface). Every file that imports both must alias one: `import { Category as CategoryService } from '../../services/category/category'`. This is error-prone. **Fix:** Rename the service class to `CategoryService`.

3. **`AuthorService` imports from `environment.development`. What is the risk in production?**
   Angular's build system replaces `environment.development.ts` with `environment.ts` at build time when `--configuration production` is used. So functionally it works, but it is semantically wrong and breaks the intent of the environment file system. In some CI configurations that don't apply file replacements, it could point to a dev API in a prod build.

4. **Why does `AdminUserService` target `/admin` as its `baseUrl` rather than `/admin/users`?**
   Looking at the backend routes, the admin users endpoint is `GET /admin/users`. But the service uses `${environment.apiUrl}/admin` and then calls `this.http.get<GetAdminUsersResponse>(this.baseUrl, { params })`. The actual backend route would need to be `/admin` not `/admin/users` for this to work correctly — or there is a path mismatch.

5. **`AuthorService.createAuthor` accepts `Author` (full interface with `_id`). What happens when creating a new author that doesn't have an `_id` yet?**
   The `Author` interface requires `_id: string`. When creating a new author, the caller passes `{ name, bio }` without `_id`, which violates the type. The TypeScript compiler would flag this if strict. Using `Partial<Author>` or a dedicated `CreateAuthorRequest` type would be correct.

**Cross-Topic Questions:**
- `AdminUserService.getUsers` params include `search` and `role`. The backend must have query parameter handling for these. Joi validates these as query params before the controller.
- Category CRUD in `CategoryAdmin` uses all four service methods. Create/Update use SweetAlert2 modals to collect input, then delegate to the service. Delete triggers a Swal confirmation. This pattern (Swal + service call + reload) is consistent across admin components.

**Pitfalls & Issues:**

- **Pattern:** `CategoryService` class named `Category` — naming collision. Forces awkward aliased imports everywhere.
- **Pattern:** `AuthorService.createAuthor(author: Author)` — wrong type for a create operation. Should be `Omit<Author, '_id'>` or a dedicated request type.
- **Pattern:** `AdminUserService` base URL is `/admin` — if the backend registers admin users at `/admin/users`, every request will 404. Needs verification against actual backend routing.

**Quick-Recall Cheat Sheet:**
- `AdminUserService` is the only service correctly using `HttpParams` — all others use raw string concat
- `CategoryService` class is named `Category` — aliased import required everywhere
- `AuthorService` uses `PATCH` for partial updates, `PUT` for full replacement — both exist, only PATCH is used in UI
- `createAuthor` accepts full `Author` interface including `_id` — incorrect for create operations
- All three import from `environment.development` instead of `environment`

---

## 10. Shared UI Components

### Shared UI Components

**What it does:** Reusable UI building blocks: `BookCard` (displays book in grid), `BookForm` (add/edit book FormData builder), `CategoryAdmin` (full category CRUD), `Filter` (category toggle filter), `Footer`, `MinMaxSlider` (price range), `NavBar` (auth state + cart badge), `Pagenation` (pagination control), `ReviewForm`, `ReviewsList`, `SearchBar`, `StarRating`.

**Design Decisions:**
- Modern Angular signal inputs (`input()`, `input.required()`) are used in newer components. Older components use `@Input()` decorator — inconsistency within the same codebase.
- `output()` (signal-based) is used in `Filter`, `MinMaxSlider`, `SearchBar`; `@Output() EventEmitter` is used in `ReviewForm`, `StarRating` — same inconsistency.
- `MinMaxSlider` validates range in `validateRange()` by swapping min/max if inverted — a defensive UX decision.
- `CategoryAdmin` injects `ChangeDetectorRef` and calls `cdr.markForCheck()` after async data loads — appropriate for potential `OnPush` parent components.
- `NavBar` guards `loadCartCount` behind `isPlatformBrowser` to avoid SSR HTTP requests.

**Interview & Discussion Questions:**

1. **Why does `BookCard.addToCart` use `event.stopPropagation()` and `event.preventDefault()`?**
   `BookCard` is wrapped in a router link for navigation to book details. The "Add to Cart" button click would bubble up and trigger navigation. `stopPropagation` prevents the event from reaching the router link; `preventDefault` prevents any default browser action (e.g., form submission if button were inside a form).

2. **What is the `isAdding` signal in `BookCard` used for?**
   It is a loading/debounce guard. If `isAdding()` is true, subsequent clicks are ignored (`if(this.isAdding()) return`). It is set to `true` when the add-to-cart request starts and `false` when it completes or errors. This prevents duplicate cart additions from rapid clicks.

3. **Explain the `SearchBar.emitQuery` logic — how does it differentiate between an author search and a name search?**
   It looks up the search query string in the `authors()` list by name. If a matching author is found, it emits `authorId=${author._id}`. If not, it emits `name=${query}`. This means if you type an author's exact name, it triggers an author filter; otherwise it triggers a title search. It appends `&categories=${id}` if a category is also selected.

4. **Why does `ReviewsList` use a setter for `@Input() bookId` instead of `ngOnChanges`?**
   The setter fires `loadReviews()` every time `bookId` changes. `ngOnChanges` is also implemented as a backup, but the comment calls it a "backup if the setter didn't trigger." This is redundant and could cause double-loading. The correct pattern is to use one or the other.

5. **What does `StarRatingComponent` do with `hoveredRating`? How is it used in the template?**
   `hoveredRating` tracks which star the mouse is currently over. In the template, stars display as filled if their index is `<= (hoveredRating || value)`. On mouse leave, `hoveredRating` resets to 0 and the display falls back to the actual `value`. This creates the interactive hover preview effect.

**Cross-Topic Questions:**
- `NavBar` reads `authService.currentUser` and `cartService.cartCount` as signals — both update reactively without manual subscriptions when the user logs in/out or cart changes.
- `BookForm` emits `FormData` (not a typed DTO) to the parent. This is because `FormData` is required for multipart file uploads (book cover image). The parent (`AdminBooks`) then passes it to `bookService.createBook(formData)`.

**Pitfalls & Issues:**

- **Pattern:** Mixed use of `@Input()`/`@Output()` and signal `input()`/`output()`. `ReviewForm` and `StarRating` use decorators while newer components use signals. **Fix:** Standardize to signal inputs/outputs for all components.
- **Pattern:** `ReviewsList` calls `loadReviews()` from both the setter AND `ngOnChanges`. If both fire for the same change, the API is called twice.
  ```typescript
  // Fix: use only the setter, remove ngOnChanges duplicate call
  ngOnChanges(changes: SimpleChanges): void {
    // Remove the loadReviews() call here — setter handles it
  }
  ```
- **Pattern:** `ReviewsList.setCurrentUserId()` manually decodes the JWT (`JSON.parse(atob(token.split('.')[1]))`). This duplicates auth logic that `AuthService.currentUser` already handles. **Fix:** Use `inject(AuthService).currentUser()?.id` instead.
- **Pattern:** `BookForm` logs `console.log('Form submitted with data:', tempFormData)` and `console.log('Form cancelled')` — debug logs left in production code.

**Quick-Recall Cheat Sheet:**
- `BookCard.isAdding` signal = debounce guard for add-to-cart button
- `SearchBar` detects author search by looking up query against authors list — emits `authorId=` or `name=`
- `ReviewsList` has double-load risk: setter + ngOnChanges both call `loadReviews()`
- Mixed `@Input`/`@Output` and `input()`/`output()` signals across components — inconsistency
- Multiple components manually decode JWT instead of using `AuthService.currentUser`

---

## 11. Auth Pages (Login & Register)

### Auth Pages (Login & Register)

**What it does:** `Login` and `Register` are two-step form pages implementing the OTP flow. Step 1 collects credentials, calls the API to trigger OTP email, then transitions to Step 2 where the OTP is entered and verified. Both pages are `ChangeDetectionStrategy.OnPush` and use reactive forms with signals for UI state.

**Design Decisions:**
- `LoginStep` and `RegisterStep` union types (`'credentials' | 'otp'`) model the multi-step UI state explicitly.
- The current user's email is stored in a private `_email` signal and exposed as readonly — so the OTP step can read it but the template cannot accidentally clear it.
- `passwordMatchValidator` is a cross-field group validator defined at the form group level, not on a single control.
- `ChangeDetectionStrategy.OnPush` is used — signals and reactive forms update the view via Angular's signal change detection system.
- After successful login, the app checks the user's roles and redirects to `/admin/books` or `/` accordingly.

**Interview & Discussion Questions:**

1. **Why is `_email` stored as a signal instead of a simple property?**
   To maintain consistency with other state (signals for everything) and because the email must survive the transition from Step 1 to Step 2 (it's needed for the OTP verify call). A signal ensures Angular tracks it reactively if any template ever reads it, and it is immutable from outside via `.asReadonly()`.

2. **Where is `passwordMatchValidator` defined and how does it work?**
   It's defined in `register.ts` as a `ValidatorFn` applied to the entire `FormGroup`. It reads both `password` and `confirmPassword` controls from the group and returns `{ passwordMismatch: true }` if they differ. The template checks `registerForm.hasError('passwordMismatch') && confirmPasswordCtrl.touched`.

3. **Why is `ChangeDetectionStrategy.OnPush` used here? What signals the view to update?**
   Signals automatically notify Angular's change detection when `.set()` is called. With `OnPush`, Angular only checks the component when an input changes, an event fires, or a signal used in the template changes. Since `isLoading`, `errorMessage`, `step`, and form state all use signals or reactive forms (which emit events), all view updates are correctly triggered.

4. **After OTP login, where does the redirect go for an admin vs a regular user?**
   In `submitOtp()`: `const redirectPath = res.user?.roles.includes('admin') ? '/admin/books' : '/'`. The `AuthResponse` from `verifyLoginOtp` is piped through `handleAuthSuccess` which calls `getMe()` if needed. The `res.user` is available in the `next` callback, so the roles check is reliable.

5. **What happens if the user submits the OTP form but the email was lost (e.g., page refresh)?**
   The email is in the `_email` signal (in-memory). A page refresh destroys the component and the signal, losing the email. The user would be on Step 2 with no email to send for verification. **Fix:** Persist the email in `sessionStorage` during the OTP step, clear it on success or back navigation.

**Cross-Topic Questions:**
- `submitOtp` calls `authService.verifyLoginOtp()` which internally calls `handleAuthSuccess()` which may call `getMe()`. The entire `switchMap` chain ensures `_currentUser` is populated before the guard on subsequent navigations can read it.
- `guestGuard` blocks logged-in users from reaching these pages. So a user who logs in and navigates back to `/login` is redirected away — consistent behavior.

**Pitfalls & Issues:**

- **Pattern:** OTP step state (`_email` signal) is lost on page refresh. No persistence. **Fix:** Use `sessionStorage` for the in-progress email.
- **Pattern:** `otpForm` OTP pattern is `^[a-zA-Z0-9]{6}$` — 6 alphanumeric chars. The backend generates OTPs; if the backend uses only numeric OTPs, this regex is unnecessarily permissive but not harmful.
- **Pattern:** `Login` has no "resend OTP" button. If the OTP expires or is not received, the user has no recovery path on the UI. **Fix:** Add a resend OTP call linked to `authService.login()` (retriggers OTP send) on the OTP step.

**Quick-Recall Cheat Sheet:**
- Two-step form using `LoginStep` / `RegisterStep` signal for state machine
- Email stored in `_email` signal — survives step transition but lost on refresh
- `passwordMatchValidator` is a group-level cross-field validator
- Both pages are `OnPush` — signals drive all UI updates
- No "resend OTP" functionality — UX gap

---

## 12. Explore & Book Details Pages

### Explore & Book Details Pages

**What it does:** `Explore` is the main book listing/search page with filtering by category, price range, author search, and sorting. `BookDetails` shows a single book's details, add-to-cart, and the review section with eligibility checking.

**Design Decisions:**
- `Explore` builds a composite query string from four independent signal fragments (`priceQuery`, `categoryQuery`, `searchQuery`, `query`) — assembling them in `handleQuery()`.
- `BookDetails` checks review eligibility by fetching the user's order history and checking for delivered orders containing the book — a client-side check mirroring the backend's server-side gate.
- `BookDetails` uses `@ViewChild` to get a reference to `ReviewsList` and manually call `loadReviews()` after a new review is added.
- JWT is manually decoded in `checkUserEligibility` to get the current user ID as a fallback when `authService.currentUser()` is null.

**Interview & Discussion Questions:**

1. **How does `Explore.handleQuery` assemble the final query string?**
   It concatenates four parts each with a trailing `&`: `searchPart + pricePart + categoryPart + sortPart`. Then it slices off the final `&` with `.slice(0, -1)`. If all parts are empty, `finalQuery` is an empty string (the full slice produces `''`). This is brittle — if any part has a missing trailing `&`, the concatenation breaks.

2. **Why does `BookDetails.checkUserEligibility` manually decode the JWT?**
   `authService.currentUser()` is null if `getMe()` has not been called yet (e.g., on first page load without navigating through an auth guard). The fallback decodes `localStorage.getItem('token')` to get the user ID directly from the JWT payload. This is a workaround for the lack of a proactive `getMe()` call on page load.

3. **What is the role of `@ViewChild('reviewsList') reviewsList!: ReviewsListComponent`?**
   After a new review is submitted via `ReviewForm`, the parent `BookDetails` receives the `reviewAdded` event and calls `this.reviewsList.loadReviews()` to refresh the list without a full page reload. This is direct imperative component communication — an alternative to passing signals/inputs.

4. **Why is `handleQuery` triggered by the SearchBar's `query` output but price and category changes only update their respective signals without triggering a fetch?**
   Price and category changes update `priceQuery` and `categoryQuery` signals but do NOT call `getAllBooks`. Only `handleQuery` calls `getAllBooks`. This means changing the price slider or category filter does nothing until the user also submits a search. **This is a significant UX bug** — filter changes should trigger an immediate fetch.

5. **Both `Explore` and `AdminBooks` have nearly identical logic. What does this suggest architecturally?**
   Violation of DRY principle. Both components share: `books`, `categories`, `authors` signals, `sortOptions` array, `handleQuery`, `handlePageChange`, `handleFilterCategories`, `handlePriceChange`. This logic should be extracted into a `BookListService` or a `BookListBase` class. **Fix:** Extract to a shared service or use component composition.

**Cross-Topic Questions:**
- The Explore page passes `categories` and `authors` signals to `SearchBar` and `Filter` as inputs. These are populated by `getAllCategories()` and `getAllAuthors()` on `ngOnInit`. If those calls fail, the filters are empty but the page still works — graceful degradation.
- Book IDs in `BookDetails` use `book.id || book._id` throughout — the `_id → id` backend mapping is correctly handled here.

**Pitfalls & Issues:**

- **Pattern (major):** Filtering (price, category) does not trigger a re-fetch until `handleQuery` is called. Only `SearchBar` submission triggers `handleQuery`. **Fix:** Have `handleFilterCategories` and `handlePriceChange` call `handleQuery()` directly after updating their signals.
- **Pattern:** `console.log` statements are littered in `handleQuery` (`console.log('Handling query:', query)`, etc.). Remove before production.
- **Pattern:** `Explore` and `AdminBooks` are near-duplicates (~200 lines each). Massive DRY violation.
- **Pattern:** `checkUserEligibility` makes two sequential HTTP calls (getBookReviews + getMyOrders) with nested subscribes — a pyramid of doom. **Fix:** Use `forkJoin` or `combineLatest`.

**Quick-Recall Cheat Sheet:**
- `Explore` assembles query from 4 signal fragments — fragile string concat with `.slice(0,-1)`
- Category/price filters update signals but don't auto-trigger fetch — UX bug
- `BookDetails` manually decodes JWT when `authService.currentUser()` is null — workaround for missing eager profile fetch
- `Explore` ≈ `AdminBooks` — DRY violation, should be extracted
- Review eligibility check = two sequential API calls (reviews + orders) — should use `forkJoin`

---

## 13. Cart & Checkout Pages

### Cart & Checkout Pages

**What it does:** `Cart` displays the user's cart with quantity controls, item removal, and a totals summary. It uses a `Subject`-based debouncer so rapid quantity changes are batched. `Checkout` is a two-section reactive form (shipping address + payment method) that places an order. It supports COD and Online payment with a Stripe placeholder.

**Design Decisions:**
- `Cart` uses `debounceTime(500)` on a `Subject<{ item, quantity }>` to batch quantity change requests — prevents spamming the backend API.
- Checkout totals are computed client-side: `subtotal → shipping (free if ≥100) → 8% tax → total`. These don't match the Cart page's totals (cart has different shipping logic: free if >1000, fixed 100 otherwise).
- Checkout uses `timeout(10000)` + `finalize()` on the order submission observable.
- If payment method is 'Online', a fake 2-second Swal loading animation fires before navigating to order confirmation — a UI stub for the unimplemented Stripe flow.

**Interview & Discussion Questions:**

1. **How does the quantity debouncer work in `Cart`?**
   A `Subject` named `quantityDebouncer` is created. `changeQuantity()` pushes items into it with `debouncer.next(...)`. The `pipe(debounceTime(500))` in `ngOnInit` waits 500ms of silence, then subscribes and calls `cartService.updateCartItem(bookId, quantity)`. This means if the user clicks +/- multiple times quickly, only the last value after 500ms of inactivity is sent to the backend.

2. **What does `timeout(10000)` do on the `submitOrder` observable?**
   If the backend doesn't respond within 10 seconds, `timeout` throws a `TimeoutError`, which is caught by the `error` callback and triggers the "Order Failed" Swal. This prevents the UI from hanging indefinitely. `finalize(() => this.isSubmitting = false)` ensures the loading state is always reset.

3. **Why does `CheckoutComponent` use `markFormGroupTouched` recursively?**
   `this.checkoutForm` is a nested `FormGroup` (shipping + payment as sub-groups). Calling `markAllAsTouched()` on the parent group only marks immediate controls. The recursive `markFormGroupTouched` traverses nested `FormGroup` and `FormArray` instances, ensuring all validation errors are surfaced in the template.

4. **The checkout's shipping calculation (free if subtotal >= 100) differs from the cart page's logic (free if > 1000). Is this a bug?**
   Yes. `Cart` uses `this.itemTotal > 1000 ? 50 : 100` (shipping is 50 or 100). `Checkout` uses `sub >= 100 ? 0 : 10` (shipping is 0 or 10). These are completely different thresholds and amounts. The displayed totals on cart and checkout will differ for most order sizes. **Fix:** Extract shipping calculation to `CartService` or a utility function as a single source of truth.

5. **What happens when the user selects "Online" payment and clicks Place Order?**
   The order is placed via `orderService.createOrder()` with `paymentMethod: 'Online'`. On success, a 2-second fake Swal "Processing Payment" dialog appears, then navigation goes to `/order-confirmation/:id`. There is no actual Stripe integration — this is a UI stub. The backend also has no Stripe implementation.

**Cross-Topic Questions:**
- `checkout.ts` maps cart items to order payload using `item.book.id || item.book._id` — correctly handles the `_id → id` mapping.
- Error handling in `submitOrder` checks both `err?.error?.errors` (array from Joi validation) and `err?.error?.message` (string from Express error handler) — correctly handles both backend error shapes.

**Pitfalls & Issues:**

- **Pattern (bug):** Cart and Checkout have different shipping calculation logic. Total displayed will differ between pages.
- **Pattern:** Stripe/Online payment is a fake 2-second delay with no real integration. The backend also has no Stripe implementation. Any order placed as "Online" creates a real order record with `paymentMethod: 'Online'` and `paymentStatus: 'pending'` but no payment is actually processed.
- **Pattern:** `quantityDebouncer` Subject is created but never completed. If the user navigates away mid-debounce, the pending emission will still fire after `ngOnDestroy`. **Fix:** Add `takeUntilDestroyed()` or complete the Subject in `ngOnDestroy`.
- **Pattern:** `Cart` page directly mutates `item.quantity` in `changeQuantity()` for optimistic UI, but on error calls `loadCart()` (full reload). This is acceptable but inconsistent with the admin orders page which rolls back the specific field.

**Quick-Recall Cheat Sheet:**
- Cart quantity changes are debounced 500ms via `Subject` + `debounceTime`
- Checkout has `timeout(10000)` on order submit — prevents indefinite hang
- Cart vs Checkout shipping logic DIFFER — bug with inconsistent amounts and thresholds
- "Online" payment = fake 2-second Swal + navigation, no real Stripe
- `quantityDebouncer` Subject never completed — potential leak on navigation

---

## 14. Order History & Order Confirmation

### Order History & Order Confirmation

**What it does:** `OrderHistory` fetches and displays the user's past orders with book images and subtotals. It normalizes the API response (handles both populated and unpopulated `bookId` shapes). `OrderConfirmation` fetches and displays a single order by ID from the route params.

**Design Decisions:**
- `OrderHistory` defines local interfaces (`ApiBookRef`, `ApiOrderItem`, `ApiOrder`) to type the raw API response — a defensive approach given the polymorphic `bookId` field.
- A `devLogin()` method with a hardcoded test JWT token is present in production code.
- `OrderHistory` uses `ChangeDetectorRef.detectChanges()` explicitly, suggesting the component may be running in a zone that doesn't auto-detect changes, or is under `OnPush`.
- `trackByOrder` is implemented for `ngFor` performance.

**Interview & Discussion Questions:**

1. **Why does `OrderHistory` define its own `ApiOrder` and `ApiOrderItem` local interfaces instead of using the existing `Order` interface?**
   The `Order` interface expects `items: OrderItem[]` where `OrderItem.bookId` is `string | Book`. The actual API response may have a more complex populated shape (with `bookName`, `imageUrl`, `priceAtPurchase`, `subtotal` at the item level). The local interfaces model the raw response faithfully before normalizing it into the standard `Order` type.

2. **What does the `fetchOrders` normalization do to each order item?**
   For each item, it checks if `bookId` is a string or an object. If it's an object, it extracts `coverImage` and the ID (`_id || id`). It then constructs a flat `OrderItem` with `bookId` as a string, plus `bookName`, `imageUrl`, `quantity`, `priceAtPurchase`, and a computed `subtotal`. This normalizes populated and unpopulated API responses into a consistent shape.

3. **What is `devLogin()` doing in production code? Why is it dangerous?**
   It hardcodes a JWT token and sets it in `localStorage`, then calls `fetchOrders()`. This bypasses the entire auth flow. The hardcoded token contains a real user's `id` and `email`, is readable in source, and could allow anyone reading the source to authenticate as that user. **Fix:** Remove entirely before production deployment.

4. **How does `OrderConfirmation.asBook()` work and why is it needed?**
   ```typescript
   asBook(bookId: any): Book | null {
     return bookId && typeof bookId === 'object' && 'name' in bookId ? (bookId as Book) : null;
   }
   ```
   It's a type-narrowing helper for the template. Since `OrderItem.bookId` is `string | Book`, the template can't directly access `bookId.name`. This method checks if the value is an object with a `name` property, casts it to `Book`, and returns it (or null). This is used in the template as `*ngIf="asBook(item.bookId) as book"`.

5. **Why does `OrderHistory` call `this.cdr.detectChanges()` manually?**
   The component is not explicitly `OnPush`, but `ChangeDetectorRef` is injected. Manual `detectChanges()` is called after async operations. This suggests either the component was originally `OnPush` (and `detectChanges` was correct) or the developer added it defensively. Without `OnPush`, `detectChanges()` forces a full view refresh but is unnecessary. It should be removed unless `OnPush` is added.

**Cross-Topic Questions:**
- `OrderHistory` handles 401 specifically (`err.status === 401`) to show a "session expired" message. This is the only component in the codebase with explicit 401 response handling — the interceptor should handle this globally.
- The route `/order-confirmation/:id` requires `authGuard + userGuard`. After placing an order in `Checkout`, navigation goes to this route. The `userGuard` calls `getMe()` if user is not loaded, ensuring the profile is available.

**Pitfalls & Issues:**

- **Pattern (critical):** `devLogin()` with a hardcoded JWT in production code.
  ```typescript
  devLogin(): void {
    const devToken = 'eyJhbGci...'; // HARDCODED REAL JWT
    localStorage.setItem('token', devToken);
    ...
  }
  ```
  **Fix:** Remove immediately. If needed for development, gate behind `!environment.production`.
- **Pattern:** Manual `cdr.detectChanges()` without `OnPush` is redundant noise. Add `OnPush` or remove `cdr.detectChanges()` calls.
- **Pattern:** `goToBookDetails` in `OrderHistory` accepts `string | { _id?: string; id?: string } | undefined`. The polymorphism is necessary but should be handled by a centralized utility.

**Quick-Recall Cheat Sheet:**
- `OrderHistory` normalizes raw API response (populated vs string bookId) into a flat `OrderItem`
- `devLogin()` with hardcoded JWT — **MUST be removed before production**
- `asBook()` = template type-narrowing helper for `string | Book` union
- `trackByOrder` implemented — good `ngFor` optimization
- Manual `cdr.detectChanges()` without `OnPush` — redundant

---

## 15. Admin Pages

### Admin Pages

**What it does:** Six admin sub-pages: `AdminUsers` (paginated user management), `AdminBooks` (book CRUD with full filtering), `AdminAuthors`, `AdminOrders` (status + payment status updates), `AdminReviews` (list + delete), plus the `Admin` shell component with the sidebar and `CategoryAdmin` (routed as child). All are guarded by `adminGuard`.

**Design Decisions:**
- `AdminUsers` is the most complete — uses `ChangeDetectionStrategy.OnPush`, all signals, server-side pagination, reactive forms with dynamic validators (password required on create, optional on edit), and email-taken error handling via `setErrors`.
- `AdminOrders` uses optimistic UI updates with rollback — `order.status = newStatus` before the API call, reverting on error.
- `AdminReviews` uses `signal<Review[]>` for local state management.
- `AdminBooks` is a near-duplicate of `Explore` (same filtering/sorting logic).
- `AdminAuthors` uses SweetAlert2 modals with inline `document.getElementById` DOM access for form inputs.

**Interview & Discussion Questions:**

1. **How does `AdminUsers` handle the email-already-taken error from the backend?**
   In the create user error handler, it checks if `err?.error?.message` or `err?.error?.errors` contains "email" + "taken"/"exist" (case-insensitive). If true, it calls `emailControl.setErrors({ ...existingErrors, emailTaken: true })` to add a custom error to the email control. The template then shows a specific validation message for `emailTaken`.

2. **Why does `AdminUsers.setPasswordValidators` change validators dynamically?**
   Password is required when creating a new user but optional when editing (to allow updating other fields without changing the password). `setPasswordValidators(true)` adds `Validators.required`; `setPasswordValidators(false)` removes it. `updateValueAndValidity()` is called afterward to re-run validation with the new rules.

3. **Explain the optimistic UI pattern in `AdminOrders.updateStatus`.**
   `order.status = newStatus` updates the local object immediately for instant UI feedback. Then the API call is made. If it succeeds, the local state is already correct. If it errors, `order.status = previousStatus` rolls back. The catch: this mutates the array element in place, which may not work with `OnPush` detection if the reference doesn't change. Since `AdminOrders` does NOT use `OnPush`, this works but is fragile.

4. **How does `AdminAuthors` collect form data for create/edit?**
   It uses `Swal.fire({ html: '<input id="swal-input1"...>' })` with a `preConfirm` callback that manually reads DOM elements via `document.getElementById`. This bypasses Angular's form system entirely. It is fragile, untestable, and not type-safe. **Fix:** Use a proper Angular reactive form in a modal component.

5. **Why does `Admin` (shell) call `authService.getMe().subscribe()` in `ngOnInit`?**
   The admin panel needs to display the user's name and initials in the sidebar. If the user navigated directly to `/admin` without going through a guard that fetched the profile (or if the profile expired from memory), `getMe()` is called proactively. The sidebar then reads `authService.currentUser` which is updated by `getMe()`.

**Cross-Topic Questions:**
- `AdminOrders.loadOrders()` calls `orderService.getAllOrders()` which hits `GET /order` — an admin-only endpoint. The backend's `admin` middleware verifies the role. The `adminGuard` on the parent route prevents non-admins from reaching this page.
- `AdminBooks` imports `BookForm` component — the only place `BookForm` is used. The `BookForm` emits `FormData` for file uploads (book cover images → Cloudinary via the backend).

**Pitfalls & Issues:**

- **Pattern:** `AdminAuthors` uses `document.getElementById` inside SweetAlert modals instead of Angular forms. Untestable and not Angular-idiomatic.
- **Pattern:** `AdminBooks` and `Explore` are near-identical (DRY violation). `AdminBooks` adds delete/add/edit buttons.
- **Pattern:** `AdminOrders` uses `setTimeout(() => this.cdr.detectChanges())` to "avoid NG0100" (ExpressionChangedAfterItHasBeenChecked). This is a band-aid. The root cause is setting `this.isLoading = false` in the subscription which triggers CD synchronously. **Fix:** Use `OnPush` with signals.
- **Pattern:** `deleteBook` in `AdminBooks` does not update the local `books` signal after a successful delete — the deleted book remains visible until the user manually refreshes. **Fix:** Call `getAllBooks()` or remove the item from `books.update(arr => arr.filter(...))`.

**Quick-Recall Cheat Sheet:**
- `AdminUsers` = most complete component: OnPush, signals, dynamic validators, email-taken error
- `AdminOrders` = optimistic UI with rollback (but mutations in-place, no signal update)
- `AdminAuthors` uses DOM getElementById in Swal — not Angular-idiomatic
- `AdminBooks.deleteBook` doesn't refresh the list after delete — stale UI bug
- `setTimeout + cdr.detectChanges()` in `AdminOrders` = NG0100 band-aid, fix with OnPush + signals

---

## 16. Profile Pages

### Profile Pages

**What it does:** `ProfileComponent` (user) and `AdminProfileComponent` (admin) allow users to view and update their profile (name, date of birth, password). Both are `OnPush`, use reactive forms with inline edit mode toggling, and share essentially the same logic.

**Design Decisions:**
- Edit mode is toggled with an `isEditMode` signal — view mode shows read-only data, edit mode shows the form.
- Password change is optional — only included in the update payload if `password` field is non-empty.
- Password confirmation is handled inline (not a validator) — a manual comparison before sending the API call.
- Both profile components call `authService.getMe()` if `currentUser()` is null on init.

**Interview & Discussion Questions:**

1. **Why is password confirmation checked manually (`if (password !== confirmPassword)`) instead of as a form validator?**
   The `profileForm` uses a flat group, not a group-level validator. Adding a group validator like `passwordMatchValidator` would require restructuring the form. The manual check before API submission is simpler but bypasses Angular's standard validation reporting pattern. **Fix:** Add a cross-field group validator and remove the manual check.

2. **Why do both profile components exist separately instead of sharing one component?**
   They are functionally nearly identical. The only differences are the route path, the `RouterLink` targets in the template, and minor styling. This is a DRY violation. **Fix:** Create a shared `ProfileFormComponent` with an `isAdmin` input.

3. **How does `populateForm` handle the `dob` field?**
   `user.dob ? user.dob.split('T')[0] : ''` — the backend returns ISO 8601 datetime strings (e.g., `2000-01-15T00:00:00.000Z`). Splitting on `'T'` extracts the date portion (`2000-01-15`) which is what the HTML `<input type="date">` expects.

4. **What does `notFutureDateValidator` do?**
   It is a custom `ValidatorFn` in `form-validators.ts`. It parses the input date and compares it to today's date (with time set to midnight). If the date is in the future, it returns `{ futureDate: true }`. This prevents users from entering a future date of birth.

5. **Why does `saveProfile` call `this.profileForm.markAllAsTouched()` before returning on invalid?**
   By default, Angular only shows validation errors for controls that have been "touched" (interacted with). `markAllAsTouched()` marks every control as touched so all validation error messages become visible immediately when the user clicks "Save" without filling required fields.

**Cross-Topic Questions:**
- `authService.updateMe(payload)` calls `PUT /auth/me` and updates `_currentUser` signal via the response `res.data`. The profile form then re-reads `currentUser()` for display.
- `notFutureDateValidator` is shared between `ProfileComponent`, `AdminProfileComponent`, `Register`, and `AdminUsers` — correctly centralized in `utils/form-validators.ts`.

**Pitfalls & Issues:**

- **Pattern:** Profile and AdminProfile are near-identical. DRY violation.
- **Pattern:** Password confirmation is handled manually, not as a form validator. The `confirmPassword` control has no validators set on it, so `profileForm.invalid` won't catch mismatched passwords — the manual check is the only safety net.
- **Pattern:** `cancelEdit` calls `populateForm()` which patches the form with current user values. If `getMe()` was called but the response overwrote the in-memory user with different data (unlikely but possible), the cancel behavior correctly resets to server state.

**Quick-Recall Cheat Sheet:**
- Both profile pages are near-identical — DRY violation
- Password change is optional; payload only includes password if non-empty
- Password confirmation is manual check, not a form validator
- `dob` field uses `.split('T')[0]` to convert ISO datetime to `YYYY-MM-DD` for date input
- `markAllAsTouched()` on save — shows all validation errors at once

---

## 17. Form Validators Utility

### Form Validators Utility

**What it does:** `form-validators.ts` exports two reusable form validation utilities: `passwordStrengthPattern` (regex requiring at least one letter and one digit) and `notFutureDateValidator` (custom `ValidatorFn` that rejects future dates).

**Design Decisions:**
- `passwordStrengthPattern` is exported as a `RegExp` constant, not as a validator function, so it can be used directly with `Validators.pattern()` AND as a standalone test in business logic.
- `notFutureDateValidator` parses the date with an appended `T00:00:00` to avoid timezone edge cases where `new Date('2024-01-15')` is interpreted as UTC midnight and may be a day off in local timezones.
- Both are used across multiple pages: register, admin-users, profile, admin-profile.

**Interview & Discussion Questions:**

1. **Why does `notFutureDateValidator` append `T00:00:00` to the value before parsing?**
   `new Date('2024-01-15')` is parsed as UTC midnight in most environments. In a timezone ahead of UTC (e.g., UTC+3), midnight UTC is 3 AM local time, which means the "date" appears to be correct but the comparison with `new Date()` (which is local time) could produce off-by-one errors on the boundary day. Appending `T00:00:00` makes it parse as local midnight, ensuring a same-day comparison is always correct.

2. **Why is `passwordStrengthPattern` exported separately from a validator function?**
   `Validators.pattern(regex)` requires a regex, not a `ValidatorFn`. By exporting the raw regex, it can be used with `Validators.pattern(passwordStrengthPattern)` directly. If it were wrapped in a validator function, callers would need to use it differently. The pattern can also be used in unit tests or documentation outside Angular's form system.

3. **What edge cases might `notFutureDateValidator` miss?**
   If `control.value` is an empty string, the validator returns `null` (valid). The required validator is expected to catch empty values separately. If `control.value` is an invalid date string, `Number.isNaN(inputDate.getTime())` returns `{ invalidDate: true }` — good defensive coding.

4. **Are these validators unit testable? How would you test `notFutureDateValidator`?**
   Yes. Create a mock `AbstractControl` with `{ value: '1990-01-01' }` and call `notFutureDateValidator(control)`. Assert it returns `null`. Then pass a future date string and assert it returns `{ futureDate: true }`. No Angular TestBed needed — pure functions.

5. **Should the password pattern be more restrictive? What does it currently allow?**
   `^(?=.*[A-Za-z])(?=.*\d).+$` requires at least one letter and one digit with any other characters. It allows spaces, special characters, and no minimum length enforced by the regex itself (minimum length is handled by `Validators.minLength(8)`). It does not require uppercase, lowercase, or special characters — minimal strength.

**Cross-Topic Questions:**
- The password pattern is used on Register, AdminUsers create, and profile update. The backend's Joi schema likely has its own password validation. If they differ, a password valid on the frontend might be rejected by the backend. **Fix:** Align regex with backend Joi rules.
- `notFutureDateValidator` is applied to `dob` (date of birth) across all forms. The `maxDob` getter in profile components also sets `max` attribute on the input as a second UI layer of protection.

**Pitfalls & Issues:**

- **Pattern:** No minimum character class requirements beyond "at least one letter and one digit." A password of `aaaaaaa1` passes. **Fix:** Add special character requirement if backend requires it.
- **Pattern:** `passwordStrengthPattern` and the backend's Joi schema may be out of sync. No shared validation logic. **Fix:** Document the exact rules that match the backend.

**Quick-Recall Cheat Sheet:**
- `passwordStrengthPattern` = regex requiring ≥1 letter + ≥1 digit; used with `Validators.pattern()`
- `notFutureDateValidator` = returns `{ futureDate: true }` if date > today
- `T00:00:00` appended to avoid UTC/local timezone off-by-one on boundary dates
- Both are pure functions — unit testable without Angular TestBed
- Password pattern may not match backend Joi rules — potential sync issue

---

## 18. SSR Configuration

### SSR Configuration

**What it does:** The app uses Angular SSR (`@angular/ssr`). `server.ts` sets up an Express server that serves static assets from `/browser` and delegates all other requests to `AngularNodeAppEngine`. `app.routes.server.ts` defines server-side rendering modes. `app.config.server.ts` merges SSR providers with the base client config.

**Design Decisions:**
- `RenderMode.Client` on `path: '**'` means the server renders a shell HTML (no pre-rendered content) and the browser handles all rendering. This is effectively CSR with SSR infrastructure in place but not used.
- `maxAge: '1y'` on static files means browser and CDN cache assets for one year — requires content-hashed filenames (which Angular's build produces by default).
- `isMainModule(import.meta.url) || process.env['pm_id']` — the server starts if run directly OR if managed by PM2 process manager.
- `AngularNodeAppEngine` handles request routing and rendering internally.

**Interview & Discussion Questions:**

1. **What is the actual rendering behavior given `RenderMode.Client` for all routes?**
   The server returns a minimal HTML shell (index.html with no pre-rendered content). Angular bootstraps in the browser and renders everything. This gives no SEO benefit and no performance benefit over a pure SPA — only the infrastructure is in place.

2. **Why would you change `RenderMode.Client` to `RenderMode.Server` for `/explore`?**
   The explore page has public book listings that benefit from SEO (book names, categories in HTML) and faster first contentful paint (pre-rendered HTML arrives with content). Changing to `RenderMode.Server` would render the page on the server for every request.

3. **What does `withEventReplay()` do in the context of current SSR config (Client mode)?**
   Since all routes are `RenderMode.Client`, the server never pre-renders content. `withEventReplay()` has no effect in this configuration — it only activates when client-side hydration needs to replay events captured during SSR's rendered HTML interaction period.

4. **Why does `NavBar.ngOnInit` check `isPlatformBrowser` before calling `loadCartCount`?**
   During SSR (if ever enabled), there is no `localStorage` and no user session on the server. Calling `loadCartCount` server-side would fail with a 401 (no auth header in the interceptor, since `_token` is initialized from `localStorage` which is unavailable). The browser check prevents this wasted request.

5. **What is the `reqHandler` export in `server.ts` used for?**
   It's an export for Firebase Cloud Functions or other serverless environments that can import and invoke the Express request handler directly rather than running the `app.listen()` server. The `isMainModule` check separates "run as Node process" from "used as a module by serverless host."

**Pitfalls & Issues:**

- **Pattern:** SSR infrastructure is set up but `RenderMode.Client` renders everything client-side — wasted complexity. Either commit to SSR (set specific routes to `RenderMode.Server`) or remove SSR entirely. The current state adds build complexity with no benefit.
- **Pattern:** Guards all return `true` during SSR (`!isPlatformBrowser` → `return true`). If SSR were actually enabled for protected pages, users could briefly see protected content before client hydration kicks in and the guard redirects them. **Fix:** For SSR-rendered pages, use server-side session/cookie auth instead of `localStorage` guards.

**Quick-Recall Cheat Sheet:**
- `RenderMode.Client` for all routes = SSR infrastructure, no SSR benefit
- `isMainModule || pm_id` = starts server when run directly or via PM2
- `maxAge: '1y'` on static assets = aggressive caching (safe with hashed filenames)
- Guards return `true` on server — SSR would briefly show protected pages before client hydration
- `withEventReplay()` + `withFetch()` = configured for SSR but not active due to Client render mode

---

## Cross-Repo Integration Points

**How the interceptor attaches JWT to requests:**
`authInterceptor` reads `inject(AuthService).token()` — a signal that always reflects the current value of `localStorage.getItem('token')` as set by `handleAuthSuccess`. On every HTTP request, if the token is non-null, a new request is cloned with `Authorization: Bearer ${token}`. The backend's `auth` middleware reads `req.headers.authorization`, validates the JWT, and sets `req.user`. If the token is absent or invalid, the backend returns 401/403. The frontend has no global 401 interceptor — each component handles errors locally.

**How the frontend handles the inconsistent error response shape (message vs errors key):**
Most error handlers check `err?.error?.message || err?.error?.errors`. For Joi validation errors (array), the backend returns `errors: string[]`. For application errors, it returns `message: string`. Components that need to display these do:
```typescript
const backendErrors = err?.error?.errors;
const msg = Array.isArray(backendErrors)
  ? backendErrors.join('<br>')
  : (err?.error?.message || err?.message || 'Default message');
```
This pattern is implemented in `checkout.ts` and `admin-users.ts`. Many other error handlers only check `err?.error?.message` and miss the `errors` array. Inconsistent coverage across components.

**How the frontend handles the inconsistent status field casing ('Success'/'success'/'Fail'):**
The frontend does NOT use `response.status` for control flow anywhere. HTTP status codes (`res.ok`, `err.status`) drive all branching. TypeScript types `ApiResponse.status` as plain `string`. The `status` field is effectively ignored, which is the correct approach given the backend inconsistency.

**How guards align with backend middleware (auth + admin chain):**
`authGuard` = `auth` middleware (JWT verification). `adminGuard` = `auth` + `admin` middleware (JWT + role check). `userGuard` = `auth` middleware + inverse admin check (blocks admins from user-only routes, no backend equivalent). The backend doesn't have a concept of "user-only" routes — all non-admin authenticated routes are accessible to both users and admins. The `userGuard` is a purely frontend UX decision to give admins a better experience.

**How the frontend maps `_id → id` (only Book model does this on backend):**
The `Book` interface has both `_id: string` (required) and `id?: string` (optional). Anywhere a book's ID is needed for an API call, the pattern `book.id || book._id` or `book.id ?? book._id` is used. This is consistently handled in `cart.ts`, `checkout.ts`, and `book-details.ts`. For non-Book models (User, Author, Category, Order), only `_id` is used. `AdminUser` uses `_id` throughout. The `User` (auth) interface uses `id` (not `_id`) — matching the backend's JWT payload field which is also `id`.

**How the frontend handles the flat `GET /auth/me` response vs the `{ data: ... }` wrapper on other endpoints:**
`AuthService.getMe()` is typed as `Observable<User>` (not `Observable<ApiResponse<User>>`). The backend returns `{ id, email, firstName, lastName, dob, roles }` directly without a `data` wrapper. Every other service uses `ApiResponse<T>`. This asymmetry is correctly handled by typing `getMe()` differently. Components and guards call `getMe()` and receive the `User` directly — no `.data` access needed.

**How Stripe payment flow is handled on frontend given it's not yet implemented on backend:**
The checkout form has a payment method selector (`COD` | `Online`). When `Online` is selected and the order is placed, the frontend creates the order normally (`POST /order`), then shows a fake 2-second "Processing Payment" Swal loading dialog, then navigates to `/order-confirmation/:id`. No Stripe SDK is loaded, no payment intent is created, no real charge occurs. The order is created with `paymentMethod: 'Online'` and `paymentStatus: 'pending'`. Admin can manually update `paymentStatus` to `'paid'` via the admin orders panel. The full Stripe implementation (load Stripe.js, create PaymentIntent on backend, confirm payment on frontend) is entirely missing.

**Loading states and error states per API call:**
Each component manages its own loading/error state:
- `isLoading = signal<boolean>(false)` or `isLoading = false` (property) set to `true` before the call, `false` in both `next` and `error` callbacks (or via `finalize()`).
- Error messages stored in `errorMessage = signal<string|null>(null)` or `error: string | null = null`.
- No global loading indicator or error toast system. Each component shows its own inline error.
- Inconsistency: `AdminOrders` uses `setTimeout(() => cdr.detectChanges())` after setting `isLoading = false`. `AdminUsers` uses `OnPush` + signals (correct). `Cart` uses `cdr.detectChanges()` after the subscription (unnecessary without `OnPush`).

---

## Top 20 Q&A Cheat Sheet

**1. What is the two-step OTP auth flow and how does the frontend implement it?**
Step 1: POST credentials → backend sends OTP email, returns `{ message }`. Step 2: POST email + OTP → backend returns `{ accessToken, user? }`. `AuthService` stores the token, calls `getMe()` if user not in response, sets `_currentUser` signal.

**2. Why does `AuthService.getMe()` return `Observable<User>` while all other services return `Observable<ApiResponse<T>>`?**
The backend's `GET /auth/me` returns a flat User object without a `{ data: ... }` wrapper. Typing it as `User` directly matches the actual response shape.

**3. How does the cart count badge stay in sync across pages?**
`CartService.cartCount` is a `signal<number>(0)`. Every cart mutation (add/remove/update) calls `loadCartCount().subscribe()` in a `tap` side effect, which updates the signal. `NavBar` reads this signal reactively in its template.

**4. What is `_id → id` mapping and where must the frontend handle it?**
Only the backend's `Book` model maps `_id → id` in `toJSON()`. The frontend's `Book` interface has both `_id` (required) and `id?` (optional). Anywhere a book ID is used for API calls, the code must use `book.id || book._id`.

**5. How does the frontend handle Joi validation error arrays vs single message strings?**
`err?.error?.errors` is an array for Joi validation failures. `err?.error?.message` is a string for application errors. The pattern: `Array.isArray(err?.error?.errors) ? errors.join('\n') : err?.error?.message`. Only `checkout.ts` and `admin-users.ts` implement this fully; other components only check `message`.

**6. Why do all guards return `true` during SSR?**
Browser APIs (`localStorage`, `document`, `Swal`) are unavailable on the server. The SSR pass renders everything; guards re-run on the client during hydration where browser APIs are available.

**7. What is the purpose of `userGuard` vs `authGuard`?**
`authGuard` only checks if a token exists. `userGuard` additionally calls `getMe()` if user data isn't loaded, and redirects admins to `/admin/books` — preventing admins from accessing user-only pages.

**8. Why does `BookCard.addToCart` call `event.stopPropagation()` and `event.preventDefault()`?**
The card is wrapped in a router link. Without stopping propagation, the click event bubbles up and triggers navigation to the book detail page instead of (or in addition to) adding to cart.

**9. How are price, category, and sort filters assembled into a query string for the books API?**
Four `signal` fragments are concatenated with `&` separators in `handleQuery()`: `searchPart + pricePart + categoryPart + sortPart`, with `.slice(0,-1)` removing the trailing `&`. Only `handleQuery` triggers a fetch — filter-only changes (price/category) do NOT auto-fetch without a search submit.

**10. Why isn't `status` from the API response used for control flow?**
The backend returns `status` as `'Success'`, `'success'`, or `'Fail'` inconsistently. The frontend always uses HTTP status codes for error handling and control flow, ignoring the `status` string.

**11. What is the Stripe payment status and what happens when a user selects Online payment?**
Stripe is not implemented on either frontend or backend. Selecting Online creates an order with `paymentMethod: 'Online'` and `paymentStatus: 'pending'`. A fake 2-second Swal loading dialog fires, then the user is redirected to order confirmation. No real payment occurs.

**12. How does `ReviewForm` determine if a user can leave a review?**
`BookDetails.checkUserEligibility` fetches both the book's existing reviews (to check if already reviewed) and the user's orders (to check for delivered orders containing this book). Both checks run sequentially via nested subscribes. Only users with a delivered order for the book who haven't already reviewed it can submit.

**13. What is the critical security bug in `OrderHistory`?**
`devLogin()` contains a hardcoded real JWT token that is set directly in `localStorage`. This exposes real user credentials in the source code and allows anyone to authenticate as that user. It must be removed before production deployment.

**14. Why does `CartService.getCart()` never throw an error?**
It wraps the HTTP call in `catchError(() => of(emptyCartFallback))`, returning a fake empty cart response on any error. This prevents the cart page from breaking for unauthenticated users who might navigate to the cart (though `authGuard` should prevent this).

**15. How does the `authInterceptor` work at a technical level?**
It is a functional `HttpInterceptorFn`. On every outgoing HTTP request, it reads `AuthService.token()` (a signal). If non-null, it clones the request with `setHeaders: { Authorization: 'Bearer ${token}' }` and passes the cloned request to `next()`. If null, the original request passes through unchanged.

**16. What are the two main DRY violations in the codebase?**
(1) `Explore` and `AdminBooks` are near-identical components (~200 lines each) with the same filtering, sorting, pagination, and query building logic. (2) `ProfileComponent` and `AdminProfileComponent` are near-identical with the same reactive form, edit mode, and save logic.

**17. Why does `AdminUsers` use `fb.nonNullable.group()` but other forms use `fb.group()`?**
`nonNullable.group()` uses `NonNullableFormBuilder`, which ensures form controls never have `null` values — `.value` is always the control's type (string for text inputs), never `null | string`. This makes `getRawValue()` type-safe without null coalescing. Other forms use the nullable default and require `value ?? ''` patterns.

**18. How does the `debounceTime` in Cart prevent API spam?**
A `Subject<{ item, quantity }>` collects all quantity change events. It is piped with `debounceTime(500)`, meaning the subscription only fires after 500ms of inactivity. Rapid clicks buffer in the Subject; only the final value after the user stops clicking is sent to the API.

**19. What is the inconsistency in shipping cost calculations between Cart and Checkout?**
`Cart`: free shipping if `itemTotal > 1000`, otherwise `100`. `Checkout`: free shipping if `subtotal >= 100`, otherwise `10`. These use completely different thresholds and amounts — a user would see different totals on each page.

**20. What environment file should services import from and what is the current state?**
Services should always import from `environment` (the production alias replaced by the Angular build system). Currently `BookService`, `AuthorService`, `CategoryService`, `CartService`, and others incorrectly import from `environment.development`. Only `AuthService`, `OrderService`, and `ReviewService` correctly import from `environment`.
