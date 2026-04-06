# Emergency Interview Prep
## Part 5: Beginner JavaScript Core Concepts Q&A (100 Questions)

---

## SECTION 1: VARIABLES & DATA TYPES (Questions 1-20)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 1 | What is a variable? | "A named container for storing data." | A labeled box where you keep information. | `let playerName = "Alice";` |
| 2 | What is `let`? | "Declares a variable that can be changed later." | A box whose contents you can replace. | `let score = 0; score = 10;` |
| 3 | What is `const`? | "Declares a variable that cannot be reassigned." | A box with permanent label - can't replace whole box. | `const MAX_PLAYERS = 4;` |
| 4 | What is `var`? | "Old way to declare variables - function scoped." | The old box style - still works but `let`/`const` preferred. | `var oldWay = "don't use me";` |
| 5 | What is a string? | "Text data enclosed in quotes." | Words and letters - anything in quotes. | `let name = "Alice";` or `let name = 'Alice';` |
| 6 | What is a number? | "Numeric data for calculations." | Digits for math - no quotes needed. | `let diceRoll = 6; let price = 19.99;` |
| 7 | What is a boolean? | "True or false value." | Yes/no, on/off, true/false. | `let isGameOver = false;` |
| 8 | What is `null`? | "Intentional absence of value." | Empty box on purpose. | `let winner = null;` |
| 9 | What is `undefined`? | "Variable declared but not assigned a value." | Box exists but nothing inside yet. | `let score; console.log(score);` → undefined |
| 10 | What is an array? | "Ordered list of values." | A row of numbered boxes. | `let players = ["Alice", "Bob", "Carol"];` |
| 11 | How do you get array length? | "Use `.length` property." | Count how many items in the list. | `players.length` → 3 |
| 12 | What is an object? | "Collection of key-value pairs." | A box with named compartments. | `let player = { name: "Alice", score: 100 };` |
| 13 | How do you add to an array? | "Use `.push()` method." | Put something at the end of the list. | `players.push("David");` |
| 14 | How do you remove from an array? | "Use `.pop()` or `.splice()`." | Take something off the end or from middle. | `players.pop();` removes last |
| 15 | What is array index? | "Position number starting from 0." | Box number - first is 0, not 1. | `players[0]` is first player |
| 16 | What is `typeof` operator? | "Returns the data type of a value." | Asks "what kind of thing is this?" | `typeof "hello"` → "string" |
| 17 | What is type coercion? | "Automatic conversion between types." | JavaScript trying to be helpful by converting types. | `"5" + 5` → "55" (number becomes string) |
| 18 | What is type conversion? | "Manual conversion between types." | You explicitly change the type. | `Number("5")` → 5, `String(5)` → "5" |
| 19 | What is `NaN`? | "Not a Number - result of failed number conversion." | Tried to make a number but couldn't. | `Number("hello")` → NaN |
| 20 | What is `Infinity`? | "Represents infinite number value." | Bigger than any number can be. | `1 / 0` → Infinity |

---

## SECTION 2: OPERATORS & EXPRESSIONS (Questions 21-35)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 21 | What is an operator? | "Symbol that performs an operation on values." | Math symbols like +, -, *, /. | `+`, `-`, `*`, `/`, `=`, `===` |
| 22 | What is arithmetic operator? | "Performs math: +, -, *, /, %." | Basic math operations. | `5 + 3`, `10 - 2`, `4 * 2`, `8 / 2` |
| 23 | What is `%` (modulo)? | "Returns remainder after division." | What's left over after dividing. | `10 % 3` → 1 (10 ÷ 3 = 3 remainder 1) |
| 24 | What is assignment operator? | "Assigns value to variable: =." | Put something in the box. | `let score = 100;` |
| 25 | What is comparison operator? | "Compares values: ===, !==, <, >." | Checks if things are equal, greater, less. | `5 === 5` → true, `5 > 3` → true |
| 26 | What is `===` vs `==`? | "`===` checks value AND type; `==` only value." | Strict vs loose equality. Always use `===`. | `5 === "5"` → false. `5 == "5"` → true |
| 27 | What is logical operator? | "Combines conditions: &&, ||, !." | AND, OR, NOT for combining checks. | `if (a && b)`, `if (a || b)`, `if (!a)` |
| 28 | What is `&&` (AND)? | "True if BOTH conditions are true." | Both must be yes. | `true && true` → true. `true && false` → false |
| 29 | What is (OR)? | "True if AT LEAST ONE condition is true." | Either one can be yes. | `true || false` → true. `false || false` → false |
| 30 | What is `!` (NOT)? | "Reverses boolean value." | Opposite of what you have. | `!true` → false. `!false` → true |
| 31 | What is increment operator? | "Adds 1: ++." | Go up by one. | `let x = 5; x++;` → x is 6 |
| 32 | What is decrement operator? | "Subtracts 1: --." | Go down by one. | `let x = 5; x--;` → x is 4 |
| 33 | What is `+=` operator? | "Adds and assigns: x += 5 means x = x + 5." | Shorthand for adding to existing value. | `let score = 10; score += 5;` → 15 |
| 34 | What is ternary operator? | "Shorthand if-else: condition ? trueValue : falseValue." | Quick way to choose between two values. | `let message = won ? "You win!" : "Try again";` |
| 35 | What is operator precedence? | "Order in which operations are performed." | Multiplication before addition, parentheses first. | `2 + 3 * 4` → 14 (not 20) |

