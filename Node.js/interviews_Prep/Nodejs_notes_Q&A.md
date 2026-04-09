# Node.js Interview Revision Sheet
### Shadow Interview Prep

---

# BLOCK 1 — How Node Works

---

## Topic 1 — What is Node.js

> **Quick Recap:**
> Node.js = V8 engine + libuv + bindings. V8 executes JS, libuv handles async I/O, bindings glue them together. The result: JS runs outside the browser as a server-side runtime.

### Aim
Understand what Node.js is, how it differs from a browser runtime, and when to use or avoid it.

### Why
Interviewers open with this to test your architectural understanding — not just "it runs JS on the server."

### How
- **V8** compiles and executes JavaScript
- **libuv** provides async I/O, the thread pool, and the event loop infrastructure
- **Bindings (C++)** glue V8 and libuv together, giving JS access to OS-level capabilities

### Key Interview Points + Ideal Answers

**Q: What is Node.js and how is it different from a browser runtime?**
> Node.js is a server-side runtime environment built on Chrome's V8 engine, combined with libuv for async I/O — allowing JavaScript to run outside the browser. Unlike the browser, Node has no DOM, no `window`, no Web APIs — instead it has `fs`, `http`, `process`, and direct OS access via libuv.

**Q: Why is Node.js single-threaded and how does it handle concurrency?**
> The main thread runs one thing at a time — it acts as the event loop. When a blocking I/O request comes in (file read, DB query, network), the main thread hands it to libuv and moves on immediately. libuv executes it using its thread pool or OS async primitives. When the result is ready, an event fires and the main thread picks up the callback. This is concurrency without parallelism — from the main thread's POV, it handles many requests by never waiting on any of them.

**Q: What's the difference between blocking and non-blocking code?**
> - **Blocking I/O**: thread halts and waits — `fs.readFileSync()`, sync DB calls, `execSync()`
> - **Blocking CPU**: thread computes non-stop — heavy `for` loops, image processing, complex math
> - **Non-blocking**: operation is initiated, control returns immediately, result handled later via callback/promise — thread never waits

**Q: When should you use Node.js and when should you avoid it?**
> ✅ **Use for**: REST APIs, real-time apps (chat, live notifications), streaming, microservices, high-concurrency I/O-heavy workloads
> ❌ **Avoid for**: video encoding, image processing, ML inference, complex mathematical computation — these block the single main thread and starve all other requests

---

## Topic 2 — V8 Engine: JIT, Hidden Classes, Optimization/Deoptimization

> **Quick Recap:**
> V8 has two compilers: **Ignition** (fast baseline, generates bytecode) and **TurboFan** (optimizing compiler, kicks in on hot code). Hidden classes make property lookups O(1) by mimicking static language behavior. Changing object shape or types breaks these optimizations → deoptimization.

### Aim
Understand how V8 compiles and optimizes JavaScript code.

### Why
Shows depth beyond "Node runs JS" — interviewers at senior level expect you to know why Node is fast and what you can do to break that.

### How
1. Code enters V8 → **Ignition** interprets it and generates bytecode immediately
2. **Profiler** runs in parallel, tracking which functions are called repeatedly ("hot code")
3. Hot code is handed to **TurboFan** → compiled to optimized machine code
4. Future calls use machine code directly — no re-interpretation
5. If assumptions break (type changes) → **deoptimization** → back to bytecode

### Key Interview Points + Ideal Answers

**Q: What is the V8 engine and what role does it play in Node.js?**
> V8 is the JavaScript engine built by Google, used in both Chrome and Node.js. It compiles JavaScript directly to machine code rather than interpreting it — that's why it's fast. It's the execution layer of Node; without it, there's no JS runtime.

**Q: Can Node.js work without V8?**
> Technically you could swap V8 for another engine (Microsoft attempted this with Chakra), but V8 is so deeply integrated into Node's architecture it's not practical. V8 is the heart — the rest of Node is built around it.

**Q: What is JIT compilation?**
> Just-In-Time compilation is V8's strategy of combining interpretation and compilation:
> - **Ignition** generates bytecode immediately (fast startup)
> - **TurboFan** compiles hot code (frequently called functions) to optimized machine code
> This takes the best of both worlds: fast start (interpretation) + fast execution (compilation).

**Q: What are hidden classes and how do they improve performance?**
> JavaScript objects are dynamic — properties can be added at any time. Normally, finding a property on an object would require a dictionary lookup. V8 solves this by creating **hidden classes** — internal structures that give each property a fixed memory offset. Property access becomes O(1) instead of O(n) dictionary search, mimicking how static languages like C++ work.
>
> **You break hidden classes by:**
> ```javascript
> // BAD — different property order = different hidden classes
> const a = {}; a.x = 1; a.y = 2;
> const b = {}; b.y = 2; b.x = 1; // different hidden class than a
> ```

**Q: What is deoptimization?**
> TurboFan makes type assumptions when optimizing. If those assumptions are violated, V8 **deoptimizes** — discards the machine code and falls back to bytecode.
> ```javascript
> function add(a, b) { return a + b; }
> add(1, 2);      // V8 optimizes assuming numbers
> add("x", "y"); // type changed → deoptimize → recompile from scratch
> ```
> Cost: recompilation time + performance regression until re-optimized.

---

## Topic 3 — libuv: Thread Pool, Async I/O, Role Alongside V8

> **Quick Recap:**
> libuv is a C library that gives Node cross-platform async I/O. V8 = JS execution. libuv = everything else (file system, network, timers, thread pool). A Node.js process has ~7 threads: 1 main + 4 libuv thread pool + V8 internals (GC, profiler).

### Aim
Understand what libuv does, how its thread pool works, and how it interacts with V8 and the event loop.

### Why
"Node is single-threaded" is a myth interviewers love to probe. Knowing libuv shows you understand the real architecture.

### How
```
Node.js Process
├── Main Thread (V8 + Event Loop)
├── libuv Thread Pool (4 threads default)
│     handles: fs, crypto, dns.lookup, zlib
└── OS Async Primitives (no threads needed)
      handles: TCP/UDP, IPC, pipes
      uses: epoll (Linux), kqueue (Mac), IOCP (Windows)
```

### Key Interview Points + Ideal Answers

**Q: What is libuv and why does Node need it?**
> libuv is a cross-platform asynchronous I/O library written in C. V8 has zero knowledge of file systems, networking, or OS calls — it only executes JavaScript. libuv fills that gap: it abstracts OS-level async operations so Node works identically on Linux, Windows, and macOS.

**Q: Walk through fs.readFile() from call to callback:**
> 1. `fs.readFile()` is called → lands on call stack
> 2. Main thread sees it can't execute this alone → hands to libuv
> 3. libuv checks thread pool — if a thread is free, the file read starts immediately
> 4. Main thread continues the event loop — not blocked
> 5. Thread pool reads file from disk
> 6. When done → libuv pushes a callback into the **event queue** (POLL phase)
> 7. Event loop picks it up on its next iteration → your callback executes

**Q: How many threads does Node actually create?**
> ~7+ total:
> - 1 main thread (event loop)
> - 4 libuv thread pool (default, tunable via `UV_THREADPOOL_SIZE`)
> - 1-2 V8 internals (GC, profiler/optimizer)

**Q: What happens when 10 fs.readFile() calls hit the thread pool at once?**
> 4 execute immediately (one per thread). The remaining 6 queue up. As each thread finishes, it pulls the next task from the queue. This means your "async" code isn't actually running concurrently — it's waiting in line if the pool is exhausted. This is **thread pool exhaustion**.

**Q: How does libuv handle network I/O — does it use the thread pool?**
> No. Network I/O uses OS-level async primitives — `epoll` on Linux, `kqueue` on macOS, `IOCP` on Windows. These let the OS watch thousands of sockets simultaneously without needing a thread per connection. That's why Node can handle 10K concurrent HTTP connections with no thread pool involvement at all.

**Full task routing table:**
| Goes to Thread Pool | Goes to OS Async (no thread) |
|---|---|
| `fs.*` file operations | TCP/UDP networking |
| `crypto` (bcrypt, pbkdf2) | HTTP requests |
| `dns.lookup` | Pipes, IPC |
| `zlib` compression | Timers |

---

## Topic 4 — Event Loop: All 6 Phases in Order

> **Quick Recap:**
> Sync code runs first (before event loop). Then microtasks drain (nextTick → Promises). Then the 6 phases run in order. Microtasks drain between EVERY phase. Poll phase is where most of your app code lands — it can block/wait if nothing else is pending.
>
> **Memory trick: T**im **P**atiently **I**n **P**oll **C**heck **C**lose → **TPIPCC**

### Aim
Know all 6 phases in order and what each processes.

### Why
One of the most common deep-dive Node.js interview questions. Incorrect event loop knowledge is an immediate red flag.

### How
```
Node starts
    ↓
Execute ALL sync code (call stack)
    ↓
Drain microtasks: nextTick queue → Promise queue
    ↓
┌─────────────────────────────────────────┐
│  1. TIMERS          → setTimeout/setInterval (if delay expired)    │
│  2. PENDING CALLBACKS → deferred I/O errors from last tick         │
│  3. IDLE/PREPARE    → internal Node use only                       │
│  4. POLL            → execute I/O callbacks (fs, network)          │
│                       if empty + setImmediate scheduled → CHECK    │
│                       if empty + nothing → WAIT here for I/O       │
│  5. CHECK           → setImmediate() callbacks                     │
│  6. CLOSE CALLBACKS → socket.on('close'), cleanup                  │
└─────────────────────────────────────────┘
    ↓
Drain microtasks between EVERY phase
    ↓
Loop repeats until nothing left → process exits
```

### Key Interview Points + Ideal Answers

**Q: What is the event loop and what problem does it solve?**
> The event loop is a continuous loop running on the main thread that checks queues of pending callbacks and executes them one by one — giving the illusion of concurrency on a single thread. Without it, JS would need to block and wait for every async operation, serving one request at a time.

**Q: Walk through all 6 phases:**
> 1. **Timers** — runs `setTimeout` and `setInterval` callbacks whose delay has expired
> 2. **Pending Callbacks** — I/O errors deferred from the previous tick (e.g. TCP errors on some OSes)
> 3. **Idle/Prepare** — internal Node use only, you never interact with this
> 4. **Poll** — executes I/O callbacks (file reads, DB responses, HTTP). If queue empty and `setImmediate` is scheduled → moves to CHECK. If nothing → waits here for new I/O
> 5. **Check** — runs `setImmediate()` callbacks
> 6. **Close Callbacks** — runs cleanup handlers like `socket.on('close')`

**Q: Why is the Poll phase the most important?**
> Almost all application code lands here — every `fs.readFile` callback, DB response, HTTP handler. Its waiting behavior is what makes Node efficient: instead of spinning uselessly, it sleeps until the OS signals new I/O is ready.

**Q: Where do microtasks fit in the 6 phases?**
> Microtasks are NOT part of the 6 phases. They run between every phase transition — completely draining before the next phase starts. Priority: `process.nextTick` first (all of them), then `Promise.then` (all of them).

