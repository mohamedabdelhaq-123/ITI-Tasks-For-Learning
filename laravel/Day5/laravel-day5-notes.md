# Laravel — Day 5: Building a REST API with Sanctum Auth & OAuth

> 📚 **Docs References used throughout:** [Routing](https://laravel.com/docs/13.x/routing) · [Validation](https://laravel.com/docs/13.x/validation) · [API Resources](https://laravel.com/docs/13.x/eloquent-resources) · [Sanctum](https://laravel.com/docs/13.x/sanctum) · [Socialite](https://laravel.com/docs/13.x/socialite) · [Filesystem](https://laravel.com/docs/13.x/filesystem)

---

## Prerequisites

Before this session, you should be comfortable with:
- Laravel routing, controllers, and Eloquent models (Days 1–4)
- What REST APIs are (you know this from Node/DRF)
- What tokens/JWTs are conceptually

---

## 1. Setting Up the API

### Why a separate API setup?

In Laravel, the default `routes/web.php` is designed for **browser-based apps** — it uses sessions, cookies, and CSRF protection. APIs are **stateless**, meaning each request carries its own credentials (a token) with no session. Laravel separates these concerns with `routes/api.php`.

### Installation

```bash
php artisan install:api
```

This single command does several things at once:
- Installs **Laravel Sanctum** (the token-based auth package)
- Creates the `routes/api.php` file
- Runs the necessary database migrations for the token table

📖 [Docs: API Routing setup](https://laravel.com/docs/13.x/routing#api-routes)

> **Key behavior:** Every route you define in `routes/api.php` is **automatically prefixed with `/api`**. So a route for `/posts` becomes `/api/posts`. You never write the `/api` prefix yourself.

---

### Create the API Controller

```bash
php artisan make:controller Api\PostController --api
```

- `Api\PostController` → creates the file at `app/Http/Controllers/Api/PostController.php`. The `Api\` part creates a subfolder, keeping API controllers organized and separate from web controllers.
- `--api` → scaffolds 5 methods only: `index`, `show`, `store`, `update`, `destroy`. It skips `create` and `edit` because those are HTML form pages — an API doesn't need them.

Compare `--resource` vs `--api`:

| Flag | Methods Generated | Use for |
|---|---|---|
| `--resource` | 7 (includes `create`, `edit`) | Web apps with HTML forms |
| `--api` | 5 (no form pages) | Pure REST APIs |

---

### Register the Routes

In `routes/api.php`:

```php
use App\Http\Controllers\Api\PostController;

// Option 1: Register each route manually
Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::put('/posts/{id}', [PostController::class, 'update']);
Route::delete('/posts/{id}', [PostController::class, 'destroy']);

// Option 2: One line does all of the above (cleaner!)
Route::apiResource('/posts', PostController::class);
```

`Route::apiResource` is the API equivalent of `Route::resource`. It wires all 5 CRUD routes to your controller automatically.

📖 [Docs: API Resource Routes](https://laravel.com/docs/13.x/controllers#api-resource-routes)

---

### Testing with Postman

Since there are no HTML views, **Postman** is your browser for the API.

- Base URL: `http://localhost:8000/api/posts`
- Always set the header: `Accept: application/json`

> ⚠️ **Critical:** Without `Accept: application/json`, Laravel will return HTML error pages instead of JSON error responses. This is a very common mistake.

---

## 2. API Controller — Returning JSON

Unlike web controllers that `return view(...)`, API controllers return JSON.

```php
// Web controller
return view('posts.index', ['posts' => $posts]);

// API controller
return response()->json([
    'data'   => $posts,
    'status' => 'success',
], 200);
```

`response()->json($data, $statusCode)` is Laravel's way of building a JSON response — equivalent to `res.json()` in Express or `Response()` in DRF.

---

## 3. The `index` Method — Listing Posts

```php
public function index()
{
    // Read an optional query param, defaulting to 10 if not provided
    $perPage = request()->query('per_page', 10);

    $posts = Post::paginate($perPage);

    return response()->json([
        'data'   => $posts,
        'status' => 'success',
    ], 200);
}
```

**Breaking it down:**

- `request()->query('per_page', 10)` → reads `?per_page=5` from the URL. The second argument (`10`) is the default value if the param isn't sent. This is identical to `req.query.per_page` in Express or `request.query_params.get('per_page', 10)` in DRF.
- `Post::paginate($perPage)` → automatically adds pagination metadata (`current_page`, `total`, `next_page_url`) to the response.

📖 [Docs: Pagination](https://laravel.com/docs/13.x/pagination)

---

## 4. The `show` Method — Getting One Post

### Simple approach (manual find):

```php
public function show(string $id)
{
    $post = Post::find($id);

    if (!$post) {
        return response()->json([
            'message' => 'Post not found',
            'status'  => 'failed',
        ], 404);
    }

    return response()->json([
        'data'   => $post,
        'status' => 'success',
    ], 200);
}
```

`Post::find($id)` returns the model if found, or `null` if not. You then manually handle the not-found case.

### Better approach — Eager Loading with `with()`:

```php
$post = Post::with('author')->find($id);
```

`with('author')` tells Eloquent to load the related `author` relationship in the **same query** (a JOIN), avoiding the "N+1 query problem". Without it, Eloquent would fire a separate query for the author every time you access `$post->author`.

> **N+1 problem analogy:** Imagine fetching 10 posts, then for each post making a separate DB call to get the author. That's 1 + 10 = 11 queries. `with()` collapses it into 2 queries total.

📖 [Docs: Eager Loading](https://laravel.com/docs/13.x/eloquent-relationships#eager-loading)

---

## 5. API Resources — The Transformation Layer

### The problem they solve

By default, when you return a model as JSON, Laravel dumps **every column** from the database directly to the response. This is a problem because:
- You might expose sensitive fields (like internal IDs, passwords, private flags)
- You might want to rename fields or compute values (like building a full image URL)
- You might want to shape the data differently than how it's stored

An **API Resource** is a class that sits between your model and the JSON response and controls exactly what gets sent. Think of it as DRF's `Serializer`.

📖 [Docs: Eloquent API Resources](https://laravel.com/docs/13.x/eloquent-resources)

### Create a Resource

```bash
php artisan make:resource PostDetailsResource
```

This creates `app/Http/Resources/PostDetailsResource.php`.

### Define the transformation

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostDetailsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'content'     => $this->content,

            // Build full image URL only if an image exists
            'image'       => $this->image
                                ? asset('storage/' . $this->image)
                                : null,

            // Access relationship data (requires eager loading in controller)
            'author_name' => $this->author->name,
        ];
    }
}
```

**Key points:**
- `$this` refers to the underlying Eloquent model. You access all model fields and relationships through it.
- `asset('storage/path')` generates the full public URL to a file (e.g., `http://localhost/storage/images/photo.jpg`). Without this, you'd just return the raw file path string, which is useless to a frontend.
- `$this->author->name` works because you eager-loaded `author` in the controller with `Post::with('author')->find($id)`.

### Use the Resource in the controller

```php
// For a single model instance
return response()->json([
    'data'   => PostDetailsResource::make($post),
    'status' => 'success',
], 200);

// For a collection of models
return response()->json([
    'data'   => PostDetailsResource::collection($posts),
    'status' => 'success',
], 200);
```

| Method | Use for |
|---|---|
| `PostDetailsResource::make($post)` | A single model |
| `PostDetailsResource::collection($posts)` | Multiple models (array/collection) |

---

## 6. The `store` Method — Creating a Post

### The pattern: Validate → Create → Respond

```php
public function store(Request $request)
{
    // 1. Validate
    $validated = $request->validate([
        'title'   => ['required', 'string', 'max:255'],
        'content' => ['required', 'string'],
        'slug'    => ['required', 'string', 'unique:posts,slug'],
    ]);

    // 2. Create
    $post = Post::create($validated);

    // 3. Respond
    return response()->json([
        'data'   => $post,
        'status' => 'success',
    ], 201); // 201 = Created
}
```

📖 [Docs: Validation](https://laravel.com/docs/13.x/validation)

### How Validation Works

`$request->validate([...])` does two things:
1. Checks the incoming data against your rules.
2. If validation **passes** → returns only the validated fields as an array (safe to use directly).
3. If validation **fails** → automatically returns a `422 Unprocessable Entity` JSON response with error messages (because we set `Accept: application/json` in Postman/client).

This is equivalent to DRF's serializer `.is_valid(raise_exception=True)`.

### Auto-generating the Slug

A **slug** is a URL-friendly version of a title, e.g., `"My First Post"` → `"my-first-post"`. Rather than asking the API client to send the slug manually, you can auto-generate it from the title **before validation runs**.

The best place to do this is in a **Form Request class**:

```bash
php artisan make:request StorePostRequest
```

```php
// app/Http/Requests/StorePostRequest.php

use Illuminate\Support\Str;

protected function prepareForValidation(): void
{
    // This runs BEFORE validation, so 'slug' is injected automatically
    $this->merge([
        'slug' => Str::slug($this->title),
    ]);
}

public function rules(): array
{
    return [
        'title'   => ['required', 'string', 'max:255'],
        'content' => ['required', 'string'],
        'slug'    => ['required', 'string', 'unique:posts,slug'],
    ];
}
```

Then in the controller, replace `Request $request` with `StorePostRequest $request` — Laravel auto-injects and validates it.

📖 [Docs: Form Requests & `prepareForValidation`](https://laravel.com/docs/13.x/validation#preparing-input-for-validation)

> **Why a Form Request class instead of inline validation?**
> When validation logic grows complex, keeping it inside the controller makes the controller messy. A Form Request is a dedicated class for validation — cleaner, reusable, and testable. It's the Laravel equivalent of DRF's dedicated serializer classes.

---

## 7. The `destroy` Method — Deleting a Post

Deleting often has **side effects**: related records, uploaded files, etc. You must handle them manually.

```php
public function destroy(string $id)
{
    $post = Post::find($id);

    if (!$post) {
        return response()->json([
            'message' => 'Post not found',
            'status'  => 'failed',
        ], 404);
    }

    // 1. Delete the associated image file from storage
    if ($post->image && Storage::disk('public')->exists($post->image)) {
        Storage::disk('public')->delete($post->image);
    }

    // 2. Delete related comments (if no cascade set in DB)
    $post->comments()->delete();

    // 3. Delete the post itself
    $post->delete();

    return response()->json([
        'message' => 'Post deleted successfully',
        'status'  => 'success',
    ], 200);
}
```

📖 [Docs: File Storage](https://laravel.com/docs/13.x/filesystem)

### Important: Filesystem Configuration

By default, Laravel stores uploaded files in the `local` disk (not publicly accessible). For images that need to be served via URL, you must use the `public` disk.

In `.env`:
```env
FILESYSTEM_DISK=public
```

And run this once to create a symbolic link from `public/storage` to `storage/app/public`:
```bash
php artisan storage:link
```

After this, files stored with `Storage::disk('public')->put(...)` are accessible at `http://localhost/storage/filename`.

---

## 8. Auth — Registration

### The Registration Flow

```
Client sends { name, email, password, password_confirmation }
    → Validate
    → Create user
    → Return token or success response
```

```php
public function register(Request $request)
{
    $validated = $request->validate([
        'name'                  => ['required', 'string', 'max:255'],
        'email'                 => ['required', 'email', 'unique:users,email'],
        'password'              => ['required', 'string', 'min:8', 'confirmed'],
        // 'confirmed' rule checks that 'password_confirmation' field matches 'password'
    ]);

    $user = new User();
    $user->name     = $validated['name'];
    $user->email    = $validated['email'];

    // forceFill bypasses the $fillable protection and sets password
    // password is auto-hashed because of the 'hashed' cast on the model
    $user->forceFill(['password' => $validated['password']])->save();

    return response()->json([
        'message' => 'User registered successfully',
        'status'  => 'success',
    ], 201);
}
```

### Why `forceFill()`?

The `User` model has a `$fillable` array that acts as a whitelist for mass assignment (security feature). If `password` isn't in `$fillable`, calling `User::create(['password' => ...])` would silently ignore it. `forceFill()` bypasses this whitelist — useful when you know exactly what you're doing and the data is already validated.

📖 [Docs: Mass Assignment](https://laravel.com/docs/13.x/eloquent#mass-assignment)

> ⚠️ **`confirmed` validation rule:** When you add `'confirmed'` to the `password` field's rules, Laravel automatically looks for a `password_confirmation` field in the request and checks they match. The client must send both fields.

---

## 9. Auth — Stateful API Authentication with Sanctum

### What is Sanctum?

Sanctum is Laravel's first-party package for **API token authentication**. When a user logs in, Sanctum generates a plain-text token, stores a hashed version in the database (`personal_access_tokens` table), and returns the plain-text version to the client. On every subsequent request, the client sends this token in the `Authorization` header and Sanctum validates it.

📖 [Docs: Sanctum Token Authentication](https://laravel.com/docs/13.x/sanctum#api-token-authentication)

**Analogy from Node/DRF:** Sanctum tokens work like JWT or DRF's `TokenAuthentication`, but the token is stored in the DB (similar to DRF's `Token` model), making it revocable.

### Setup

1. Run `php artisan install:api` (already done above — installs Sanctum + creates api.php)
2. Add the `HasApiTokens` trait to your `User` model:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    // ...
}
```

---

### Login

```php
// routes/api.php
Route::post('/login', [AuthController::class, 'login']);
```

```php
public function login(Request $request)
{
    // Extract only email and password from the request
    $credentials = $request->only('email', 'password');

    // auth()->attempt() checks if these credentials match a DB record
    // It also logs the user in for this request if successful
    if (auth()->attempt($credentials)) {

        // Generate a new token for this user
        $token = auth()->user()->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'status'       => 'success',
        ], 200);
    }

    return response()->json([
        'message' => 'Unauthorized — invalid credentials',
        'status'  => 'failed',
    ], 401);
}
```

**How it works step by step:**
1. `auth()->attempt($credentials)` → runs `SELECT * FROM users WHERE email = ?` then compares the hashed password. Returns `true` or `false`.
2. `createToken('auth_token')` → creates a record in `personal_access_tokens` table and returns a `NewAccessToken` object.
3. `->plainTextToken` → the raw string token to send to the client (e.g., `1|abc123xyz...`). This is shown **only once** — it's stored hashed in the DB.

The client stores this token and sends it with every future request:
```
Authorization: Bearer 1|abc123xyz...
```

---

### Protecting Routes (Middleware)

```php
// routes/api.php

// Public routes (no auth needed)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes (token required)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/posts', PostController::class);
});
```

`auth:sanctum` is the middleware that reads the `Authorization: Bearer <token>` header, looks up the token in the DB, and authenticates the user. If no valid token is provided, it returns `401 Unauthorized` automatically.

📖 [Docs: Protecting Routes](https://laravel.com/docs/13.x/sanctum#protecting-routes)

---

### Logout

There are two logout strategies depending on your use case:

```php
public function logout(Request $request)
{
    // Strategy 1: Log out from ALL devices (delete every token for this user)
    $request->user()->tokens()->delete();

    // Strategy 2: Log out from THIS device only (delete just the current token)
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully',
        'status'  => 'success',
    ], 200);
}
```

| Strategy | When to use |
|---|---|
| `tokens()->delete()` | "Log out everywhere" — e.g., after a password change |
| `currentAccessToken()->delete()` | Normal logout from current session/device only |

`$request->user()` works inside a protected route because Sanctum has already authenticated the user from the token — it's equivalent to `request.user` in DRF.

---

## 10. OAuth — Social Login with Laravel Socialite

### What is OAuth?

OAuth lets users log in using their existing account on another platform (GitHub, Google, etc.) without creating a new password on your app. The flow is:

```
Your App → Redirects user to GitHub
GitHub → User approves → Redirects back to your app with a code
Your App → Exchanges code for user info → Log in or register the user
```

📖 [Docs: Laravel Socialite](https://laravel.com/docs/13.x/socialite)

### Installation

```bash
composer require laravel/socialite
```

### Configuration

In `config/services.php`, add your provider's credentials:

```php
'github' => [
    'client_id'     => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect'      => env('GITHUB_REDIRECT_URI'),
],
```

In `.env`:
```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
```

You get these values by creating an OAuth App on GitHub (Settings → Developer settings → OAuth Apps).

### Routes

```php
// Redirect user to GitHub
Route::get('/auth/github', [AuthController::class, 'redirectToGithub']);

