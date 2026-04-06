# Emergency Interview Prep
## Part 3: Core JavaScript Concepts Q&A (150 Questions)

---

## SECTION 1: EVENT LOOP (Questions 1-25)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 1 | What is the JavaScript Event Loop? | "Mechanism for non-blocking operations despite single-threading." | Chef with one hand - start boiling, set timer, chop veggies. Timer rings, back to water. | `console.log("A");setTimeout(()=>console.log("B"),0);console.log("C")` → A,C,B |
| 2 | Why single-threaded? | "One call stack - executes one piece of code at a time." | One worker - one job at a time. Can set reminders, switch tasks. | Code runs line by line. No true parallel in one tab. |
| 3 | Call Stack vs Callback Queue? | "Stack executes now; Queue holds code for later." | Desk = work now. Inbox = work later. Event loop moves inbox to desk. | `fn()` → stack. `setTimeout(fn,1000)` → queue, waits 1s |
| 4 | Microtasks vs macrotasks? | "Microtasks (Promises) priority > macrotasks (setTimeout)." | VIP guests skip the line. After each macrotask, all microtasks run. | `setTimeout(()=>log("macro"),0);Promise.resolve().then(()=>log("micro"))` → micro,macro |
| 5 | `setTimeout(fn,0)` not immediate? | "Schedules as macrotask - runs after stack and microtasks." | "Do when free" not "do now." Min delay ~4ms. | `setTimeout(()=>log("later"),0);log("now")` → now,later |
| 6 | `setTimeout` in dice animation? | "Delays reveal, allowing GIF to play." | Start animation, timer 1s, then show result. Non-blocking. | `diceImage.src="anim.gif";setTimeout(()=>diceImage.src="result.png",1000)` |
| 7 | Infinite `setTimeout` loops? | "Don't block but consume memory." | Each schedules new task - pile up if forever. | `function loop(){setTimeout(loop,1000)}` - add stop condition |
| 8 | `setTimeout` vs `setInterval`? | "`setTimeout` variable delays, ensures completion." | Metronome ticks regardless vs finish then schedule next. | `function anim(){update();if(!done)setTimeout(anim,16)}` |
| 9 | "Blocking" operation? | "Prevents event loop from processing other tasks." | Traffic jam - nothing moves until cleared. | `for(let i=0;i<1000000000;i++){}` blocks, UI freezes |
| 10 | `async/await` and event loop? | "Syntactic sugar over Promises (microtasks)." | `async` = returns Promise. `await` pauses function, not loop. | `async function roll(){const r=await diceRoll();updateUI(r)}` |
| 11 | `await` doesn't block browser? | "Yields control back to event loop." | "Pause MY function, let others work." Resumes when Promise resolves. | While `await delay(1000)`, user can click, animations play |
| 12 | "Tick" in event loop? | "One cycle: stack → microtasks → one macrotask." | Clock tick - each cycle processes pending work. | Execute stack → all microtasks → one macrotask → repeat |
| 13 | Promises in event loop? | "`.then`/`.catch` are microtasks, before macrotasks." | VIP - processed immediately after current code. | `Promise.resolve().then(()=>log("p"));setTimeout(()=>log("t"),0)` → p,t |
| 14 | Callback hell? | "Nested callbacks unreadable; Promises flatten." | Russian doll callbacks - deep nesting. Promises chain flat. | Bad: `a(()=>b(()=>c(()=>d())))`. Good: `await a();await b();await c()` |
| 15 | Event loop handles user events? | "Events are macrotasks added to queue." | Click adds task to queue. Picked up when current work finishes. | 5 fast clicks → 5 events in queue → processed sequentially |
| 16 | "Starvation" in event loop? | "One task type dominates, prevents others." | VIP line never ends - regular customers wait forever. | `while(true){Promise.resolve().then(()=>{})}` starves setTimeout |
| 17 | `requestAnimationFrame`? | "Schedules before browser repaint, synced to display." | Direct line to screen - "call before next frame." | `function anim(){update();requestAnimationFrame(anim)}` |
| 18 | `setTimeout` not exact? | "Runs after delay when call stack clear." | "Wait at least Xms, then when free." Not guaranteed exact. | Heavy calc at 90ms → callback runs after, maybe 200ms+ |
| 19 | Sync vs async code? | "Sync sequential blocking; async schedules later non-blocking." | Waiting in line vs ordering food - do other things, ready when ready. | Sync: `readFileSync()`. Async: `await readFile()` |
| 20 | `Promise.all` and event loop? | "Waits for all Promises, callback as microtask." | Wait for all friends before movie. Each arrives when can. | `await Promise.all([fetch('/a'),fetch('/b'),fetch('/c')])` |
| 21 | Zero-delay `setTimeout` use? | "Defer execution until after stack clears." | "Let browser breathe" - update UI, then continue. | `el.textContent="Loading...";setTimeout(()=>heavyCalc(),0)` |
| 22 | Event loop: Node vs Browser? | "Node has I/O phases; Browser focuses on rendering." | Browser cares about paint, user input. Node cares about files, network. | Browser: render→tasks→microtasks. Node: timers→I/O→poll→... |
| 23 | Animations stutter with `setTimeout`? | "Not synced to display; use `requestAnimationFrame`." | Screen 60Hz. `setTimeout(fn,16)` may fire between frames. | `setTimeout(()=>update(),16)` may miss. `rAF(update)` perfect |
| 24 | Web Workers and event loop? | "Workers run on separate threads, truly parallel." | Hire another worker - own desk (event loop), independent. | `const w=new Worker('worker.js');w.postMessage(data);w.onmessage=e=>result=e.data` |
| 25 | Call stack overflow? | "Too many nested calls exceed stack size." | Stack of plates - too many, it topples. | `function r(){r()}r()` → RangeError: Maximum call stack exceeded |

