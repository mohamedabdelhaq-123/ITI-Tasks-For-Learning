# 🏗️ Laravel — Complete Developer Study Guide
> From Raw PHP & Node/Django background → Production-grade Laravel

---

# 📑 Table of Contents

- [Overview](#-overview)
- [Core Concepts](#-core-concepts)
- [Project Structure](#️-project-structure)
- [Request Lifecycle](#-request-lifecycle)
- [bootstrap/app.php](#️-bootstrapappphp--the-engine)
- [HTTP Kernel & Middleware](#️-http-kernel--middleware)
- [Routing](#-routing)
- [Controllers](#-controllers)
- [Blade Templating](#-blade-templating-the-view-layer)
- [Database Layer](#️-database-layer)
- [Database Seeding](#-database-seeding)
- [Eloquent Relationships](#-eloquent-relationships)
- [Sessions & Flash Data](#-sessions--flash-data)
- [Artisan CLI](#️-artisan-cli--command-reference)
- [Validation](#-validation)
- [Debugging with dd()](#-debugging-with-dd)
- [Common Mistakes](#️-common-mistakes)
- [Best Practices](#-best-practices)
- [Practical Examples](#-practical-examples)
- [Summary Cheat Sheet](#-summary-cheat-sheet)


---

## 📋 Overview

Laravel is a PHP web framework that eliminates the repetitive, fragile work of building raw PHP apps — routing, sessions, auth, database management — so you focus entirely on business logic.

**Your background maps to Laravel like this:**

| Your Background | Laravel Equivalent |
|---|---|
| `express()` + `app.get()` | `routes/web.php` + `Route::get()` |
| Django ORM / raw SQL | Eloquent ORM |
| `require 'class.php'` | Service Container (DI) |
| `npm run dev` | `php artisan serve` |
| `django-admin startproject` | `laravel new my-app` |
| `python manage.py migrate` | `php artisan migrate` |
| `node` REPL / `django shell` | `php artisan tinker` |

---

## 🧠 Core Concepts

### 1 — Why Laravel?

**Problem (BEFORE):** In raw PHP, every developer builds their own mini-framework — custom routers, manual session starts, copy-pasted config files. No two projects look alike. Onboarding a new dev is a nightmare.

**Solution (AFTER):** Laravel is an opinionated, standardized framework. One codebase structure, one set of conventions, one team language.

> 📖 Doc Reference: [Why Laravel — Installation](https://laravel.com/docs/13.x/installation#why-laravel)

---

### 2 — The MVC Pattern

**The single most important mental model in Laravel.**

```
USER REQUEST  →  [ ROUTE ]  →  [ CONTROLLER ]
                                     |
         ←  [ VIEW ]  ←  [ MODEL ] ←→ [ DATABASE ]
```

| Layer | Responsibility | Laravel Location |
|---|---|---|
| **Model** (M) | Talks to the database | `app/Models/` |
| **View** (V) | Renders the HTML | `resources/views/` |
| **Controller** (C) | Handles the request, connects M and V | `app/Http/Controllers/` |

**BEFORE (Spaghetti PHP):**
```php
// Everything in one file — data + logic + HTML
$result = mysqli_query($conn, "SELECT * FROM users");
while($row = $result->fetch_assoc()) {
    echo "<li>" . $row['username'] . "</li>";
}
```

**AFTER (Laravel MVC):**
```php
// Controller — only logic
public function index() {
    $users = User::all();            // Model handles data
    return view('users', compact('users')); // View handles HTML
}
```

> 📖 Doc Reference: [Architecture → Request Lifecycle](https://laravel.com/docs/13.x/lifecycle)

---

## 🗂️ Project Structure

Laravel hands you a fully mapped directory. Every file has one home.

```
project-root/
├── app/              🧠 The Brain: Models, Controllers (M + C of MVC)
│   ├── Http/
│   │   └── Controllers/
│   ├── Models/
│   └── View/Components/
├── bootstrap/        ⚙️  App initialization (bootstrap/app.php = the engine)
├── config/           🎛️  Settings (DB, mail, third-party services)
├── database/         🗄️  Migrations (schema), Seeders (test data)
├── public/           🌍 The ONLY web-accessible folder (index.php, assets)
├── resources/        🎨 Blade views, uncompiled CSS/JS (V of MVC)
│   └── views/
│       ├── layouts/
│       └── components/
├── routes/           🚦 Traffic cops: web.php, api.php, console.php
└── tests/            🧪 Automated testing
```

> ⚠️ **Critical:** `public/` is the only folder exposed to the browser. Never put sensitive logic or `.env` files inside it.

> 📖 Doc Reference: [Directory Structure](https://laravel.com/docs/13.x/structure)

---

## 🌊 Request Lifecycle

**This is the most important flow to understand before writing any code.**

### Explicit Flow (what the user triggers):
```
Browser → HTTP GET /users → Web Server (Nginx/Apache)
```

### Implicit Flow (what Laravel does internally):

```
[ Browser: GET /users ]
        │
        ▼
[ public/index.php ]         🌍 Single entry point — loads Composer autoloader
        │
        ▼
[ bootstrap/app.php ]        ⚙️  Builds the application instance (the engine)
        │
        ▼
[ HTTP Kernel / Middleware ]  🛡️  Security guards: CSRF, Sessions, CORS, Auth
        │
        ▼
[ routes/web.php ]           🚦 Matches URL to code
        │
        ▼
[ Controller Method ]         🧠 Fetches data, returns response
        │
        ▼
[ View (Blade) ]              🎨 Renders HTML
        │
        ▼
[ Browser sees the page ]
```

**Why this matters:** In raw PHP you had `users.php`, `about.php`, `contact.php` — each booting its own session, config, and DB connection. A missed `require` anywhere = silent bugs or security holes. In Laravel, one entry point boots everything once.

> 📖 Doc Reference: [Architecture → Request Lifecycle](https://laravel.com/docs/13.x/lifecycle)

---

## ⚙️ bootstrap/app.php — The Engine

This file configures and builds the entire application instance. It uses the **Fluent Builder Pattern** — chain methods to declare your app's structure.

```php
// bootstrap/app.php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Configuration\Exceptions;

return Application::configure(basePath: dirname(__DIR__))

    // 1. Attach routing files
    ->withRouting(
        web: __DIR__.'/../routes/web.php',         // browser traffic
        commands: __DIR__.'/../routes/console.php', // CLI commands
        health: '/up',                             // health check endpoint
    )

    // 2. Configure middleware (the security/session pipeline)
    ->withMiddleware(function (Middleware $middleware): void {
        // Add global or route-specific middleware here
    })

    // 3. Configure error handling
    ->withExceptions(function (Exceptions $exceptions): void {
        // Format API errors vs HTML errors here
    })

    // 4. Compile and return the app instance to index.php
    ->create();
```

**Node.js mental model:**
```javascript
// This file is the equivalent of your Express setup file:
const app = express();
app.use('/', webRoutes);     // → withRouting()
app.use(globalMiddleware);   // → withMiddleware()
app.use(errorHandler);       // → withExceptions()
export default app;          // → ->create()
```

> 📖 Doc Reference: [Architecture → Request Lifecycle → Routing and Middleware](https://laravel.com/docs/13.x/lifecycle#routing-and-middleware)

---

## 🛡️ HTTP Kernel & Middleware

The Kernel is your app's central security checkpoint. In **Laravel 11+**, its configuration lives entirely in `bootstrap/app.php` (no separate `Kernel.php` file).

```
[ GET /dashboard ]
        │
        ▼
+--- bootstrap/app.php ---+
| 1. CORS check            |  ← global, runs on every request
| 2. Session start         |  ← global
| 3. CSRF token verify     |  ← global
| 4. Auth: must be logged in | ← route-specific
+-------------------------+
        │ (if all pass)
        ▼
[ routes/web.php ] → [ Controller ]
```

**BEFORE (Express — manual stacking):**
```javascript
app.use(cors());
app.use(express.json());
app.get('/dashboard', requireAuth, (req, res) => { ... });
```

**AFTER (Laravel — centralized config):**
```php
->withMiddleware(function (Middleware $middleware) {
    // Append a custom global middleware
    $middleware->append(SecurityHeaders::class);

    // Create a named alias to use on specific routes
    $middleware->alias([
        'admin' => EnsureUserIsAdmin::class,
    ]);
})
```

**Using a middleware alias on a route:**
```php
Route::get('/admin', [AdminController::class, 'index'])->middleware('admin');
```

> ⚠️ **Never put database queries in global middleware** — it runs on every single request and will slow down your entire app.

> 📖 Doc Reference: [Basics → Middleware](https://laravel.com/docs/13.x/middleware)

---

## 🚦 Routing

### The Route Syntax

```php
// routes/web.php
Route::get('/users', [UserController::class, 'index']);
//    ↑ HTTP verb  ↑ URI                     ↑ Action tuple
```

**Breaking it down:**
- `Route` — The Facade that talks to Laravel's routing engine
- `::get` — HTTP method to listen for
- `'/users'` — URI the user typed
- `[UserController::class, 'index']` — "Instantiate UserController, run the `index` method"

**Node.js equivalent:**
```javascript
app.get('/users', userController.index);
```

**Raw PHP equivalent:**
```php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $uri === '/users') {
    $controller = new UserController();
    $controller->index();
}
```

### Resource Routes (One Line = Full CRUD)

```php
// One line wires up 7 routes automatically
Route::resource('users', UserController::class);
```

| Verb | URI | Controller Method | Route Name | Purpose |
|---|---|---|---|---|
| GET | `/users` | `index` | `users.index` | List all |
| GET | `/users/create` | `create` | `users.create` | Show create form |
| POST | `/users` | `store` | `users.store` | Save new record |
| GET | `/users/{user}` | `show` | `users.show` | Show one record |
| GET | `/users/{user}/edit` | `edit` | `users.edit` | Show edit form |
| PUT/PATCH | `/users/{user}` | `update` | `users.update` | Save updates |
| DELETE | `/users/{user}` | `destroy` | `users.destroy` | Delete record |

> 📖 Doc Reference: [Basics → Routing](https://laravel.com/docs/13.x/routing)

---

## 🧠 Controllers

Controllers are the "C" in MVC — they receive the request, fetch data from the Model, and return a View or JSON.

### Creating a Controller

```bash
# Creates app/Http/Controllers/UserController.php
php artisan make:controller UserController

# Creates controller + all 7 CRUD methods (Resource Controller)
php artisan make:controller UserController --resource

# Creates Model + Migration + Resource Controller all at once
php artisan make:model User -mcr
```

### Full CRUD Resource Controller

```php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // READ: List all users
    public function index()
    {
        $users = User::all();
        return view('users.index', compact('users'));
    }

    // CREATE — Step 1: Show the form
    public function create()
    {
        return view('users.create');
    }

    // CREATE — Step 2: Process and save
    public function store(Request $request)
    {
        // Always validate BEFORE touching the database
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        User::create($validated); // Mass assignment — safe because validated

        return redirect()->route('users.index');
    }

    // READ: Show one user
    public function show(User $user) // Route Model Binding — auto-fetches by ID
    {
        return view('users.show', compact('user'));
    }

    // UPDATE — Step 1: Show edit form
    public function edit(User $user)
    {
        return view('users.edit', compact('user'));
    }

    // UPDATE — Step 2: Process and save
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()->route('users.index');
    }

    // DELETE: Remove record
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index');
    }
}
```

### Route Model Binding

When your controller method type-hints a Model, Laravel **automatically fetches that record by ID** — and returns a 404 if not found.

```php
// BEFORE: Manual null check
public function show(int $id)
{
    $post = Post::find($id);
    if (!$post) { return 'Post not found'; }
    return view('posts.show', ['post' => $post]);
}

// AFTER: Route Model Binding (clean, automatic 404)
public function show(Post $post)
{
    return view('posts.show', compact('post'));
}
// If /posts/99 doesn't exist → framework returns 404 automatically
// Your controller method never even runs
```

> ⚠️ **Fat Controller** anti-pattern: if your controller method exceeds ~20 lines, you're putting business logic where it doesn't belong.

---

## 🎨 Blade Templating (The View Layer)

Blade is Laravel's HTML templating engine — similar to EJS (Node) or Jinja2 (Django).

### Passing Data from Controller to View

```php
// All three lines below do the exact same thing
return view('users.index', ['users' => $users]);  // manual array
return view('users.index', compact('users'));      // PHP shorthand
```

**How `compact()` works:**
- `compact('users')` finds the variable `$users` in scope
- Builds `['users' => $users]` automatically
- In Blade, the **array key** becomes the **variable name**

```php
// Passing multiple variables
return view('posts.index', compact('posts', 'trending'));
// Blade now has: $posts and $trending
```

> ⚠️ **Objects are passed by reference** — not a copy. Mutating a model inside a Blade view changes the actual object in memory. Never call `->delete()` or `->save()` inside a Blade file.

---

### Layout Inheritance: @extends / @yield / @section

**Problem:** Without layouts, you copy-paste `<head>`, `<nav>`, and `<footer>` into every file. Change your nav once = edit 200 files.

**Solution:** One master layout with named slots. Child pages inject their unique content.

```
[ MASTER LAYOUT: resources/views/layouts/app.blade.php ]
<html>
  <head><title> @yield('title', 'My App') </title></head>  ← slot with default
  <body>
    <nav>Global Navigation</nav>

    @yield('content')    ← main slot — child fills this
    
    <footer>Global Footer</footer>
  </body>
</html>
         ↑ child view injects INTO the master

[ CHILD VIEW: resources/views/users/index.blade.php ]

@extends('layouts.app')             ← "wrap me in the master layout"
@section('title', 'Users List')     ← fills the title slot
@section('content')                 ← opens the content slot
    <h1>All Users</h1>
    @foreach ($users as $user)
        <p>{{ $user->name }}</p>
    @endforeach
@endsection                         ← closes the content slot
```

**BEFORE (Raw PHP):**
```php
<?php include 'header.php'; ?>
<h1>Users</h1>
<?php include 'footer.php'; ?>
```

**AFTER (Blade):**
```blade
@extends('layouts.app')
@section('content')
    <h1>Users</h1>
@endsection
```

---

### @include (Simple HTML Injection)

Use for small, simple partials where you just want to inject raw HTML.

```blade
{{-- Pass specific data using an array --}}
@include('partials.alert', ['type' => 'danger', 'message' => 'Payment failed!'])

{{-- resources/views/partials/alert.blade.php --}}
<div class="alert alert-{{ $type }}">
    {{ $message }}
</div>
```

---

### Blade Components (The Modern Way — React-like)

Components are reusable, isolated UI elements with their own logic. Think React/Angular components.

**Generate a component:**
```bash
# Class-based: creates PHP file (logic) + blade file (UI)
php artisan make:component Alert

# Anonymous (UI only — most common): creates only the blade file
php artisan make:component Alert --view
```

**Naming rule:**
```
make:component Alert          → components/alert.blade.php       → <x-alert />
make:component SubmitButton   → components/submit-button.blade.php → <x-submit-button />
make:component Forms/Input    → components/forms/input.blade.php  → <x-forms.input />
```
> ⚠️ Nested components use **dot notation** in the tag, not slashes: `<x-forms.input />`

**Usage:**
```blade
{{-- Using the component in your page --}}
<x-alert type="danger" class="mt-4">
    <strong>Error:</strong> Payment failed!
</x-alert>
```

**The component file:**
```blade
{{-- resources/views/components/alert.blade.php --}}
{{-- $attributes catches extra HTML attributes like class="mt-4" --}}
{{-- $slot catches whatever HTML you put between the tags --}}
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $slot }}
</div>
```

**React comparison:**
```jsx
// React equivalent
<Alert type="danger" className="mt-4">
    <strong>Error:</strong> Payment failed!
</Alert>
```

> 📖 Doc Reference: [Basics → Blade Templates → Components](https://laravel.com/docs/13.x/blade#components)

---

### @csrf — The Security Directive

Every HTML form that changes data (POST, PUT, DELETE) must include `@csrf`.

**What it does:** Generates a hidden input with a secret, session-specific token. This proves the form was submitted by your app, not a hacker's script.

```blade
<form method="POST" action="/users">
    @csrf   {{-- compiles to: <input type="hidden" name="_token" value="xyz..."> --}}
    <input type="text" name="name">
    <button type="submit">Save</button>
</form>
```

```
[ evil.com ] → POST /users/delete                     → Your App 🛑 419 BLOCKED
[ your.com ] → POST /users/delete + Token: "abc123"   → Your App ✅ 200 OK
```

> ⚠️ Getting a `419 Page Expired` error? You forgot `@csrf` inside your `<form>`.

> 📖 Doc Reference: [Basics → CSRF Protection](https://laravel.com/docs/13.x/csrf)

---

## 🗄️ Database Layer

### .env — Credentials File

Never hardcode database credentials. The `.env` file stores environment-specific secrets, excluded from version control.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_laravel_app
DB_USERNAME=root
DB_PASSWORD=secret
```

> 📖 Doc Reference: [Basics → Configuration](https://laravel.com/docs/13.x/configuration)

---

### Migrations — Version-Controlled Database Schema

**Problem (BEFORE):** You email a `dump.sql` file. Dev A adds a column, forgets to tell Dev B, Dev B's app crashes.

**Solution (AFTER):** Migrations are PHP blueprints for your schema, committed to Git. Everyone runs `php artisan migrate` and gets the identical database state.

```
[ Dev A ] php artisan make:model Product -m
   ↓ creates: database/migrations/2026_05_14_create_products_table.php
   ↓ pushes to GitHub

[ Dev B ] git pull → php artisan migrate
   ↓ Database builds the 'products' table locally ✅
```

**BEFORE (Raw SQL):**
```sql
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**AFTER (Laravel Migration):**
```php
// database/migrations/xxxx_create_products_table.php
public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();                          // BIGINT UNSIGNED PRIMARY KEY
        $table->string('name');                // VARCHAR(255)
        $table->integer('price')->default(0);  // INT with default
        $table->timestamps();                  // created_at + updated_at
    });
}

public function down(): void
{
    Schema::dropIfExists('products'); // what to run on rollback
}
```

**Adding a Foreign Key:**
```php
// Verbose way
$table->unsignedBigInteger('author_id')->nullable()->after('id');
$table->foreign('author_id')->references('id')->on('users');

// Modern Laravel shorthand (preferred)
$table->foreignId('author_id')->nullable()->after('id')->constrained('users');
```

> ⚠️ When rolling back, always `dropForeign()` before `dropColumn()` — removing a column while a FK constraint still references it will crash.

> 📖 Doc Reference: [Database → Migrations](https://laravel.com/docs/13.x/migrations)

---

### The Complete Migration Command Matrix

| Artisan Command | What It Does | Raw SQL Equivalent |
|---|---|---|
| `make:migration add_X_to_Y` | Creates a new schema change file | `ALTER TABLE ...` |
| `migrate` | Runs all pending migrations | Execute `.sql` script |
| `migrate:status` | Shows run/pending status per file | Manual DB check |
| `migrate:rollback` | Reverses the **last batch** only | Revert last change |
| `migrate:reset` | Reverses **all** migrations | Revert everything |
| `migrate:refresh` | Reset + migrate (step by step) | Full rebuild |
| `migrate:fresh` | **DROP all tables** + migrate | `DROP DATABASE` + rebuild |
| `make:seeder ProductSeeder` | Scaffolds a test data class | `INSERT INTO` script |
| `db:seed` | Runs the seeders | Execute `INSERT` scripts |

> ⚠️ **Never run `migrate:fresh` on production.** It drops every table and deletes all data permanently.

> 💡 `migrate:fresh` is safer than `migrate:refresh` during dev because it bypasses broken `down()` methods in old migration files.

---

### DB Facade vs. Eloquent ORM

You have two tools for querying the database. Choose the right one.

```
[ Controller ]
      ├── 🏎️  DB Facade   → Returns raw PHP stdClass array
      └── 🧠  Eloquent    → Returns smart Model objects with methods
                                    ↓
                             [ Database ]
```

| Tool | Returns | Use When |
|---|---|---|
| **DB Facade** | Raw `stdClass` array | Massive exports, complex multi-table reports, millions of rows |
| **Eloquent ORM** | Rich Model objects | 90% of your app — CRUD, relationships, standard queries |

**BEFORE (Node.js raw SQL):**
```javascript
const users = await db.query('SELECT * FROM users WHERE active = ?', [1]);
```

**AFTER:**
```php
use Illuminate\Support\Facades\DB;
use App\Models\User;

// DB Facade — fast, raw, no Model overhead
$users = DB::table('users')->where('active', 1)->get();
// $users[0]->name  ← stdClass, cannot be saved or updated

// Eloquent ORM — smart objects
$users = User::where('active', 1)->get();
// $users[0]->name  ← can call ->update(), ->delete(), ->save()
```

> 📖 Doc References:
> - [Database → Query Builder](https://laravel.com/docs/13.x/queries)
> - [Eloquent ORM → Getting Started](https://laravel.com/docs/13.x/eloquent)

---

### Three Ways to Insert Data

```php
// 1. DB Facade — raw, fastest, no Model events fire
DB::table('posts')->insert([
    'title'   => $request['title'],
    'content' => $request['content'],
]);

// 2. Eloquent Object — explicit, bypasses $fillable, full control
$post = new Post();
$post->title   = $request['title'];
$post->content = $request['content'];
$post->save();

// 3. Eloquent Mass Assignment — cleanest, relies on $fillable ✅ recommended
$validated = $request->validate(['title' => 'required', 'content' => 'required']);
Post::create($validated);
```

**When to use which:**
- **Mass Assignment**: Standard web forms — 90% of the time
- **Eloquent Object**: When you need to calculate/inject values before saving (e.g., `$post->author_id = auth()->id()`)
- **DB Facade**: Bulk data exports, reporting on millions of rows

---

### Model Security Properties: $fillable, $guarded, $hidden

These are the bouncers that control what data gets in and out of your models.

```
+-------------+-------------------+------------------+----------------------------+
| PROPERTY    | DIRECTION         | TYPE             | WHAT IT TELLS LARAVEL      |
+-------------+-------------------+------------------+----------------------------+
| $fillable   | 📥 IN  (Saving)   | Whitelist (Safe) | "ONLY allow these columns" |
| $guarded    | 📥 IN  (Saving)   | Blacklist (Block)| "BLOCK these columns"      |
| $hidden     | 📤 OUT (Reading)  | Blacklist (Mask) | "HIDE these from JSON/API" |
+-------------+-------------------+------------------+----------------------------+
```

> Use `$fillable` **OR** `$guarded`. Never both in the same model.

**$fillable — The Whitelist:**
```php
class Post extends Model {
    // Only these columns can be mass-assigned
    // A hacker sneaking is_admin=1 into the payload → silently discarded
    protected $fillable = ['title', 'content'];
}
```

**$guarded — The Blacklist:**
```php
class User extends Model {
    // Everything is allowed EXCEPT 'is_admin'
    // Good when you have 50 columns and only need to block one
    protected $guarded = ['is_admin'];
}
```

**$hidden — The API Mask:**
```php
class User extends Model {
    // These columns exist in DB + PHP memory
    // But they are SCRUBBED from any JSON/API response automatically
    protected $hidden = ['password', 'remember_token'];
}
```

**BEFORE (Node — manual scrubbing, error-prone):**
```javascript
const user = await db.getUser();
delete user.password; // must remember this on EVERY route
res.json(user);
```

**AFTER (Laravel — automatic, define once):**
```php
class User extends Model {
    protected $fillable = ['name', 'email', 'password']; // let password IN
    protected $hidden   = ['password'];                   // keep password OUT
}

// In Controller:
$user = User::create($request->all());
return response()->json($user); // password is automatically absent from JSON
```

**The password lifecycle:**
```
REGISTRATION:
  Form → $fillable allows 'password' → saved (hashed) to DB ✅

API RESPONSE:
  DB → $hidden strips 'password' → JSON sent to browser (no password) ✅
```

> 📖 Doc References:
> - [Eloquent → Mass Assignment](https://laravel.com/docs/13.x/eloquent#mass-assignment)
> - [Eloquent → Serialization (hidden)](https://laravel.com/docs/13.x/eloquent-serialization#hiding-attributes-from-json)

---

### Casts — Automatic Type Conversion

```php
class User extends Model {
    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime', // DB string → PHP Carbon/DateTime object
            'password'          => 'hashed',   // auto-bcrypt on assignment, no Hash::make() needed
        ];
    }
}

// BEFORE (manual):
$user->password = bcrypt($request->password);
$user->save();
$date = new DateTime($user->email_verified_at);

// AFTER (with casts):
$user->password = $request->password;          // auto-hashed
$user->email_verified_at->format('Y-m-d');     // already a Carbon object
```
---

# 🌱 Database Seeding

## What is Seeding?

Seeding means inserting dummy, test, or initial data into your database automatically.

Instead of manually creating users, posts, products, or categories from phpMyAdmin every time, Laravel lets you generate them using Seeder classes.

```
Seeder → Inserts predefined data → Database
```

**BEFORE (Manual Work):**

```sql
INSERT INTO users (name, email)
VALUES ('Mohamed', 'mohamed@test.com');
```

**AFTER (Laravel Seeder):**

```php
User::create([
    'name'  => 'Mohamed',
    'email' => 'mohamed@test.com',
]);
```

---

## Why Seeding Matters

### Problems Without Seeders

* Every developer manually inserts test data
* Team databases become inconsistent
* Testing takes longer
* Rebuilding the database becomes painful

### Benefits of Seeders

* Fast project setup
* Consistent dummy data for the whole team
* Easier testing and development
* Useful for demos and learning
* Can rebuild your entire database instantly

---

## Creating a Seeder

```bash
php artisan make:seeder UserSeeder
```

Creates:

```text
database/seeders/UserSeeder.php
```

---

## Seeder Structure

```php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@test.com',
            'password' => 'password',
        ]);
    }
}
```

### Important Notes

* `run()` is the method Laravel executes
* Anything inside `run()` gets inserted into the database
* You can use:

  * `Model::create()`
  * DB Facade
  * Factories

---

## Running Seeders

### Run All Seeders

```bash
php artisan db:seed
```

Laravel starts from:

```php
database/seeders/DatabaseSeeder.php
```

---

### Run a Specific Seeder

```bash
php artisan db:seed --class=UserSeeder
```

Useful when testing only one table.

---

## DatabaseSeeder — The Main Seeder

Think of `DatabaseSeeder.php` as the master controller for all seeders.

```php
// database/seeders/DatabaseSeeder.php

public function run(): void
{
    $this->call(UserSeeder::class);
}
```

```
DatabaseSeeder
      ↓
Calls UserSeeder
      ↓
Users inserted into database
```

---

## Calling Multiple Seeders

```php
public function run(): void
{
    $this->call([
        UserSeeder::class,
        ProductSeeder::class,
        CategorySeeder::class,
    ]);
}
```

This lets your whole database build itself automatically.

---

## Using Factories with Seeders

Factories generate fake data automatically.

### Factory Example

```bash
php artisan make:factory PostFactory
```

```php
// database/factories/PostFactory.php

public function definition(): array
{
    return [
        'title'   => fake()->sentence(),
        'content' => fake()->paragraph(),
    ];
}
```

---

### Seeder + Factory

```php
// database/seeders/PostSeeder.php

public function run(): void
{
    Post::factory()->count(50)->create();
}
```

### What Happens

```
Factory generates fake data
        ↓
Seeder inserts it into DB
        ↓
Database now has 50 fake posts
```

---

## Common Seeding Workflow

### Fresh Database + Seed Everything

```bash
php artisan migrate:fresh --seed
```

### What It Does

```text
1. Drops all tables
2. Re-runs all migrations
3. Executes all seeders
4. Database becomes fully ready
```

> ⚠️ Never run `migrate:fresh --seed` on production.

---

## Common Seeding Mistakes

| Mistake                                           | Problem               | Fix                    |
| ------------------------------------------------- | --------------------- | ---------------------- |
| Forgetting to call seeder inside `DatabaseSeeder` | Seeder never runs     | Add `$this->call()`    |
| Running seeders before migrations                 | Tables don't exist    | Run `migrate` first    |
| Hardcoding too much fake data                     | Difficult maintenance | Use factories          |
| Using production emails/passwords                 | Security risk         | Use dummy values       |
| Using `migrate:fresh` on production               | Complete data loss    | Local development only |

---

## Best Practices for Seeding

* Use factories for large fake datasets
* Keep seeders focused by table/domain
* Use meaningful dummy data
* Seed admin/test accounts separately
* Use `migrate:fresh --seed` during development
* Never put sensitive real credentials inside seeders
* Keep `DatabaseSeeder` organized and readable

---

## Quick Seeder Cheat Sheet

```bash
# Create Seeder
php artisan make:seeder UserSeeder

# Run all seeders
php artisan db:seed

# Run one seeder
php artisan db:seed --class=UserSeeder

# Reset DB + migrate + seed
php artisan migrate:fresh --seed
```

---

## Seeder Mental Model

```text
Migration = Builds the database structure
Seeder    = Fills the database with data
Factory   = Generates fake data automatically
```

```text
Migration → Creates tables
Factory   → Generates fake values
Seeder    → Inserts values into tables
```

---

## 🤝 Eloquent Relationships

### The Core Concept

Define the relationship **once** on the Model, use it **everywhere** forever — no raw JOINs.

```php
// BEFORE: Raw SQL every time you need related data
$comments = DB::table('comments')->where('post_id', $postId)->get();

// AFTER: Define once on the Model, then just call $post->comments anywhere
```

### The 3-Step Formula (For Every Relationship)

```
STEP 1: Add FK column in Migration     ← Database level (physical column)
STEP 2: Define belongsTo on the CHILD  ← "I belong to a parent"
STEP 3: Define hasMany on the PARENT   ← "I have many children"
```

**The Golden Rule:**
```
"Which table holds the FK column?"
        ↓
    That model gets → belongsTo()
    The other model → hasMany() or hasOne()
```

---

### 1️⃣ One-to-One — hasOne / belongsTo

Each user has exactly one profile.

```
users table          profiles table
────────────         ─────────────────
id  ←─────────────── user_id   ← FK lives on the CHILD (profiles)
name                 bio
```

```php
// app/Models/User.php (The Parent/Owner)
public function profile(): HasOne
{
    return $this->hasOne(Profile::class);
    // Laravel auto-assumes: FK = 'user_id' on profiles table
}

// app/Models/Profile.php (The Child)
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

// Usage in Controller:
$profile = User::find(1)->profile;  // → single Profile object
$user    = Profile::find(1)->user;  // → single User object
```

---

### 2️⃣ One-to-Many — hasMany / belongsTo

One post has many comments.

```
posts table          comments table
────────────         ─────────────────
id  ←─────────────── post_id   ← FK lives on the CHILD (comments)
title                body
```

```php
// app/Models/Post.php (The Parent)
public function comments(): HasMany
{
    return $this->hasMany(Comment::class);
    // Auto-assumes: FK = 'post_id' on comments table
}

// app/Models/Comment.php (The Child)
public function post(): BelongsTo
{
    return $this->belongsTo(Post::class);
}

// Usage:
$comments = Post::find(1)->comments; // → Collection of Comment objects
$post     = Comment::find(1)->post;  // → single Post object
```

---

### 3️⃣ Many-to-Many — belongsToMany

A user can have many roles. A role can belong to many users. Requires a **pivot table**.

```
users table    role_user (pivot)     roles table
────────────   ─────────────────     ────────────
id             user_id  ←─────────── id
name           role_id  ──────────→  name
```

```php
// app/Models/User.php
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class);
    // Auto-assumes pivot table name: 'role_user' (alphabetical + singular)
}

// app/Models/Role.php (mirror relationship)
public function users(): BelongsToMany
{
    return $this->belongsToMany(User::class);
}

// Usage:
$roles = User::find(1)->roles;   // → Collection of Role objects
$users = Role::find(1)->users;   // → Collection of User objects

// Managing the pivot table (no raw SQL needed!)
$user->roles()->attach($roleId);         // add a role
$user->roles()->detach($roleId);         // remove a role
$user->roles()->sync([1, 2, 3]);         // replace all roles
```

---

### Custom Foreign Key Names

When your FK column doesn't follow Laravel's naming convention (e.g., `author_id` instead of `user_id`):

```php
// BROKEN — Laravel guesses 'user_id', but column is 'author_id' → returns NULL silently
public function posts(): HasMany {
    return $this->hasMany(Post::class);
}

// FIXED — always pass the explicit key
public function posts(): HasMany {
    return $this->hasMany(Post::class, 'author_id');
}

public function user(): BelongsTo {
    return $this->belongsTo(User::class, 'author_id');
}
```

---

### ⚠️ The N+1 Query Problem

The most dangerous performance trap when using relationships in loops.

```php
// ❌ BAD — 1 query for posts + 1 query per post = 101 queries for 100 posts
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // fires a NEW SQL query every iteration!
}

// ✅ GOOD — Eager Loading: always exactly 2 queries, regardless of count
$posts = Post::with('user')->get();
foreach ($posts as $post) {
    echo $post->user->name; // already loaded in memory, zero extra queries
}
```

---

### Full Relationship Example (Controller + Blade)

```php
// PostController.php
public function show(Post $post)    // Route Model Binding
{
    $post->load('comments');        // Eager load to prevent N+1
    return view('posts.show', compact('post'));
}

public function index()
{
    $posts = Post::with('user')->get(); // load posts + their authors in 2 queries
    return view('posts.index', compact('posts'));
}
```

```blade
{{-- resources/views/posts/index.blade.php --}}
@foreach ($posts as $post)
    <h2>{{ $post->title }}</h2>
    <p>Written by: {{ $post->user->name }}</p>
@endforeach
```

> 📖 Doc Reference: [Eloquent → Relationships](https://laravel.com/docs/13.x/eloquent-relationships) & [Eager Loading](https://laravel.com/docs/13.x/eloquent-relationships#eager-loading)

---

## 🧳 Sessions & Flash Data

### Sessions — Temporary Cross-Request Storage

Store data for a user across multiple requests without writing to the database.

**BEFORE (Raw PHP — boilerplate everywhere):**
```php
session_start(); // must repeat this on every single file
$_SESSION['cart'] = 'Laptop';
$item = isset($_SESSION['cart']) ? $_SESSION['cart'] : null;
```

**AFTER (Laravel):**
```php
// Store data (in a Controller)
session(['cart_item' => 'Laptop']);

// Retrieve data (even on a different route)
$item = session('cart_item', 'default_value_if_missing');
```

### Flash Sessions (One-Time Messages)

Flash data is stored for exactly one request, then automatically deleted. Perfect for success/error messages after form submissions.

```php
// In store() method after saving:
return redirect()->route('posts.index')->with('success', 'Post created!');
```

```blade
{{-- In your Blade view — shows once, then disappears --}}
@if (session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif
```

```
POST /posts → DB::insert() → session flash('success') → redirect to GET /posts
                                                               ↓
                                              Blade reads session('success') → displays once
                                              Next page load → message is gone ✅
```

> 📖 Doc Reference: [Basics → Session](https://laravel.com/docs/13.x/session)

---

## 🛠️ Artisan CLI — Command Reference

Artisan is Laravel's CLI — like `npm run` + `django-admin` combined.

### Most Important Commands

```bash
# 🚀 Development Server
php artisan serve                              # like npm start / python manage.py runserver

# 🏗️ Code Generation
php artisan make:model Product -mcr           # Model + Migration + Resource Controller
php artisan make:model Post -m                # Model + Migration only
php artisan make:controller PostController --resource  # Resource Controller only
php artisan make:migration add_stock_to_products_table # Schema alteration file
php artisan make:seeder ProductSeeder         # Dummy data class
php artisan make:component Alert --view       # Anonymous Blade component

# 🗄️ Database
php artisan migrate                           # Run all pending migrations
php artisan migrate:status                    # See what has/hasn't run
php artisan migrate:rollback                  # Undo last batch
php artisan migrate:refresh                   # Rollback all → migrate all
php artisan migrate:fresh                     # DROP all tables → migrate (⚠️ NEVER on prod)
php artisan db:seed                           # Inject dummy data

# 🔍 Inspection
php artisan route:list                        # See all routes, methods, controllers

# 🧪 REPL Sandbox
php artisan tinker                            # Interactive PHP shell with full app loaded

# 🔑 Security
php artisan key:generate                      # Generate app encryption key (run after fresh clone)

# 🧹 Cache
php artisan optimize:clear                    # Clear all caches
```

### The `make:model -mcr` Shortcut

```bash
php artisan make:model Product -mcr
# -m = Migration (database/migrations/xxxx_create_products_table.php)
# -c = Controller (app/Http/Controllers/ProductController.php)
# -r = Resource Controller (adds all 7 CRUD methods)
```

### Tinker — Your Testing Sandbox

```bash
php artisan tinker
> User::where('email', 'admin@test.com')->first()  # instant DB query
> Post::create(['title' => 'My First Post', 'content' => 'Hello!'])
> User::count()
```

---

## 🔐 Validation

Laravel's built-in validation intercepts form data before it touches your database.

**BEFORE (Node — manual if-chains):**
```javascript
if (!req.body.name || req.body.name.length > 255) {
    return res.status(400).send('Invalid name');
}
```

**AFTER (Laravel — declarative rules):**
```php
public function store(Request $request)
{
    // If validation fails → auto-redirects back with error messages
    // If it passes → $validated contains only the safe, verified data
    $validated = $request->validate([
        'name'    => 'required|string|max:255',
        'email'   => 'required|email|unique:users',
        'content' => 'required|string',
    ]);

    // If execution reaches here → data is 100% clean and safe
    Post::create($validated);
}
```

> ⚠️ Validation runs **inside the Controller**, meaning it executes **after** the HTTP Kernel (Middleware) has already handled global security (CORS, CSRF, etc.)

> 📖 Doc Reference: [Basics → Validation](https://laravel.com/docs/13.x/validation)

---

## 🐞 Debugging with `dd()`

`dd()` = **Dump and Die** — prints the variable to the browser and immediately halts execution.

```php
public function index() {
    $users = User::all();

    dd($users); // ← execution stops HERE, renders interactive output in browser

    return view('users.index', compact('users')); // ← this line NEVER runs
}
```

**Node equivalent:** `console.log(data); process.exit();`

> ⚠️ `dd()` is a **debugging** tool only — never leave it in production code.

---

## ⚠️ Common Mistakes

| Mistake | What Happens | Fix |
|---|---|---|
| Forgetting `@csrf` in a form | `419 Page Expired` error | Add `@csrf` inside every `<form>` |
| `migrate:fresh` on production | All data permanently deleted | Only use on local/staging |
| Missing `$fillable` on Model | Mass assignment exception when calling `create()` | Add `protected $fillable = [...]` |
| Wrong FK name in relationship | Silently returns `null` — hard to debug | Pass explicit key: `hasMany(Post::class, 'author_id')` |
| N+1 in loops | 100 posts = 101 queries, app slows to a crawl | Use `Post::with('user')->get()` |
| DB queries in global middleware | Every single request becomes slow | Move to route-specific middleware |
| Mutating objects inside Blade | Changes real DB data | Blade is read-only — never call `->save()` there |
| `dropColumn()` before `dropForeign()` in `down()` | Migration crashes | Always drop FK constraint first |

---

## ✅ Best Practices

- **Always validate before inserting** — use `$request->validate()` before `Model::create()`
- **Use Resource Controllers** — `--resource` gives you a standard 7-method blueprint
- **Eager load in loops** — `Post::with('user')->get()` instead of `Post::all()`
- **Use Route Model Binding** — eliminates manual null checks and auto-returns 404
- **Keep Controllers thin** — if a method exceeds ~20 lines, extract logic to a Service class
- **Use anonymous Blade components** — `--view` flag for simple UI elements, class-based only when you need PHP logic
- **Use `compact()`** when variable name matches the key you're sending to the view
- **Never hardcode credentials** — always use `.env`
- **Define `$hidden`** on any model that has a password or sensitive token before building any API response
- **Use `migrate:fresh --seed`** on local to reset your dev database cleanly

---

## 💡 Practical Examples

### Complete Route → Controller → View Chain

**Step 1: Route**
```php
// routes/web.php
Route::get('/posts', [PostController::class, 'index']);
```

**Step 2: Controller**
```php
// app/Http/Controllers/PostController.php
public function index()
{
    $posts = Post::with('user')->get(); // Eager load authors
    return view('posts.index', compact('posts'));
}
```

**Step 3: View**
```blade
{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('content')
    @foreach ($posts as $post)
        <h2>{{ $post->title }}</h2>
        <p>By {{ $post->user->name }}</p>
    @endforeach
@endsection
```

---

### Secure Store Method (Full Security Chain)

```php
public function store(Request $request)
{
    // 1. Validate — filters bad data, stops execution if rules fail
    $validated = $request->validate([
        'title'   => 'required|string|max:255',
        'content' => 'required|string',
    ]);

    // 2. Create — only validated fields, Model's $fillable provides final guard
    Post::create($validated);

    // 3. Flash message + Redirect (no URL params, auto-deletes after display)
    return redirect()->route('posts.index')->with('success', 'Post created!');
}
```

---

### One-to-Many Full Setup (Migration → Model → Controller → Blade)

```php
// Step 1: Migration — adds FK column
$table->foreignId('author_id')->nullable()->constrained('users');

// Step 2: Post Model — defines the relationship
public function user(): BelongsTo {
    return $this->belongsTo(User::class, 'author_id'); // explicit key!
}

// Step 3: User Model — defines the reverse
public function posts(): HasMany {
    return $this->hasMany(Post::class, 'author_id');   // explicit key!
}

// Step 4: Controller — eager load to prevent N+1
$posts = Post::with('user')->get();

// Step 5: Blade — navigate the relationship
@foreach ($posts as $post)
    {{ $post->title }} by {{ $post->user->name }}
@endforeach
```

---

## 📌 Summary Cheat Sheet

### The Request Journey
```
Browser → public/index.php → bootstrap/app.php → Middleware → routes/web.php → Controller → View → Browser
```

### The MVC Folder Map
```
Model      → app/Models/
Controller → app/Http/Controllers/
View       → resources/views/
Routes     → routes/web.php
```

### Eloquent Quick Reference
```php
Model::all()                    // SELECT * FROM table
Model::find($id)                // SELECT WHERE id = ?
Model::where('col', val)->get() // SELECT WHERE col = val
Model::create($array)           // INSERT (needs $fillable)
$model->update($array)          // UPDATE
$model->delete()                // DELETE
Model::with('relation')->get()  // Eager load (prevents N+1)
```

### Relationship Rule
```
Table with the FK column   → belongsTo()
Table without the FK column → hasMany() / hasOne()
Two tables via pivot        → belongsToMany()
```

### Security Checklist Per Feature
```
✅ Form submission?         Add @csrf
✅ Saving to DB?            Add $request->validate()
✅ Mass assigning?          Define $fillable on Model
✅ API JSON response?       Define $hidden on Model
✅ Loop with relationship?  Use with() eager loading
✅ URL with model ID?       Use Route Model Binding
```

### 5 Artisan Commands You'll Use Daily
```bash
php artisan serve              # start dev server
php artisan make:model X -mcr  # scaffold full MVC
php artisan migrate            # apply schema changes
php artisan route:list         # inspect all routes
php artisan tinker             # test queries live
```

---

> 📖 **Single Source of Truth:** [Laravel 13.x Documentation](https://laravel.com/docs/13.x)