**Q: What is the Reactor Pattern?**
> The architectural pattern Node is built on:
> 1. **Event Demultiplexer** (libuv) — watches multiple I/O sources simultaneously using OS primitives
> 2. **Event Queue** — completed events pile up as callbacks
> 3. **Event Loop** — picks events from queue one by one
> 4. **Handlers** — your callbacks execute
>
> "Don't call us, we'll call you" — you register handlers, the system calls them when events are ready.

---

## Topic 5 — Microtasks vs Macrotasks

> **Quick Recap:**
> Microtasks cut the line — they run between every event loop phase, fully draining before the loop advances. nextTick > Promise > setImmediate > setTimeout. Recursive nextTick = event loop starvation (I/O freezes). Recursive setImmediate = safe (yields per iteration).

### Aim
Know the execution order of all async scheduling mechanisms.

### Why
Output order questions are extremely common in Node.js interviews. Getting this wrong signals shallow understanding.

### How
```
Priority ladder (highest → lowest):
1. Sync code
2. process.nextTick (all of them — fully drain)
3. Promise.then/catch (all of them — fully drain)
4. setImmediate (CHECK phase)
5. setTimeout/setInterval (TIMERS phase)
```

### Key Interview Points + Ideal Answers

**Q: What is the execution order of nextTick, Promise, setImmediate, setTimeout?**
```javascript
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
console.log('sync');

// Output:
// sync       ← runs first, sync code
// nextTick   ← microtask, highest priority
// promise    ← microtask, second
// timeout    ← TIMERS phase (non-deterministic vs setImmediate from main script)
// immediate  ← CHECK phase
```

**Q: setImmediate vs setTimeout(fn, 0) — what's the order?**
> **From main script — non-deterministic** (race condition at OS level for timer registration).
> **Inside I/O callback — always setImmediate first:**
> ```javascript
> fs.readFile('f', () => {
>     setTimeout(() => console.log('timeout'), 0);
>     setImmediate(() => console.log('immediate'));
>     // immediate ALWAYS first — we're in POLL, next is CHECK
> });
> ```

**Q: Will recursive process.nextTick cause a memory issue?**
> Not a memory issue — a **starvation** issue. Node fully drains the nextTick queue before advancing the event loop. If nextTick keeps re-adding to itself, the loop never moves — I/O freezes, setImmediate never runs, server appears frozen. Eventually call stack can overflow too.
> ```javascript
> // DANGEROUS
> process.nextTick(function flood() { process.nextTick(flood); });
>
> // SAFE — setImmediate yields per iteration
> setImmediate(function safe() { setImmediate(safe); });
> ```

**Comparison table:**
| | process.nextTick | Promise.then | setImmediate | setTimeout(0) |
|---|---|---|---|---|
| Type | Microtask* | Microtask | Macrotask | Macrotask |
| Phase | Between phases | Between phases | CHECK | TIMERS |
| Recursive safety | ❌ Starves loop | ❌ Starves loop | ✅ Safe | ✅ Safe |

---

## Topic 6 — Event Loop Blocking

> **Quick Recap:**
> Two types of blocking: **I/O blocking** (thread waits for OS/disk/network — libuv solves this) and **CPU blocking** (thread computes non-stop — NO built-in solution, needs Worker Threads). One blocked request = all clients frozen.

### Aim
Understand what blocks the event loop and the performance impact.

### Why
"What would you do if your Node server is slow?" — this topic is behind almost every performance question.

### How
```
Blocking I/O → hand to libuv → main thread free ✅
Blocking CPU → main thread IS the worker → stuck ❌ → use Worker Threads
```

### Key Interview Points + Ideal Answers

**Q: What causes event loop blocking?**
> Two categories:
> - **Blocking I/O**: `fs.readFileSync()`, `execSync()`, `crypto.*Sync()` — thread waits for OS
> - **Blocking CPU**: heavy computation loops, `JSON.parse(hugeData)`, regex on large strings, image/video processing — thread computes non-stop with no yield

**Q: What is the performance impact?**
```
One CPU-blocking request (5 seconds) freezes ALL clients:

req1 → [=====CPU 5s=====] → done
req2 → [waiting 5s......] → handled
req3 → [waiting 5s......] → handled
req4 → [waiting 5s......] → handled
```

**Q: How do you avoid blocking?**
| Blocker | Fix |
|---|---|
| `fs.readFileSync()` | `fs.promises.readFile()` |
| Heavy CPU loop | Worker Threads |
| `execSync()` | `exec()` / `spawn()` |
| `JSON.parse(huge)` | Streaming JSON parser |
| Blocking regex | Rewrite / Worker Threads |
| Infinite nextTick | Use setImmediate |

**Chunking pattern — break CPU work to yield:**
```javascript
// BAD — blocks for entire duration
items.forEach(heavyProcess);

// GOOD — yields to event loop between chunks
function processChunk(items, index) {
    items.slice(index, index + 1000).forEach(heavyProcess);
    if (index + 1000 < items.length) {
        setImmediate(() => processChunk(items, index + 1000));
    }
}
processChunk(items, 0);
```

**Q: When should you NOT use Node.js?**
> Avoid for: video encoding, image processing, ML inference, scientific computing, complex cryptographic operations at scale.
> Rule of thumb: if your operation is **waiting** for something → Node handles it perfectly. If it's **computing** something heavy → wrong tool or use Worker Threads.


# BLOCK 2 — Async Patterns

---

## Topic 7 — Callbacks: Error-First Pattern, Callback Hell

> **Quick Recap:**
> Callbacks = original async mechanism in Node. Rule: error is ALWAYS first argument (null if success). Always `return callback(...)` — the `return` exits the parent function, preventing double-calls. Callback hell = nested callbacks = pyramid of doom. Solution path: named functions → Promises → async/await.

### Aim
Understand the callback pattern, error-first convention, and its limitations.

### Why
All Node.js core modules use callbacks internally. EventEmitter, streams, and legacy code all rely on them. util.promisify (Topic 10) wraps them. You must know the base before understanding the evolution.

### How
```javascript
// Error-first callback contract:
callback(null, data);           // success: err = null
callback(new Error('failed'));  // failure: err = Error object
```

### Key Interview Points + Ideal Answers

**Q: What is the error-first callback pattern?**
> Every Node.js async function passes the error as the FIRST argument to the callback — `null` on success, an `Error` object on failure. This forces developers to handle errors before accessing the result.
> ```javascript
> fs.readFile('file.txt', 'utf8', function(err, data) {
>     if (err) {
>         console.error(err.message);
>         return; // critical: stop here
>     }
>     console.log(data); // only runs if no error
> });
> ```

**Q: What is the difference between returning a callback and just calling it?**
> `return callback(err)` does two things: calls the callback AND exits the parent function immediately. Without `return`, code falls through and the callback fires twice — causing "Cannot set headers after they are sent" and other catastrophic bugs.
> ```javascript
> // WRONG — callback fires twice
> function findUser(id, cb) {
>     if (!id) {
>         cb(new Error('No ID')); // fires
>     }                           // no return — falls through
>     db.find(id, cb);           // fires again 💥
> }
>
> // CORRECT
> function findUser(id, cb) {
>     if (!id) return cb(new Error('No ID')); // return exits function
>     db.find(id, cb);
> }
> ```

**Q: What is callback hell?**
> When async operations depend on each other, callbacks nest inside callbacks — creating an unreadable pyramid. Problems: hard to read, error must be handled at every level, variables bleed into each other's scope, debugging is painful.
> ```javascript
> // Pyramid of doom
> getUser(id, (err, user) => {
>     getPosts(user.id, (err, posts) => {
>         getComments(posts[0].id, (err, comments) => {
>             // 3 levels deep already...
>         });
>     });
> });
> ```

**Q: What is the first argument passed to a callback?**
> Always the error — either an `Error` object if something went wrong, or `null` if everything succeeded. This is a Node.js convention followed by all core modules and well-written packages.

---

## Topic 8 — Promises: Chaining, Promise.all, Promise.race

> **Quick Recap:**
> Promise = object representing a future value. 3 states: pending → fulfilled OR rejected (immutable once settled). Chains are flat — no nesting. ONE `.catch()` handles all errors above it. `Promise.all` = parallel + fail-fast. `Promise.allSettled` = parallel + never fails. `Promise.race` = first settlement wins. `Promise.any` = first success wins.

### Aim
Understand Promise states, chaining, and static methods for parallel operations.

### Why
Promises are the foundation of async/await. Understanding them deeply means you understand why async/await works the way it does.

### How
```
new Promise((resolve, reject) => { ... })
         ↓
    PENDING
    /      \
resolve    reject
   ↓          ↓
FULFILLED  REJECTED
(immutable once settled — can't go back or switch)
```

### Key Interview Points + Ideal Answers

**Q: What are Promises and what problem do they solve?**
> A Promise is an object representing a value that isn't available yet but will be in the future. It solves callback hell by replacing nested callbacks with flat chains — same logic, completely readable.
> ```javascript
> // Callback hell               // Promise chain
> getUser(id, (err, user) => {  getUser(id)
>   getPosts(user.id, ...        .then(user => getPosts(user.id))
>     getComments(...            .then(posts => getComments(posts[0].id))
>     )                          .catch(err => console.error(err));
>   });
> });
> ```

**Q: What are the three states of a Promise?**
> - **Pending**: initial state, operation not yet completed
> - **Fulfilled**: operation completed successfully, `.then()` handlers run
> - **Rejected**: operation failed, `.catch()` handlers run
>
> Once settled (fulfilled or rejected), state is **immutable** — calling `resolve` or `reject` again is silently ignored.

**Q: Promise.all() vs Promise.race() vs Promise.allSettled() vs Promise.any()?**

| Method | Resolves when | Rejects when | Use case |
|---|---|---|---|
| `Promise.all` | ALL succeed | ANY fails | Parallel independent calls |
| `Promise.allSettled` | ALL settle | Never | Get all results, ignore failures |
| `Promise.race` | FIRST settles | FIRST fails | Timeout pattern |
| `Promise.any` | FIRST succeeds | ALL fail | Fastest server wins |

```javascript
// Promise.all — parallel, fail-fast
const [user, posts] = await Promise.all([getUser(), getPosts()]);
// Total time = longest single operation (not sum)

// Promise.race — timeout pattern
function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timed out')), ms)
    );
    return Promise.race([promise, timeout]);
}
```

**Q: How do you handle errors in a promise chain?**
> `.catch()` catches all errors thrown anywhere above it in the chain. Always end chains with `.catch()` — unhandled rejections crash Node in v15+.
> ```javascript
> getUser(id)
>     .then(user => getPosts(user.id))
>     .then(posts => render(posts))
>     .catch(err => console.error(err)) // catches all above ✅
>     .finally(() => cleanup()); // always runs
> ```

---

## Topic 9 — Async/Await: try/catch, Rewriting Promises

> **Quick Recap:**
> async/await is syntactic sugar over Promises — it doesn't replace them, it makes them readable. `async` always returns a Promise. `await` pauses the current function only (not the event loop — the main thread is still free). Sequential `await` on independent operations = silent performance bug.

### Aim
Write clean async code with async/await and understand its performance implications.

### Why
async/await is the standard today. The sequential vs parallel trap is the most common performance mistake in Node.js codebases.

