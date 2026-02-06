# Complete JavaScript Guide

---

## Table of Contents

1. [Variables & Declarations](#variables--declarations)
2. [Data Types](#data-types)
3. [Type Coercion](#type-coercion)
4. [Hoisting](#hoisting)
5. [Scope](#scope)
6. [Operators & Comparisons](#operators--comparisons)
7. [Falsey Values](#falsey-values)
8. [Functions](#functions)
9. [Classes](#classes)
10. [DOM Manipulation](#dom-manipulation)
11. [Events](#events)
12. [Asynchronous JavaScript](#asynchronous-javascript)
13. [Regular Expressions](#regular-expressions)
14. [Built-in Objects](#built-in-objects)
15. [Window & Location Methods](#window--location-methods)
16. [Dialog Boxes](#dialog-boxes)
17. [Array Methods](#array-methods)
18. [Advanced Concepts](#advanced-concepts)

---

## Variables & Declarations

### Variable Declaration Methods

JavaScript provides three ways to declare variables, each with different characteristics:

#### `var` - Function-Scoped (Legacy)

```javascript
var myName = "andrew";
myName = 30; // Can be reassigned
myName = true; // Can be reassigned
myName = null; // Can be reassigned
```

**Characteristics:**

- Function-scoped or globally-scoped
- Not block-scoped (ignores `{}` blocks like if, for, while)
- Can be reassigned and redeclared
- Hoisted to the top of its scope and initialized with `undefined`

#### `let` - Block-Scoped (Modern)

**Characteristics:**

- Block-scoped (accessible only within the nearest `{}`)
- Can be reassigned, but NOT redeclared in the same scope
- Hoisted but not initialized (Temporal Dead Zone)
- Cannot be accessed before declaration

```javascript
let x = 5;
{
  console.log(x); // ReferenceError - cannot access x
  let x; // New block-scoped x
}
```

#### `const` - Block-Scoped (Immutable Reference)

**Characteristics:**

- Block-scoped (same rules as `let`)
- Cannot be reassigned or redeclared
- Must be initialized at declaration
- For objects and arrays, the reference is immutable, but properties/elements can be modified

```javascript
const user = { name: "John" };
user.name = "Jane"; // ✅ Allowed - modifying property
user = {}; // ❌ Error - cannot reassign reference
```

### Comparison Table

| Feature       | `var`                            | `let`                    | `const`                  |
| ------------- | -------------------------------- | ------------------------ | ------------------------ |
| **Scope**     | Function/Global                  | Block                    | Block                    |
| **Reassign**  | ✅ Yes                           | ✅ Yes                   | ❌ No                    |
| **Redeclare** | ✅ Yes                           | ❌ No                    | ❌ No                    |
| **Hoisting**  | Yes (initialized to `undefined`) | Yes (Temporal Dead Zone) | Yes (Temporal Dead Zone) |
| **Best For**  | Avoid in modern code             | When reassignment needed | Default choice           |

### Best Practices

```
1. Use const by default
2. Use let when you need to reassign
3. Avoid var in modern JavaScript (ES6+)
```

---

## Data Types

JavaScript has **7 primitive data types**:

### 1. String

Represents text values enclosed in quotes.

```javascript
const greeting = "Hello";
const name = "John";
const template = `Hello ${name}`;
```

### 2. Number

Represents integers and floating-point numbers.

```javascript
const age = 42;
const pi = 3.14;
const negative = -10;
```

**Special values:**

- `Infinity` - represents positive infinity
- `-Infinity` - represents negative infinity
- `NaN` - represents "Not-a-Number" (result of invalid math)

### 3. BigInt

Represents integers larger than `Number.MAX_SAFE_INTEGER` (2^53 - 1).

```javascript
const largeNumber = 9007199254740991n;
const bigIntAddition = 10n + 20n; // 30n
```

### 4. Boolean

Represents logical values.

```javascript
const isActive = true;
const isDeleted = false;
```

### 5. Undefined

A variable declared but not assigned a value.

```javascript
let x;
console.log(x); // undefined
```

### 6. Null

Represents the intentional absence of a value.

```javascript
let user = null; // Explicitly set to nothing
```

### 7. Symbol

Represents a unique and immutable identifier (rarely used).

```javascript
const id = Symbol("id");
const id2 = Symbol("id");
console.log(id === id2); // false - each Symbol is unique
```

### Important Notes

- Primitive values are **immutable** - you cannot change a primitive value itself
- Primitives are compared **by value**: `"hello" === "hello"` returns `true`
- Built-in object wrappers exist but are less efficient: `new String("hello")` creates an object, not a primitive

```javascript
// Inefficient - creates objects
const x = new String("Andrew");
const y = new String("Andrew");
console.log(x === y); // false - different objects

// Efficient - primitives
const a = "Andrew";
const b = "Andrew";
console.log(a === b); // true - same value
```

---

## Type Coercion

**Type coercion** (implicit casting) occurs when JavaScript automatically converts a value from one type to another.

### Examples of Type Coercion

```javascript
const x = 10;
const y = "20";
console.log(x - y); // -10 (y converted to number)
console.log(x + y); // "1020" (x converted to string)

const str = "menna";
const str2 = "shata";
console.log(str - str2); // NaN (strings cannot be converted to valid numbers)

console.log(x + false); // 11 (false converted to 0)
console.log(x + true); // 11 (true converted to 1)

console.log(x + undefined); // NaN (undefined cannot be coerced to number)
```

### Type Coercion Rules

- **Subtraction (-)**: Always attempts numeric coercion
- **Addition (+)**: If either operand is a string, concatenation occurs
- **Boolean coercion**: `true` → 1, `false` → 0
- **Undefined coercion**: Cannot be reliably converted

### typeof Operator

```javascript
console.log(typeof 42); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof Symbol("id")); // "symbol"
console.log(typeof null); // "object" (historical bug)
console.log(typeof NaN); // "number" (NaN is a number type!)
```

---

## Hoisting

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope before code execution.

### var Hoisting

`var` declarations are hoisted and initialized with `undefined`:

```javascript
console.log(x); // undefined (hoisted but not assigned)
var x = 50;
console.log(x); // 50
```

This is equivalent to:

```javascript
var x; // Declaration hoisted
console.log(x); // undefined
x = 50; // Assignment stays in place
console.log(x); // 50
```

### let and const Hoisting

`let` and `const` are hoisted but NOT initialized (Temporal Dead Zone):

```javascript
console.log(y); // ReferenceError - cannot access before initialization
let y = 30;
```

### Function Hoisting

Function declarations are hoisted completely (both declaration and body):

```javascript
myFunc(5, 3); // Works! Outputs 8

function myFunc(x, y) {
  return x + y;
}
```

Function expressions are NOT hoisted:

```javascript
myFunc(); // TypeError - myFunc is undefined

const myFunc = function (x, y) {
  return x + y;
};
```

### Global Variables

Any variable assigned without declaration becomes a global variable:

```javascript
zzz = 300; // Global variable (bad practice!)
console.log(window.zzz); // 300
```

---

## Scope

### Block Scope vs Function Scope

The scope determines where a variable is accessible.

```javascript
// var is NOT block-scoped
{
  var x = 10;
}
console.log(x); // 10 (accessible outside block)

// let and const ARE block-scoped
{
  let y = 20;
  const z = 30;
}
console.log(y); // ReferenceError
console.log(z); // ReferenceError
```

### Scope Chain

JavaScript looks for variables in the current scope, then parent scopes, until reaching global scope:

```javascript
const global = "global";

function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";
    console.log(innerVar); // "inner" - found in local scope
    console.log(outerVar); // "outer" - found in parent scope
    console.log(global); // "global" - found in global scope
  }

  inner();
}

outer();
```

---

## Operators & Comparisons

### Equality Operators

**`==` (loose equality)** - compares values, performs type coercion:

```javascript
const age = 30;
console.log(age == "30"); // true (string converted to number)
console.log(age != "30"); // false
```

**`===` (strict equality)** - compares values AND types, no coercion:

```javascript
const age = 30;
console.log(age === "30"); // false (different types)
console.log(age === 30); // true
```

**Best practice:** Always use `===` and `!==` to avoid unexpected type coercion bugs.

### Logical Operators

```javascript
const x = 20;
const age = 30;

console.log(x > 5 && age < 40); // true && true → true
console.log(x > 30 && age < 40); // false && true → false
console.log(x > 30 || age < 40); // false || true → true
```

### Comparison Examples

```javascript
console.log(3 < 2 < 1); // (false < 1) → (0 < 1) → true
```

---

## Falsey Values

In JavaScript, the following values are considered **falsey** and evaluate to `false` in boolean contexts:

| Value       | Description                               |
| ----------- | ----------------------------------------- |
| `false`     | The boolean keyword false                 |
| `0`         | The number zero (including 0.0)           |
| `-0`        | Negative zero                             |
| `0n`        | BigInt zero                               |
| `""`        | Empty string                              |
| `null`      | Intentional absence of value              |
| `undefined` | Variable not assigned a value             |
| `NaN`       | Result of invalid mathematical operations |

### All Other Values Are Truthy

```javascript
if ("hello") {
  console.log("Truthy!"); // Executes
}

if ([]) {
  console.log("Arrays are truthy!"); // Executes (even empty arrays!)
}

if ({}) {
  console.log("Objects are truthy!"); // Executes
}

if (0) {
  console.log("This won't execute"); // Skipped
}
```

---

## Functions

### Function Declaration

Hoisted completely - can be called before declaration:

```javascript
myFunc(5, 3); // Works!

function myFunc(x, y) {
  return x + y;
}
```

### Function Expression

Not hoisted - must be declared before use:

```javascript
const greet = function (name) {
  return "Hello " + name;
};

greet("John"); // "Hello John"
```

### Arrow Functions (ES6)

Concise syntax with implicit return for single expressions:

```javascript
// Multi-line
const greet = (name) => {
  return "Hello " + name;
};

// Single expression (implicit return)
const greet = (name) => "Hello " + name;

// Single parameter (parentheses optional)
const square = (x) => x * x;

// Multiple parameters
const add = (a, b) => a + b;

// No parameters
const random = () => Math.random();
```

**Important:** Arrow functions don't have their own `this` binding - they inherit from the enclosing scope:

```javascript
const user = {
  name: "John",
  sayName() {
    // Arrow function inherits 'this' from parent scope
    setTimeout(() => {
      console.log(this.name); // "John" - works correctly
    }, 1000);
  },
};
```

### Anonymous Functions

Functions without names, typically used as callbacks:

```javascript
setTimeout(function () {
  console.log("Executed after 1 second");
}, 1000);

button.addEventListener("click", function (e) {
  console.log("Button clicked!");
});
```

### Immediately Invoked Function Expression (IIFE)

Executes immediately upon definition:

```javascript
(function () {
  console.log("Runs immediately!");
  const privateVar = "hidden"; // Private scope
})();

// With parameters
(function (name) {
  console.log("Hello " + name);
})("John");
```

**Use case:** Creating a private scope to avoid polluting the global namespace.

### Higher-Order Functions

Functions that accept or return other functions:

```javascript
const multiplier = (factor) => {
  return (num) => {
    return num * factor;
  };
};

const double = multiplier(2);
console.log(double(5)); // 10
console.log(double(3)); // 6
```

### Async Functions

Enable clean handling of asynchronous operations (see [Asynchronous JavaScript](#asynchronous-javascript)):

```javascript
async function fetchData() {
  const data = await fetch("/api/data");
  return await data.json();
}
```

### Number Checkers

```javascript
isNaN(value); // Check if NOT a number (unreliable - uses coercion)
Number.isNaN(value); // More reliable (no coercion)

isFinite(value); // Check if number (not NaN or Infinity)
Number.isFinite(value); // More reliable
```

**Note:** Use `Number.isNaN()` and `Number.isFinite()` for more reliable results, as the global versions perform type coercion first.

---

## Classes

### Basic Class Structure

```javascript
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  displayInfo() {
    console.log(`${this.name} is ${this.age} years old`);
  }
}

const user = new User("John", 30);
user.displayInfo(); // "John is 30 years old"
```

### Constructor Method

Runs automatically when you create an instance:

```javascript
class Car {
  constructor(brand, color) {
    this.brand = brand;
    this.color = color;
  }
}

const myCar = new Car("Toyota", "red");
console.log(myCar.brand); // "Toyota"
console.log(myCar.color); // "red"
```

### Methods

Functions inside a class that perform actions:

```javascript
class Calculator {
  constructor(num) {
    this.num = num;
  }

  add(x) {
    return this.num + x;
  }

  multiply(x) {
    return this.num * x;
  }
}

const calc = new Calculator(10);
console.log(calc.add(5)); // 15
console.log(calc.multiply(2)); // 20
```

### Inheritance with `extends`

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name} barks!`);
  }
}

const dog = new Dog("Buddy");
dog.speak(); // "Buddy makes a sound"
dog.bark(); // "Buddy barks!"
```

### `super()` - Accessing Parent Methods

**Important:** If you extend a class and implement a constructor, you **must** call `super()`:

```javascript
class Animal {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  info() {
    console.log(`${this.name} is a ${this.type}`);
  }
}

class Dog extends Animal {
  constructor(name, type, breed) {
    super(name, type); // MUST call super() first
    this.breed = breed;
  }

  info() {
    super.info(); // Call parent method
    console.log(`Breed: ${this.breed}`);
  }
}

const dog = new Dog("Max", "Dog", "German Shepherd");
dog.info();
// Output:
// "Max is a Dog"
// "Breed: German Shepherd"
```

### Method Overriding

Override parent methods in child class:

```javascript
class Vehicle {
  start() {
    console.log("Vehicle starting...");
  }
}

class Car extends Vehicle {
  start() {
    // Override parent method
    console.log("Car engine starting...");
  }
}

const car = new Car();
car.start(); // "Car engine starting..."
```

### Abstract Classes

Prevent direct instantiation of a class:

```javascript
class User {
  constructor(name, age) {
    if (this.constructor === User) {
      throw new Error("User is abstract and cannot be instantiated");
    }
    this.name = name;
    this.age = age;
  }
}

class Employee extends User {
  constructor(name, age, salary) {
    super(name, age);
    this.salary = salary;
  }
}

// const user = new User("John", 30);  // Error!
const emp = new Employee("Jane", 28, 5000); // Works
```

### toString() Method

Returns a string representation of an object:

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  toString() {
    return `${this.name} (${this.age} years old)`;
  }
}

const person = new Person("Alice", 28);
console.log(person.toString()); // "Alice (28 years old)"
console.log(person + ""); // toString() called automatically
```

### Classes Are Objects

Functions (and classes) are objects in JavaScript:

```javascript
const UserClass = class {
  constructor(name) {
    this.name = name;
  }
};

const user = new UserClass("John");
```

---

## DOM Manipulation

The **Document Object Model (DOM)** is a tree-like representation of the HTML page. JavaScript can access and modify it.

### Selecting Elements

#### `getElementById()`

Selects a single element by ID:

```javascript
const element = document.getElementById("myId");
```

#### `querySelector()`

Selects the first element matching a CSS selector:

```javascript
const element = document.querySelector(".myClass");
const element = document.querySelector("#myId");
const element = document.querySelector("div p");
```

#### `querySelectorAll()`

Selects all elements matching a CSS selector (returns NodeList):

```javascript
const elements = document.querySelectorAll(".myClass");

// Can be iterated like an array
elements.forEach((el) => {
  console.log(el);
});
```

#### `getElementsByClassName()`

Selects all elements with a class (returns HTMLCollection - live):

```javascript
const elements = document.getElementsByClassName("myClass");
```

**Note:** `getElementsByClassName` returns a live HTMLCollection that updates automatically when elements are added dynamically.

#### `getElementsByTagName()`

Selects all elements of a specific tag:

```javascript
const divs = document.getElementsByTagName("div");
```

### Modifying Content

#### `textContent`

Gets or sets plain text (safer for user input):

```javascript
const element = document.querySelector("div");
element.textContent = "New text";
const text = element.textContent;
```

#### `innerHTML`

Gets or sets HTML content (can execute scripts):

```javascript
element.innerHTML = "<p>New HTML</p>";
```

⚠️ **Security Warning:** Be cautious with `innerHTML` when handling user input (risk of XSS attacks).

#### `innerText`

Similar to `textContent` but respects CSS visibility.

### Modifying Attributes

#### `setAttribute()`

Sets an attribute:

```javascript
element.setAttribute("data-id", "123");
element.setAttribute("class", "active");
```

#### `getAttribute()`

Gets an attribute value:

```javascript
const value = element.getAttribute("data-id");
```

#### `removeAttribute()`

Removes an attribute:

```javascript
element.removeAttribute("disabled");
```

#### Direct Property Access

Some attributes can be accessed as properties:

```javascript
element.id = "newId";
element.title = "Hover text";
element.href = "https://example.com";
```

### Modifying Classes

#### `classList.add()`

Adds one or more classes:

```javascript
element.classList.add("active");
element.classList.add("class1", "class2");
```

#### `classList.remove()`

Removes classes:

```javascript
element.classList.remove("active");
```

#### `classList.toggle()`

Adds the class if absent, removes if present:

```javascript
element.classList.toggle("active");
```

#### `classList.contains()`

Checks if element has a class:

```javascript
if (element.classList.contains("active")) {
  console.log("Element is active");
}
```

### Modifying Styles

#### Inline Styles

```javascript
element.style.color = "red";
element.style.backgroundColor = "blue";
element.style.fontSize = "16px";
```

**Note:** Use camelCase for hyphenated CSS properties.

#### Getting Computed Styles

```javascript
const color = window.getComputedStyle(element).color;
```

### Creating and Removing Elements

#### `createElement()`

Creates an element in memory:

```javascript
const newDiv = document.createElement("div");
newDiv.textContent = "Hello";
```

#### `appendChild()`

Adds element as last child:

```javascript
parent.appendChild(newDiv);
```

#### `insertBefore()`

Inserts element before another element:

```javascript
parent.insertBefore(newDiv, referenceElement);
```

#### `removeChild()`

Removes a child element:

```javascript
parent.removeChild(child);
```

#### `remove()`

Removes the element itself:

```javascript
element.remove();
```

#### `replaceChild()`

Replaces one child with another:

```javascript
parent.replaceChild(newElement, oldElement);
```

### Navigating the DOM

```javascript
const parent = element.parentElement;
const children = element.children;
const firstChild = element.firstChild;
const lastChild = element.lastChild;

const nextSibling = element.nextElementSibling;
const prevSibling = element.previousElementSibling;
```

### Cloning Elements

```javascript
const clone = original.cloneNode(true); // true = deep clone (including children)
```

### Best Practices

- Use `querySelector()` and `querySelectorAll()` for modern, flexible selection
- Use `textContent` instead of `innerHTML` for plain text (more secure)
- Cache DOM selections in variables if used multiple times
- Use `classList` instead of directly modifying the `class` attribute
- Use **event delegation** for dynamically added elements
- Be cautious with `innerHTML` when handling user input

---

## Events

### Event Listeners

#### `addEventListener()` - Standard Method

```javascript
const button = document.getElementById("myButton");

button.addEventListener("click", function (event) {
  console.log("Button clicked!");
});

// With arrow function
button.addEventListener("click", (event) => {
  console.log("Button clicked!");
});

// With named function
function handleClick(event) {
  console.log("Button clicked!");
}
button.addEventListener("click", handleClick);
```

**Pros:**

- Can attach multiple handlers to the same event
- Can remove listeners with `removeEventListener()`
- Best practice for modern JavaScript

#### DOM Property Event Handlers

```javascript
button.onclick = function (event) {
  console.log("Button clicked!");
};
```

**Cons:**

- Only one handler per event (overwrites previous)
- Cannot easily remove handler

#### Inline Event Handlers (HTML)

```html
<button onclick="handleClick(event)">Click me</button>
```

⚠️ **Not recommended** - mixes HTML and JavaScript, security concerns.

#### Event Delegation

Attach listener to parent instead of many children:

```javascript
document.body.addEventListener("click", function (event) {
  if (event.target.matches(".my-button")) {
    console.log("Button clicked!");
  }
});
```

**Benefits:**

- More efficient for many similar elements
- Works with dynamically added elements
- Single listener instead of many

### Common Events

- `click` - Mouse click
- `dblclick` - Double click
- `mousedown` / `mouseup` - Mouse button press/release
- `mouseover` / `mouseout` - Mouse enters/leaves
- `keydown` / `keyup` / `keypress` - Keyboard events
- `submit` - Form submission (reloads page by default)
- `change` - Input value changes
- `input` - Input value changes (fires immediately)
- `focus` / `blur` - Element gains/loses focus
- `load` - Page or image finishes loading
- `scroll` - User scrolls

### Event Properties

```javascript
function handleEvent(event) {
  console.log(event.target); // Element that triggered the event
  console.log(event.key); // Key pressed (for keyboard events)
  console.log(event.code); // Physical key position
  console.log(event.type); // Type of event
}

element.addEventListener("click", handleEvent);
```

**Note:** For keyboard events, `e.key` gets the key value, while `e.code` gets the physical position.

### Event Propagation

Events propagate through the DOM in three phases:

1. **Capturing phase** (trickling down from root to target)
2. **Target phase** (event reaches the target element)
3. **Bubbling phase** (travels up from target back to root)

#### Bubbling (Default)

```javascript
parent.addEventListener("click", () => {
  console.log("Parent clicked");
});

child.addEventListener("click", () => {
  console.log("Child clicked");
});

// Clicking child logs:
// "Child clicked"
// "Parent clicked"
```

#### Capturing

```javascript
parent.addEventListener(
  "click",
  () => {
    console.log("Parent clicked");
  },
  true,
); // Note the 'true' parameter

child.addEventListener(
  "click",
  () => {
    console.log("Child clicked");
  },
  true,
);

// Clicking child logs:
// "Parent clicked"
// "Child clicked"
```

#### Stopping Propagation

```javascript
element.addEventListener("click", (e) => {
  e.stopPropagation(); // Stops bubbling/capturing
  e.stopImmediatePropagation(); // Also stops other handlers on same element
});
```

### setTimeout

Executes a function after a delay (in milliseconds):

```javascript
setTimeout(() => {
  console.log("Executed after 2 seconds");
}, 2000);

// With parameters
setTimeout(
  (name) => {
    console.log(`Hello ${name}`);
  },
  1000,
  "John",
);
```

### Event Object

```javascript
const div = document.querySelector("div");

function handleClick(e) {
  console.log(e.target); // Element that was clicked
  console.log(e.currentTarget); // Element that listener is on
  console.log(e.type); // "click"
}

div.addEventListener("click", handleClick);
```

**Note:** In event handlers, `this === e.target` (when using regular functions, not arrow functions).

---

## Asynchronous JavaScript

### The Problem: Callback Hell

Deeply nested callbacks make code hard to read and maintain:

```javascript
getUser(1, function (user) {
  getDepartment(user.deptId, function (dept) {
    getProjects(dept.id, function (projects) {
      console.log(projects); // Deep nesting!
    });
  });
});
```

### Solution 1: Promises with `.then()`

Promises represent a value that may be available in the future.

#### Promise States

- **Pending** - Initial state, operation hasn't completed
- **Fulfilled** - Operation completed successfully
- **Rejected** - Operation failed

#### Creating and Using Promises

```javascript
function getUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "John" });
      } else {
        reject("Invalid user ID");
      }
    }, 1000);
  });
}

// Using the promise
getUser(1)
  .then((user) => {
    console.log("User:", user);
    return getDepartment(user.deptId); // Return next promise
  })
  .then((dept) => {
    console.log("Department:", dept);
    return getProjects(dept.id);
  })
  .then((projects) => {
    console.log("Projects:", projects);
  })
  .catch((error) => {
    console.log("Error:", error);
  })
  .finally(() => {
    console.log("Operation completed"); // Runs regardless of success/failure
  });
```

#### Promise.all() - Multiple Promises

Execute multiple promises and wait for all to complete:

```javascript
Promise.all([getUser(1), getSettings(), getNotifications()])
  .then(([user, settings, notifications]) => {
    console.log("User:", user);
    console.log("Settings:", settings);
    console.log("Notifications:", notifications);
  })
  .catch((error) => {
    console.log("Error:", error);
  });
```

#### Promise.race() - First Completed Promise

```javascript
Promise.race([getUser(1), getSettings()]).then((result) => {
  console.log("First completed:", result);
});
```

### Solution 2: Async/Await (Recommended)

Async/await is syntactic sugar over promises - looks synchronous but is asynchronous:

#### Basic Syntax

```javascript
async function getUserInfo() {
  const user = await getUser(1);
  console.log("User:", user);
}

getUserInfo();
```

#### Error Handling with Try/Catch

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.log("Error:", error);
  } finally {
    console.log("Request completed");
  }
}

fetchData("/api/users");
```

#### Sequential vs Parallel Operations

```javascript
async function loadData() {
  // Sequential - one after another
  const user = await getUser(1);
  const dept = await getDepartment(user.deptId);

  // Parallel - all at once using Promise.all()
  const [posts, comments, likes] = await Promise.all([
    getPosts(user.id),
    getComments(user.id),
    getLikes(user.id),
  ]);

  console.log("User:", user);
  console.log("Posts:", posts);
}

loadData();
```

#### Async Functions Always Return Promises

```javascript
async function getValue() {
  return 42; // Wrapped in a promise
}

// Can use .then()
getValue().then((value) => {
  console.log(value); // 42
});

// Or await it
const value = await getValue();
console.log(value); // 42
```

#### Practical Example: Login with Async/Await

```javascript
async function login(email, password) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
}

async function getProfile(token) {
  const response = await fetch("/api/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
}

async function authenticateUser(email, password) {
  try {
    const loginData = await login(email, password);
    const profile = await getProfile(loginData.token);
    console.log("Profile:", profile);
  } catch (error) {
    console.log("Authentication failed:", error);
  }
}
```

### Comparison

| Approach        | Readability | Error Handling    | Best For            |
| --------------- | ----------- | ----------------- | ------------------- |
| **Callbacks**   | Poor        | Messy             | Single operations   |
| **Promises**    | Good        | `.catch()` blocks | Multiple operations |
| **Async/Await** | Excellent   | Try/catch         | Modern applications |

**Best Practice:** Use **async/await** for new code. It's the most readable and maintainable approach.

---

## Regular Expressions

Regular expressions (regex) are patterns used to match strings.

### Creating Regular Expressions

#### Using RegExp Constructor

```javascript
const regexEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
```

#### Using Literal Notation (Preferred)

```javascript
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### Common Methods

```javascript
// Test if pattern matches
const result = regexEmail.test("user@example.com"); // true
const result2 = regexEmail.test("invalid-email"); // false

// Find matches
const matches = "abc123def456".match(/\d+/g); // ["123", "456"]

// Replace
const replaced = "hello world".replace(/world/, "universe"); // "hello universe"
```

### Common Patterns

- `\d` - Any digit (0-9)
- `\w` - Any word character (a-z, A-Z, 0-9, \_)
- `\s` - Any whitespace
- `^` - Start of string
- `$` - End of string
- `+` - One or more
- `*` - Zero or more
- `{n}` - Exactly n occurrences
- `[abc]` - Any character in brackets
- `[^abc]` - Any character NOT in brackets

### Email Validation Example

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emails = [
  "user@example.com", // valid
  "invalid-email", // invalid
  "test@domain.co.uk", // valid
];

emails.forEach((email) => {
  console.log(`${email}: ${emailRegex.test(email)}`);
});
```

---

## Built-in Objects

### Math Object

Static methods for mathematical operations:

```javascript
Math.abs(-5); // 5
Math.max(1, 5, 3); // 5
Math.min(1, 5, 3); // 1
Math.round(4.7); // 5
Math.floor(4.7); // 4
Math.ceil(4.2); // 5
Math.pow(2, 3); // 8
Math.sqrt(9); // 3
Math.random(); // 0 to 1
```

### Array Methods

#### Creating Arrays

```javascript
const arr = [1, 2, "hello", true];
const arr2 = new Array(); // Empty array (less efficient)
```

**Note:** Arrays can contain any type, including functions and other arrays.

#### Array.from()

Creates a new array from array-like objects (shallow copy):

```javascript
const arr = [1, 2, 3];
const copy = Array.from(arr); // [1, 2, 3]

// Works with NodeList
const nodeList = document.querySelectorAll("div");
const array = Array.from(nodeList);
```

#### Array.at()

Supports negative indices:

```javascript
const arr = [1, 2, 3, 4, 5];
console.log(arr.at(-1)); // 5 (last element)
console.log(arr.at(-2)); // 4 (second to last)
```

### Date Object

**Important:** Month numbers are zero-indexed (0 = January, 11 = December).

```javascript
// Create current date
const now = new Date();

// Create specific date (year, month, day)
const date = new Date(2024, 0, 15); // January 15, 2024

// Methods
date.getFullYear(); // 2024
date.getYear(); // 124 (years since 1900) - AVOID
date.getMonth(); // 0 (January)
date.getDate(); // 15
date.getDay(); // 0-6 (0 = Sunday) - Note: week starts on Sunday!
date.getTime(); // Milliseconds since January 1, 1970
```

**Caution:** `getYear()` is deprecated and returns years since 1900. Always use `getFullYear()`.

### String Interpolation

#### Template Literals (Modern)

```javascript
const name = "John";
const age = 30;
const message = `${name} is ${age} years old`;
```

#### String Concatenation (Legacy)

```javascript
const message = "Hello " + name + ", you are " + age + " years old";
```

### Type Checking

```javascript
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (historical bug)
typeof NaN; // "number" (NaN is a number!)
typeof Symbol("id"); // "symbol"
```

---

## Window & Location Methods

### window.open()

Opens a new browser window or tab:

```javascript
// Open in new tab
const newTab = window.open("https://example.com", "_blank");

// Open in same window
window.open("https://example.com", "_self");

// Open with specific size
const popup = window.open(
  "popup.html",
  "popup",
  "width=500,height=300,left=200,top=200",
);
```

### window.close()

Closes the current window:

```javascript
window.close();

// Close a popup
if (popup) {
  popup.close();
}
```

### window.print()

Opens the print dialog:

```javascript
const printBtn = document.querySelector("#printBtn");
printBtn.addEventListener("click", () => {
  window.print();
});
```

#### Print Specific Content with CSS

```css
@media print {
  .no-print {
    display: none;
  }
}
```

### history.back()

Goes back one page (back button):

```javascript
document.querySelector("#backBtn").addEventListener("click", () => {
  history.back();
});
```

### history.forward()

Goes forward one page (forward button):

```javascript
history.forward();
```

### history.go()

Goes to a specific page in history:

```javascript
history.go(-2); // Back 2 pages
history.go(1); // Forward 1 page
history.go(0); // Reload current page
```

### location.href

Gets or sets the complete URL:

```javascript
// Get current URL
const currentUrl = location.href;

// Navigate to new page (saves in history)
location.href = "https://example.com";
```

### location.replace()

Replaces current page (NOT saved in history - user can't go back):

```javascript
location.replace("/login"); // User cannot go back to previous page
```

### location.pathname

Gets the path portion of URL:

```javascript
// If URL is https://example.com/products/shoes
console.log(location.pathname); // /products/shoes
```

### location.search

Gets the query string:

```javascript
// If URL is https://example.com?id=123&name=alice
console.log(location.search); // ?id=123&name=alice

// Parse query parameters
const params = new URLSearchParams(location.search);
console.log(params.get("id")); // 123
console.log(params.get("name")); // alice
```

### location.hash

Gets the fragment identifier:

```javascript
// If URL is https://example.com#section2
console.log(location.hash); // #section2

// Listen for hash changes (single-page app routing)
window.addEventListener("hashchange", () => {
  const hash = location.hash.slice(1);
  if (hash === "home") {
    showHome();
  }
});
```

### location.protocol

Gets the protocol:

```javascript
console.log(location.protocol); // "https:"

if (location.protocol === "https:") {
  console.log("Secure connection");
}
```

### location.reload()

Reloads the current page:

```javascript
// Reload from cache
location.reload();

// Reload from server (bypass cache)
location.reload(true);
```

---

## Dialog Boxes

### Alert

Displays a message with an OK button:

```javascript
alert("Hello, World!");
```

### Confirm

Displays a message with OK and Cancel buttons, returns boolean:

```javascript
if (confirm("Are you sure?")) {
  console.log("User clicked OK");
} else {
  console.log("User clicked Cancel");
}
```

### Prompt

Displays an input field for user to enter text:

```javascript
const name = prompt("Enter your name:");
if (name) {
  console.log("Hello " + name);
}
```

---

## Array Methods

### Creating Arrays

```javascript
const arr = [1, 2, 3];
const arr2 = new Array(1, 2, 3); // Same as above
```

### Array.from()

Creates shallow copy from array-like objects:

```javascript
const arr = [1, 2, 3];
const copy = Array.from(arr);
```

### Array.at()

Access elements with negative indices:

```javascript
const arr = ["a", "b", "c"];
arr.at(-1); // 'c'
arr.at(-2); // 'b'
```

### Array Methods with forEach

```javascript
const arr = [1, 2, 3];

arr.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});
```

### array.map()

Creates new array by transforming each element:

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2); // [2, 4, 6]
```

### array.filter()

Creates new array with elements that pass a test:

```javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter((n) => n % 2 === 0); // [2, 4]
```

---

## Advanced Concepts

### Destructuring

Extract values from arrays or properties from objects:

#### Array Destructuring

```javascript
const arr = [1, 2, 3];
const [first, second] = arr;
console.log(first, second); // 1, 2

// Swap values
let a = 1,
  b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
```

#### Object Destructuring

```javascript
const user = { name: "John", age: 30 };
const { name, age } = user;
console.log(name, age); // "John", 30
```

### Spread Operator (...)

Used for arrays and objects:

```javascript
//merge arrays
const arr = [1, 2, 3];
const arr2 = [...arr, 4, 5]; // [1, 2, 3, 4, 5]
//merge objects
const obj = { a: 1, b: 2 };
const obj2 = { ...obj, c: 3 }; // { a: 1, b: 2, c: 3 }
//override object properties
const obj = { a: 1, b: 2 };
const obj2 = { ...obj, b: 3 }; // { a: 1, b: 3 }

//there is also rest parameters which are the oposite of the spread ast it condences the array or object to
//a single element , if you want to use it with other prameters i must come last (x,y,...theArgs)
function sum(...theArgs) {
  let total = 0;
  for (const arg of theArgs) {
    total += arg;
  }
  return total;
}

console.log(sum(1, 2, 3));
// Expected output: 6

console.log(sum(1, 2, 3, 4));
// Expected output: 10
```

### for...in vs for...of

#### for...in - Iterates over Keys

```javascript
const obj = { name: "John", age: 30 };
for (const key in obj) {
  console.log(key); // "name", "age"
  console.log(obj[key]); // "John", 30
}
```

**Note:** Each variable is treated as a string when iterating with `for...in`.

#### for...of - Iterates over Values

```javascript
const arr = ["a", "b", "c"];
for (const value of arr) {
  console.log(value); // 'a', 'b', 'c'
}
```

**Note:** Each variable contains the actual values when using `for...of`.

### Switch Statements

```javascript
const day = 3;

switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  case 3:
    console.log("Wednesday");
    break;
  default:
    console.log("Unknown day");
}

// Output: "Wednesday"
```

**Important:** `switch` uses **strict equality (===)** for comparison.

### Variable Assignment Rules

```javascript
var x = 10;
var x = 20; // Allowed - redeclaration

let y = 10;
let y = 20; // Error - cannot redeclare in same scope

// Assigning without declaration creates global variable (bad practice!)
zzz = 300; // Global variable
```

### String Concatenation vs Undefined

```javascript
const str = "hello";
const undef = undefined;
console.log(str + undef); // "helloundefined"
```

### Module Scripts

Use `<script type="module">` to enable ES6 modules (import/export) and place scripts at the top of HTML:

```html
<script type="module" src="app.js"></script>
```

### Default Exports

```javascript
// Class definition with default export
export default class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  display() {
    console.log(`${this.name} is ${this.age} years old`);
  }
}
```

```javascript
// Import default export (can use any name)
import User from "./User.js";

const user = new User("John", 25);
user.display(); // "John is 25 years old"
```

### AJAX

**AJAX** (Asynchronous JavaScript and XML) allows web pages to send and receive data from a server asynchronously without reloading the page.

```javascript
// Using fetch (modern approach)
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log("Error:", error));

// Using async/await
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
}
```

### Code Organization Tips

1. Plan and design your project before coding
2. Use functions and classes to organize code
3. Keep functions small and focused
4. Use meaningful variable and function names
5. Comment complex logic
6. Use version control (Git)
7. Follow consistent code style

---

## Glossary

| Term                | Definition                                                             |
| ------------------- | ---------------------------------------------------------------------- |
| **Hoisting**        | JavaScript's behavior of moving declarations to the top of their scope |
| **Coercion**        | Automatic type conversion (implicit casting)                           |
| **Closure**         | Function that has access to variables from its parent scope            |
| **Callback**        | Function passed as argument to another function                        |
| **Promise**         | Object representing eventual completion/failure of async operation     |
| **Async/Await**     | Syntax for handling promises more cleanly                              |
| **DOM**             | Document Object Model - tree representation of HTML                    |
| **Event Bubbling**  | Event propagates upward through parent elements                        |
| **Event Capturing** | Event propagates downward from root to target                          |
| **Destructuring**   | Extracting values from arrays or object properties                     |
| **Spread Operator** | `...` operator for spreading array/object elements                     |

---

## Quick Reference

### Variable Declaration

```javascript
const x = 5; // Preferred - immutable reference
let y = 10; // Use when reassignment needed
var z = 15; // Avoid in modern code
```

### Arrow Functions

```javascript
const add = (a, b) => a + b;
const greet = (name) => `Hello ${name}`;
const log = () => console.log("hi");
```

### Async/Await

```javascript
async function load() {
  try {
    const data = await fetch("/api/data").then((r) => r.json());
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
}
```

### Array Methods

```javascript
[1, 2, 3].map((x) => x * 2); // [2, 4, 6]
[1, 2, 3, 4].filter((x) => x > 2); // [3, 4]
[1, 2, 3].forEach((x) => console.log(x));
```

### DOM Selection

```javascript
document.getElementById("id");
document.querySelector(".class");
document.querySelectorAll("div");
```

### Event Listening

```javascript
element.addEventListener("click", (e) => {
  console.log(e.target);
});
```

---

**Last Updated:** January 2026  
**Note:** This guide covers JavaScript ES6+ (modern JavaScript). For older browser support, code may need to be transpiled using tools like Babel.