// GitHub redirects back here after user approves
Route::get('/auth/github/callback', [AuthController::class, 'handleGithubCallback']);
```

### Controller

```php
use Laravel\Socialite\Facades\Socialite;

// Step 1: Send the user to GitHub's login page
public function redirectToGithub()
{
    return Socialite::driver('github')->redirect();
}

// Step 2: GitHub sends the user back here with their info
public function handleGithubCallback()
{
    $githubUser = Socialite::driver('github')->user();

    // Find existing user or create a new one
    $user = User::updateOrCreate(
        ['email' => $githubUser->getEmail()],
        [
            'name'              => $githubUser->getName(),
            'github_id'         => $githubUser->getId(),
            'email_verified_at' => now(), // GitHub verified the email
        ]
    );

    // Log them in and return a Sanctum token
    $token = $user->createToken('github_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type'   => 'Bearer',
    ]);
}
```

📖 [Socialite: Retrieving User Details](https://laravel.com/docs/13.x/socialite#retrieving-user-details)

---

## 11. Quick Reference Summary

### Artisan Commands

| Command | Purpose |
|---|---|
| `php artisan install:api` | Set up Sanctum + `routes/api.php` |
| `php artisan make:controller Api\PostController --api` | Create API controller |
| `php artisan make:resource PostDetailsResource` | Create a JSON transformer |
| `php artisan make:request StorePostRequest` | Create a Form Request for validation |
| `php artisan storage:link` | Link `storage/app/public` → `public/storage` |

### Response Status Codes (used in this session)

| Code | Meaning | When to use |
|---|---|---|
| `200` | OK | Successful GET, DELETE |
| `201` | Created | Successful POST (resource created) |
| `401` | Unauthorized | Wrong credentials / no token |
| `404` | Not Found | Resource doesn't exist |
| `422` | Unprocessable Entity | Validation failed (auto by Laravel) |

### The Full API Request Flow

```
POST /api/posts  (with Authorization: Bearer <token>)
    ↓
routes/api.php  →  middleware('auth:sanctum') checks token
    ↓
PostController@store
    ↓
StorePostRequest validates input (+ auto-generates slug)
    ↓
Post::create($validated)  →  database
    ↓
PostDetailsResource::make($post)  →  shapes the JSON output
    ↓
response()->json([...], 201)  →  client
```

---

## Common Mistakes to Avoid

1. **Forgetting `Accept: application/json` in Postman** → Laravel returns HTML instead of JSON errors.
2. **Not running `php artisan storage:link`** → Image URLs return 404.
3. **Not eager loading relationships** → `$post->author->name` triggers N+1 queries. Always use `Post::with('author')->...`.
4. **Returning the plain-text token from `createToken()` directly** → you must access `.plainTextToken` property.
5. **Using `tokens()->delete()` when you only want single-device logout** → logs the user out of all devices. Use `currentAccessToken()->delete()` for single-device.
6. **Forgetting to add `HasApiTokens` to the User model** → `createToken()` won't exist on the user.