### How
```javascript
// async function always returns a Promise
async function getData() { return 42; }
getData().then(console.log); // 42

// await pauses current function, event loop stays free
async function main() {
    const data = await fetchData(); // pauses HERE, not the whole app
    console.log(data);
}
```

### Key Interview Points + Ideal Answers

**Q: How does async/await improve readability over promise chaining?**
> Two concrete problems it solves:
> 1. **Shared scope** — all variables accessible in the same block (no closure gymnastics)
> 2. **Conditional logic** — natural if/else between async steps
> ```javascript
> // Promise chain — variable scope problem
> getUser(id)
>     .then(user => getPosts(user.id))
>     .then(posts => ({ user, posts })) // 'user' not in scope here 😱
>
> // async/await — all in same scope
> async function getProfile(id) {
>     const user  = await getUser(id);
>     const posts = await getPosts(user.id);
>     return { user, posts }; // both available ✅
> }
> ```

**Q: What is the biggest performance trap with async/await?**
> Sequential await on independent operations — each waits for the previous even though they could run in parallel:
> ```javascript
> // SLOW — sequential (450ms total)
> const user    = await getUser();    // 100ms
> const posts   = await getPosts();   // 200ms
> const friends = await getFriends(); // 150ms
>
> // FAST — parallel (200ms total)
> const [user, posts, friends] = await Promise.all([
>     getUser(), getPosts(), getFriends()
> ]);
> ```
> Rule: if operations don't depend on each other → run in parallel with `Promise.all`.

**Q: Rewrite a promise chain using async/await with try/catch:**
> ```javascript
> // Promise chain
> fetchUser(id)
>     .then(user => fetchPosts(user.id))
>     .then(posts => render(posts))
>     .catch(err => console.error(err));
>
> // Async/await equivalent
> async function loadProfile(id) {
>     try {
>         const user  = await fetchUser(id);
>         const posts = await fetchPosts(user.id);
>         return render(posts);
>     } catch (err) {
>         console.error(err);
>     }
> }
> ```

**Q: How do you use async/await without try/catch?**
> ```javascript
> // Pattern 1 — .catch() on await
> const user = await fetchUser(id).catch(err => null);
> if (!user) return res.status(404).send('Not found');
>
> // Pattern 2 — Go-style wrapper utility
> function handle(promise) {
>     return promise.then(data => [null, data]).catch(err => [err, null]);
> }
> const [err, user] = await handle(fetchUser(id));
> if (err) return res.status(500).send('Error');
> ```

---

## Topic 10 — Converting Callbacks to Promises: util.promisify

> **Quick Recap:**
> `util.promisify` wraps any error-first callback function into a Promise-returning function. One-line conversion. Only works if the function follows the error-first convention. Node also ships `fs.promises` natively — no promisify needed for fs anymore.

### Aim
Convert legacy callback-based APIs to work with async/await.

### Why
Node's core modules are callback-based historically. You'll encounter this when working with older codebases or packages.

### How
```javascript
// Manual Promise wrapper pattern
new Promise((resolve, reject) => {
    callbackFn(args, (err, result) => {
        if (err) return reject(err);
        resolve(result);
    });
});

// util.promisify does this automatically
const asyncFn = promisify(callbackFn);
const result = await asyncFn(args);
```

### Key Interview Points + Ideal Answers

**Q: How do you convert a callback API to a Promise manually?**
> ```javascript
> function readFilePromise(path, encoding) {
>     return new Promise((resolve, reject) => {
>         fs.readFile(path, encoding, (err, data) => {
>             if (err) return reject(err);
>             resolve(data);
>         });
>     });
> }
> const data = await readFilePromise('file.txt', 'utf8');
> ```

**Q: What is util.promisify and when would you use it?**
> `util.promisify` automatically wraps any error-first callback function into a Promise-returning function. Use it for old Node.js core APIs or third-party packages that haven't adopted Promises.
> ```javascript
> const { promisify } = require('util');
> const readFile = promisify(fs.readFile);
> const data = await readFile('file.txt', 'utf8'); // now promise-based ✅
> ```
> Note: for `fs` operations today, use `fs.promises` or `require('fs/promises')` directly — no promisify needed.

**Q: Edge case — functions with multiple callback success arguments:**
> `util.promisify` only captures the first success argument. For functions like `dns.lookup(host, cb)` which calls back with `(err, address, family)`, only `address` is captured. Use `dns.promises.lookup()` instead for the full result.

---

## Topic 11 — Error Handling: Sync vs Async, uncaughtException, Domains

> **Quick Recap:**
> 4 error patterns: return value, throw/try-catch, error-first callback, EventEmitter 'error' event. try/catch does NOT catch errors inside callbacks — only works with sync code or async/await. `uncaughtException` = last resort, MUST exit after. Domains = deprecated, replaced by async/await + AsyncLocalStorage.

### Aim
Handle errors correctly in both sync and async contexts, and understand process-level error handling.

### Why
Poor error handling is the #1 cause of production crashes. Interviewers probe this heavily for senior roles.

### How
```
Layer 1: Individual function   → try/catch, .catch(), error-first callback
Layer 2: Express middleware    → error handling middleware (4 args)
Layer 3: Process level         → unhandledRejection, uncaughtException
Layer 4: Infrastructure        → PM2 restart, monitoring (Sentry)
```

### Key Interview Points + Ideal Answers

**Q: What are the four error handling patterns in Node.js?**
> 1. **Return value** — return `null`/`false` to signal failure (sync, simple)
> 2. **throw/try-catch** — for sync code and async/await
> 3. **Error-first callback** — `callback(err, result)` for async operations
> 4. **EventEmitter .on('error')** — for streams, servers, long-lived objects
>    ```javascript
>    server.on('error', (err) => console.error(err)); // must listen or process crashes
>    ```

**Q: Why doesn't try/catch work inside callbacks?**
> ```javascript
> // Does NOT work — error thrown in callback is async, not in try's scope
> try {
>     fs.readFile('file.txt', (err, data) => {
>         throw new Error('oops'); // NOT caught 😱
>     });
> } catch (e) { /* never runs */ }
>
> // Works — async/await keeps error in same execution context
> async function read() {
>     try {
>         const data = await fs.promises.readFile('file.txt');
>     } catch (err) { /* caught ✅ */ }
> }
> ```

**Q: What is the difference between operational errors and programmer errors?**
> - **Operational errors**: expected runtime failures — file not found, DB connection failed, invalid user input. Handle gracefully, return appropriate response.
> - **Programmer errors**: bugs that should never happen — `undefined.property`, wrong argument type, logic errors. Let them crash — fix the code, don't hide them.

**Q: When should you use uncaughtException and what must you do after?**
> `uncaughtException` is a last resort — it catches any error that wasn't handled anywhere else. After catching it, you **MUST exit the process** — Node's state is undefined after an uncaught exception, memory may be corrupted, connections may be broken.
> ```javascript
> process.on('uncaughtException', (err) => {
>     logger.fatal(err);          // log everything
>     server.close(() => {        // stop accepting requests
>         process.exit(1);        // exit — let PM2/Docker restart
>     });
> });
>
> process.on('unhandledRejection', (reason) => {
>     console.error('Unhandled Rejection:', reason);
>     process.exit(1); // Node 15+ does this automatically
> });
> ```

**Q: What are Domains and why are they deprecated?**
> Domains were Node's attempt to group async operations for shared error handling. They were deprecated because: performance overhead on every async op, complex to reason about, didn't handle all edge cases. **Modern replacement**: `async/await` + `try/catch` for logic, `AsyncLocalStorage` for request-scoped context.



---


# BLOCK 3 — Core Modules

---

## Topic 12 — EventEmitter: .on, .emit, .once, Memory Leak + Stack Overflow Trap

> **Quick Recap:**
> EventEmitter = Node's pub/sub system. One-to-many: one emit → multiple listeners fire. `.on` = listen forever. `.once` = listen once, auto-removes. Default max 10 listeners — exceeded = memory leak warning. `.emit()` is SYNCHRONOUS — listeners run inline on call stack. Synchronous emit cycle = stack overflow. setImmediate breaks the cycle safely. nextTick breaks cycle but starves the event loop.

### Aim
Understand EventEmitter's API, when to use it over callbacks, and its dangerous edge cases.

### Why
EventEmitter is the foundation of streams, HTTP servers, and the entire Node.js event system. Memory leak and stack overflow traps are classic senior interview questions.

### How
```
Callback: one emitter → one handler  (tight coupling, one-time)
EventEmitter: one emitter → many handlers (loose coupling, repeated)
```

### Key Interview Points + Ideal Answers

**Q: What is EventEmitter?**
> Node's built-in pub/sub system. Objects emit named events, listeners react to them. Everything in Node that "fires events" is built on it — HTTP servers, streams, processes, sockets.
> ```javascript
> const { EventEmitter } = require('events');
> const ee = new EventEmitter();
>
> ee.on('data', (chunk) => console.log(chunk));
> ee.emit('data', 'hello'); // → hello
> ```
> In real apps, extend it:
> ```javascript
> class Database extends EventEmitter {
>     connect() {
>         // ... connection logic
>         this.emit('connected', { host: 'localhost' });
>     }
> }
> ```

**Q: Main methods — .on, .emit, .once, .off?**
> ```javascript
> ee.on('event', handler);         // listen forever
> ee.once('event', handler);       // listen once, auto-removes after first fire
> ee.emit('event', data);          // fire event with optional data
> ee.off('event', handler);        // remove specific listener
> ee.removeAllListeners('event');  // remove all for this event
> ee.listenerCount('event');       // how many listeners registered
> ```

**Q: Events vs Callbacks — the real difference?**
> - **Callback**: one-to-one, tight coupling, single occurrence. "Call me when done."
> - **EventEmitter**: one-to-many, loose coupling, repeated occurrences. "Announce to whoever cares."
>
> Use callbacks when something happens **once** and one recipient needs the result.
> Use EventEmitter when something happens **repeatedly** or **multiple parts** of the app need to react.

**Q: What is the memory leak trap?**
> Every `.on()` stores a function reference in memory. Exceeding 10 listeners triggers a warning. The real leak happens when listeners are added inside request handlers without being removed:
> ```javascript
> // LEAK — new listener per request, never removed
> app.get('/data', (req, res) => {
>     emitter.on('update', (data) => res.json(data)); // adds every request 😱
> });
>
> // FIX — auto-removes after one fire
> app.get('/data', (req, res) => {
>     emitter.once('update', (data) => res.json(data)); // ✅
> });
> ```

**Q: What is the stack overflow trap with synchronous emit cycles?**
> `.emit()` is synchronous — it calls listeners immediately on the current call stack. An emit cycle (ping emits pong, pong emits ping) grows the call stack infinitely → `RangeError: Maximum call stack size exceeded`.
> ```javascript
> // DANGEROUS — synchronous cycle → stack overflow
> ee.on('ping', () => ee.emit('pong'));
> ee.on('pong', () => ee.emit('ping'));
> ee.emit('ping'); // 💥
>
> // FIX — setImmediate defers, breaks sync chain, stack clears
> ee.on('ping', () => setImmediate(() => ee.emit('pong')));
> ee.on('pong', () => setImmediate(() => ee.emit('ping')));
>
> // WARNING — nextTick breaks stack overflow but starves event loop
> ee.on('ping', () => process.nextTick(() => ee.emit('pong'))); // ❌ starvation
> ```