---

## SECTION 3: CONTROL FLOW (Questions 36-55)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 36 | What is control flow? | "Order in which code statements execute." | The path code takes through your program. | Top to bottom, with branches and loops |
| 37 | What is an `if` statement? | "Runs code only if condition is true." | Decision maker - do this IF that. | `if (score > 100) { alert("Win!"); }` |
| 38 | What is `else`? | "Runs code when `if` condition is false." | Otherwise do this. | `if (won) { celebrate(); } else { retry(); }` |
| 39 | What is `else if`? | "Checks another condition if first is false." | If not that, check this. | `if (a) {...} else if (b) {...} else {...}` |
| 40 | What is a `switch` statement? | "Checks value against multiple cases." | Multiple-choice decision. | `switch(dice) { case 1: ...; break; case 2: ...; }` |
| 41 | What is a `for` loop? | "Repeats code a specific number of times." | Do this X times. | `for (let i = 0; i < 5; i++) { console.log(i); }` |
| 42 | What is loop initialization? | "Setting up the loop variable: let i = 0." | Starting point for counting. | `let i = 0` starts at zero |
| 43 | What is loop condition? | "Test that determines if loop continues: i < 5." | Keep going while this is true. | `i < 5` - stop when i reaches 5 |
| 44 | What is loop increment? | "How loop variable changes: i++." | Count up (or down) each time. | `i++` adds 1 each iteration |
| 45 | What is a `while` loop? | "Repeats while condition is true." | Keep doing this as long as condition holds. | `while (!gameOver) { playTurn(); }` |
| 46 | What is `break`? | "Exits loop immediately." | Stop right now, get out of loop. | `if (found) break;` |
| 47 | What is `continue`? | "Skips to next loop iteration." | Skip this one, go to next. | `if (skip) continue;` |
| 48 | What is an infinite loop? | "Loop that never ends (usually a bug)." | Stuck doing something forever. | `while (true) { ... }` without break |
| 49 | What is `for...of` loop? | "Loops over values in iterable (array, string)." | Go through each item one by one. | `for (let player of players) { console.log(player); }` |
| 50 | What is `for...in` loop? | "Loops over keys in object." | Go through each property name. | `for (let key in player) { console.log(key, player[key]); }` |
| 51 | What is a code block? | "Code inside curly braces {}." | Group of statements treated as one unit. | `if (true) { statement1; statement2; }` |
| 52 | What is nesting? | "Putting control structures inside each other." | Loop inside loop, if inside if. | `for (...) { if (...) { ... } }` |
| 53 | What is early return? | "Exiting function early with `return`." | Stop function now, give answer back. | `if (!valid) return;` |
| 54 | What is truthy vs falsy? | "Values that act like true/false in conditions." | Some values count as true, some as false. | `0`, `""`, `null`, `undefined`, `false` are falsy |
| 55 | What is short-circuit evaluation? | "Stops evaluating as soon as result is known." | If first part decides answer, skip rest. | `false && anything()` → false (anything() never runs) |

---