---

## SECTION 2: DOM MANIPULATION (Questions 26-50)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 26 | What is the DOM? | "Tree representation of HTML JS can manipulate." | Family tree of HTML - each tag a node. Read, modify, add, remove. | `<html>`→`<body>`→`<div>`→`<p>` - traverse and modify |
| 27 | `innerHTML` vs `textContent`? | "`innerHTML` parses HTML; `textContent` plain text - safer." | Translator vs copy machine - former interprets, latter exact. | `el.innerHTML="<b>Bold</b>"`→Bold. `el.textContent="<b>Bold</b>"`→`<b>Bold</b>` |
| 28 | `document.write` bad practice? | "Blocks parsing, can overwrite document, inflexible." | Typewriter - writes where cursor is, can't go back. | Bad: `document.write("<p>Hi</p>")`. Good: `document.body.appendChild(document.createElement("p")).textContent="Hi"` |
| 29 | What is reflow? | "Recalculates element positions/sizes - cascades, expensive." | Rearranging room - measure, move, couch doesn't fit, rearrange. | `el.style.width="100px"` → reflow. Batch changes. |
| 30 | Repaint vs reflow? | "Repaint redraws pixels; reflow changes layout then repaints." | Repaint wall vs move wall - former cheaper. | `color:red`→repaint. `width:100px`→reflow+repaint |
| 31 | Minimize reflows? | "Batch reads/writes, use transforms, don't interleave." | Plan changes, execute all at once. Don't measure-move-measure. | Read all layout first, then write all changes |
| 32 | Event delegation? | "One listener on parent handles multiple children." | Parent walkie-talkie vs each child having one. | `board.addEventListener("click",e=>{if(e.target.classList.contains("tile"))handle(e.target)})` |
| 33 | When NOT use delegation? | "Children need different event types." | Unique handling (click/hover/drag) - direct listeners clearer. | Your 3 cards have individual listeners |
| 34 | Event bubbling? | "Events propagate from target up through ancestors." | Click button in div in body - bubbles up: button→div→body. | `btn.addEventListener("click",()=>log("btn"));div.addEventListener("click",()=>log("div"))` → btn,div |
| 35 | Event capturing? | "Events travel document down to target before bubbling." | Opposite direction - rarely used. | `div.addEventListener("click",handler,true)` - true=capture |
| 36 | Stop propagation? | "`event.stopPropagation()` prevents further bubbling." | "I've got this, no one else needs to know." | `btn.addEventListener("click",e=>{e.stopPropagation();doSomething()})` |
| 37 | `event.preventDefault()`? | "Prevents browser's default action." | Links navigate, forms submit, space scrolls - prevent it. | `form.addEventListener("submit",e=>{e.preventDefault();handle()})` |
| 38 | `template` elements? | "Hold inert HTML cloned efficiently without rendering." | Cookie cutters - define shape, stamp copies when needed. | `<template id="card"><div class="card">...</div></template>` → `template.content.cloneNode(true)` |
| 39 | `DocumentFragment`? | "Lightweight container for nodes appended in one operation." | Moving box - pack inside, move box, unpack. One reflow. | `const f=document.createDocumentFragment();items.forEach(i=>f.appendChild(i));container.appendChild(f)` |
| 40 | Cloning vs `innerHTML`? | "Cloning preserves listeners/refs; `innerHTML` creates fresh." | Copies existing vs parses strings - former faster, preserves more. | `template.content.cloneNode(true)` copies structure. `innerHTML` parses fresh |
| 41 | Shadow DOM? | "Scoped DOM subtree isolated from main document." | Room with one-way mirrors - inside sees out, outside doesn't see in. | `const s=el.attachShadow({mode:'open'});s.innerHTML='<style>...</style><div>...</div>'` |
| 42 | `data-*` attributes? | "Store custom data without affecting rendering." | Sticky notes on elements - info for later, valid HTML. | `<div data-player-id="3">` → `el.dataset.playerId` → "3" |
| 43 | `children` vs `childNodes`? | "`children` = element nodes only; `childNodes` includes text/comments." | Kids in room vs kids + whispers + graffiti. | `<div>Text<p>Child</p></div>`: children=[p], childNodes=[text,p] |
| 44 | Remove all children efficiently? | "`innerHTML=''` for simplicity; while loop for compatibility." | Sweep table vs remove one by one - former faster. | `container.innerHTML=''` fast. `while(c.firstChild)c.removeChild(c.firstChild)` compatible |
| 45 | `requestAnimationFrame`? | "Schedule animations synced to browser refresh rate." | Direct line to screen - "tell me when about to draw." | `function anim(){update();requestAnimationFrame(anim)}` |
| 46 | CSS transforms for animation? | "GPU accelerated, don't trigger layout recalc." | Physical move vs hologram - GPU projects latter. | `transform:translateX(100px)` GPU accel. `left:100px` layout recalc |
| 47 | Intersection Observer API? | "Detects elements entering/exiting viewport efficiently." | Browser tells you when visible - no constant polling. | `const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)load(e.target)}));o.observe(img)` |
| 48 | Browser compatibility? | "Feature detection or polyfills." | Check if exists before using, or add shim. | `if('IntersectionObserver' in window)useIO();else useFallback()` |
| 49 | Mutation Observer API? | "Watches DOM changes, calls callback on mutations." | Security camera for DOM - notifies on add/remove/change. | `const o=new MutationObserver(ms=>log('DOM changed!'));o.observe(body,{childList:true})` |
| 50 | `classList` vs `className`? | "`classList` add/remove/toggle without affecting others." | Add stickers vs rewrite name tag - former keeps base. | `el.classList.add("active")` keeps others. `el.className="active"` wipes |