---

## Topic 13 — Streams: 4 Types, Piping, Events, Backpressure

> **Quick Recap:**
> Streams = process data chunk by chunk instead of loading everything into memory. 4 types: Readable (produces), Writable (consumes), Duplex (both), Transform (duplex that modifies). Pipe connects them and handles backpressure automatically. Backpressure = writable buffer full, readable must pause.

### Aim
Understand why streams exist, how to use them, and what backpressure is.

### Why
Streaming is core to Node's performance story — file uploads, video delivery, HTTP request bodies are all streams. Backpressure is a common senior interview question.

### How
```
Without streams: readFile → entire file in RAM → send
With streams:    read 64KB → send 64KB → read next 64KB → ...
RAM usage = constant regardless of file size
```

### Key Interview Points + Ideal Answers

**Q: What is a stream and when is it useful?**
> A stream handles data piece by piece instead of loading everything into memory at once. Critical for large files, video/audio streaming, HTTP bodies, real-time data processing.
> ```javascript
> // Without streams — 2GB video = 2GB in RAM 😱
> fs.readFile('video.mp4', (err, data) => res.send(data));
>
> // With streams — 64KB chunks, constant RAM usage ✅
> fs.createReadStream('video.mp4').pipe(res);
> ```

**Q: What are the four types of streams?**
> - **Readable**: produces data — `fs.createReadStream()`, `http.IncomingMessage`
> - **Writable**: consumes data — `fs.createWriteStream()`, `http.ServerResponse`
> - **Duplex**: both readable and writable — `net.Socket` (TCP — can send AND receive)
> - **Transform**: duplex that modifies data — `zlib.createGzip()` (reads raw, writes compressed), `crypto.createCipher()`

**Q: What events do streams fire?**
> ```javascript
> // Readable
> readable.on('data',  chunk => {});  // chunk of data arrived
> readable.on('end',   ()    => {});  // no more data
> readable.on('error', err   => {});  // error occurred
>
> // Writable
> writable.on('finish', ()  => {});   // all data flushed
> writable.on('drain',  ()  => {});   // buffer emptied, can write more
> writable.on('error',  err => {});   // error occurred
> ```

**Q: What is piping and what does it do internally?**
> `.pipe()` connects a readable to a writable and automatically manages flow + backpressure. Internally:
> ```javascript
> // What pipe does under the hood:
> readable.on('data', (chunk) => {
>     const canContinue = writable.write(chunk);
>     if (!canContinue) {
>         readable.pause();                    // buffer full — stop reading
>         writable.once('drain', () => readable.resume()); // resume when drained
>     }
> });
> readable.on('end', () => writable.end());
>
> // Chain transforms:
> fs.createReadStream('input.txt')
>     .pipe(zlib.createGzip())
>     .pipe(crypto.createCipher(...))
>     .pipe(fs.createWriteStream('output.gz.enc'));
> ```

**Q: What is backpressure?**
> When the readable produces data faster than the writable can consume it, the writable's internal buffer fills up. Without backpressure handling, the buffer grows until the process runs out of memory. With backpressure: readable pauses when writable buffer is full, resumes when drained. `pipe()` handles this automatically.

---

## Topic 14 — Buffer: What It Is, Why Not Strings, Heap vs Stack

> **Quick Recap:**
> Buffer = fixed-size chunk of raw binary data. Lives OUTSIDE V8 heap (in C++ memory). Binary strings corrupt data during encoding/decoding roundtrips. Buffer stores bytes exactly as-is. `Buffer.alloc()` = safe (zero-filled). `Buffer.allocUnsafe()` = fast (raw memory, may have old data — never send to clients without filling).

### Aim
Understand what Buffer is, why it exists, and its memory characteristics.

### Why
Any time you work with files, network, crypto, or binary data you're working with Buffers. Memory location question is a common deep-dive.

### How
```
V8 Heap:   Buffer object (just a reference, tiny)
C++ Memory: Buffer data (actual raw bytes, can be gigabytes)
            → outside GC pressure
            → zero-copy to OS syscalls
```

### Key Interview Points + Ideal Answers

**Q: What is Buffer?**
> Buffer is Node's class for handling raw binary data — bytes that haven't been interpreted as any encoding. It appears whenever you work with files without specifying encoding, network packets, images, or any binary protocol.
> ```javascript
> const buf = Buffer.from('Hello');
> console.log(buf);             // <Buffer 48 65 6c 6c 6f>
> console.log(buf.toString());  // 'Hello'
> console.log(buf.length);      // 5 (bytes, not characters)
>
> // File without encoding = Buffer
> fs.readFile('image.png', (err, data) => {
>     console.log(data instanceof Buffer); // true
> });
>
> // File with encoding = string
> fs.readFile('file.txt', 'utf8', (err, data) => {
>     console.log(typeof data); // 'string'
> });
> ```

**Q: Why use Buffer instead of binary strings?**
> 1. **Correctness**: some byte sequences are invalid UTF-8/Latin-1 — converting to string corrupts them. Buffer stores bytes exactly as-is, no interpretation, no corruption.
> 2. **Performance**: V8 strings are UTF-16 — 2 bytes per character. Buffer is 1 byte per byte — half the memory. No encoding/decoding overhead.

**Q: Where does Buffer live in memory?**
> The Buffer **object** (the reference) lives on the V8 heap — tiny. The actual **data bytes** live OUTSIDE the V8 heap, in C++ memory managed by Node. This means:
> - Large buffers don't trigger V8 GC pressure
> - Data can be passed to OS syscalls with zero-copy (no marshalling overhead)
> - Multiple Buffers can share the same underlying memory via `ArrayBuffer`

**Q: Buffer.alloc vs Buffer.allocUnsafe?**
> ```javascript
> Buffer.alloc(10);       // fills with zeros — SAFE, slightly slower
> Buffer.allocUnsafe(10); // raw memory — FAST but may contain old process data
>                         // never send allocUnsafe to clients without filling first
> ```

---

## Topic 15 — Module System: CommonJS vs ESM, exports vs module.exports

> **Quick Recap:**
> CJS = `require/module.exports`, synchronous, dynamic (can require anywhere). ESM = `import/export`, asynchronous, static (hoisted, enables tree-shaking), live bindings. exports = alias to module.exports. Replace exports = break alias (always replace module.exports directly). require() caches results — same object returned every time.

### Aim
Understand both module systems, their differences, and the exports trap.

### Why
Module system questions appear in almost every Node.js interview. The exports vs module.exports trap catches even experienced developers.

### How
```javascript
// Node wraps every module in this function:
(function(exports, require, module, __filename, __dirname) {
    // your module code
    // exports === module.exports at start
    // module.exports is what require() actually returns
});
```

### Key Interview Points + Ideal Answers

**Q: CommonJS vs ESM — key differences?**
| | CommonJS | ESM |
|---|---|---|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| Timing | Runtime resolution | Compile-time (static) |
| Bindings | Copied values | Live bindings |
| Tree-shaking | ❌ | ✅ |
| Default in Node | ✅ `.js` files | Needs `.mjs` or `"type":"module"` |

**Live bindings — the key ESM difference:**
```javascript
// counter.mjs (ESM)
export let count = 0;
export function increment() { count++; }

// main.mjs
import { count, increment } from './counter.mjs';
increment();
console.log(count); // 1 ✅ — live, reflects actual value

// CommonJS equivalent
const { count, increment } = require('./counter');
increment();
console.log(count); // 0 😱 — copied value, not live
```

**Q: What is the difference between exports and module.exports?**
> `exports` is just an alias (reference) to `module.exports`. They both point to the same object initially. `require()` returns `module.exports` — not `exports`.
>
> **The trap**: reassigning `exports` breaks the alias — `module.exports` still points to the original empty object.
> ```javascript
> // SAFE — adding properties to shared object
> exports.greet = () => 'hello';        // ✅
> module.exports.greet = () => 'hello'; // ✅ same thing
>
> // TRAP — reassigning exports breaks the reference
> exports = { greet: () => 'hello' }; // ❌ module.exports = {} still
>
> // CORRECT — always replace module.exports
> module.exports = { greet: () => 'hello' }; // ✅
> module.exports = function() {};             // ✅
> ```

**Q: How does require() work internally?**
> 1. **Resolve** — find the file path (checks `.js`, `/index.js`, `node_modules`)
> 2. **Load** — read file content
> 3. **Wrap** — wrap in function (provides `exports`, `require`, `module`, `__filename`, `__dirname`)
> 4. **Execute** — run the wrapped function
> 5. **Cache** — store in `require.cache` — subsequent calls return cached result instantly
>
> Clearing cache (force reload):
> ```javascript
> delete require.cache[require.resolve('./config')];
> const freshConfig = require('./config'); // re-executes
> ```

**Q: What does require.resolve() do?**
> Returns the absolute file path without loading or executing the module. Useful for checking if a package is installed or for cache-busting.
> ```javascript
> try {
>     require.resolve('some-package');
>     console.log('installed');
> } catch (e) {
>     console.log('not found');
> }
> ```

---

## Topic 16 — fs Module: Sync vs Async Operations

> **Quick Recap:**
> Always use async fs in server code. Sync fs only acceptable at startup (loading config before server starts) or in CLI scripts. `fs.watch()` = OS-level events (fast, efficient). `fs.watchFile()` = polling (slower, more consistent on network drives).

### Aim
Use the fs module correctly without blocking the event loop.

### Why
Using `readFileSync` inside a route handler is one of the most common Node.js mistakes. Interviewers test this to see if you understand blocking vs non-blocking in practice.

### How
```javascript
// Three ways to read a file:
fs.readFileSync()              // sync — blocks main thread
fs.readFile(cb)                // async callback
fs.promises.readFile()         // async promise (preferred today)
```

### Key Interview Points + Ideal Answers

**Q: When is sync fs acceptable?**
> ✅ App startup — loading config once before server starts, no concurrent requests yet
> ✅ CLI scripts — sequential processing expected, no concurrency needed
> ❌ Inside request handlers — blocks all clients
> ❌ Inside event callbacks — blocks event loop

**Q: How does non-blocking file read work?**
> ```javascript
> fs.readFile('data.txt', 'utf8', (err, data) => {
>     // executes LATER via event loop POLL phase
>     console.log(data);
> });
> console.log('this runs first'); // main thread continues immediately
> ```
> Flow: call → libuv thread pool picks it up → main thread continues → thread reads disk → callback pushed to POLL queue → event loop executes it.

**Q: How do you monitor a file for changes?**
> ```javascript
> // fs.watch — uses OS events (inotify/FSEvents/IOCP) — fast and efficient
> const watcher = fs.watch('config.json', (eventType, filename) => {
>     console.log(`${filename} was ${eventType}d`);
>     // re-read and reload config
> });
> watcher.close(); // stop watching when done
>
> // fs.watchFile — polling (checks every N ms)
> // Slower but more consistent on network drives
> ```

---

## Topic 17 — process Object: process.env, process.argv, process.nextTick