## SECTION 4: FUNCTIONS (Questions 56-75)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 56 | What is a function? | "Reusable block of code that performs a task." | Recipe you can use multiple times. | `function greet(name) { return "Hello " + name; }` |
| 57 | What is function declaration? | "Creates named function: function name() {}." | Standard way to make a function. | `function rollDice() { return Math.random() * 6; }` |
| 58 | What is function expression? | "Assigns function to variable: const fn = function() {}." | Function stored in a variable. | `const roll = function() { return Math.random(); };` |
| 59 | What is arrow function? | "Shorter function syntax: () => {}." | Quick way to write small functions. | `const roll = () => Math.random() * 6;` |
| 60 | What is a parameter? | "Variable in function definition." | Placeholder for input. | `function greet(name)` - `name` is parameter |
| 61 | What is an argument? | "Actual value passed to function." | Real thing put in placeholder. | `greet("Alice")` - "Alice" is argument |
| 62 | What is `return`? | "Sends value back from function." | The answer the function gives. | `function add(a, b) { return a + b; }` |
| 63 | What is `void` function? | "Function that doesn't return a value." | Does something but gives nothing back. | `function log(message) { console.log(message); }` |
| 64 | What is function scope? | "Variables declared in function only exist there." | Function's private box of variables. | `function fn() { let x = 5; } // x not accessible outside` |
| 65 | What is a callback function? | "Function passed as argument to another function." | "When done, call this function." | `setTimeout(() => console.log("Done"), 1000);` |
| 66 | What is a higher-order function? | "Function that takes or returns another function." | Function that works with functions. | `setTimeout`, `addEventListener` |
| 67 | What is function hoisting? | "Function declarations moved to top of scope." | Can call function before it's defined. | `greet(); function greet() {}` works |
| 68 | What is default parameter? | "Parameter with preset value if not provided." | Use this value if nothing given. | `function greet(name = "Player") { ... }` |
| 69 | What is rest parameter? | "Collects remaining arguments into array." | Gather extra arguments into a list. | `function sum(...numbers) { ... }` |
| 70 | What is spread operator? | "Expands array into individual elements." | Unpack a list into separate items. | `Math.max(...[1, 5, 3])` → 5 |
| 71 | What is function overloading? | "JavaScript doesn't support true overloading." | Can't have multiple functions with same name. | Last definition wins in JS |
| 72 | What is recursion? | "Function calling itself." | Function that uses itself to solve problem. | `function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }` |
| 73 | What is pure function? | "Function with no side effects, same input = same output." | Doesn't change anything outside itself. | `function add(a, b) { return a + b; }` |
| 74 | What is side effect? | "Function changes something outside itself." | Modifies external state. | `let x = 0; function increment() { x++; }` |
| 75 | What is function composition? | "Combining functions where output of one is input of next." | Chain of functions working together. | `const result = fn3(fn2(fn1(input)));` |

---

## SECTION 5: ARRAYS & OBJECTS (Questions 76-90)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 76 | What is array indexing? | "Accessing item by position number." | Pick a box by its number. | `arr[0]` gets first item |
| 77 | What is `.length` property? | "Number of items in array." | How many things in the list. | `[1, 2, 3].length` → 3 |
| 78 | What is `.push()`? | "Adds item to end of array." | Put something at the back. | `arr.push(4)` → [1,2,3,4] |
| 79 | What is `.pop()`? | "Removes and returns last item." | Take off the back. | `arr.pop()` → 3, array is [1,2] |
| 80 | What is `.shift()`? | "Removes and returns first item." | Take off the front. | `arr.shift()` → 1, array is [2,3] |
| 81 | What is `.unshift()`? | "Adds item to beginning of array." | Put something at the front. | `arr.unshift(0)` → [0,1,2,3] |
| 82 | What is `.indexOf()`? | "Finds position of item in array." | Where is this thing? | `[1,2,3].indexOf(2)` → 1 |
| 83 | What is `.includes()`? | "Checks if array contains item." | Is this in here? | `[1,2,3].includes(2)` → true |
| 84 | What is `.slice()`? | "Returns portion of array without modifying original." | Copy a section. | `[1,2,3,4].slice(1,3)` → [2,3] |
| 85 | What is `.splice()`? | "Adds/removes items from array (modifies original)." | Cut and paste in array. | `[1,2,3].splice(1,1)` removes 2 |
| 86 | What is `.forEach()`? | "Runs function for each array item." | Do this to every item. | `arr.forEach(item => console.log(item));` |
| 87 | What is `.map()`? | "Creates new array by transforming each item." | Change every item, get new list. | `[1,2,3].map(x => x * 2)` → [2,4,6] |
| 88 | What is `.filter()`? | "Creates new array with items passing test." | Keep only what matches. | `[1,2,3,4].filter(x => x > 2)` → [3,4] |
| 89 | What is `.find()`? | "Returns first item matching condition." | Find the first one that matches. | `[1,2,3].find(x => x > 1)` → 2 |
| 90 | What is object destructuring? | "Extract properties into variables." | Pull out values by name. | `const { name, score } = player;` |

