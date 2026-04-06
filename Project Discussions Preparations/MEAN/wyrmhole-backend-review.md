# WyrmHole Backend — Full Code Review & Discussion Guide
> **Stack:** Node.js · Express 5 · MongoDB · Mongoose 9 · JWT · OTP · Cloudinary · Multer · Joi · Pino  
> **Prepared for:** Team of 4 — project discussion & code review  
> **Scope:** Backend repository only (`ecommerce-backend`)

---

## Table of Contents

1. [Entry Point — `index.js`](#1-entry-point--indexjs)
2. [Authentication — `controllers/auth.js`, `middleware/auth.js`, `utils/jwt.js`, `utils/otp.js`](#2-authentication)
3. [User Model & Admin Controller](#3-user-model--admin-controller)
4. [Book Module — Model, Controller, Routes](#4-book-module)
5. [Author & Category Modules](#5-author--category-modules)
6. [Cart Module](#6-cart-module)
7. [Order Module — Transactions & State Machine](#7-order-module)
8. [Review Module](#8-review-module)
9. [Middleware Layer](#9-middleware-layer)
10. [Validation — Joi Schemas (`utils/validations.js`)](#10-validation--joi-schemas)
11. [Error Handling — `utils/error-handler.js`](#11-error-handling)
12. [Image Pipeline — Cloudinary, Multer, Sharp](#12-image-pipeline)
13. [Utilities — Logger, Mailer, OTP, JWT](#13-utilities)
14. [Models Index & Schema Design](#14-models-index--schema-design)
15. [Routes Layer](#15-routes-layer)
16. [Cross-Repo Integration Points](#cross-repo-integration-points)
17. [Top 20 Q&A Cheat Sheet](#top-20-qa-cheat-sheet)

---

## 1. Entry Point — `index.js`

### What it does
`index.js` is the application bootstrap. It wires together Express middleware (CORS, JSON body parsing, static files), mounts all route groups, registers the global error handler, connects to MongoDB via Mongoose, and exports a dual-mode handler that works both as a classic Node HTTP server for local dev AND as a Vercel serverless function.

### Design Decisions
- **Dual-mode export:** The `if (require.main === module)` guard allows the file to `app.listen()` locally while also exporting a serverless-compatible `async (req, res)` handler for Vercel. This is the standard Vercel/Express compatibility pattern.
- **Single connection guard (`isConnected`):** Since Vercel may reuse warm Lambda containers, the flag prevents multiple `mongoose.connect()` calls on repeated invocations.
- **Centralized routing via `routes/index.js`:** All route groups are loaded from a single barrel file, keeping `index.js` clean.
- **Error handler placement:** Registered _after_ all routes, as required by Express's 4-argument error middleware convention.
- **Cloudinary cleanup in error handler:** If a file was uploaded to Cloudinary mid-request but the request subsequently fails, `req.public_id` is used to roll back the orphaned image.

### Interview & Discussion Questions

**Q1: Why is there an `isConnected` flag in `connectDB()`? What problem does it solve?**  
A: Vercel serverless functions are stateless per invocation but containers can be reused ("warm starts"). Without the flag, every new request would try to re-run `mongoose.connect()`, potentially opening hundreds of connections to Atlas and hitting its connection limit. The flag short-circuits repeat calls in already-warm containers.

**Q2: Explain the dual-mode export pattern. How does the same file run locally AND on Vercel?**  
A: `if (require.main === module)` is `true` only when Node runs the file directly (e.g., `node index.js`), so `app.listen()` fires locally. Vercel never runs the file directly — it `require()`s it and calls the exported async function. That function calls `connectDB()` then passes `req` and `res` straight to Express's internal `app()` handle.

**Q3: The inline request logger uses `console.log`, but the rest of the app uses Pino. Is that intentional?**  
A: No, it's an inconsistency. The middleware at lines ~22–27 was clearly left from development and should be replaced with a `pino-http` middleware or removed. It logs every request body for POST calls, which is a data-leak risk in production (passwords, OTPs).

**Q4: What is the order of Express middleware and why does it matter here?**  
A: Order: CORS → static → JSON body parser → request logger → routes → error handler → 404 handler. The 404 catch-all must come _last_, after routes; the error handler must be registered after routes too. CORS must come before routes so preflight OPTIONS requests are handled before authentication logic can reject them.

**Q5: Why does the CORS config accept both `http://localhost:4200` and `process.env.FRONTEND_URL`?**  
A: `localhost:4200` is the Angular CLI dev server port. `FRONTEND_URL` is the production Vercel deployment URL. Both are whitelisted so the same codebase works in development and production without code changes. `.filter(Boolean)` safely drops `undefined` if `FRONTEND_URL` is unset.

**Q6: What happens if `mongoose.connect()` throws during a Vercel cold start?**  
A: The error propagates out of `connectDB()`, which `throw`s it. The exported async handler will reject, and Vercel will return a 500 to the client. Since `isConnected` is never set to `true`, the next request will retry the connection — which is the desired behavior.

### Cross-Topic Questions
- **Frontend ↔ Backend CORS:** Angular's `HttpClient` sends `credentials: true` cookies only if the backend sets `credentials: true` in CORS config — it does. The Angular environment files must point to the correct backend URL.
- **Serverless ↔ MongoDB:** Connection pooling behaves differently in serverless vs. long-running processes. The `isConnected` guard is a workaround; a more robust solution is `mongoose.connection.readyState`.
- **Error handler ↔ Cloudinary:** The `req.public_id` rollback in the error handler ties the image pipeline to the global error handler — a cross-cutting concern that requires both to be in sync.

### Pitfalls & Issues

**Issue 1 — Console logging passwords and OTPs:**
```js
if (req.method === 'POST') {
  console.log('Body:', JSON.stringify(req.body, null, 2));
}
```
This prints the full request body — including passwords and OTPs — to stdout on every POST. In production this is a serious security leak. **Fix:** Remove this block entirely or replace with `pino-http` which can be configured to redact sensitive fields.

**Issue 2 — `isConnected` flag is process-local, not connection-state-based:**
```js
let isConnected = false;
```
If Mongoose silently drops the connection, `isConnected` stays `true` and new requests won't reconnect. **Fix:** Use `mongoose.connection.readyState === 1` instead.

**Issue 3 — 404 handler placed after error handler in source:**
The 404 `app.use((req, res) => res.sendStatus(404))` is placed _after_ the error handler in the file. In Express 5 this still works, but it's a logical ordering smell that can confuse developers. **Fix:** Document or reorder for clarity.

### Quick-Recall Cheat Sheet
- Dual-mode: `require.main === module` → local server; exported async fn → Vercel serverless
- `isConnected` flag prevents repeated MongoDB connections on warm Lambda restarts
- CORS allows `localhost:4200` (dev) + `FRONTEND_URL` env var (prod), both with `credentials: true`
- Global error handler checks `req.public_id` to clean up orphaned Cloudinary uploads
- The inline `console.log` body logger is a dev leftover — **remove before production**

---

## 2. Authentication

**Files:** `controllers/auth.js` · `middleware/auth.js` · `utils/jwt.js` · `utils/otp.js` · `utils/mailer.js`

### What it does
Implements a two-factor registration and login flow: the user submits credentials, an OTP is emailed, the user submits the OTP, and only then is a JWT issued. The `auth` middleware verifies JWTs on protected routes by reading the `Authorization: Bearer <token>` header and attaching the decoded payload to `req.user`.

### Design Decisions
- **Two-step OTP flow for both register AND login:** Adds a second factor without a dedicated 2FA library. Registration stores user data in-memory with the OTP so it's only persisted after email verification.
- **In-memory OTP store (`Map`):** Simple, zero-dependency, but non-persistent. Intentional for a small app; doesn't survive process restarts.
- **JWT with 15-day expiry, no refresh tokens:** Simple stateless auth. No token rotation or revocation mechanism.
- **bcrypt salt rounds = 10:** Industry standard. Higher is more secure but slower; 10 is a good balance.
- **Separate `registerOtpStore` and `loginOtpStore`:** Prevents an OTP generated for registration being reused to complete a login flow.

### Interview & Discussion Questions

**Q1: Walk through the full registration flow step-by-step.**  
A: `POST /auth/register` → Joi validates body → `sendOtp()` generates a 6-char hex OTP, stores `{ otp, userData, expiresAt }` in `registerOtpStore` keyed by email, emails it. `POST /auth/register/verify-otp` → `consumeOtp()` checks expiry and value, deletes from store, returns the record → User document created → JWT returned.

**Q2: Why is user data stored in the OTP store before the user is saved to MongoDB?**  
A: To avoid creating zombie user accounts. If the user never verifies the OTP, no database record is created. The pending data lives only in RAM for 2 minutes. This is a cleaner approach than creating an unverified user and adding a verification flag.

**Q3: What are the security limitations of the in-memory OTP store?**  
A: (1) It doesn't survive server restarts — any pending OTP is lost. (2) On multi-instance deployments (load balanced), store A issues an OTP but the verify request might hit store B (which is empty), causing a false "OTP not found" error. (3) No rate limiting on OTP generation — an attacker can flood the email server. **Fix:** Use Redis for a shared, TTL-aware OTP store.

**Q4: What payload is embedded in the JWT, and what are the implications?**  
A: `{ id, email, roles }` — see `utils/jwt.js`. The `roles` array in the token means role changes (e.g., revoking admin) don't take effect until the 15-day token expires. **Fix:** Either shorten expiry, add a token version/revocation mechanism, or always re-fetch roles from DB on sensitive operations.

**Q5: How does the `auth` middleware attach user data to the request?**  
A: It reads `req.headers.authorization`, strips `Bearer `, calls `jwt.verify()` with `JWT_SECRET`. On success, the decoded payload `{ id, email, roles }` is assigned to `req.user`. On failure (expired, invalid signature), it creates an `UnauthorizedError` and calls `next(err)`.

**Q6: What happens if `verifyLoginOtp` is called with a valid OTP but the user has been deleted from the DB between login and OTP verify?**  
A: `consumeOtp()` succeeds (OTP is valid), then `User.findOne({ email })` returns `null`. The controller creates a `UserNotFoundError` and calls `next(err)`, returning 404. This is handled correctly.

### Cross-Topic Questions
- **Frontend ↔ JWT storage:** The Angular app likely stores the JWT in `localStorage` or a service. The backend never sets cookies, so `credentials: true` in CORS is redundant for pure JWT auth (though harmless).
- **Admin middleware ↔ JWT roles:** `middleware/admin.js` reads `req.user.roles` which was set by `middleware/auth.js`. Both middlewares must be chained (`auth` first, then `admin`) — the routes do this correctly.
- **OTP ↔ Mailer:** `sendOtp()` always attempts to email. The mailer has a dev fallback that `console.log`s the OTP when `EMAIL_HOST` is unset.

### Pitfalls & Issues

**Issue 1 — OTP store is in-process memory (not distributed):**
```js
const registerOtpStore = new Map();
const loginOtpStore = new Map();
```
On Vercel, each serverless invocation _may_ run in a separate container. A user who registers on one instance will never find their OTP on a verify request routed to another. **Fix:** Use Redis (e.g., Upstash) with a TTL key.

**Issue 2 — No OTP rate limiting:**
```js
async function sendOtp(store, email, extraData = {}) {
  const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
  store.set(email, {...extraData, otp, expiresAt: Date.now() + OTP_TTL});
  await sendOtpEmail(email, otp);
}
```
Anyone can call `/auth/register` in a tight loop with the same email, generating hundreds of emails. **Fix:** Check if an unexpired OTP already exists before generating a new one, and return a 429 with time-remaining.

**Issue 3 — JWT roles cached for 15 days:**
```js
jwt.sign({ id: user._id, email: user.email, roles: user.roles }, ..., { expiresIn: '15d' })
```
If an admin revokes a user's admin status, they keep admin access for up to 15 days. **Fix:** Reduce expiry or add DB role re-validation on admin-only endpoints.

**Issue 4 — `updateMe` allows password change without confirming current password:**
```js
if (password !== undefined) updates.password = password;
```
A session hijacker with a valid token can permanently change the password. **Fix:** Require `currentPassword` and verify with `bcrypt.compare` before allowing a password update.

### Quick-Recall Cheat Sheet
- Two-step OTP: credentials → OTP email → verify OTP → JWT issued
- OTP store is an in-memory `Map` — breaks in multi-instance/serverless environments
- JWT payload: `{ id, email, roles }`, 15-day expiry, no refresh token
- `auth` middleware → sets `req.user`; `admin` middleware → checks `req.user.roles`
- No rate limiting on OTP generation — denial-of-service risk against email provider

---

## 3. User Model & Admin Controller

**Files:** `models/user.js` · `controllers/admin.js`

### What it does
The `User` model defines the schema for all users, with bcrypt password hashing via Mongoose hooks. The admin controller provides CRUD operations over users, accessible only to admins, including search, pagination, and role management.

### Design Decisions
- **Password hashing in Mongoose hooks (`pre('save')`, `pre('findOneAndUpdate')`):** Keeps hashing logic co-located with the model, ensuring it's impossible to accidentally save a plain-text password.
- **`roles` as a string array (`['user']`, `['user', 'admin']`):** Flexible RBAC without a separate roles collection. Simple for a two-role system.
- **`isAdmin` boolean in admin API mapped to roles array:** Abstracts the internal roles representation from the API surface. The frontend sends `isAdmin: true/false`; the backend translates to `['user', 'admin']` or `['user']`.
- **`select('-password')` on every query:** Defense-in-depth to prevent accidental password hash exposure.

### Interview & Discussion Questions

**Q1: How does the `pre('findOneAndUpdate')` hook handle password hashing?**  
A: It uses `this.getUpdate()` to read the pending update object. If `password` is present, it hashes it and calls `this.setUpdate()` to replace the update with the hashed version before Mongoose sends it to MongoDB.

**Q2: What's the risk of `findByIdAndUpdate` with `runValidators: true` vs. a save-based update?**  
A: `findByIdAndUpdate` with `runValidators: true` only runs validators on the fields being updated, not the whole document. Also, `this` inside validators points to the query, not the document, so instance methods like `comparePassword` aren't available. The team correctly uses `new: true` (renamed `returnDocument: 'after'` in Mongoose 9) to return the updated document.

**Q3: How does the admin filter for users with only the 'user' role (no admin role)?**  
A: `filter.roles = { $size: 1, $all: ['user'] }` — this matches documents where the roles array has exactly 1 element AND that element is 'user'. This correctly excludes admins (who have `['user', 'admin']`).

**Q4: Is there any protection against an admin deleting themselves?**  
A: No. `DELETE /admin/users/:id` has no check to prevent self-deletion. **Fix:** Compare `req.params.id` to `req.user.id` and return 403 if they match.

**Q5: Why does `createUser` in the admin controller use `User.exists()` instead of just catching a duplicate-key error?**  
A: It provides a more explicit, user-friendly 409 error response (`'This email is already taken'`) rather than letting the duplicate-key error propagate to the generic error handler which would return a less clear message.

### Cross-Topic Questions
- **Admin controller ↔ Auth controller:** Both create users, but `admin/createUser` skips OTP entirely — the admin directly creates verified accounts. This is intentional but means admin-created accounts have no email verification.
- **Frontend ↔ Pagination:** The admin response includes `{ data, pagination: { total, page, limit, pages } }` — the Angular admin panel must read `pagination.pages` to render page controls.

### Pitfalls & Issues

**Issue 1 — Admin can delete themselves:**
```js
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  ...
});
```
No guard against self-deletion. **Fix:** Add `if (req.params.id === req.user.id) return res.status(403).json(...)`.

**Issue 2 — `updateUser` (admin) uses `findByIdAndUpdate` but password hashing hook may not fire correctly:**
```js
const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
```
The `pre('findOneAndUpdate')` hook in `user.js` does handle this case, but it only hashes if `update.password` exists at the top level of the update object. If the update is wrapped (e.g., `$set`), the hook won't find it. Since the controller passes a plain object, this works — but it's fragile. **Fix:** Explicitly use `{ $set: updates }` and update the hook accordingly, or use a `save()`-based approach.

**Issue 3 — `createdAt` is defined manually on schema AND timestamps could be added:**
```js
createdAt: { type: Date, default: Date.now }
```
The User schema doesn't use `{ timestamps: true }` but manually defines `createdAt`. This means `updatedAt` is never tracked. **Fix:** Remove the manual field and add `{ timestamps: true }` to the schema options.

### Quick-Recall Cheat Sheet
- Passwords hashed in `pre('save')` and `pre('findOneAndUpdate')` Mongoose hooks
- `roles: ['user']` vs `['user', 'admin']` — mapped from `isAdmin` boolean in API
- Always `select('-password')` on read queries
- `$size: 1, $all: ['user']` — clever filter to isolate pure-user accounts
- No self-deletion guard on admin delete — known gap

---

## 4. Book Module

**Files:** `models/book.js` · `controllers/book.js` · `routes/books.js`

### What it does
The most complex module. Books support full CRUD with image upload, soft-delete, and a rich aggregation pipeline for listing (with joins to Author, Category, Reviews for computed fields like `averageRating`). The `findAllBooks` static method on the model encapsulates the full search/filter/sort/paginate pipeline.

### Design Decisions
- **Soft delete (`isDeleted: true`):** Preserves referential integrity — orders and reviews that reference a deleted book's `_id` still resolve correctly. A hard delete would orphan those records.
- **Partial unique index on `name`:** `{ unique: true, partialFilterExpression: { isDeleted: false } }` allows multiple soft-deleted books to share the same name while enforcing uniqueness among active books.
- **Aggregation static method on model:** `Book.findAllBooks(query)` keeps the aggregation pipeline with the model, following the "fat model, thin controller" pattern. It handles filtering, joining, computing virtual fields, and `$facet`-based pagination in one pass.
- **`$facet` for paginated metadata:** A single aggregation pass returns both the paginated data array and the total count, avoiding two round trips.
- **Virtual `status` field:** Derived from `stock` without persisting it. Available when querying via `toJSON: { virtuals: true }` but NOT in aggregation results — the aggregation recomputes it with `$cond`.

### Interview & Discussion Questions

**Q1: Why is soft delete used instead of hard delete for books?**  
A: Orders store `bookId` references and even snapshot `bookName`/`priceAtPurchase`, but reviews only reference `bookId`. If a book is hard-deleted, order history still works (snapshot fields), but review queries via populate would silently return `null`. Soft delete keeps the document in MongoDB so all references remain resolvable.

**Q2: Explain the `$facet` stage in `findAllBooks`. Why is it used?**  
A: `$facet` runs multiple aggregation sub-pipelines on the same input documents in parallel. Here it runs `{ metaData: [{ $count: ... }] }` and `{ data: [{ $sort }, { $skip }, { $limit }] }` simultaneously. The result is both the total count and the current page of data in one query, enabling efficient pagination without two separate queries.

**Q3: The `status` virtual is defined on the schema but also recomputed inside the aggregation. Why?**  
A: Mongoose virtuals are computed by the JavaScript ODM layer and are not available inside MongoDB aggregations. The `$cond` expression in `$addFields` replicates the virtual's logic in MongoDB's query language. The virtual is still useful for single-document `find()` queries that go through the Mongoose layer.

**Q4: Walk through how `findBookById` works and why it uses `aggregate` instead of `findById + populate`.**  
A: It uses `aggregate` to: (1) `$match` by `_id` and `isDeleted: false`, (2) `$lookup` categories with a projection sub-pipeline, (3) `$lookup` the author, (4) `$lookup` reviews, (5) `$addFields` to compute `averageRating` and `reviewCount`, (6) `$project` to remove the raw reviews array. Using `aggregate` instead of `populate` gives finer-grained control (computed fields, filtering within lookups) and is more efficient for reads that need aggregated data.

**Q5: Why is `replaceBook` returning 201 instead of 200?**  
A: This is a bug — 201 "Created" is semantically wrong for a PUT replace operation. HTTP 200 "OK" is correct for a successful replacement of an existing resource. This appears in `updateBook` as well. **Fix:** Change to `res.status(200)`.

**Q6: What happens to Cloudinary images when a book is soft-deleted?**  
A: Nothing. The `deleteBook` controller sets `isDeleted: true` but does NOT call `deleteFromCloudinary`. The image remains in Cloudinary storage indefinitely. **Fix:** Call `deleteFromCloudinary(book.coverImagePublicId)` after the soft-delete update succeeds.

### Cross-Topic Questions
- **Book controller ↔ Cart controller:** The cart controller calls `Book.findById(bookId)` and checks `isDeleted` before adding to cart. This duplicates the book-existence check but provides stock validation.
- **Book model ↔ Order model:** The order item schema stores `bookName` and `priceAtPurchase` as snapshots specifically because books can be soft-deleted or have their prices changed.
- **Frontend ↔ Book list:** The Angular product listing page reads `totalBooks`, `currentPage`, and `pageSize` from the response to drive pagination. The `status` field drives stock badges.

### Pitfalls & Issues

**Issue 1 — `console.log` left in production code:**
```js
body.coverImage = req.secure_url;
body.coverImagePublicId = req.public_id;
console.log(body.coverImage);
console.log(body.coverImagePublicId);
```
Present in `createBook` and `replaceBook`. **Fix:** Remove entirely; Pino logger is available.

**Issue 2 — Wrong HTTP status code on update/replace:**
```js
res.status(201).json({ status: 'Success', data: book });
```
`replaceBook` and `updateBook` both return 201 Created. **Fix:** Use `res.status(200)`.

**Issue 3 — Soft delete does not clean up Cloudinary image:**
The `deleteBook` controller never calls `deleteFromCloudinary`. **Fix:** After the `findOneAndUpdate`, call `await deleteFromCloudinary(book.coverImagePublicId)`.

**Issue 4 — `low stock` status condition is wrong in the aggregation:**
```js
statusQuery = {$and: [{stock: {$lt: 2}}, {stock: {$gt: 0}}]};
```
`$lt: 2` means stock = 1 only. But the virtual says `stock <= 2` is low stock (checks `stock > 2` for available). The aggregation `$cond` doesn't match the status query filter. **Fix:** Use `$lte: 2` and `$gt: 0` consistently everywhere.

**Issue 5 — No old image deletion on `replaceBook`/`updateBook`:**
When a book's cover image is replaced, `cloudianryService` uploads the new image, but the old `coverImagePublicId` is never deleted. **Fix:** Before uploading, retrieve the existing book's `coverImagePublicId` and call `deleteFromCloudinary` on it after a successful upload.

### Quick-Recall Cheat Sheet
- Soft delete (`isDeleted: true`) + partial unique index preserves referential integrity
- `Book.findAllBooks()` is a model static using `$facet` for single-pass paginated aggregation
- Virtual `status` works for ODM queries but must be recomputed with `$cond` in aggregations
- Old Cloudinary images are never deleted on update or soft-delete — storage leak
- `findBookById` uses `aggregate` (not `populate`) for computed `averageRating`/`reviewCount`

---

## 5. Author & Category Modules

**Files:** `models/author.js` · `controllers/author.js` · `models/category.js` · `controllers/category.js`

### What it does
Authors and categories are reference data that books point to. Both support admin CRUD. Deleting an author soft-deletes all their books. Deleting a category has a guard: it refuses if any active book has _only_ that category, then removes the category ID from all other books.

### Design Decisions
- **Cascade soft-delete for author:** `deleteAuthor` calls `Book.updateMany({ authorId: id }, { isDeleted: true })`. This makes sense because a book without an author is invalid.
- **Referential integrity guard for category:** Rather than cascading, the category delete _blocks_ if it would leave a book category-less. This is a business rule: a book must have at least one category.
- **No soft delete for authors/categories themselves:** They are hard-deleted. Books referencing them are soft-deleted (author) or de-linked (category).
- **`timestamps` option misconfigured on Author model:** The schema options object is passed as a third argument to `new mongoose.Schema()` instead of being merged into the second argument — so timestamps are silently ignored.

### Interview & Discussion Questions

**Q1: Why does deleting an author cascade to soft-delete books instead of blocking like categories do?**  
A: A book _must_ have an author (required field in schema). There's no valid state for a book with no author. Blocking the delete would lock admins out of removing authors who have books. Soft-deleting the books preserves history while removing them from the active catalog.

**Q2: Walk through the category delete guard logic.**  
A: `Book.find({ $and: [{ categories: id }, { categories: { $size: 1 } }] })` finds books where `id` is in their categories array AND their categories array has exactly one element. If any such books exist, deletion is blocked with an informative message listing the count. Then `Book.updateMany({ categories: id }, { $pull: { categories: id } })` removes the category from all books that had multiple categories.

**Q3: Is the `timestamps` option working in the Author model?**  
A: No. The author schema is constructed as `new mongoose.Schema(fields, toJSONOptions, timestampsOptions)` — but `mongoose.Schema` only accepts two arguments (fields, options). The timestamps object is a third argument that Mongoose ignores. **Fix:** Merge `toJSON` and `timestamps` into a single options object as the second argument.

**Q4: `updateAuthor` returns status 201 for a PATCH update. Is that correct?**  
A: No. 201 is for resource creation. A PATCH update should return 200. This is a copy-paste bug shared across the author controller.

**Q5: What happens if `deleteAuthor` is called with a valid ObjectId that doesn't exist in the DB?**  
A: `Author.findByIdAndDelete({ _id: id })` returns `null`. The controller checks for null and calls `next(AuthorNotFoundError)`, which resolves to a 404. Correct behavior.

### Cross-Topic Questions
- **Author/Category ↔ Book validation middleware:** `book-ref-validations.js` queries the Author and Category collections before a book is created/updated. It acts as a foreign-key constraint that MongoDB doesn't natively enforce.
- **Frontend ↔ Dropdowns:** The Angular create-book form populates author and category dropdowns from `GET /authors` and `GET /categories`. These are public endpoints (no auth required).

### Pitfalls & Issues

**Issue 1 — Author schema `timestamps` option is silently dropped:**
```js
const authorSchema = new mongoose.Schema({...}, {toJSON: {transform...}}, {timestamps: true});
```
Third argument is ignored by Mongoose. **Fix:**
```js
const authorSchema = new mongoose.Schema({...}, {
  toJSON: { transform(doc, ret) { delete ret.__v; return ret; } },
  timestamps: true
});
```

**Issue 2 — `deleteAuthor` uses `findByIdAndDelete({ _id: id })` instead of `findByIdAndDelete(id)`:**
```js
const author = await Author.findByIdAndDelete({ _id: id });
```
`findByIdAndDelete` accepts an id directly, not a filter object. Passing `{ _id: id }` works because Mongoose is lenient here, but it's semantically incorrect and could confuse maintainers. **Fix:** `Author.findByIdAndDelete(id)`.

**Issue 3 — Category `remove` doesn't account for soft-deleted books:**
```js
const books = await Book.find({$and: [{categories: id}, {categories: {$size: 1}}]});
```
This also finds soft-deleted books. A book that is soft-deleted but has only this category will block the category deletion unnecessarily. **Fix:** Add `{ isDeleted: false }` to the filter.

### Quick-Recall Cheat Sheet
- Author delete → cascades to soft-delete all their books (`Book.updateMany`)
- Category delete → blocked if any book has only that category; otherwise pulls the ID from multi-category books
- `timestamps: true` on Author model is silently broken (wrong schema constructor argument)
- Category guard doesn't exclude soft-deleted books — can block valid deletes
- All update/delete operations return 201 instead of 200 — wrong HTTP status

---

## 6. Cart Module

**Files:** `models/cart.js` · `controllers/cart.js` · `routes/carts.js`

### What it does
Implements a persistent shopping cart with a 1-to-1 user mapping. Supports add (with upsert cart creation), quantity update, item removal, cart display (filtering soft-deleted books), and a lightweight count endpoint for the navbar badge.

### Design Decisions
- **Cart as a MongoDB document (not session-based):** Persists across devices and sessions. The cart is tied to `userId` with a unique index.
- **Upsert on add:** `Cart.findOneAndUpdate({ user: id }, {}, { upsert: true, new: true })` creates the cart if it doesn't exist, avoiding a separate "create cart" step.
- **In-memory item management (`.find`, `.splice`, `.save`):** Items are an embedded array on the Cart document. Mutations use JS array methods then `save()` rather than atomic MongoDB operators (`$push`, `$pull`). This is simpler but slightly less efficient.
- **`display` filters out soft-deleted books:** After populating, items referencing deleted books are filtered out before returning. This handles the edge case where a book was deleted after being added to a cart.

### Interview & Discussion Questions

**Q1: Why does `add` use `findOneAndUpdate` with upsert instead of a two-step find-then-save?**  
A: Atomic upsert avoids a race condition: if two requests arrive simultaneously for a user with no cart, both would try to `insert` a new cart and one would fail with a duplicate-key error. The upsert is atomic at the MongoDB level.

**Q2: What's the difference in stock validation between `add` and `update`?**  
A: `add` checks `myBook.stock < quantity` for new items, or `myBook.stock < bookInCart.quantity + quantity` when adding to an existing item (total would exceed stock). `update` checks `myBook.stock < quantity` against the new absolute quantity. This means `update` replaces (not increments) the quantity.

**Q3: Why does the `count` endpoint exist separately from `display`?**  
A: The navbar needs only a count badge — a number — not the full cart with book details. A separate lightweight endpoint avoids `populate()` overhead on every page load/route change in the Angular app.

**Q4: What is `removeBookFromAllCarts` used for?**  
A: It's a utility exported from the cart controller for use when a book is deleted — it removes the book from every user's cart atomically using `Cart.updateMany` with `$pull`. However, looking at the `deleteBook` controller, this function is **never actually called**. It's defined but orphaned.

**Q5: How would you make cart operations safer against race conditions?**  
A: The current approach loads the cart, modifies it in JS, and saves — two DB round trips with a window between them. An alternative is to use `findOneAndUpdate` with `$push`/`$pull`/`$inc` operators which are atomic in MongoDB. For stock checking atomically, use optimistic concurrency (version keys) or transactions.

### Cross-Topic Questions
- **Cart ↔ Order:** On order placement, the cart is completely deleted (`Cart.findOneAndDelete`). This is intentional — all items transition from cart to order.
- **Cart ↔ Book (soft delete):** The `display` controller filters out soft-deleted books but doesn't remove them from the cart document. So deleted books accumulate as dead entries in the cart array until the user explicitly removes them or places an order.

### Pitfalls & Issues

**Issue 1 — `removeBookFromAllCarts` is never called:**
```js
async function removeBookFromAllCarts(bookId) {
  await Cart.updateMany({'items.book': bookId}, {$pull: {items: {book: bookId}}});
}
```
Exported but never invoked by `deleteBook`. Soft-deleted books remain in user carts as dead entries. **Fix:** Call this function from `deleteBook` in `controllers/book.js`.

**Issue 2 — Race condition on cart item modification:**
```js
const myCart = await Cart.findOne({user: id});
// ... JS manipulation ...
await myCart.save();
```
Two separate DB operations. Under concurrent requests, both could read the same cart state, make conflicting changes, and one would silently overwrite the other. **Fix:** Use `findOneAndUpdate` with atomic operators (`$push`, `$pull`, `$inc`) where possible.

**Issue 3 — Soft-deleted books accumulate in cart:**
The `display` handler filters them on read but never removes them from the DB. **Fix:** Either call `removeBookFromAllCarts` on soft delete, or do a `$pull` during the `display` operation and save.

### Quick-Recall Cheat Sheet
- 1-to-1 user-cart via unique index; upsert creates cart on first add
- Stock checked on add (delta) and update (absolute) — different logic for each
- `removeBookFromAllCarts` utility exists but is never called from `deleteBook`
- `display` filters soft-deleted books in memory but doesn't persist the cleanup
- `count` endpoint exists for cheap navbar badge without full `populate`

---

## 7. Order Module — Transactions & State Machine

**Files:** `models/order.js` · `controllers/order.js` · `routes/orders.js`

### What it does
Handles order placement (with MongoDB ACID transactions to atomically decrement stock and clear the cart), order retrieval, and status management via a state machine. Cancellation uses another transaction to restore stock. The order model auto-generates a unique order number.

### Design Decisions
- **MongoDB transactions for order placement:** Ensures that stock decrements, order creation, and cart deletion all succeed or all roll back atomically. Requires a MongoDB replica set (Atlas provides this).
- **State machine for order status:** `validTransitions` map defines allowed status changes, preventing invalid moves like `delivered → processing`.
- **Cancellation uses a separate transaction:** Stock restoration on cancel is also wrapped in a transaction to prevent partial stock restores.
- **`priceAtPurchase` snapshot in order item:** Captures the price at time of purchase so that future price changes on the book don't retroactively affect order history.
- **`orderNumber` via `pre('validate')` hook:** Generates a human-readable order number using timestamp + sequential count.

### Interview & Discussion Questions

**Q1: Why are MongoDB transactions required for order placement? What goes wrong without them?**  
A: Without a transaction, if the server crashes after decrementing stock for item 1 but before creating the Order document, stock is lost permanently. Similarly, if order save fails after decrementing 3 books' stock, the stock is gone but there's no order. A transaction ensures all-or-nothing atomicity — either everything succeeds or the `abortTransaction()` rolls everything back.

**Q2: What happens to the cart if order placement fails midway?**  
A: Because the cart deletion (`Cart.findOneAndDelete`) is inside the transaction, it's rolled back along with everything else if `abortTransaction()` is called. The user's cart is preserved intact.

**Q3: Explain the `validTransitions` state machine. Can an order go from `processing` directly to `delivered`?**  
A: `validTransitions['processing'] = ['shipped', 'delivered', 'cancelled']`. Yes — it can skip `shipped` and go directly to `delivered`. This may be intentional (e.g., local pickup) but could be a business logic gap. The `out for delivery` state exists in the map but NOT in the Mongoose schema enum, leaving it as legacy/dead code.

**Q4: Why does `getOrderById` check authorization inline instead of using middleware?**  
A: Because the authorization rule is nuanced: admins can see any order, but regular users can only see their own. This rule can't be expressed as a simple role-check middleware. The controller reads `order.userId._id` (after populate) and compares it to `req.user.id`. This is valid but could be extracted to a reusable helper.

**Q5: What is the risk in the `pre('validate')` order number generation?**  
A: 
```js
const count = await mongoose.model('Order').countDocuments();
this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
```
Two simultaneous orders could both read the same `countDocuments()` result and generate identical order numbers. Since `orderNumber` has a `unique: true` index, one would fail with a duplicate-key error. **Fix:** Use a MongoDB counter document with `$inc` inside the transaction, or use a UUID.

**Q6: Does `placeOrder` validate that items belong to the currently logged-in user's cart?**  
A: No. `placeOrder` takes `items` directly from the request body — a user could technically order books that aren't in their cart, or order any quantity. The cart is cleared regardless. The only server-side validation is stock availability. **Fix:** Either fetch items from the cart (ignore request body items) or cross-validate request items against cart contents.

### Cross-Topic Questions
- **Order ↔ Review:** `addReview` checks for a `delivered` order containing the book. Orders are the gateway to reviews.
- **Order ↔ Book stock:** Stock is decremented in `placeOrder` and restored on cancel — both use transactions to prevent race conditions.
- **Frontend ↔ Order status:** The Angular order-detail component likely polls or navigates using `status` and `paymentStatus` fields to show appropriate UI states.

### Pitfalls & Issues

**Issue 1 — Race condition in `orderNumber` generation:**
```js
const count = await mongoose.model('Order').countDocuments();
this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
```
Not atomic. **Fix:** Use `{ $inc: { seq: 1 } }` on a counters collection inside the transaction.

**Issue 2 — Order items not validated against user's cart:**
```js
const {items, shippingAddress, paymentMethod = 'COD'} = req.body;
```
Any authenticated user can order any bookId/quantity without it being in their cart. **Fix:** Fetch the cart inside the transaction and derive order items from it.

**Issue 3 — `out for delivery` in `validTransitions` but not in schema enum:**
```js
'out for delivery': ['delivered', 'cancelled'], // Legacy support
```
This key can never be reached because the schema `enum` doesn't include it. Dead code that misleads maintainers. **Fix:** Either add `'out for delivery'` to the schema enum or remove it from `validTransitions`.

**Issue 4 — `updatePaymentStatus` has no business rule validation:**
```js
const order = await Order.findByIdAndUpdate(req.params.id, {paymentStatus}, {...})
```
Payment status can be changed to `pending` on an already-`success` order, which is logically invalid. **Fix:** Add a transition guard similar to `validTransitions` for payment status.

### Quick-Recall Cheat Sheet
- `placeOrder` and `updateOrderStatus` (cancel path) use MongoDB transactions for ACID atomicity
- `validTransitions` map enforces order status state machine
- `priceAtPurchase` snapshot protects order history from price changes
- `orderNumber` generation has a race condition — not truly unique under concurrency
- `out for delivery` status is in `validTransitions` but missing from schema enum — dead code

---

## 8. Review Module

**Files:** `models/review.js` · `controllers/review.js` · `routes/reviews.js`

### What it does
Manages book reviews with a business rule that users can only review books from their own delivered orders. Uses upsert semantics so a user updating their review doesn't create duplicates. The `(userId, bookId)` compound unique index enforces one-review-per-user-per-book at the database level.

### Design Decisions
- **Delivered-order gate:** Before allowing a review, the controller queries for a delivered order containing the book. This is a purchase-verification pattern common in e-commerce.
- **Upsert for add/update:** `Review.findOneAndUpdate({ userId, bookId }, { rating, comment }, { upsert: true })` combines create and update into one operation — calling the same endpoint updates the review if one already exists.
- **Compound unique index:** `reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true })` enforces the business rule at the DB level as a safety net even if the upsert logic fails.

### Interview & Discussion Questions

**Q1: Why does `addReview` explicitly cast `userId` and `bookId` to ObjectId?**  
A: 
```js
const uId = new mongoose.Types.ObjectId(userId);
const bId = new mongoose.Types.ObjectId(bookId);
```
`req.user.id` from JWT is a string. Mongoose normally coerces strings in queries, but explicit casting ensures exact type matching for embedded document array lookups (`items.bookId`). The comment in the code says this prevents subtle filter mismatches.

**Q2: If a user wants to update their review, do they call a different endpoint?**  
A: No. `POST /review` with the same `bookId` will upsert — updating the existing review's `rating` and `comment` because of `{ upsert: true }` and the `{ userId, bookId }` filter. There is no separate PUT/PATCH endpoint for reviews.

**Q3: What happens if a user tries to delete someone else's review?**  
A: `deleteReview` checks `review.userId.toString() !== req.user.id && !req.user.roles.includes('admin')`. If the user is not the owner AND not an admin, a 403 is returned. Admins can delete any review.

**Q4: Can a user review a book multiple times?**  
A: No. The compound unique index `{ userId: 1, bookId: 1 }` on the review model prevents two review documents with the same user-book combination. The upsert in `addReview` also ensures only one document per user-book pair.

**Q5: What is returned by the `getBookReviews` endpoint? Does it include the reviewer's name?**  
A: Yes. `Review.find({ bookId }).populate('userId', 'firstName lastName avatar')` — returns `firstName`, `lastName`, and `avatar` (though `avatar` is not in the User schema, so it will always be `undefined`).

### Cross-Topic Questions
- **Review ↔ Order:** The delivered-order check creates a tight coupling — the review system depends on the order system being correct.
- **Review ↔ Book aggregation:** `findAllBooks` and `findBookById` both `$lookup` the reviews collection to compute `averageRating`. Reviews are never embedded — always a separate collection joined at query time.
- **Frontend ↔ Reviews:** The Angular book-detail page likely renders a star rating from `averageRating` (computed in book queries) and a list from `GET /review/book/:bookId`.

### Pitfalls & Issues

**Issue 1 — `getMyReviews` populates `bookId` with field `title` which doesn't exist:**
```js
.populate('bookId', 'title coverImage')
```
The Book model uses `name`, not `title`. This will populate `bookId` with an object where `title` is `undefined` and `name` is absent. **Fix:** Change `'title coverImage'` to `'name coverImage'`.

**Issue 2 — Debug `console.log` statements left in `addReview`:**
```js
console.log('--- Add Review Debug ---');
console.log('User ID:', userId);
console.log('Book ID:', bookId);
console.log('Order check failed...');
```
These are development leftovers that pollute production logs. **Fix:** Remove all `console.log` and use the Pino `logger` if tracing is needed.

**Issue 3 — `avatar` field in `getBookReviews` populate doesn't exist on User model:**
```js
.populate('userId', 'firstName lastName avatar')
```
`avatar` is not in `models/user.js`. This returns `undefined` silently. **Fix:** Either add an `avatar` field to the User model or remove it from the populate projection.

**Issue 4 — No pagination on `getBookReviews`:**
A popular book could accumulate thousands of reviews. The endpoint returns all of them in one query with no limit. **Fix:** Add `limit` and `page` query parameters, validated by a Joi schema.

### Quick-Recall Cheat Sheet
- Gate: can only review books from a **delivered** order
- Upsert semantics: `POST /review` creates OR updates (one review per user-book)
- Compound unique index `(userId, bookId)` enforces uniqueness at DB level
- `getMyReviews` populates `title` — should be `name` (wrong field name, silent bug)
- No pagination on `getBookReviews` — performance risk for popular books

---

## 9. Middleware Layer

**Files:** `middleware/async-handler.js` · `middleware/auth.js` · `middleware/admin.js` · `middleware/validate-request.js` · `middleware/validate-query.js` · `middleware/book-ref-validations.js` · `middleware/cloudinary-service.js`

### What it does
Seven focused middleware functions covering: async error catching, JWT authentication, admin role enforcement, request body validation, query parameter validation, book foreign-key validation, and Cloudinary image upload.

### Design Decisions
- **`asyncHandler` wrapper:** Avoids try/catch in every controller. Wraps `async` functions in a promise that catches rejections and forwards them to `next(err)`. This is the standard Express 5 async error handling pattern.
- **Separation of `validate-request` and `validate-query`:** Different Joi schemas and different `req` properties (`req.body` vs `req.query`). Keeping them separate follows single-responsibility.
- **`book-ref-validations` as middleware (not controller logic):** Validates author/category existence before the controller runs, keeping controllers clean of reference-check boilerplate. Acts as a middleware-level FK constraint.
- **`cloudinary-service` uploads the file then passes `public_id` and `secure_url` via `req`:** Keeps Cloudinary logic out of controllers. The controller only reads `req.secure_url` and `req.public_id`.

### Interview & Discussion Questions

**Q1: How does `asyncHandler` work? Write the implementation from memory.**  
A:
```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```
It returns a new middleware that wraps the async function. Any rejection is caught and forwarded to `next`, which triggers the Express error handler.

**Q2: What is the exact order of middleware on a `POST /books` request?**  
A: `auth` → `isAdmin` → `upload.single('image')` (Multer) → `validateRequest(bookSchema)` → `validateAuthorExsists` → `validateCategoryExsists` → `cloudianryService` → `createBook` controller. This order is important: auth before admin, validation before DB calls, Cloudinary upload last before the controller.

**Q3: Why is Joi validation placed _after_ auth middleware in the route definitions?**  
A: As stated in the category routes comment: "Joi validation after auth to save time — if Joi is OK but not authenticated, we've wasted time." Actually this comment is backwards — it means auth runs first so unauthenticated requests are rejected cheaply before the more expensive Joi validation. A subtlety: for public endpoints, Joi runs without auth.

**Q4: What does `validateCategoryExsists` check beyond just existence?**  
A: It also checks for duplicate category IDs in the array before querying the DB: `new Set(stringIds).size === body.categories.length`. This prevents sending `['abc', 'abc']` — which would pass the schema `unique` validator but waste a DB call and create ambiguity.

**Q5: If `cloudianryService` runs but the controller fails afterward, is the uploaded image cleaned up?**  
A: Yes — this is handled in `index.js`. `cloudianryService` sets `req.public_id` before calling `next()`. If the controller throws, the global error handler checks `if (req.public_id)` and calls `deleteFromCloudinary(req.public_id)` to remove the orphaned upload.

### Cross-Topic Questions
- **`auth` middleware ↔ all protected routes:** Every protected route chains `auth` first. The decoded JWT payload on `req.user` is then available to all subsequent middleware and controllers.
- **`validate-request` ↔ `utils/validations.js`:** Middleware is dumb — it just calls `schema.validate(req.body)`. All schema intelligence lives in `validations.js`.
- **Cloudinary service ↔ book controller:** The controller _assumes_ `req.secure_url` is set (in `createBook` and `replaceBook`). If Cloudinary upload fails and somehow doesn't throw, the controller would set `coverImage` to `undefined`.

### Pitfalls & Issues

**Issue 1 — `book-ref-validations.js` is not wrapped in `asyncHandler`:**
```js
const validateAuthorExsists = async (req, res, next) => { ... }
```
If `Author.findById()` throws (e.g., network error), the unhandled rejection won't be caught by Express. **Fix:** Wrap with `asyncHandler` or add try/catch.

**Issue 2 — Joi `validate-query` doesn't strip unknown query params:**
```js
const {error} = schema.validate(req.query);
```
By default, Joi `validate()` in permissive mode allows unknown keys. An attacker or buggy client could send arbitrary query parameters that pass through to the controller/aggregation. **Fix:** Use `schema.validate(req.query, { allowUnknown: false })` or add `.options({ allowUnknown: false })` to the schema.

**Issue 3 — Typo in middleware filename and export name:**
```js
// middleware/cloudinary-service.js
const cloudianryService = asyncHandler(...)  // "cloudianry" typo
module.exports = cloudianryService;
```
Minor but visible in imports. **Fix:** Rename variable and module consistently.

### Quick-Recall Cheat Sheet
- `asyncHandler`: wraps async fn, `.catch(next)` forwards errors to Express error handler
- Route middleware order: `auth → admin → multer → validateRequest → ref-validations → cloudinary → controller`
- `req.public_id` is the signal for global error handler to rollback Cloudinary uploads
- `book-ref-validations.js` async functions are NOT wrapped in `asyncHandler` — uncaught rejection risk
- Joi query validation doesn't block unknown params — potential security surface

---

## 10. Validation — Joi Schemas (`utils/validations.js`)

### What it does
Central file for all Joi schemas used across the application. Covers user registration/login/update, books (create and patch variants), authors, categories, cart operations, orders, reviews, OTP verification, and query parameter validation.

### Design Decisions
- **`patchBookSchema` derived from `bookSchema` via `.fork()`:** Instead of duplicating the schema with all fields optional, `.fork()` transforms specific fields to `.optional()`. DRY principle applied to schema definitions.
- **`mongoId` as a reusable primitive:** `Joi.string().hex().length(24)` defined once and reused in all schemas that reference MongoDB ObjectIds.
- **Separate `bookQuerySchema`:** Query parameters have different constraints (all optional, bounded ranges) from request bodies. A dedicated schema prevents leaking body validation rules to query strings.
- **`passwordSchema` as a shared constraint:** Password rules (min 8, uppercase + digit) defined once, reused in registration and update schemas.

### Interview & Discussion Questions

**Q1: How does `patchBookSchema` avoid repeating the full `bookSchema`?**  
A: `.fork(['name', 'price', ...], field => field.optional())` creates a new schema based on `bookSchema` where the listed fields are transformed to optional. This means the patch schema inherits all other constraints (min/max length, patterns) but doesn't require any specific field.

**Q2: Why validate the `mongoId` as `Joi.string().hex().length(24)` instead of using a regex or Mongoose ObjectId validation?**  
A: A valid MongoDB ObjectId is a 24-character hexadecimal string. This check is cheap, library-free, and runs before any DB query, providing fast feedback. Mongoose's own `CastError` is the fallback if a valid-looking string isn't a real ObjectId.

**Q3: Why does `userLoginSchema` use `Joi.string().min(6)` for password instead of the full `passwordSchema`?**  
A: During login, the backend doesn't validate password complexity — it just checks it against the stored hash. Requiring the user to type an uppercase letter during login is unnecessary friction. The `min(6)` is just a sanity check to avoid obviously garbage inputs.

**Q4: What does `Joi.array().single()` do in `bookQuerySchema.categories`?**  
A: It allows the query parameter to be passed either as an array (`?categories[]=abc&categories[]=def`) or as a single string (`?categories=abc`). `single()` coerces a single string value into a one-element array, normalizing the input for downstream array operations.

**Q5: Is the `verifyOtpSchema` correctly enforcing the OTP format?**  
A: `Joi.string().length(6)` — yes, the OTP is a 6-character hex string (generated via `crypto.randomBytes(3).toString('hex').toUpperCase()`). The schema enforces exact length but doesn't enforce uppercase or hex-only characters. This is fine because the comparison in `consumeOtp` is case-sensitive (`record.otp !== otp`), so a lowercase submission would fail even if Joi passes it.

### Cross-Topic Questions
- **Validations ↔ middleware:** All schemas are consumed by `validateRequest` and `validateQuery` middleware. The schema file has no side effects — it's a pure export.
- **Frontend ↔ validation:** Angular's reactive forms should mirror these constraints (min/max lengths, patterns) for a consistent UX. Mismatches cause frustrating "valid on form, rejected by API" errors.

### Pitfalls & Issues

**Issue 1 — `bookSchema` doesn't validate `price` minimum:**
```js
price: Joi.number().required()
```
A book with price `0` or `-5` would pass Joi but violate the Mongoose schema's `min: 1`. **Fix:** Add `.min(1)` to the price field in `bookSchema`.

**Issue 2 — `authorSchema` makes `bio` optional but the Author model requires it:**
```js
// Joi
bio: Joi.string().min(5).max(2000).trim(true).optional()
// Mongoose
bio: { type: String, required: true, ... }
```
A request with no `bio` passes Joi validation but fails at Mongoose save with a `ValidationError`. The error handler will catch this, but it's a contract inconsistency. **Fix:** Make `bio` required in `authorSchema`.

**Issue 3 — `userRegisterSchema` doesn't validate name format (special characters allowed):**
```js
firstName: Joi.string().min(2).max(50).required()
```
Users could register with names like `'; DROP TABLE users; --`. While this isn't an SQL injection risk (MongoDB), it's a data quality issue. **Fix:** Add `.pattern(/^[a-zA-Z\s'-]+$/)` for name fields.

### Quick-Recall Cheat Sheet
- `patchBookSchema = bookSchema.fork([...], f => f.optional())` — DRY PATCH schema
- `mongoId = Joi.string().hex().length(24)` — reusable ObjectId validator
- `Joi.array().single()` — normalizes single string to array for query params
- `authorSchema.bio` is optional in Joi but required in Mongoose — inconsistency
- `bookSchema.price` has no `.min()` in Joi — allows zero/negative prices past validation

---

## 11. Error Handling

**File:** `utils/error-handler.js` · (global handler in `index.js`)

### What it does
A registry-based error handler: an exported array of `{ match, handler }` objects. Each object knows how to identify a specific error type and how to transform it into an HTTP response. The global handler in `index.js` iterates the array, finds the first match, and uses it.

### Design Decisions
- **Registry pattern (array of matcher/handler pairs):** Extensible — adding a new error type requires appending one object to the array, not modifying a switch/if-else chain.
- **Named error types (`err.name`):** Custom errors are identified by `err.name` string, avoiding `instanceof` checks that can fail across module boundaries.
- **Mongoose/MongoDB errors handled by name and code:** `ValidationError` (Mongoose), `code 11000` (duplicate key), `CastError` (invalid ObjectId) are all standard Mongoose error shapes.
- **`statusCode` fallback in `index.js`:** If no handler matches, the global handler checks `err.statusCode` as a last resort before returning a generic 500.

### Interview & Discussion Questions

**Q1: Why use a registry array instead of a switch statement or if-else chain?**  
A: Open/closed principle — open for extension, closed for modification. Adding a new error type doesn't require editing control flow logic. Each error type is self-contained. It also makes the error registry easy to unit test in isolation.

**Q2: There are two handlers for `ValidationError`. How does the registry handle this?**  
A: The first handler matches `err.name === 'ValidationError' && err.errors` (Mongoose validation), the second matches `err.name === 'ValidationError' && err.isJoi` (Joi). Since `Array.find()` returns the first match, the order matters. Mongoose errors have `err.errors` (object), Joi errors have `err.isJoi` (boolean). They're mutually exclusive, so order doesn't matter here, but it's still important to understand.

**Q3: What does the `CastError` handler do? When is it triggered?**  
A: When a route receives an invalid MongoDB ObjectId (e.g., `GET /books/not-a-real-id`), Mongoose throws a `CastError` during query execution. The handler returns `{ statusCode: 400, errors: "Invalid _id: not-a-real-id" }`. This prevents a 500 for user input errors.

**Q4: What is the response shape inconsistency between error types?**  
A: Some handlers use `message` key, others use `errors` key:
- `UnauthorizedError`: `{ status, message }`  
- `BookNotFoundError`: `{ status, errors }`  
- `ValidationError`: `{ status, errors: [...] }`  
This inconsistency means the frontend must handle two different error response shapes. **Fix:** Standardize on a single key — prefer `message` for all, or always use `errors` as an array.

**Q5: How does the Cloudinary orphan cleanup work in the error handler?**  
A:
```js
if (req.public_id) { deleteFromCloudinary(req.public_id); }
```
If `cloudianryService` set `req.public_id` but a subsequent middleware/controller threw an error, the global handler detects `req.public_id` and fires the delete. Note: `deleteFromCloudinary` is async but isn't awaited here — it's fire-and-forget. **Fix:** `await deleteFromCloudinary(req.public_id)` to handle failures, or log errors from it.

### Cross-Topic Questions
- **Error handler ↔ Frontend:** Angular's `HttpClient` interceptor should normalize the `message`/`errors` inconsistency from the backend. A central error interceptor in Angular is the frontend equivalent of this handler.
- **Error names ↔ Controllers:** Controllers that use `next(err)` must set `err.name` correctly. Any typo in a name means the error falls through to the generic 500 handler.

### Pitfalls & Issues

**Issue 1 — Inconsistent error response shape (`message` vs `errors`):**
Some errors return `{ status, message }`, others `{ status, errors }`. The frontend must check for both. **Fix:** Standardize to `{ status, message }` everywhere.

**Issue 2 — `deleteFromCloudinary` not awaited in error handler:**
```js
if (req.public_id) { deleteFromCloudinary(req.public_id); }
```
Fire-and-forget. If Cloudinary delete fails, the error is silently swallowed. **Fix:** Wrap in an async handler or at least `.catch(logger.error)`.

**Issue 3 — `status` field uses both 'Fail' and 'fail' (capitalization inconsistent):**
Looking across handlers: some use `'Fail'`, others `'fail'` (check `index.js` fallback). The `status` field is cosmetic but consumers that string-match on it will have bugs. **Fix:** Standardize to lowercase `'fail'` and `'error'` per JSend convention.

### Quick-Recall Cheat Sheet
- Registry pattern: array of `{ match, handler }` — extensible without editing control flow
- Custom errors identified by `err.name` string (not `instanceof`)
- `ValidationError` has two handlers — Mongoose (`err.errors`) and Joi (`err.isJoi`)
- `deleteFromCloudinary` in error handler is fire-and-forget (not awaited) — silent failure risk
- Error response uses `message` OR `errors` key inconsistently — frontend must handle both

---

## 12. Image Pipeline — Cloudinary, Multer, Sharp

**Files:** `config/upload.js` · `config/cloudinary.js` · `middleware/cloudinary-service.js` · `utils/cloudinary-handler.js`

### What it does
A four-stage image pipeline: Multer intercepts multipart form data and holds the file in memory, fileFilter validates MIME type, `cloudianryService` middleware converts the buffer to base64 and uploads to Cloudinary, and the controller reads `req.secure_url`/`req.public_id`. Orphan cleanup is handled in the global error handler.

### Design Decisions
- **Memory storage (no disk):** Files never touch the filesystem. The buffer is base64-encoded and sent directly to Cloudinary. This is ideal for serverless (no persistent disk) but increases RAM usage for large files.
- **5MB size limit:** Reasonable for book cover images.
- **JPEG/PNG/WEBP allowlist:** Server-side MIME validation in addition to Cloudinary's own validation.
- **`sharp` dependency (installed but not used):** Listed in `package.json` but not imported anywhere in the codebase. It was likely planned for image resizing/optimization before upload.
- **Cloudinary folder `ecommerce/books`:** Organizes uploads in a predictable path.

### Interview & Discussion Questions

**Q1: Why is memory storage used instead of disk storage for Multer?**  
A: Vercel serverless functions have read-only filesystems (no `/tmp` write in some configurations) and ephemeral containers. Storing files on disk would fail or be lost between invocations. Memory storage keeps the file in the Node process buffer until Cloudinary upload completes.

**Q2: What is the base64 upload approach and what are its trade-offs?**  
A:
```js
const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
const result = await cloudinary.uploader.upload(fileStr, { folder: 'ecommerce/books' });
```
The buffer is encoded as a base64 data URI and sent to Cloudinary's uploader. Trade-off: base64 encoding inflates payload size by ~33% compared to streaming. For serverless, this is acceptable. A streaming upload from a buffer would be more efficient.

**Q3: `sharp` is in `package.json` but never imported. What was it likely intended for?**  
A: Image processing before upload — resizing to a standard dimension (e.g., 800×1200 for book covers), converting to WebP for compression, or stripping EXIF metadata. Without it, Cloudinary receives raw uploads which may be very large. **Fix:** Either add image processing with Sharp or remove the dependency.

**Q4: What happens if a book update request is sent without a file?**  
A: In `updateBook`:
```js
if (req.file) {
  body.coverImage = req.secure_url;
  body.coverImagePublicId = req.public_id;
}
```
The `if (req.file)` guard means image fields are only updated if a new file was sent. The existing `coverImage` is preserved. This is correct for PATCH semantics.

**Q5: How is an orphaned Cloudinary image (upload succeeded, controller failed) cleaned up?**  
A: `cloudianryService` stores `result.public_id` in `req.public_id` before calling `next()`. If any subsequent middleware/controller throws, Express routes to the global error handler, which checks `req.public_id` and fires `deleteFromCloudinary`. This is a clean cross-cutting cleanup pattern.

### Cross-Topic Questions
- **Multer ↔ Joi validation:** Multer runs before `validateRequest` in the book routes. This means an invalid file type causes a Multer error _before_ body validation runs. The `InvalidFileType` error name is registered in the error handler.
- **Cloudinary ↔ Book model:** `coverImage` and `coverImagePublicId` fields on the Book model store the CDN URL and Cloudinary public ID respectively. The public ID is needed for deletion.

### Pitfalls & Issues

**Issue 1 — `sharp` is an unused dependency:**
```json
"sharp": "^0.34.5"
```
Adds ~50MB to node_modules, increases cold start time on Vercel, and requires native binaries. **Fix:** Remove if unused, or implement resizing before upload.

**Issue 2 — No image dimension/aspect ratio validation:**
Any 5MB JPEG is accepted. A 1×10000px image would be uploaded and displayed incorrectly. **Fix:** Use Sharp to validate or enforce a minimum/maximum aspect ratio before upload.

**Issue 3 — Old cover image not deleted when book image is replaced:**
When `replaceBook` or `updateBook` with a new image runs, the old `coverImagePublicId` is overwritten in DB but the old Cloudinary image is never deleted. **Fix:** In the controller, fetch the old book record, extract `coverImagePublicId`, upload the new image, save the new IDs, then delete the old Cloudinary image.

**Issue 4 — MIME type check only validates declaration, not actual content:**
```js
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (allowedTypes.includes(file.mimetype)) { cb(null, true); }
```
A malicious user can rename `malware.exe` to `cover.jpg` and Multer will accept it (the browser sets `mimetype` based on the filename extension they provide). **Fix:** Use `file-type` library to inspect the actual file magic bytes from the buffer.

### Quick-Recall Cheat Sheet
- Memory storage: buffer held in RAM, base64-encoded and uploaded to Cloudinary
- 5MB limit + JPEG/PNG/WEBP MIME allowlist enforced by Multer
- `req.public_id` + `req.secure_url` are the interface between the middleware and the controller
- `sharp` is installed but never used — dead dependency
- Old images never deleted on update/replace — Cloudinary storage leak

---

## 13. Utilities — Logger, Mailer, OTP, JWT

**Files:** `utils/logger.js` · `utils/mailer.js` · `utils/otp.js` · `utils/jwt.js`

### What it does
Shared utility functions: structured logging with Pino (dual-target in dev, JSON in prod), email sending via Nodemailer (with dev console fallback), OTP generation and verification, and JWT signing.

### Design Decisions
- **Pino over Winston/Morgan:** Pino is significantly faster than Winston for high-throughput logging. It uses JSON output by default, which integrates well with log aggregators (Datadog, CloudWatch).
- **`pino-pretty` in dev, raw JSON in production:** Human-readable logs locally, machine-parseable in prod. The transport config uses `targets` array for dual output (console + file) in development.
- **Dev fallback in mailer:** If `EMAIL_HOST` is not set, OTPs are `console.log`'d. This avoids needing an SMTP server for local development.
- **Separate `registerOtpStore` and `loginOtpStore`:** Prevents cross-flow OTP reuse.
- **JWT claims include `roles`:** Avoids DB calls on every request to check roles, at the cost of role staleness.

### Interview & Discussion Questions

**Q1: What is the Pino logging configuration difference between dev and production?**  
A: In dev: `pino-pretty` with colorized, human-readable output to console + error-level logs written to `logs/app.log` via `pino/file`. In production: plain Pino with JSON output to stdout (no pretty-printing, no file). This is correct for production where structured JSON is consumed by log aggregators.

**Q2: How does the mailer handle missing SMTP configuration?**  
A: 
```js
if (!process.env.EMAIL_HOST) {
  console.log(`[DEV] OTP for ${to}: ${otp}`);
  return;
}
```
If `EMAIL_HOST` is unset, it logs the OTP to console and returns early. This allows development without configuring a real SMTP server.

**Q3: Describe the OTP lifecycle.**  
A: (1) `sendOtp(store, email, extraData)` → generates 6-char hex OTP via `crypto.randomBytes(3)`, stores `{ ...extraData, otp, expiresAt: now + 2min }` in the Map, calls `sendOtpEmail`. (2) `consumeOtp(store, email, otp)` → looks up by email, checks expiry, checks OTP match, deletes from store, returns the record. Both expired and invalid OTPs throw `UnauthorizedError`.

**Q4: What is in the JWT payload and why?**  
A: `{ id: user._id, email: user.email, roles: user.roles }`. `id` is used to identify the user without a DB lookup on every request. `email` is for display/logging. `roles` enables role checks in middleware without DB calls. The 15-day expiry means no refresh token is needed but stolen tokens are valid for 15 days.

**Q5: Why use `crypto.randomBytes(3).toString('hex')` for OTP generation instead of `Math.random()`?**  
A: `Math.random()` is a pseudorandom number generator that is not cryptographically secure — its output can be predicted given enough samples. `crypto.randomBytes` uses the OS's cryptographically secure random source (CSPRNG), making the OTP unpredictable.

### Pitfalls & Issues

**Issue 1 — OTP comparison is case-sensitive but the generated OTP is uppercase:**
```js
const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
// ...
if (record.otp !== otp) { throw ... }
```
If the frontend sends the OTP in lowercase, the comparison fails. The Joi schema `Joi.string().length(6)` doesn't enforce case. **Fix:** Either normalize both to uppercase in `consumeOtp`, or remove `.toUpperCase()` and normalize to lowercase.

**Issue 2 — No OTP brute-force protection:**
`consumeOtp` doesn't track failed attempts. An attacker can try all 16^6 = 16,777,216 possible values. With a 2-minute window and no rate limit, this is theoretically feasible for a fast client. **Fix:** Limit attempts (e.g., 5 tries), then invalidate the OTP and require a new one.

**Issue 3 — JWT secret hardness not enforced:**
The `JWT_SECRET` env var has no minimum length validation at startup. A developer could set it to `"secret"` in production. **Fix:** Add a startup check: `if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET too short')`.

### Quick-Recall Cheat Sheet
- Pino: dev = pretty + file, prod = JSON stdout
- Mailer: `console.log` fallback when `EMAIL_HOST` unset (dev only)
- OTP: `crypto.randomBytes(3)` hex → 6-char CSPRNG string, 2-minute TTL in Map
- JWT: `{ id, email, roles }`, 15-day expiry, HS256 signed with `JWT_SECRET`
- OTP is `.toUpperCase()` but comparison is strict — case mismatch from frontend causes false invalid OTP

---

## 14. Models Index & Schema Design

**File:** `models/index.js` · All model files

### What it does
`models/index.js` is a barrel file that re-exports all 7 Mongoose models. This allows controllers to import all models from a single path (`require('../models')`). The schema design section covers cross-cutting patterns used across models.

### Design Decisions
- **Barrel export:** Prevents import path sprawl in controllers. `const { Book, Cart, Order } = require('../models')` is cleaner than three separate requires.
- **Schema field snapshots in Order:** `bookName` and `priceAtPurchase` are denormalized snapshots because order history must be immutable.
- **`_id: false` on embedded schemas:** The `orderItemSchema` uses `{ _id: false }` to avoid generating unnecessary ObjectIds for embedded sub-documents.
- **Compound unique index on Review:** `{ userId: 1, bookId: 1 }` — composite uniqueness enforced at DB level.
- **`timestamps: true`** on most models for `createdAt`/`updatedAt` tracking.

### Interview & Discussion Questions

**Q1: Why does the Order model embed items as sub-documents rather than referencing Book documents?**  
A: Sub-documents with price/name snapshots ensure order history is immutable. If a book's price is updated or the book is soft-deleted, the order still correctly records what was purchased at what price. References would require the book to remain unchanged forever.

**Q2: What does `_id: false` do on `orderItemSchema`?**  
A: By default, Mongoose adds an `_id` field to every sub-document. `{ _id: false }` suppresses this, saving storage and avoiding unnecessary ObjectId generation for items that don't need independent identity (they're identified by position in the array and `bookId`).

**Q3: What is the difference between the `toJSON` transform on Book vs Author models?**  
A: Book's `toJSON`: `ret.id = ret._id; delete ret._id; delete ret.__v`. Author's `toJSON`: only `delete ret.__v`. Book maps `_id` to `id` for frontend compatibility (Angular expects `id` not `_id`). Author doesn't. This inconsistency means the frontend handles different id field names for different resources.

**Q4: Why does the Review model use a compound index instead of a unique compound field declaration in the schema?**  
A: Mongoose doesn't have a native "compound unique field" syntax at the field level. Compound indexes are always defined separately with `schema.index({ field1: 1, field2: 1 }, { unique: true })`. This is the correct and only way to express composite uniqueness in Mongoose.

**Q5: The Cart model has a `TODO: feature delete cart if not updated in 15 days` comment. How would you implement this?**  
A: Use a MongoDB TTL index: `cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 15 * 24 * 60 * 60 })`. This requires `timestamps: true` to maintain `updatedAt`. MongoDB's TTL index automatically deletes documents after the specified duration.

### Pitfalls & Issues

**Issue 1 — Inconsistent `id` vs `_id` across models:**
Book maps `_id → id` in `toJSON`, but Author, Category, Order don't. **Fix:** Apply a consistent `toJSON` transform across all models, or use a Mongoose plugin.

**Issue 2 — `pre('validate')` orderNumber hook is not atomic:**
Already described in the Order module section. **Fix:** Use a counter document with `$inc`.

**Issue 3 — No index on `Book.authorId` or `Book.categories`:**
Queries like `findAllBooks` with `authorId` or `categories` filter will do full collection scans. **Fix:** Add `bookSchema.index({ authorId: 1 })` and `bookSchema.index({ categories: 1 })`.

### Quick-Recall Cheat Sheet
- Barrel export: `models/index.js` re-exports all 7 models for clean imports
- Order items are embedded sub-documents with price/name snapshots (immutable history)
- `_id: false` on `orderItemSchema` suppresses per-item ObjectId generation
- Compound unique index on Review: `{ userId: 1, bookId: 1 }` — one review per user per book
- Book `toJSON` maps `_id → id` but other models don't — inconsistent across API responses

---

## 15. Routes Layer

**Files:** `routes/index.js` + 8 route modules

### What it does
Express Router instances grouped by resource. A central `routes/index.js` mounts each router at its path. Route files define the HTTP method, path, middleware chain, and controller for each endpoint.

### Design Decisions
- **Resource-based routing:** Each resource (books, authors, cart, etc.) has its own router file, matching RESTful conventions.
- **Middleware chaining inline:** Auth, admin, validation, and upload middleware are chained directly in the route definition. This makes each route's security requirements explicit and scannable.
- **`router.use(auth, admin)` in admin routes:** Instead of adding `auth, admin` to every route individually, it's applied once at the router level. All admin routes are protected by default.
- **Route ordering for specifics before wildcards:** In `carts.js`, `GET /count` is defined before `GET /` to ensure it isn't captured by a wildcard. Similarly, in `orders.js`, `GET /my` is before `GET /:id`.

### Interview & Discussion Questions

**Q1: In `routes/carts.js`, why is `GET /count` defined before `GET /`?**  
A: Express matches routes in declaration order. If `GET /` were first with a wildcard, `GET /count` would never be reached — `count` would be treated as a parameter. Placing specific routes before parameterized ones is a fundamental Express routing rule.

**Q2: In `routes/orders.js`, why is `GET /my` defined before `GET /:id`?**  
A: Same reason — `GET /my` would otherwise be caught by `GET /:id` with `id = 'my'`, causing a `CastError` when Mongoose tries to cast `'my'` as an ObjectId.

**Q3: The admin routes file uses `router.use(auth, admin)` at the top. What does this mean for all routes in that file?**  
A: Every route in `routes/admin.js` automatically has `auth` and `admin` middleware applied. This is cleaner than repeating the chain on each route but means there's no way to make a single route in that file public without restructuring.

**Q4: What HTTP methods are used for update operations and why?**  
A: Both `PUT` (replace) and `PATCH` (partial update) are used for books and authors. `PUT` replaces the entire resource (requires all fields), `PATCH` updates only provided fields. This follows REST semantics correctly and is reflected in Joi — `patchBookSchema` makes all fields optional.

**Q5: The `routes/reviews.js` defines `GET /my` after `GET /` (admin). Could `GET /my` be shadowed?**  
A: Looking at the file: `GET /book/:bookId` → `GET /` (admin) → `POST /` → `GET /my` → `DELETE /:id`. The `GET /my` route is NOT shadowed by `GET /book/:bookId` or `GET /` because they match different paths. However, `DELETE /:id` could theoretically shadow routes if a wildcard were involved, but since `GET /my` is GET and `DELETE /:id` is DELETE, they don't conflict.

### Cross-Topic Questions
- **Routes ↔ Middleware:** The middleware chain on each route is the primary security boundary. Incorrect ordering (e.g., controller before validation) is immediately visible in route definitions.
- **Routes ↔ Frontend API service:** The Angular `HttpClient` service in the frontend maps to these routes. Every API call in Angular corresponds to exactly one route here. URL mismatches (e.g., `/cart` vs `/carts`) cause silent 404s.

### Pitfalls & Issues

**Issue 1 — `PUT /me` in auth routes should probably be `PATCH /me`:**
```js
router.put('/me', auth, validateRequest(userUpdateSchema), authController.updateMe);
```
The `userUpdateSchema` makes all fields optional (it's a partial update). Semantically, a PUT should replace the entire resource and require all fields. The implementation is PATCH-like. **Fix:** Change to `router.patch('/me', ...)` or make all user fields required in the schema.

**Issue 2 — No rate limiting on auth routes:**
`POST /auth/register` and `POST /auth/login` have no rate limiting. Brute-force and credential-stuffing attacks are unmitigated. **Fix:** Add `express-rate-limit` middleware, especially on `/auth/login`, `/auth/register`, and OTP verification endpoints.

**Issue 3 — Admin `PUT /:id` route doesn't use the correct schema:**
```js
router.put('/:id', validateRequest(adminUpdateUserSchema), adminController.updateUser);
```
`adminUpdateUserSchema` makes all fields optional. For a PUT (full replace), all fields should be required. **Fix:** Create `adminReplaceUserSchema` with required fields for the PUT route, or change it to PATCH.

### Quick-Recall Cheat Sheet
- Specific routes before parameterized: `GET /count` before `GET /`, `GET /my` before `GET /:id`
- `router.use(auth, admin)` in admin router — all routes protected at router level
- PUT vs PATCH: PUT = replace (all fields), PATCH = partial (optional fields) — mirrored in Joi schemas
- No rate limiting on auth endpoints — brute-force risk
- Angular API service URLs must match these routes exactly — `/cart` (not `/carts`) for the mounted path

---

## Cross-Repo Integration Points

> This section covers how the Angular frontend and this Express backend connect. Use it even if reviewing only one repo.

### API Contract & Base URLs

| Environment | Backend URL | Angular Config |
|---|---|---|
| Development | `http://localhost:3000` | `environment.ts` → `apiUrl` |
| Production | Vercel deployment URL | `environment.prod.ts` → `apiUrl` |

The Angular app should use an `environment.ts` variable for the API URL, never hardcoded strings in services.

---

### JWT Flow

```
Angular Login Form
      │
      ▼
POST /auth/login  ─────────────────────────►  Check credentials, send OTP
POST /auth/login/verify-otp  ────────────►  consumeOtp, return { accessToken }
      │
      ▼
Angular stores accessToken (localStorage or memory)
      │
      ▼
Every subsequent request:
  Authorization: Bearer <accessToken>
      │
      ▼
auth middleware → jwt.verify() → req.user = { id, email, roles }
```

**Frontend responsibility:**
- Store token securely (avoid `localStorage` for XSS-sensitive apps — prefer `httpOnly` cookies)
- Attach `Authorization: Bearer <token>` header on every authenticated request (typically via an Angular HTTP interceptor)
- Handle 401 responses by clearing the token and redirecting to login

**Backend responsibility:**
- Verify token on every protected route
- Return 401 `UnauthorizedError` for missing/expired/invalid tokens
- Return 403 `ForbiddenError` for valid tokens with insufficient roles

---

### HTTP Error Handling Contract

The frontend must handle two different error response shapes from the backend:

```json
// Shape 1 — used by most 4xx errors
{ "status": "Fail", "errors": "Book not found" }
{ "status": "Fail", "errors": ["name is required", "price must be a number"] }

// Shape 2 — used by auth/user errors
{ "status": "Fail", "message": "Invalid credentials" }

// Shape 3 — generic 500
{ "status": "error", "message": "Something went wrong" }
```

**Angular interceptor recommendation:**
```typescript
// http.interceptor.ts
intercept(req, next) {
  return next.handle(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = err.error?.message || err.error?.errors || 'Unknown error';
      // Show toast notification
      return throwError(() => err);
    })
  );
}
```

---

### CORS Configuration

```js
// Backend
app.use(cors({
  origin: ['http://localhost:4200', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));
```

- `credentials: true` is set — the Angular `HttpClient` must use `{ withCredentials: true }` on requests **only if using cookies**. For pure JWT-in-header auth, this setting is harmless but unnecessary.
- `origin` is an allowlist — any other origin gets a CORS error. The Angular deployed URL must be set as `FRONTEND_URL` in Vercel environment variables.

---

### Request/Response Shape Examples

**GET `/books`** — Paginated book list:
```json
{
  "status": "Success",
  "data": [ { "_id": "...", "name": "...", "price": 29.99, "status": "available", "averageRating": 4.2, ... } ],
  "totalBooks": 42,
  "currentPage": 1,
  "pageSize": 10
}
```

**POST `/auth/register/verify-otp`** — Returns token immediately after registration:
```json
{
  "message": "User registered successfully",
  "user": { "id": "...", "email": "...", "roles": ["user"] },
  "accessToken": "eyJ..."
}
```

**GET `/auth/me`** — Note: response is flat (no `data` wrapper):
```json
{ "id": "...", "email": "...", "firstName": "...", "roles": ["user"] }
```
⚠️ This is inconsistent with other endpoints that wrap in `{ data: ... }`.

---

### Loading & Error State Patterns

Angular components consuming this API should handle three states for every API call:

| State | Trigger | UI |
|---|---|---|
| **Loading** | Request in-flight | Spinner / skeleton |
| **Success** | 2xx response | Render data |
| **Error** | 4xx / 5xx / network | Error message banner |

The `status` field in responses (`'Success'`, `'success'`, `'fail'`, `'error'`) is inconsistently cased — Angular should not rely on this field for control flow; rely on HTTP status codes instead.

---

### Common Frontend-Backend Mismatches (Bugs to Watch)

| Issue | Backend | Frontend Impact |
|---|---|---|
| Book `id` vs `_id` | `toJSON` maps `_id → id` on Book only | Other models return `_id` — Angular must handle both |
| `GET /auth/me` flat response | No `data` wrapper | Angular service must read `res` not `res.data` |
| Error key `message` vs `errors` | Inconsistent across error types | Angular interceptor must check both keys |
| `status` casing | `'Success'` / `'success'` / `'Fail'` | Don't use `status` field for logic |
| Review `bookId.title` | Bug: field is `name` not `title` | My reviews page will show `undefined` book names |

---

## Top 20 Q&A Cheat Sheet

**Optimized for last-minute review. Read through once before the discussion.**

---

**1. How does the dual-mode server work (local vs. Vercel)?**  
`require.main === module` → `app.listen()` for local. Vercel `require()`s the file and calls the exported `async (req, res)` function. `isConnected` flag prevents repeat MongoDB connections on warm Lambda restarts.

**2. Walk through the full two-factor auth flow.**  
Register: POST credentials → OTP emailed → POST OTP → user saved → JWT returned.  
Login: POST credentials → OTP emailed → POST OTP → JWT returned.  
OTPs are stored in in-memory `Map`s with 2-minute TTL.

**3. What is in the JWT payload and what are its risks?**  
`{ id, email, roles }`, 15-day expiry. Risk: role changes (e.g., admin revocation) don't take effect until token expires. No refresh token mechanism.

**4. Why does the book list use `$facet` in its aggregation?**  
`$facet` runs sub-pipelines on the same input in parallel — one counts total documents (`$count`), another applies `$sort + $skip + $limit`. Single round trip for paginated data + total count.

**5. What is a soft delete and why is it used for books?**  
Sets `isDeleted: true` instead of removing the document. Preserves referential integrity for orders (which reference `bookId`) and reviews. A partial unique index on `name` still enforces uniqueness among active books.

**6. How do MongoDB transactions work in `placeOrder`?**  
`startSession()` → `startTransaction()` → decrement stock for each book, create Order, delete Cart (all `.session(session)`) → `commitTransaction()`. On any error: `abortTransaction()` rolls everything back.

**7. How does the error handler work?**  
Registry of `{ match, handler }` objects. In the global handler, `errorHandler.find(e => e.match(err))` returns the first matching handler. Each handler returns `{ statusCode, status, message/errors }`. Falls back to `err.statusCode` if no match, then to 500.

**8. What is `asyncHandler` and why is it needed?**  
A wrapper that returns `(req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)`. Catches rejected promises from `async` controllers and forwards them to the Express error handler. Avoids try/catch in every controller.

**9. How does the review gate work?**  
Before allowing a review, `addReview` queries for an Order where `userId` matches, `status === 'delivered'`, and `items.bookId` includes the target book. No delivered order → 403 denied.

**10. What order status transitions are allowed?**  
`processing → shipped | delivered | cancelled`  
`shipped → delivered | cancelled`  
`delivered → (none)`  
`cancelled → (none)`  
Defined in `validTransitions` map. Cancellation triggers a transaction to restore stock.

**11. How are Cloudinary images cleaned up on request failure?**  
`cloudianryService` sets `req.public_id` after a successful upload. The global error handler checks `if (req.public_id)` and calls `deleteFromCloudinary(req.public_id)` to remove the orphaned image.

**12. How does the category delete guard work?**  
Queries for books where `id` is in their categories AND `categories.length === 1`. If any exist, deletion is blocked (those books would be left with no category). Otherwise, `$pull` removes the category ID from all other books.

**13. What does `Joi.array().single()` do?**  
Allows a query param to be passed as a single string _or_ an array. `?categories=abc` → `['abc']`. `?categories[]=abc&categories[]=def` → `['abc', 'def']`. Normalizes both forms.

**14. Why does the Order model snapshot `bookName` and `priceAtPurchase`?**  
Orders must be immutable records of what was purchased at what price. If a book's price later changes or the book is soft-deleted, the order history must still accurately reflect the original transaction.

**15. What security gaps exist in the authentication system?**  
(a) OTP store is in-memory — breaks on multi-instance deployments.  
(b) No OTP rate limiting — email flooding possible.  
(c) JWT roles cached 15 days — role revocation not immediate.  
(d) `updateMe` allows password change without current password verification.

**16. What is the CORS configuration and what does it protect?**  
Allowlist: `localhost:4200` (dev) + `FRONTEND_URL` env var (prod). `credentials: true` allows cookies/auth headers. Any request from an origin not in the list will be rejected by the browser's preflight check.

**17. What are the three main bugs in the review module?**  
(a) `getMyReviews` populates `'title coverImage'` — field is `name`, not `title` (silent undefined).  
(b) Debug `console.log` statements left in `addReview`.  
(c) No pagination on `getBookReviews` — performance risk for popular books.

**18. How does the `pre('save')` hook for password hashing work?**  
`if (!this.isModified('password')) return` — only hashes if the password field is being changed. Then `this.password = await bcrypt.hash(this.password, 10)`. The `pre('findOneAndUpdate')` hook handles the update case by checking `this.getUpdate().password`.

**19. What is the biggest unresolved production risk in this codebase?**  
The OTP in-memory Map store is incompatible with multi-instance deployments (Vercel serverless) — OTPs issued by one container cannot be verified by another. The fix is Redis with TTL keys (e.g., Upstash for serverless).

**20. What are the HTTP status code bugs to call out?**  
`replaceBook`, `updateBook`, `updateAuthor`, and `deleteAuthor` all return **201 Created** instead of **200 OK**. 201 is for resource creation. These are PATCH/PUT/DELETE operations and should return 200. Additionally, `GET /auth/me` and other endpoints inconsistently wrap responses in `{ data: ... }` vs returning flat objects.

---

*Document prepared for WyrmHole team code review — backend repository `ecommerce-backend`*  
*All code quotes reference the actual source files provided.*