---

## SECTION 3: SCOPES & CLOSURES (Questions 51-75)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 51 | JavaScript scopes? | "Global, function, block (ES6+), module - variable accessibility." | Rooms in house: living (global), bedroom (function), bathroom (block), apartment (module). | `let global="all";function fn(){let func="here";if(true){let block="temp"}}` |
| 52 | `var` vs `let` vs `const`? | "`var` function-scoped hoisted; `let`/`const` block-scoped not hoisted." | `var` = town crier (announces everywhere). `let`/`const` stay put. | `console.log(a);var a=1`→undefined. `console.log(b);let b=1`→ReferenceError |
| 53 | What is hoisting? | "Declarations moved to top of scope during compilation." | Raising flag - declaration up, assignment stays. | `console.log(x);var x=5`→undefined. `var x` hoisted, `=5` stays |
| 54 | Temporal Dead Zone (TDZ)? | "Period between block entry and `let`/`const` declaration." | "Coming soon" sign - space exists but can't use. Access = error. | `{console.log(x);let x=5}`→ReferenceError: cannot access before init |
| 55 | What is a closure? | "Function remembering variables from outer scope after outer returns." | Backpack - carries variables from creation, accessible when called elsewhere. | `function outer(){let c=0;return()=>++c}const counter=outer();counter()`→1 |
| 56 | Closures in event listeners? | "Callbacks form closures over creation scope variables." | Listener "remembers" variables at creation time. | `for(let i=0;i<3;i++){card.addEventListener("click",()=>playCard(i))}` each closes over its `i` |
| 57 | Why use IIFEs? | "Create private scope, avoid global pollution." | Private room - variables inside stay inside. | `(function(){let private="secret";window.public=()=>private})()` |
| 58 | Module scope vs global? | "Module isolates variables; don't become global properties." | Separate apartments - each file isolated. Export to share. | `// file.js let x=1` - `x` not `window.x`. Must export |
| 59 | Scope chain? | "Looks in current scope, then outer, up to global." | "Do I have it?" → "Parent?" → "Grandparent?" until found. | `let a=1;function o(){let b=2;function i(){let c=3;log(a,b,c)}}` finds all |
| 60 | Lexical scope? | "Scope determined where function written, not called." | Birthplace matters, not travel destination. | `function o(){let x=1;return()=>log(x)}const fn=o();fn()`→1 (remembers birthplace) |
| 61 | Closures cause memory leaks? | "Keep variables alive; accidental closures over large objects waste memory." | Hoarding - keeping things prevents garbage collection. | `function p(){let huge=fetchBig();return()=>log("done")}` - huge kept alive |
| 62 | Garbage collection? | "Frees objects no longer reachable from roots." | Cleaning service - finds unused items, throws out. Mark-and-sweep. | `let obj={data:"big"};obj=null` - unreachable, GC cleans |
| 63 | Debug scope issues? | "`debugger` statement or DevTools breakpoints." | Freeze time, look around, see variables and scope. | `function m(){let x=1;debugger}` - pauses, inspect scope |
| 64 | Function vs block scope? | "Function spans whole function; block limited to `{}`." | Whole room vs cubicles in room. `var`=room, `let`/`const`=cubicle. | `if(true){var a=1;let b=2}log(a)`→1. `log(b)`→ReferenceError |
| 65 | Avoid global variables? | "Risk naming collisions, hard to reason about/test." | Shared whiteboard - anyone writes/erases. Hard to track. | Bad: `let score=0`. Good: `const game={score:0}` |
| 66 | Closures enable privacy? | "Variables accessible only through returned functions." | Safe - only function has combination. External can't access directly. | `function create(){let bal=0;return{deposit:n=>bal+=n,get:()=>bal}}` |
| 67 | Loop closure problem? | "`var` in loop shares one variable; `let` or IIFE for separate bindings." | `var` = one locker everyone shares. `let` = own locker each iteration. | Bad: `for(var i=0;i<3;i++){setTimeout(()=>log(i),100)}`→3,3,3. Good: `let i`→0,1,2 |
| 68 | `this` in arrow vs regular? | "Arrow inherits `this` from parent; regular gets from call site." | Arrow remembers "me" from birth. Regular changes by caller. | `const obj={x:1,fn:()=>log(this.x),reg(){log(this.x)}};obj.fn()`→undefined. `obj.reg()`→1 |
| 69 | `[[Environment]]` slot? | "Hidden reference to outer scope closures carry." | Secret backpack with variables from creation. Travels with function. | When `inner` created in `outer`, `inner.[[Environment]]` points to `outer`'s scope |
| 70 | Imports/exports and scope? | "Imports bring into module scope; exports make available externally." | Borrowing book vs lending - brings in vs makes available. | `import{helper}from'./utils.js'` brings into this module's scope |
| 71 | Static vs dynamic scope? | "JS uses lexical (static); dynamic would use call site." | Lexical: where written. Dynamic: where called. JS: birthplace matters. | `function f(){log(x)}function g(){let x=2;f()}let x=1;g()`→1 (lexical), would be 2 (dynamic) |
| 72 | Truly private class members? | "Private fields (`#property`) - inaccessible outside class." | Safe with no outside keyhole. Only class methods access. | `class Game{#players=new Map();getPlayers(){return this.#players}}` |
| 73 | Revealing module pattern? | "Return object with public methods, keep implementation private." | Menu shows options, not kitchen. Clean API, hidden complexity. | `const m=(function(){let p=1;function h(){}return{public:()=>p}})()` |
| 74 | Closures and performance? | "More memory (keeping vars alive) but enable powerful patterns." | Photo album takes space but preserves memories. Trade-off. | Each closure keeps scope alive. 1000 closures = 1000 scopes |
| 75 | Currying? | "Transform multi-arg function to sequence of single-arg functions." | Assembly line - one arg at a time, each returns function for next. | `const add=a=>b=>a+b;const add5=add(5);add5(3)`→8. `add5` closes over `a=5` |