---

## SECTION 6: EVENTS & ASYNC BASICS (Questions 91-100)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 91 | What is an event? | "Something that happens (click, keypress, load)." | User action or browser notification. | Click, scroll, keypress, page load |
| 92 | What is event listener? | "Function that waits for and responds to events." | "When this happens, do that." | `btn.addEventListener('click', handleClick);` |
| 93 | What is `addEventListener()`? | "Attaches event handler to element." | Connect action to response. | `element.addEventListener('click', fn);` |
| 94 | What is a click event? | "Fires when user clicks element." | Mouse button pressed and released. | `button.addEventListener('click', () => alert('Hi'));` |
| 95 | What is `setTimeout()`? | "Runs code after specified delay." | Wait this long, then do this. | `setTimeout(() => console.log('Done'), 1000);` |
| 96 | What is `setInterval()`? | "Repeatedly runs code at specified interval." | Do this every X milliseconds. | `setInterval(() => updateClock(), 1000);` |
| 97 | What is `clearTimeout()`? | "Cancels scheduled timeout." | Stop that delayed action. | `const id = setTimeout(fn, 1000); clearTimeout(id);` |
| 98 | What is `clearInterval()`? | "Stops repeating interval." | Stop that repeating action. | `const id = setInterval(fn, 1000); clearInterval(id);` |
| 99 | What is synchronous code? | "Code that runs line by line, waiting for each." | One thing at a time, in order. | `console.log(1); console.log(2);` → 1, then 2 |
| 100 | What is asynchronous code? | "Code that can run later without blocking." | Start something, continue without waiting. | `setTimeout(() => console.log(2), 0); console.log(1);` → 1, then 2 |

---

## Quick Reference: Beginner JavaScript Interview Tips

### Key Concepts to Know:
1. **Variables**: `let`, `const`, difference from `var`
2. **Data Types**: string, number, boolean, array, object
3. **Operators**: arithmetic, comparison, logical
4. **Control Flow**: if/else, for loops, while loops
5. **Functions**: declaration, expression, arrow functions
6. **Arrays**: push, pop, forEach, map, filter
7. **Objects**: properties, methods, destructuring
8. **Events**: addEventListener, click events
9. **Async**: setTimeout, callbacks

### Common Interview Questions:
- "What is the difference between `let` and `const`?"
- "How do you add an item to an array?"
- "What is a callback function?"
- "Explain event listeners."
- "What is the DOM?"

### Practice These:
- Write a function that takes an array and returns the sum
- Write a loop that prints numbers 1 to 10
- Create an object representing a player with name and score
- Add a click event listener to a button

---

## Your Project Code Examples

### Player Movement:
```javascript
function movePlayer(player, spaces) {
    let newPosition = player.position + spaces;
    if (newPosition > 100) {
        newPosition = 100; // Can't go past 100
    }
    player.position = newPosition;
    return player.position;
}
```

### Dice Roll:
```javascript
function rollDice() {
    return Math.floor(Math.random() * 6) + 1; // 1 to 6
}
```

### Check Win:
```javascript
function checkWin(player) {
    if (player.position === 100) {
        return true; // Winner!
    }
    return false;
}
```

### Update Display:
```javascript
function updatePlayerMarker(playerId, position) {
    const marker = document.getElementById(`player-${playerId}`);
    marker.style.transform = `translateX(${position * 10}px)`;
}
```

---

**Total Coverage: 500 Questions (200 Beginner + 300 Mixed)**

**Good luck with your interview! 🎲🐍🪜**