> **Quick Recap:**
> `process` is a global object — no require needed. `process.env` = environment variables (always strings). `process.argv[0]` = node path, `[1]` = script path, `[2+]` = your args. `process.nextTick` = defer to before next event loop phase (covered deeply in Topic 5).

### Aim
Use process object for environment config, CLI args, and understanding the Node.js process lifecycle.

### Why
`process.env` is used in literally every Node.js production app. `process.argv` is essential for CLI tools. process.exit/signals matter for graceful shutdown.

### How
```javascript
// process is always available, no require needed
process.env.PORT        // environment variables
process.argv            // command line arguments
process.exit(0)         // exit cleanly
process.pid             // process ID
process.memoryUsage()   // heap stats
```

### Key Interview Points + Ideal Answers

**Q: What are Node.js global objects?**
> `process`, `console`, `Buffer`, `setTimeout/setInterval/setImmediate`, `global` (like `window` in browser). In CJS modules: `__dirname`, `__filename`, `require`, `module`, `exports`.

**Q: How do you use process.env?**
> ```javascript
> // Always strings — convert as needed
> const PORT  = parseInt(process.env.PORT) || 3000;
> const DEBUG = process.env.DEBUG === 'true';
>
> // In development — load from .env file using dotenv:
> require('dotenv').config(); // must be first line
> // .env: PORT=3000\nDB_URL=mongodb://...
>
> // In production — set via OS/Docker/CI environment
> ```

**Q: How do you process command line arguments?**
> ```javascript
> // node app.js --port 3000 --env production
> process.argv
> // ['/usr/bin/node', '/path/app.js', '--port', '3000', '--env', 'production']
> // index 0 = node, index 1 = script, index 2+ = your args
>
> const args = process.argv.slice(2);
> const getArg = (flag) => {
>     const i = args.indexOf(flag);
>     return i !== -1 ? args[i + 1] : null;
> };
> const port = getArg('--port'); // '3000'
> ```

**Q: What is process.nextTick used for in practice?**
> Deferring a callback to run AFTER current synchronous code but BEFORE the next event loop phase. Classic use — EventEmitter that emits in constructor:
> ```javascript
> class MyEmitter extends EventEmitter {
>     constructor() {
>         super();
>         // without nextTick — emits before listener can be attached
>         process.nextTick(() => this.emit('ready')); // deferred ✅
>     }
> }
> const e = new MyEmitter();
> e.on('ready', () => console.log('ready!')); // attached before emit
> ```

**Other useful process methods:**
```javascript
process.exit(0);          // exit successfully
process.exit(1);          // exit with error
process.platform          // 'linux', 'darwin', 'win32'
process.uptime()          // seconds since process started
process.hrtime()          // high-resolution timer for benchmarking
process.memoryUsage()     // { heapUsed, heapTotal, rss, external }
```

---

## Topic 18 — body-parser vs express.json()

> **Quick Recap:**
> `express.json()` IS body-parser — Express 4.16+ absorbed it. No need to install body-parser separately for JSON/urlencoded. `express.json()` parses `application/json`. `express.urlencoded()` parses HTML forms. Middleware ORDER matters — always parse before routes read req.body.

### Aim
Know how request bodies are parsed and which middleware to use.

### Why
Every POST/PUT/PATCH request needs body parsing. Forgetting the middleware or putting it in the wrong order is a common bug.

### How
```
Client sends request with body
    ↓
Body arrives as raw stream of bytes
    ↓
express.json() reads stream → parses JSON → attaches to req.body
    ↓
Your route handler reads req.body ✅
```

### Key Interview Points + Ideal Answers

**Q: What is the difference between body-parser and express.json()?**
> They are functionally identical for JSON parsing. Express 4.16+ (2017) bundled body-parser's core functionality as `express.json()` and `express.urlencoded()`. You no longer need to install body-parser separately.
>
> Only use body-parser for less common content types: `bodyParser.raw()` or `bodyParser.text()`.

**Q: Common Express middleware stack with correct ordering:**
> ```javascript
> app.use(helmet());                           // 1. security headers first
> app.use(cors({ origin: 'https://...' }));   // 2. CORS before routes
> app.use(express.json());                     // 3. parse JSON bodies
> app.use(express.urlencoded({ extended: true })); // 4. parse form bodies
> app.use(cookieParser());                     // 5. parse cookies
> app.use(morgan('dev'));                      // 6. log requests
> app.use('/api', routes);                    // 7. routes last
> app.use(errorMiddleware);                   // 8. error handler very last
>
> // extended: true → qs library (supports nested objects)
> // extended: false → querystring (flat only)
> ```

**Middleware cheatsheet:**
| Middleware | Purpose |
|---|---|
| `express.json()` | Parse `application/json` bodies |
| `express.urlencoded()` | Parse HTML form submissions |
| `cookie-parser` | Parse Cookie header → `req.cookies` |
| `morgan` | HTTP request logging |
| `helmet` | Set secure HTTP headers |
| `cors` | Handle cross-origin requests |
| `dotenv` | Load `.env` into `process.env` |

---


# BLOCK 4 — Express & API

---

## Topic 19 — Middleware: What It Is, Order Matters, next(), Types

> **Quick Recap:**
> Middleware = function that intercepts requests between arrival and response. Has access to req, res, next. Must either call `next()` OR send a response — never neither (request hangs). Order is critical — middleware registered first runs first. Error middleware = exactly 4 args (err, req, res, next).

### Aim
Understand the middleware pipeline, how next() works, and types of middleware.

### Why
Express is built entirely on middleware. Every interview involving Express will probe this.

### How
```
Request → [middleware1] → [middleware2] → [middleware3] → Response
              ↓next()          ↓next()         ↓res.send()
         (passes control)  (passes control)  (ends cycle)
```

### Key Interview Points + Ideal Answers

**Q: What are middleware functions in Express?**
> Functions that sit between request arrival and response being sent. Each has access to `req`, `res`, and `next`. They form a pipeline — request flows through each middleware in registration order.

**Q: What can middleware do?**
> 1. Execute any code
> 2. Modify `req` and `res` (attach data, set headers)
> 3. End the request-response cycle (send a response)
> 4. Call `next()` to pass control to the next middleware

**Q: What happens if next() is never called?**
> The request hangs forever — client waits until timeout. Every middleware must either call `next()` or send a response. Never do neither.

**Q: What are the types of middleware?**
> ```javascript
> // 1. Application-level — all routes
> app.use(express.json());
>
> // 2. Route-level — specific route only
> app.get('/users', authMiddleware, handler);
>
> // 3. Error-handling — 4 args (must be exactly 4)
> app.use((err, req, res, next) => res.status(500).json({ error: err.message }));
>
> // 4. Built-in
> app.use(express.json());
> app.use(express.static('public'));
>
> // 5. Third-party
> app.use(morgan('dev'));
> app.use(helmet());
> ```

---

## Topic 20 — Express Request Lifecycle

> **Quick Recap:**
> Request → global middleware stack → router matches path+method → route middleware → route handler → response. If error thrown anywhere → jumps to error middleware. Express wraps Node's raw http module, adds routing, middleware pipeline, and response helpers.

### Aim
Trace the full path of a request through an Express application.

### Why
"Walk me through what happens when a request hits your Express server" is a classic interview question.

### How
```
1. Client sends HTTP request
2. Node http server receives raw bytes
3. Express creates req + res objects
4. Global middleware runs in order (helmet, cors, json, morgan...)
5. Router matches path + HTTP method
6. Route middleware runs (auth, validation...)
7. Route handler executes (DB query, logic...)
8. res.json() / res.send() → response sent
9. If error thrown anywhere → error middleware
```

### Key Interview Points + Ideal Answers

**Q: Why use Express over the native HTTP module?**
> Native HTTP requires manual routing (if/else on `req.url`), manual body parsing (listening to `data` events), manual error handling. Express provides: declarative routing, middleware pipeline, built-in body parsing, response helpers, error handling — without boilerplate. Same power, fraction of the code.

---

## Topic 21 — Error Handling Middleware: 4-Argument Pattern

> **Quick Recap:**
> Express detects error middleware by EXACTLY 4 arguments. 3 args = regular middleware. Always register error middleware LAST, after all routes. `next(err)` skips all regular middleware and jumps to error handler. In production: show full error internally, show generic message to client.

### Aim
Handle errors gracefully across the entire Express application.

### Why
Unhandled errors crash servers. A proper error handling strategy is expected at every level above junior.

### How
```javascript
// Error is triggered by:
next(new Error('something broke')); // explicit
throw new Error('oops');            // inside async try/catch with next(err)
// Then flows to:
app.use((err, req, res, next) => { /* handle */ }); // last in stack
```

### Key Interview Points + Ideal Answers

**Q: What is the 4-argument error handling middleware?**
> ```javascript
> app.use((err, req, res, next) => {
>     console.error(err.stack); // log internally
>
>     // Operational error — safe to expose
>     if (err.isOperational) {
>         return res.status(err.status).json({ error: err.message });
>     }
>
>     // Programmer error — hide from client
>     res.status(500).json({ error: 'Internal Server Error' });
> });
> ```

**Q: How do errors reach the error middleware?**
> ```javascript
> // From sync route handler
> app.get('/users', (req, res, next) => {
>     try {
>         // ...
>     } catch (err) {
>         next(err); // ← passes to error middleware
>     }
> });
>
> // From async route (Express 5 catches throws automatically,
> // Express 4 needs explicit try/catch + next(err))
> app.get('/data', async (req, res, next) => {
>     try {
>         const data = await db.query();
>         res.json(data);
>     } catch (err) {
>         next(err);
>     }
> });
> ```

**Q: What is the correct middleware registration order?**
> ```javascript
> app.use(helmet());
> app.use(cors());
> app.use(express.json());
> app.use('/api', routes);      // routes
> app.use(notFoundMiddleware);  // 404 handler
> app.use(errorMiddleware);     // error handler ← always last
> ```

---

## Topic 22 — REST Principles: Stateless, HTTP Methods, Status Codes

> **Quick Recap:**
> REST = stateless, client-server, uniform interface, cacheable. Stateless = server stores NO session — every request carries all needed info (JWT). Idempotent = calling N times = same result as calling once (GET, PUT, DELETE are idempotent; POST is not). Async ≠ Non-blocking — they describe different things.

### Aim
Understand REST architecture principles and correct HTTP method/status code usage.

### Why
REST is the foundation of every backend API. Wrong status codes or non-RESTful design is immediately visible in code reviews.

### How
```
GET    → Read (no body, idempotent, cacheable)
POST   → Create (has body, NOT idempotent)
PUT    → Replace entire resource (idempotent)
PATCH  → Partial update
DELETE → Remove (idempotent)
```

### Key Interview Points + Ideal Answers

**Q: What are the core REST principles?**
> 1. **Stateless** — server stores no client session state. Each request is self-contained.
> 2. **Client-Server** — frontend and backend are independent
> 3. **Uniform Interface** — resources identified by URLs, HTTP methods define actions
> 4. **Cacheable** — responses indicate if they can be cached