---

## SECTION 4: THE `this` KEYWORD (Questions 76-100)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 76 | What is `this`? | "Execution context - determined by how function called." | "Me" - depends on who's speaking. How called matters, not where written. | `function w(){log(this)}w()`→window. `obj.m=w;obj.m()`→obj |
| 77 | Four `this` binding rules? | "Default, implicit, explicit (call/apply/bind), new. Precedence: new>explicit>implicit>default." | Four ways `this` set. New = highest, default = lowest. | `new C()`→new obj. `fn.call(o)`→o. `obj.m()`→obj. `fn()`→global/undefined |
| 78 | Default binding? | "Standalone call: `this` = global (non-strict) or undefined (strict)." | No instructions - fall back to global. Strict = undefined (safer). | `function f(){log(this)}f()`→window (non-strict), undefined (strict) |
| 79 | Implicit binding? | "Method call: `this` is object owning method." | "Who called me?" - object before dot becomes `this`. | `const obj={name:"Game",greet(){log(this.name)}};obj.greet()`→"Game" |
| 80 | Explicit binding? | "`call`/`apply`/`bind` explicitly set `this`." | Name tags at party - tell function exactly who it is. | `function g(){log(this.name)}const obj={name:"P"};g.call(obj)`→"P" |
| 81 | `call` vs `apply` vs `bind`? | "`call`: args separate. `apply`: args array. `bind`: returns new function." | Call now with args, call now with array, or create bound function. | `g.call(obj,a,b,c);g.apply(obj,[a,b,c]);const b=g.bind(obj);b(a,b,c)` |
| 82 | `new` binding? | "`new`: `this` is newly created object returned." | Factory - blank object, set as `this`, run constructor, return. | `function P(n){this.name=n}const p=new P("A");p.name`→"A" |
| 83 | `this` in arrow functions? | "Arrow has no own `this`; inherits from enclosing scope." | Remembers "me" from birth. Doesn't change by caller. | `const obj={x:1,fn:()=>log(this.x)};obj.fn()`→undefined (inherits global) |
| 84 | Arrow functions fix callback `this`? | "Preserve `this` from outer scope, avoid 'lost this'." | Name tag stays on, no matter who calls you. | `class G{start(){setTimeout(()=>this.play(),1000)}}` - `this` is G |
| 85 | "Lost this" problem? | "Passing method as callback: `this` becomes global/undefined." | Give someone your phone - it's "their" phone now. | `const fn=obj.method;fn()` - `this` not obj! Use `bind` or arrow |
| 86 | Fix `this` in event listeners? | "Use arrow functions or `bind` to preserve context." | DOM sets `this` to element. Arrow keeps your object as `this`. | `btn.addEventListener("click",()=>this.handleClick())` |
| 87 | `this` in constructors? | "`this` is instance being created." | Building house - `this` is house under construction. | `class G{constructor(){this.players=new Map()}}` - `this` is new G |
| 88 | `this` in class methods? | "Implicit binding - `this` is instance when called." | Same as object methods. Called on instance = `this` is that instance. | `const g=new G();g.playTurn()` - inside, `this` is `g` |
| 89 | `this` in static methods? | "`this` is class constructor, not instance." | Class-level. `this` useful for calling other statics. | `class G{static create(){return new this()}}` - `this` is `G` |
| 90 | Determine `this` at runtime? | "Call site analysis: new>explicit>implicit>default." | Called with `new`? First arg to `call`/`apply`/`bind`? Method call? Default. | `const obj={fn(){log(this)}};new obj.fn()`→new object (new wins) |
| 91 | `this` in global scope? | "Browser: `window`. Node: `global` or `undefined` in modules." | Container for everything. Outermost context. | `log(this)` in browser→Window. In Node module→undefined |
| 92 | Strict mode effect on `this`? | "Default binding = undefined instead of global." | "No assumptions" - no `this` specified = undefined. Catches bugs. | `'use strict';function f(){log(this)}f()`→undefined |
| 93 | `this` in IIFEs? | "Follows default binding - global or undefined in strict." | Just a function call. No special treatment. | `(function(){log(this)})()`→window (non-strict), undefined (strict) |
| 94 | Explicitly pass `this`? | "Use `call` or `apply` to invoke with specific `this`." | Lend identity card - function runs as if it were you. | `function g(){log(this.name)}g.call({name:"P"})`→"P" |
| 95 | Partial application with `bind`? | "Preset some args, create function with fewer params." | Default settings. New function needs fewer args when called. | `function g(greeting,name){log(greeting,name)}const sayHello=g.bind(null,"Hello");sayHello("W")`→"Hello W" |
| 96 | `this` in nested functions? | "Nested regular functions have own `this` (default binding)." | Each regular function gets own `this`. Doesn't inherit parent's. | `const obj={fn(){function inner(){log(this)}inner()}};obj.fn()`→window |
| 97 | `that=this` or `self=this`? | "Store `this` for nested functions before arrows existed." | Pre-ES6 workaround. Arrow functions made this obsolete. | `const self=this;setTimeout(function(){log(self.name)},100)` |
| 98 | `this` in DOM handlers? | "`this` is element event attached to." | Set automatically. Convenient for accessing clicked element. | `btn.addEventListener("click",function(){log(this)})`→the button |
| 99 | `this` in inline HTML handlers? | "`this` is DOM element - but pattern discouraged." | Works but mixing HTML/JS bad practice. Use `addEventListener`. | `<button onclick="log(this)">` logs the button |
| 100 | `this` in jQuery callbacks? | "`this` is DOM element being manipulated." | Follows DOM convention. `$(this)` wraps in jQuery object. | `$('button').click(function(){log(this)})`→clicked button |

---

## SECTION 5: JSON (Questions 101-115)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 101 | `JSON.stringify`? | "Converts JS value to JSON string." | Translator - writes objects as text in JSON format. | `JSON.stringify({name:"P",score:100})`→`'{"name":"P","score":100}'` |
| 102 | `JSON.parse`? | "Parses JSON string to JS value." | Reading blueprint - builds actual object from text. | `JSON.parse('{"name":"P","score":100}')`→`{name:"P",score:100}` |
| 103 | JSON for LocalStorage? | "LocalStorage only strings; JSON serializes objects." | Text-only box. Convert objects to text, back when retrieving. | `localStorage.setItem("game",JSON.stringify(state))` |
| 104 | JSON types? | "Objects, arrays, strings, numbers, booleans, null. Not functions, undefined, circular refs." | Simple language - basic types only. Others stripped or error. | `JSON.stringify({fn:()=>{},x:undefined,y:1})`→`'{"y":1}'` |
| 105 | Functions stringified? | "Omitted - cannot serialize." | JSON doesn't understand. Silently dropped. | `JSON.stringify({name:"G",play(){}})`→`'{"name":"G"}'` |
| 106 | `undefined` stringified? | "Omitted in objects; `null` in arrays." | "Nothing here" - skip in objects, `null` in arrays for length. | `JSON.stringify({x:undefined})`→`'{}'`. `JSON.stringify([1,undefined,3])`→`'[1,null,3]'` |
| 107 | Circular reference? | "Object references itself - breaks JSON." | Mirror reflecting mirror - infinite. JSON can't represent infinity. | `const obj={};obj.self=obj;JSON.stringify(obj)`→TypeError |
| 108 | Handle circular refs? | "Replacer function detects and handles." | Track seen objects, replace circular with placeholder. | `const seen=new WeakSet();JSON.stringify(obj,(k,v)=>{if(typeof v==='object'&&v!==null){if(seen.has(v))return'[Circular]';seen.add(v)}return v})` |
| 109 | `replacer` parameter? | "Function or array filtering/transforming values." | Control what stringifies and how. Function gets k/v, returns what to use. | `JSON.stringify(obj,['name','score'])` only includes those keys |
| 110 | `reviver` parameter? | "Transforms values during parsing - inverse of replacer." | Quality inspector - check each, transform if needed. | `JSON.parse(json,(k,v)=>{if(k==='date')return new Date(v);return v})` |
| 111 | Preserve Date objects? | "Dates become ISO strings; use reviver to reconstruct." | JSON has no Date type. String like "2024-01-01T00:00:00Z". | `JSON.stringify({now:new Date()})`→`{"now":"2024-01-01..."}`. Parse with reviver |
| 112 | `space` parameter? | "Controls formatting - indentation for readable output." | Single vs double spacing. Number = indent spaces. | `JSON.stringify(obj,null,2)` pretty. `JSON.stringify(obj)` compact |
| 113 | `JSON.parse` throws? | "Invalid JSON syntax - unquoted keys, trailing commas, single quotes." | Strict format. Common mistakes break parsing. | `JSON.parse("{name:'P'}")`→SyntaxError. Must be `{"name":"P"}` |
| 114 | Safely parse JSON? | "Wrap in try-catch for graceful handling." | Check package before opening. Try, catch, fallback. | `try{const d=JSON.parse(s)}catch(e){log('Invalid');d=default}` |
| 115 | `toJSON` vs `JSON.stringify`? | "`toJSON` customizes object's JSON representation." | Method called during stringify. "Represent me this way." | `class P{toJSON(){return{n:this.name}}}JSON.stringify(new P('A'))`→`'{"n":"A"}'` |