**Q: Status codes you must know:**
> ```
> 200 OK              → standard success
> 201 Created         → resource was created (POST)
> 204 No Content      → success, no body (DELETE)
> 400 Bad Request     → malformed request / validation failed
> 401 Unauthorized    → not authenticated (missing/bad token)
> 403 Forbidden       → authenticated but not permitted
> 404 Not Found       → resource doesn't exist
> 409 Conflict        → duplicate (email already exists)
> 429 Too Many Requests → rate limited
> 500 Internal Server Error → unhandled crash
> 503 Service Unavailable → server overloaded/down
> ```

**Q: What is the difference between async and non-blocking?**
> - **Async** = about WHEN something completes — "I'll notify you when done" (describes notification mechanism)
> - **Non-blocking** = about WHAT THE THREAD DOES while waiting — "thread doesn't wait, continues other work" (describes thread behavior)
>
> They usually go together in Node but are conceptually different. `fs.readFile()` is both async (notifies via callback) AND non-blocking (thread doesn't wait).

---

## Topic 23 — req.params vs req.query vs req.body

> **Quick Recap:**
> params = URL path segments (`:id`). query = after `?` in URL. body = request payload (needs express.json() middleware). All params and query values are ALWAYS strings — parseInt/parseFloat when needed.

### Key Interview Points + Ideal Answers

**Q: What is the difference between req.params, req.query, and req.body?**
> ```javascript
> // Route: GET /users/:id/posts/:postId?sort=desc&limit=10
> // Body: { "title": "Hello" }
>
> req.params → { id: '42', postId: '7' }      // URL path segments, always strings
> req.query  → { sort: 'desc', limit: '10' }  // after ?, always strings
> req.body   → { title: 'Hello' }              // requires express.json() middleware
>
> // Type conversion
> const page  = parseInt(req.query.page) || 1;
> const limit = parseInt(req.query.limit) || 10;
> ```

---

## Topic 24 — PUT vs PATCH

> **Quick Recap:**
> PUT = replace ENTIRE resource (missing fields → null). PATCH = update ONLY provided fields (rest untouched). Forgetting this causes data loss bugs in PUT implementations.

### Key Interview Points + Ideal Answers

**Q: What is the difference between PUT and PATCH?**
> ```javascript
> // Resource: { id: 1, name: 'Ahmed', email: 'a@a.com', age: 25 }
>
> // PUT — REPLACE entire resource. Omit a field = it becomes null
> PUT /users/1 { name: 'Ahmed Ali', email: 'new@a.com' }
> // Result: { id: 1, name: 'Ahmed Ali', email: 'new@a.com', age: null } 😱
>
> // PATCH — update ONLY provided fields
> PATCH /users/1 { name: 'Ahmed Ali' }
> // Result: { id: 1, name: 'Ahmed Ali', email: 'a@a.com', age: 25 } ✅
>
> // Mongoose implementation:
> // PUT → findByIdAndReplace()
> // PATCH → findByIdAndUpdate(id, { $set: req.body }, { new: true })
> ```

---

## Topic 25 — CORS: What It Is, Why It Happens, How to Fix

> **Quick Recap:**
> CORS = browser security policy, NOT a Node/server thing. Browser blocks requests to a different origin (protocol + domain + port). Postman never has CORS issues — it's not a browser. Fix = server sends `Access-Control-Allow-Origin` header. Preflight = OPTIONS request browser sends before non-simple requests.

### Aim
Understand why CORS happens and configure it correctly.

### Why
Every frontend+backend project hits CORS. Knowing it's browser-enforced (not server-side) is a key distinction.

### How
```
Different origin = different protocol OR different domain OR different port
localhost:3000 calling localhost:5000 = CORS issue
Same server, different port = still CORS
```

### Key Interview Points + Ideal Answers

**Q: What is CORS and why does it happen?**
> CORS is a browser security mechanism that blocks JavaScript from making requests to a different origin than the page was served from. The server never sees the block — it's entirely in the browser. This is why Postman never has CORS issues.

**Q: How do you fix CORS in Node.js?**
> ```javascript
> const cors = require('cors');
>
> // Production — specific origin
> app.use(cors({
>     origin: 'https://myfrontend.com',
>     methods: ['GET', 'POST', 'PUT', 'DELETE'],
>     allowedHeaders: ['Content-Type', 'Authorization'],
>     credentials: true // allow cookies cross-origin
> }));
>
> // Multiple origins
> const allowed = ['https://app.com', 'https://admin.app.com'];
> app.use(cors({
>     origin: (origin, callback) => {
>         if (!origin || allowed.includes(origin)) callback(null, true);
>         else callback(new Error('Not allowed by CORS'));
>     }
> }));
> ```

**Q: How do you secure cookies against XSS?**
> ```javascript
> res.cookie('token', jwtToken, {
>     httpOnly: true,     // JS cannot read via document.cookie — XSS protection ✅
>     secure: true,       // only sent over HTTPS ✅
>     sameSite: 'strict', // not sent cross-site — CSRF protection ✅
>     maxAge: 7 * 24 * 60 * 60 * 1000
> });
> ```

---

## Topic 26 — Router: Modular Route Files, express.Router()

> **Quick Recap:**
> express.Router() = mini Express app for a subset of routes. Mount with `app.use('/prefix', router)`. Enables modular files, router-level middleware, clean separation. Without it, everything piles into app.js.

### Key Interview Points + Ideal Answers

**Q: Why use express.Router() and how?**
> ```javascript
> // routes/users.js
> const router = require('express').Router();
> router.use(authMiddleware);      // applies to all routes in this file
> router.get('/', getUsers);
> router.post('/', createUser);
> router.get('/:id', getUserById);
> module.exports = router;
>
> // app.js
> app.use('/api/users', require('./routes/users'));
> // → GET /api/users      → getUsers
> // → POST /api/users     → createUser
> // → GET /api/users/123  → getUserById
> ```

---

## Topic 27 — Separating app.js and server.js

> **Quick Recap:**
> app.js = Express configuration (middleware, routes) — exported but NOT listening. server.js = starts the HTTP server (app.listen). Separation enables testing without starting a real server, clustering without touching app logic, and reusing same app for HTTP/HTTPS/tests.

### Key Interview Points + Ideal Answers

**Q: Why separate app.js from server.js?**
> ```javascript
> // app.js — pure Express config, exported
> const app = express();
> app.use(express.json());
> app.use('/api', routes);
> app.use(errorMiddleware);
> module.exports = app;
>
> // server.js — starts the server
> const app = require('./app');
> app.listen(process.env.PORT || 3000);
>
> // Benefits:
> // Testing — import app, no port conflict, no real HTTP server
> const request = require('supertest');
> await request(app).get('/api/users').expect(200); // ✅
>
> // Clustering — server.js handles fork logic, app.js unchanged
> // SSL — create separate server-ssl.js for HTTPS
> ```

---

## Topic 28 — cookie-parser: Sessions with Cookies

> **Quick Recap:**
> cookie-parser parses Cookie header → `req.cookies`. Signed cookies use a secret for tamper detection → `req.signedCookies`. JWT in cookie = stateless. Session ID in cookie + server-side store = stateful. httpOnly + secure + sameSite = secure cookie setup.

### Key Interview Points + Ideal Answers

**Q: cookie-parser usage and session management:**
> ```javascript
> app.use(cookieParser(process.env.COOKIE_SECRET));
>
> // Set
> res.cookie('session', userId, { signed: true, httpOnly: true });
>
> // Read
> const userId = req.signedCookies.session; // verified ✅
>
> // Clear (logout)
> res.clearCookie('session');
> ```

**Cookie sessions vs JWT:**
| | Cookie + Session | JWT |
|---|---|---|
| State | Stored on SERVER | Stored in TOKEN |
| Type | Stateful | Stateless |
| Invalidation | Easy (delete from store) | Hard (wait for expiry) |
| Best for | Monoliths | Microservices/APIs |

---

## Topic 29 — "Cannot set headers after they are sent"

> **Quick Recap:**
> Happens when response is sent twice. Caused by: forgetting `return` before res.send(), callback + sync both responding, calling next() twice. Fix: always `return res.send()`. The `return` exits the parent function — it's a stop sign.

### Key Interview Points + Ideal Answers

**Q: What causes this error and how do you fix it?**
> ```javascript
> // WRONG — response sent twice
> app.get('/user/:id', (req, res) => {
>     if (!req.params.id) {
>         res.status(400).json({ error: 'No ID' }); // sent ✅
>         // no return — falls through ↓
>     }
>     res.json({ user: 'Ahmed' }); // sent AGAIN 💥
> });
>
> // CORRECT — return exits function after sending
> app.get('/user/:id', (req, res) => {
>     if (!req.params.id) {
>         return res.status(400).json({ error: 'No ID' }); // ← return
>     }
>     return res.json({ user: 'Ahmed' });
> });
>
> // Also common in callbacks:
> fs.readFile('f.txt', (err, data) => {
>     if (err) return res.status(500).send('error'); // ← return
>     return res.send(data);
> });
> ```

---

# BLOCK 5 — Auth & Security

---

## Topic 30 — JWT: Structure, Sign, Verify, Full Flow

> **Quick Recap:**
> JWT = 3 parts base64url encoded: Header (algorithm) + Payload (claims) + Signature (HMAC of header+payload). NOT encrypted — just signed. Anyone can decode and read it. Never put passwords in JWT. Signature verification = tamper detection. `jwt.sign()` creates. `jwt.verify()` validates and decodes.

### Aim
Implement stateless authentication with JWT.

### Why
JWT is the standard for stateless API authentication. Every backend role will ask about this.

### How
```
Login → verify credentials → jwt.sign(payload, secret, options) → return token
Request → extract token from Authorization header → jwt.verify(token, secret) → get user
```

### Key Interview Points + Ideal Answers

**Q: What are the three parts of a JWT?**
> ```
> eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VySWQiOiIxMjMifQ  .  abc123xyz
>        ↑                            ↑                      ↑
>    Header (alg+typ)           Payload (claims)         Signature
>  base64url encoded          base64url encoded         HMAC hash
>
> Signature = HMACSHA256(base64(header) + "." + base64(payload), SECRET)
> If payload is modified → signature won't match → rejected ✅
> ```
> **Important**: JWT is encoded, NOT encrypted. Anyone can decode and read the payload. Never store passwords, credit cards, or sensitive data in JWT.

**Q: Full JWT auth flow:**
> ```javascript
> const jwt = require('jsonwebtoken');
>
> // SIGN — on login
> app.post('/login', async (req, res) => {
>     const user = await User.findOne({ email: req.body.email });
>     if (!user) return res.status(401).json({ error: 'Invalid credentials' });
>
>     const valid = await bcrypt.compare(req.body.password, user.password);
>     if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
>
>     const token = jwt.sign(
>         { userId: user._id, role: user.role },
>         process.env.JWT_SECRET,
>         { expiresIn: '24h' }
>     );
>     res.json({ token });
> });
>
> // VERIFY MIDDLEWARE — protect routes
> function authMiddleware(req, res, next) {
>     const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
>     if (!token) return res.status(401).json({ error: 'No token' });
>     try {
>         req.user = jwt.verify(token, process.env.JWT_SECRET);
>         next();
>     } catch (err) {
>         const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
>         res.status(401).json({ error: msg });
>     }
> }
>
> // USE on protected routes
> app.get('/profile', authMiddleware, (req, res) => res.json(req.user));
> ```

---

## Topic 31 — Authentication vs Authorization

> **Quick Recap:**
> Authentication = who are you? (identity). Authorization = what can you do? (permissions). Authentication happens first. Wrong auth = 401. Wrong authz = 403. Two separate middleware layers.

### Key Interview Points + Ideal Answers

**Q: What is the difference?**
> ```javascript
> // Authentication — who are you? → 401 if fails
> function authenticate(req, res, next) {
>     try {
>         req.user = jwt.verify(token, process.env.JWT_SECRET);
>         next();
>     } catch { res.status(401).json({ error: 'Login required' }); }
> }
>
> // Authorization — what can you do? → 403 if fails
> function authorize(...roles) {
>     return (req, res, next) => {
>         if (!roles.includes(req.user.role))
>             return res.status(403).json({ error: 'Insufficient permissions' });
>         next();
>     };
> }
>
> // Usage
> app.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
> ```

---

## Topic 32 — Bcrypt & Password Hashing

> **Quick Recap:**
> Never store plain-text passwords. MD5/SHA1 = crackable by rainbow tables. Bcrypt = slow by design (cost factor) + per-password salt = practically uncrackable. Salt is embedded in the hash — no need to store separately. Cost factor 10 ≈ 100ms per hash.

### Aim
Securely store and verify passwords.

### Why
Password security is a non-negotiable. Getting this wrong is a career-ending security incident.

### How
```
Registration: plaintext → bcrypt.hash(password, 10) → store hash
Login:        plaintext + stored hash → bcrypt.compare() → boolean
```

### Key Interview Points + Ideal Answers

**Q: How do you securely store passwords with bcrypt?**
> ```javascript
> const bcrypt = require('bcrypt');
>
> // Registration
> const hashedPassword = await bcrypt.hash(req.body.password, 10);
> await User.create({ email, password: hashedPassword });
>
> // Login
> const match = await bcrypt.compare(req.body.password, user.password);
> // bcrypt extracts salt from stored hash, rehashes input, compares
> if (!match) return res.status(401).json({ error: 'Invalid credentials' });
> ```
>
> The stored hash looks like: `$2b$10$[22-char-salt][31-char-hash]`
> Salt is embedded — bcrypt.compare() extracts it automatically.

**Q: Why is bcrypt better than MD5/SHA1?**
> MD5/SHA1 are designed to be FAST — attackers can compute billions of hashes per second with GPU, making rainbow tables trivial. Bcrypt is designed to be SLOW — the cost factor means even with specialized hardware, brute force is computationally infeasible.

---

## Topic 33 — Input Validation with Joi

> **Quick Recap:**
> Validate early, at the route entry point. Joi defines a schema → validates req.body against it → returns errors or sanitized values. `abortEarly: false` collects ALL errors, not just first. Validation prevents invalid data reaching DB and exposes clear error messages to clients.

### Key Interview Points + Ideal Answers

**Q: How do you validate user input with Joi?**
> ```javascript
> const Joi = require('joi');
>
> const schema = Joi.object({
>     name:     Joi.string().min(2).max(50).required(),
>     email:    Joi.string().email().required(),
>     password: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])/).required(),
>     age:      Joi.number().integer().min(18).optional()
> });
>
> // Validation middleware
> function validate(schema) {
>     return (req, res, next) => {
>         const { error, value } = schema.validate(req.body, { abortEarly: false });
>         if (error) {
>             return res.status(400).json({ errors: error.details.map(d => d.message) });
>         }
>         req.body = value; // use sanitized values
>         next();
>     };
> }
>
> app.post('/register', validate(schema), registerController);
> ```

---

## Topic 34 — Helmet: Secure HTTP Headers

> **Quick Recap:**
> Helmet is a collection of small middleware that set security-related HTTP response headers. One line: `app.use(helmet())`. Sets ~11 headers including CSP, HSTS, X-Frame-Options. Prevents clickjacking, MIME sniffing, and protocol downgrade attacks.

### Key Interview Points + Ideal Answers

**Q: What does Helmet do and what headers does it set?**
> ```javascript
> app.use(helmet()); // sets all with safe defaults
>
> // Key headers it sets:
> 'X-Frame-Options': 'SAMEORIGIN'              // prevent clickjacking
> 'X-Content-Type-Options': 'nosniff'          // prevent MIME sniffing
> 'Strict-Transport-Security': 'max-age=...'   // force HTTPS
> 'Content-Security-Policy': "default-src 'self'" // prevent XSS
> 'Referrer-Policy': 'no-referrer'
> ```

---

## Topic 35 — XSS Protection: HttpOnly, Secure, X-XSS-Protection

> **Quick Recap:**
> XSS = attacker injects script → runs in victim's browser → steals cookies. HttpOnly = JS can't read cookie (even if XSS happens). Secure = cookie only sent over HTTPS. sameSite = blocks cross-site cookie sending (CSRF protection). CSP = whitelist trusted script sources.

### Key Interview Points + Ideal Answers

**Q: How do you protect against XSS?**
> ```javascript
> // 1. HttpOnly cookies — JS can't steal them via document.cookie
> res.cookie('session', token, { httpOnly: true, secure: true, sameSite: 'strict' });
>
> // 2. Content Security Policy — blocks injected scripts from executing
> helmet.contentSecurityPolicy({ directives: { scriptSrc: ["'self'"] } });
> // → <script>injectedEvil()</script> → blocked ✅
>
> // 3. X-XSS-Protection (legacy browsers)
> 'X-XSS-Protection': '1; mode=block' // set automatically by helmet
> ```

---

## Topic 36 — Content-Security-Policy Basics

> **Quick Recap:**
> CSP = HTTP header that tells browser which sources are allowed for scripts, styles, images, etc. Blocks everything else. `default-src 'self'` = only load from own domain. Violations can be reported to an endpoint. Primary defense against XSS injection attacks.

### Key Interview Points + Ideal Answers

**Q: What is CSP and how does it protect your app?**
> ```javascript
> app.use(helmet.contentSecurityPolicy({
>     directives: {
>         defaultSrc: ["'self'"],
>         scriptSrc:  ["'self'", "https://cdn.jsdelivr.net"],
>         styleSrc:   ["'self'", "https://fonts.googleapis.com"],
>         imgSrc:     ["'self'", "https:", "data:"],
>         frameSrc:   ["'none'"],  // no iframes
>     }
> }));
>
> // Blocks:
> // <script src="https://evil.com/steal.js">   → blocked ✅
> // <script>inline evil()</script>              → blocked ✅
> ```

---

## Topic 37 — Rate Limiting: express-rate-limit

> **Quick Recap:**
> Rate limiting prevents abuse — brute force attacks on login, DoS attacks, API scraping. Per-IP by default. In multi-instance deployments, use Redis store — otherwise each instance has its own counter (easy to bypass). Apply stricter limits to auth routes.

### Key Interview Points + Ideal Answers

**Q: How do you implement rate limiting?**
> ```javascript
> const rateLimit = require('express-rate-limit');
>
> // Global limiter
> app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
>
> // Strict auth limiter
> const authLimiter = rateLimit({
>     windowMs: 15 * 60 * 1000,
>     max: 5, // only 5 login attempts per 15min per IP
>     skipSuccessfulRequests: true
> });
> app.post('/login', authLimiter, loginHandler);
>
> // Production — Redis store for shared limits across instances
> store: new RedisStore({ client: redisClient })
> ```

---

## Topic 38 — NODE_ENV: Production vs Development

> **Quick Recap:**
> NODE_ENV controls behavior across your entire app — error verbosity, logging level, caching, JWT expiry. Always set to 'production' in production. Never hardcode secrets — use env vars or a secret manager. Config files per environment = clean separation.

### Key Interview Points + Ideal Answers

**Q: What does NODE_ENV do?**
> ```javascript
> const isProd = process.env.NODE_ENV === 'production';
>
> // Error details — never expose stack traces in production
> app.use((err, req, res, next) => {
>     if (!isProd) return res.status(500).json({ error: err.message, stack: err.stack });
>     res.status(500).json({ error: 'Internal Server Error' });
> });
>
> app.use(morgan(isProd ? 'combined' : 'dev'));
> ```

**Q: How do you manage secrets in production?**
> ```
> Development  → .env file + dotenv (gitignored)
> Production   → Environment variables set by OS/Docker/CI
> Enterprise   → AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager
>
> NEVER: hardcode secrets in code
> NEVER: commit .env to git
> ```

**Config separation pattern:**
> ```javascript
> // config/index.js
> const env = process.env.NODE_ENV || 'development';
> module.exports = require(`./${env}`);
>
> // config/development.js
> module.exports = { db: 'mongodb://localhost/dev', jwtExpiry: '7d' };
>
> // config/production.js
> module.exports = { db: process.env.MONGO_URI, jwtExpiry: '1h' };
> ```

---

# BLOCK 6 — Scaling & Performance

---

## Topic 39 — Cluster Module: Round-Robin, Master/Worker, numCPUs

> **Quick Recap:**
> Node = single process = one CPU core. Server with 8 cores → 7 idle without Cluster. Cluster forks one worker per CPU. Master distributes connections round-robin (Linux). Workers are independent processes — one crash doesn't kill others. Master restarts dead workers. Cluster = vertical scaling (one machine). Load balancer = horizontal scaling (multiple machines).

### Aim
Utilize all CPU cores in a Node.js application.

### Why
A Node app running on a single core on an 8-core server is wasting 87.5% of its CPU capacity. This is a production optimization every senior developer must know.

### How
```
Master process
├── Worker 1 (full Node process, own event loop)
├── Worker 2
├── Worker 3
└── Worker 4  (one per logical CPU core)

Incoming request → master → round-robin → worker
```

### Key Interview Points + Ideal Answers

**Q: How does the Cluster module work?**
> ```javascript
> const cluster = require('cluster');
> const os = require('os');
>
> if (cluster.isMaster) {
>     for (let i = 0; i < os.cpus().length; i++) cluster.fork();
>
>     cluster.on('exit', (worker) => {
>         console.log(`Worker ${worker.process.pid} died`);
>         cluster.fork(); // auto-restart dead workers ✅
>     });
> } else {
>     // each worker is a full Node.js process
>     app.listen(3000);
> }
> ```

**Q: Cluster vs Load Balancer:**
| | Cluster | Load Balancer |
|---|---|---|
| Scale | Single machine | Multiple machines |
| Distribution | OS-level (round-robin) | Network-level |
| Setup | Built into Node | External (nginx, HAProxy) |
| Crash isolation | Per-worker | Per-server |

---

## Topic 40 — Worker Threads vs Cluster

> **Quick Recap:**
> Cluster = multiple PROCESSES (own memory, own V8, own event loop) for handling more HTTP requests. Worker Threads = multiple THREADS in same process (can share memory) for CPU-intensive computation without blocking main thread. Use both together for maximum performance.

### Key Interview Points + Ideal Answers

**Q: When do you use Worker Threads vs Cluster?**
> ```
> More concurrent HTTP requests?   → Cluster
> Heavy CPU work without blocking? → Worker Threads
> Both?                            → Cluster + Worker Threads
> ```

**Q: How do Worker Threads work?**
> ```javascript
> const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
>
> if (isMainThread) {
>     // Main thread — stays free for HTTP requests
>     app.post('/process', (req, res) => {
>         const worker = new Worker('./heavy-task.js', { workerData: req.body });
>         worker.on('message', result => res.json(result));
>         worker.on('error', err => res.status(500).json({ error: err.message }));
>     });
> } else {
>     // Worker thread — CPU work here, main thread unaffected
>     const result = heavyComputation(workerData);
>     parentPort.postMessage(result);
> }
> ```

| | Cluster | Worker Threads |
|---|---|---|
| Unit | Process | Thread |
| Memory | Separate per worker | Can share via SharedArrayBuffer |
| Communication | IPC (slow) | SharedArrayBuffer (fast) |
| Overhead | ~30MB per worker | ~few MB per thread |
| Solves | Concurrency at scale | CPU-blocking |

---

## Topic 41 — Child Process: spawn vs exec vs fork

> **Quick Recap:**
> exec = shell + buffer output (safe for small outputs, DANGEROUS with user input — shell injection). spawn = no shell + stream output (safe, handles large output, accepts args as array). fork = spawn specifically for Node.js files, adds IPC channel for message passing.

### Aim
Run external processes from Node.js safely.

### Why
Build tools, running scripts, CPU-intensive tasks in separate processes — all need child_process.

### How
```
exec  → runs in shell → buffers all output → callback(err, stdout, stderr)
spawn → no shell → streams output → events (data, close)
fork  → spawn for .js files → adds IPC (parent.send/child.on('message'))
```

### Key Interview Points + Ideal Answers

**Q: exec vs spawn vs fork:**
> ```javascript
> const { exec, spawn, fork } = require('child_process');
>
> // EXEC — shell, buffered, small output, DON'T use with user input
> exec('ls -la', (err, stdout) => console.log(stdout));
> // Injection danger: exec(`ls ${userInput}`) → userInput='; rm -rf /'
>
> // SPAWN — no shell, streamed, safe with user input
> const proc = spawn('ls', ['-la']); // args as array = safe ✅
> proc.stdout.on('data', chunk => console.log(chunk.toString()));
>
> // FORK — Node.js files + IPC messaging
> const child = fork('./worker.js');
> child.send({ task: 'process', data: dataset }); // IPC message
> child.on('message', result => console.log(result));
> ```

**Q: How do you kill child process trees?**
> ```javascript
> child.kill(); // kills only parent — children become orphans 😱
>
> // Kill entire process group (Linux)
> process.kill(-child.pid);
>
> // Cross-platform — use tree-kill package
> const treeKill = require('tree-kill');
> treeKill(child.pid);
> ```

---

## Topic 42 — process.nextTick vs setImmediate Deep Dive + Traps

> **Quick Recap:**
> Full deep dive is in Topics 5 and 12. Key trap: inside an I/O callback, order is always deterministic — nextTick → Promise → setImmediate → setTimeout. Recursive nextTick = starvation. Recursive setImmediate = safe. EventEmitter + nextTick cycle = stack overflow risk + starvation.

### Key Interview Points + Ideal Answers

**Q: Complete order inside an I/O callback:**
> ```javascript
> fs.readFile('file.txt', () => {
>     // We are in POLL phase
>     setTimeout(()       => console.log('timeout'),   0);
>     setImmediate(()     => console.log('immediate')   );
>     process.nextTick(() => console.log('nextTick')    );
>     Promise.resolve().then(() => console.log('promise'));
>     console.log('sync');
> });
>
> // Output (always this order):
> // sync       ← current sync code
> // nextTick   ← microtask queue drained
> // promise    ← microtask queue drained
> // immediate  ← CHECK phase (next after POLL)
> // timeout    ← TIMERS phase (next loop iteration)
> ```

**Trap summary:**
> ```
> Recursive nextTick      → starves event loop (I/O never runs)
> Recursive setImmediate  → safe (yields per iteration)
> EventEmitter + nextTick cycle → stack overflow + starvation
> EventEmitter + setImmediate  → safe
> ```

---

## Topic 43 — Connection Pooling

> **Quick Recap:**
> Each DB query without pooling = create connection (100ms) + query + close = slow. Pool = N persistent connections. Query arrives → borrow connection → run query → return connection (not close). Pool sizing: too few = queue up; too many = DB overwhelmed. Always release connections in `finally` block.

### Aim
Handle large numbers of DB connections efficiently.

### Why
Without pooling, a high-traffic app creates and destroys thousands of connections — overwhelming the DB. This is production-critical knowledge.

### How
```
Pool maintains N open connections
Request borrows one → runs query → returns it
No connect/disconnect overhead per query
```

### Key Interview Points + Ideal Answers

**Q: How do you implement connection pooling?**
> ```javascript
> // Mongoose — built-in pooling
> mongoose.connect(process.env.MONGO_URI, {
>     maxPoolSize: 10,
>     minPoolSize: 2
> });
>
> // pg (PostgreSQL) — explicit pool
> const { Pool } = require('pg');
> const pool = new Pool({ max: 20, idleTimeoutMillis: 30000 });
>
> // Always release in finally
> const client = await pool.connect();
> try {
>     const result = await client.query('SELECT * FROM users');
>     res.json(result.rows);
> } finally {
>     client.release(); // CRITICAL — don't forget ✅
> }
>
> // Or use shorthand (auto-releases)
> const result = await pool.query('SELECT * FROM users');
> ```

**Q: What is thread pool exhaustion? (applies to pool concept generally)**
> When all pool slots are occupied and new requests arrive, they queue up waiting. This means "async" operations aren't actually running — they're in line. Impact: latency increases, requests time out. Fix: tune pool size to match your workload and DB limits.

---

## Topic 44 — Caching Basics: In-Memory vs Redis

> **Quick Recap:**
> Cache = store expensive computation/DB result, return it instantly next time. In-memory (node-cache) = lives in process RAM, lost on restart, NOT shared between instances. Redis = external service, survives restarts, SHARED across all instances/servers. Use in-memory for single-server apps, Redis for any multi-instance deployment.

### Aim
Reduce DB load and improve response times with caching.

### Why
Caching is the first tool for performance optimization. Interview question: "How would you scale a high-traffic API?" — caching is answer #1.

### How
```
Request arrives
    ↓
Check cache → hit? → return cached data (fast)
              miss? → fetch from DB → store in cache → return
```

### Key Interview Points + Ideal Answers

**Q: In-memory vs Redis caching:**
> ```javascript
> // In-memory — single instance, simple
> const NodeCache = require('node-cache');
> const cache = new NodeCache({ stdTTL: 60 });
>
> app.get('/products', async (req, res) => {
>     const cached = cache.get('products');
>     if (cached) return res.json({ source: 'cache', data: cached });
>
>     const products = await Product.find();
>     cache.set('products', products);
>     res.json({ source: 'db', data: products });
> });
>
> // Redis — distributed, survives restarts
> const cached = await redisClient.get('products');
> if (cached) return res.json(JSON.parse(cached));
> await redisClient.setEx('products', 60, JSON.stringify(products)); // TTL 60s
> ```

| | In-memory | Redis |
|---|---|---|
| Shared across instances | ❌ | ✅ |
| Survives restart | ❌ | ✅ |
| Latency | Zero | ~1ms |
| Required for | Single server | Cluster/microservices |

**Q: How do you optimize a high-traffic Node.js API?**
> 1. Add Redis caching for frequent reads
> 2. Connection pooling for DB
> 3. Cluster module for multi-core CPU usage
> 4. Eliminate sync operations in hot paths
> 5. Add pagination — never return unlimited records
> 6. Add DB indexes on frequently queried fields
> 7. Use streams for large data transfers
> 8. Rate limiting to prevent abuse
> 9. CDN for static assets
> 10. Compress responses with `compression` middleware

---

## Topic 45 — Memory Leaks & Garbage Collection

> **Quick Recap:**
> V8 GC = generational: New Space (short-lived objects, Scavenge GC — fast, frequent) + Old Space (long-lived objects, Mark-Sweep-Compact — slow, rare). Memory leak = objects stay in memory that should have been freed. Most common causes: event listeners not removed, global caches growing forever, closures holding large references, timers/intervals not cleared.

### Aim
Diagnose and fix memory leaks in Node.js.

### Why
Memory leaks are silent killers — apps slow down and crash hours/days after deployment. Senior developers must know how to find and fix them.

### How
```
V8 Heap: New Space → short-lived → Scavenge GC
                   → survived 2 GCs → promoted to Old Space
         Old Space → long-lived → Mark-Sweep-Compact
```

### Key Interview Points + Ideal Answers

**Q: How does V8 garbage collection work?**
> V8 uses generational GC:
> - **New Space (Young Generation)**: short-lived objects. **Scavenge** GC — fast, runs often. Objects surviving 2 collections are promoted.
> - **Old Space (Old Generation)**: long-lived objects. **Mark-Sweep-Compact** — slower, runs rarely. Mark = find all reachable objects. Sweep = free unreachable. Compact = defragment memory.

**Q: What causes memory leaks in Node.js?**
> ```javascript
> // 1. Event listener accumulation — most common
> app.get('/data', (req, res) => {
>     emitter.on('update', (data) => res.json(data)); // new listener per request 😱
> });
> // Fix: emitter.once() or explicitly remove with emitter.off()
>
> // 2. Global cache without eviction
> const cache = {};
> app.get('/:id', (req, res) => {
>     cache[req.params.id] = fetchData(); // grows forever 😱
> });
> // Fix: LRU cache with max size (lru-cache package)
>
> // 3. Closure holding large reference
> function createHandler() {
>     const largeData = new Array(1000000).fill('x');
>     return function(req, res) {
>         res.send('ok'); // largeData never freed while handler exists 😱
>     };
> }
>
> // 4. Timers not cleared
> setInterval(() => heavyWork(), 1000); // runs forever
> // Fix: clearInterval(interval) when done
> ```

**Q: How do you diagnose memory leaks?**
> ```javascript
> // 1. Monitor heapUsed over time — if it grows consistently → leak
> setInterval(() => {
>     const { heapUsed, heapTotal } = process.memoryUsage();
>     console.log(`Heap: ${(heapUsed/1024/1024).toFixed(2)}MB / ${(heapTotal/1024/1024).toFixed(2)}MB`);
> }, 5000);
>
> // 2. Chrome DevTools heap snapshot
> // node --inspect server.js → chrome://inspect → Memory tab
> // Take snapshot → use app → take snapshot → compare
> // Growing objects between snapshots = the leak
>
> // 3. clinic.js — production profiling
> // clinic doctor -- node server.js
> ```

**Q: How do you fix "Process out of Memory"?**
> ```bash
> # Temporary — increase heap
> node --max-old-space-size=4096 server.js
> ```
> Real fixes:
> 1. Find and fix the leak using heap snapshots
> 2. Use streams instead of loading large data into memory
> 3. Use LRU cache with max size limit
> 4. Paginate large dataset queries
> 5. Clear timers and listeners when done
> 6. PM2 `max_memory_restart` to auto-restart when memory exceeds threshold