---

## SECTION 6: ASYNC JAVASCRIPT (Questions 116-135)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 116 | What is a Promise? | "Value that may not exist yet but will resolve in future." | Restaurant receipt - get immediately, food comes later. | `const p=fetch('/api/data');p.then(d=>log(d))` |
| 117 | Promise states? | "Pending, fulfilled, rejected. Once settled, can't change." | Light switch - pending middle, flips to on/off, stays there. | `new Promise((resolve,reject)=>{/*pending*/resolve(v)/*fulfilled*/})` |
| 118 | `Promise.then()`? | "Attaches callbacks for fulfill/reject, returns new Promise." | "When order ready, do this." Chainable. | `fetch('/api').then(r=>r.json()).then(d=>log(d))` |
| 119 | `Promise.catch()`? | "Attaches callback for reject - error handling." | "If something wrong, do this instead." | `fetch('/api').then(...).catch(e=>log('Failed:',e))` |
| 120 | `Promise.finally()`? | "Callback runs regardless of fulfill/reject - cleanup." | "No matter what, clean up after yourself." | `showLoading();fetch('/api').then(...).catch(...).finally(()=>hideLoading())` |
| 121 | `Promise.all()`? | "Waits for all Promises; rejects if any reject." | Wait for all friends before movie. One can't make it = off. | `Promise.all([fetch('/a'),fetch('/b'),fetch('/c')]).then(([a,b,c])=>...)` |
| 122 | `Promise.race()`? | "First Promise to settle wins." | Race - first to finish wins, others ignored. Useful for timeouts. | `Promise.race([fetch('/api'),new Promise((_,r)=>setTimeout(r,5000))])` |
| 123 | `Promise.allSettled()`? | "Waits for all Promises regardless of success/failure." | Get everyone's answer, even if some said no. | `Promise.allSettled([fetch('/a'),fetch('/b')]).then(rs=>rs.forEach(r=>log(r.status)))` |
| 124 | `async/await`? | "Syntactic sugar over Promises - async looks sync." | Recipe looks step-by-step, some steps "pause" without blocking. | `async function getData(){const r=await fetch('/api');const d=await r.json();return d}` |
| 125 | `async` keyword? | "Marks function async, always returns Promise." | Tells JS "this does async stuff." Wraps return in Promise. | `async function f(){return 1}f().then(v=>log(v))`→1 (wrapped) |
| 126 | `await` keyword? | "Pauses execution until Promise resolves, returns value." | "Wait here until finishes, then continue." Pauses function, not program. | `const r=await diceRoll();log(r)` - waits, then logs |
| 127 | `await` outside `async`? | "ES2022+ top-level await allowed in modules." | Needs async context. Modules allow top-level. | `// module.mjs const d=await fetch('/api')` valid! |
| 128 | Errors with `async/await`? | "Use try-catch - rejected Promises throw." | Looks like sync error handling. Rejected = thrown exception. | `try{const d=await fetch('/api')}catch(e){log('Failed:',e)}` |
| 129 | Don't `await` a Promise? | "Promise runs but you don't wait - continues immediately." | Start task but don't check when done. Fire and forget. | `async function f(){fetch('/api');log('Done')}` - "Done" before fetch! |
| 130 | Run async ops concurrently? | "Start all, then `Promise.all` for results." | Don't await in loop (sequential). Start all, wait together. | `const[a,b,c]=await Promise.all([fetchA(),fetchB(),fetchC()])` |
| 131 | Callback hell? | "Nested callbacks unreadable; Promises flatten." | Nested parentheses hard to track. Promises chain linearly. | Bad: `a(()=>b(()=>c(()=>d())))`. Good: `await a();await b()` |
| 132 | Your game uses `async/await`? | "For animation delays - `await delay(200)` pauses without blocking." | Wait for animations. Move, wait 200ms, continue. Smooth. | `async function update(){await delay(200);updateMarker()}` |
| 133 | `delay` function? | "Promise wrapper around `setTimeout` for await." | JS has no `sleep()`. Wrap `setTimeout` in Promise to await pause. | `const delay=ms=>new Promise(r=>setTimeout(r,ms))` |
| 134 | `async/await` over raw Promises? | "Readability - sequential-looking easier than chains." | Animation flow step-by-step. `await` makes clear. | `await delay(200);update();await delay(200);update()` |
| 135 | Concurrency vs parallelism? | "Concurrency = managing multiple tasks. Parallelism = simultaneous execution." | Chef juggling dishes vs multiple chefs cooking. JS concurrent, not parallel. | JS: one thread, interleaved tasks. Web Workers: multiple threads |

---

## SECTION 7: ES6 MODULES (Questions 136-150)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 136 | ES6 Modules? | "Standardized module system with import/export." | LEGO instructions - define what you need (import), provide (export). | `import{helper}from'./utils.js';export function main(){...}` |
| 137 | `import` vs `require`? | "`import` = ES6 static. `require` = CommonJS dynamic." | Pre-order (compile-time optimized) vs buy on spot (runtime flexible). | ES6: `import{x}from'./mod.js'`. CommonJS: `const{x}=require('./mod.js')` |
| 138 | Named vs default exports? | "Named = multiple by name. Default = one main export." | Menu pick by name vs chef's special - one main thing. | `export const a=1,b=2`→`import{a,b}from'./mod'`. `export default class G{}`→`import G from'./game'` |
| 139 | Multiple default exports? | "No - one default, many named allowed." | One front door, many side doors. | `export default class G{}` one only. `export class P{}export class T{}` many named |
| 140 | `import * as` vs named? | "`* as` imports all to namespace object; named specific items." | "Whole toolbox" vs "just hammer and screwdriver." | `import*as utils from'./utils';utils.helper()` vs `import{helper}from'./utils';helper()` |
| 141 | Dynamic `import()`? | "Function loading modules at runtime, returns Promise." | Order delivery - decide at runtime, arrives when ready. Lazy loading. | `const m=await import('./heavy.js');m.heavyFunction()` |
| 142 | `type="module"` in scripts? | "Enables ES6 module, import/export." | Without it, no imports allowed. Attribute enables modern system. | `<script type="module" src="app.js">` |
| 143 | Module scope vs global? | "Each module own scope; variables don't leak." | Separate apartments - each file isolated. Export to share. | `// a.js let x=1` `// b.js let x=2` - different x's, no conflict |
| 144 | Module loading order? | "Load and execute in dependency order." | Build house - foundation, walls, roof. Imports first. | `// main.js import{a}from'./a.js'` - `a.js` runs before `main.js` continues |
| 145 | Tree shaking? | "Dead code elimination - remove unused exports." | Pruning tree - cut unused branches. Smaller bundle, faster. | `export{a,b,c}` - if only `a` imported, bundler removes b,c |
| 146 | Static vs dynamic imports? | "Static = parse-time analysis. Dynamic = runtime conditional." | Scheduled delivery vs on-demand. | Static: `import{x}from'./mod'`. Dynamic: `if(c)await import('./mod')` |
| 147 | Circular dependencies? | "Allowed but can cause issues - incomplete reference." | A imports B, B imports A. JS handles but first may see incomplete. | `// a.js import{b}from'./b';export const a=1` `// b.js import{a}from'./a';export const b=2` |
| 148 | Module bundling? | "Combine modules to fewer files, optimize for browsers." | Many files = many requests. Bundle to one, minify, optimize. | Webpack/Rollup/Vite: `import`s → `bundle.js` |
| 149 | Import JSON in ES6? | "Use import assertion or fetch and parse." | Tell browser it's JSON, not JS. Or fetch and `response.json()`. | `import gameData from'./data.json'assert{type:'json'}` |
| 150 | ES6 vs CommonJS? | "ES6: static, async, browser-native. CommonJS: dynamic, sync, Node-native." | Different origins, converging. ES6 for browser, CommonJS for Node. | ES6: `import{x}from'./mod'` static. CommonJS: `const x=require('./mod')` dynamic |

---

## Quick Reference: Key Code Locations

| Concept | File | Line | Function/Class |
|---------|------|------|----------------|
| Dice Roll | `game-board.js` | 665 | `diceRoll(ROLL_SIZE)` |
| Player Movement | `grid.js` | 32 | `advance(player, amount)` |
| CyclicQueue | `game.js` | 12 | `CyclicQueue` class |
| Portal Effect | `portalTile.js` | 34 | `effect(game, player)` |
| Card Effect | `cardTile.js` | 31 | `effect(game, player)` |
| No Overlap | `game.js` | 131 | `enforceNoOverlap(player)` |
| Shuffle | `game.js` | 183 | `sort(() => Math.random() - 0.5)` |
| Elimination | `game-board.js` | 608 | Row check logic |
| Win Check | `game.js` | 221 | `checkWinCondition(player)` |
| Save State | `saving-and-loading.js` | 7 | `saveGameState(game)` |
| Load State | `saving-and-loading.js` | 20 | `loadGameState()` |
| Delay | `game-board.js` | 3 | `delay = ms => new Promise(...)` |
| DOM Ready | `game-board.js` | 50 | `DOMContentLoaded` listener |

---

**Ready for the next batch? Reply "Next batch" for 50 more advanced questions on each topic!**

**Good luck with your interview! 🎲🐍🪜**
