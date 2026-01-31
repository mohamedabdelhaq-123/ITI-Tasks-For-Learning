# TypeScript Study Guide

## Table of Contents
1. [Origins & Setup](#origins--setup)
2. [Functions & Basic Types](#functions--basic-types)
3. [Objects: The "Type Alias" Solution](#objects-the-type-alias-solution)
4. [Advanced Type Combinations](#advanced-type-combinations)
5. [Student Assessment](#student-assessment)

---

## Origins & Setup

### Why TypeScript Exists: The Problem

Imagine you're building a large e-commerce application with a team of 20 developers. In JavaScript, you might write code like this:

```javascript
// JavaScript - Looks fine at first...
function calculateDiscount(product, discountPercent) {
  return product.price * discountPercent;
}

const laptop = { name: "MacBook Pro", price: 2000 };
const discount = calculateDiscount(laptop, 0.2);  // Works!

// But later, someone passes wrong data...
const wrongDiscount = calculateDiscount(laptop, "20%");  // No error until runtime!
// Result: NaN - the bug only shows up when a customer tries to checkout
```

**The problem**: JavaScript doesn't catch type errors until your code is running. In large applications, this leads to:
- Runtime crashes that could have been prevented
- Bugs that slip into production
- Hours spent debugging issues that should have been caught immediately

### The Solution: TypeScript

TypeScript was created by Microsoft (led by Anders Hejlsberg, who also created C#) to solve these exact scalability issues. It's a **superset** of JavaScript, meaning:
- All valid JavaScript is valid TypeScript
- TypeScript adds optional static type checking
- TypeScript code compiles down to regular JavaScript

**Static vs. Dynamic Typing**:
- **Dynamic Typing (JavaScript)**: Types are checked at runtime (while the program is running)
- **Static Typing (TypeScript)**: Types are checked at compile-time (before the program runs)

### TypeScript Configuration: The Brain of Your Project

TypeScript projects use a `tsconfig.json` file that controls how the TypeScript compiler works. Think of it as the "brain" of your project.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedParameters": true,
    "noUnusedLocals": true
  }
}
```

#### Deep Dive: Why `noUnusedParameters` and `noUnusedLocals`?

These compiler options enforce code cleanliness:

**`noUnusedLocals`** - Catches variables you declare but never use:
```typescript
function processOrder(orderId: string) {
  const timestamp = Date.now();  // ❌ Error: 'timestamp' is declared but never used
  const status = "pending";       // ❌ Error: 'status' is declared but never used
  
  console.log(`Processing order ${orderId}`);
}
```

**`noUnusedParameters`** - Catches function parameters you never use:
```typescript
// ❌ Error: 'userId' is declared but its value is never read
function getProducts(category: string, userId: string) {
  return database.query(`SELECT * FROM products WHERE category = '${category}'`);
  // We forgot to filter by userId - TypeScript warns us!
}
```

**Why do we want these warnings?**
1. **Maintainability**: Dead code clutters your codebase and confuses future developers
2. **Bug Prevention**: Unused parameters often indicate incomplete logic or forgotten requirements
3. **Code Quality**: Forces developers to clean up as they go, preventing technical debt

---

## Functions & Basic Types

### The Problem: Unpredictable Function Behavior

```javascript
// JavaScript / Unsafe
function addNumbers(a, b) {
  return a + b;
}

console.log(addNumbers(5, 10));        // 15 ✓
console.log(addNumbers(5, "10"));      // "510" ✗ String concatenation!
console.log(addNumbers(5));            // NaN ✗ b is undefined
```

### The Solution: Type Annotations

```typescript
// TypeScript / Safe
function addNumbers(a: number, b: number): number {
  return a + b;
}

console.log(addNumbers(5, 10));        // 15 ✓
console.log(addNumbers(5, "10"));      // ❌ Compile error: Argument of type 'string' is not assignable to parameter of type 'number'
console.log(addNumbers(5));            // ❌ Compile error: Expected 2 arguments, but got 1
```

### Return Types: `void` vs Explicit Returns

**`void`** means a function doesn't return anything useful:

```typescript
// TypeScript
function logWelcomeMessage(username: string): void {
  console.log(`Welcome, ${username}!`);
  // No return statement - that's okay with void
}

function calculateTotal(price: number, tax: number): number {
  return price + (price * tax);
  // Must return a number
}
```

### The `any` Type: TypeScript's Escape Hatch (Use Sparingly!)

```javascript
// JavaScript / Unsafe
function processData(data) {
  return data.toUpperCase();  // Will crash if data is a number
}
```

```typescript
// TypeScript / Still Unsafe!
function processData(data: any): any {
  return data.toUpperCase();  // TypeScript won't catch the error!
}
```

**Why avoid `any`?**
- It defeats the entire purpose of TypeScript
- TypeScript can't help catch bugs
- You lose autocomplete and IntelliSense
- Code becomes as unsafe as JavaScript

**When is `any` acceptable?**
- Migrating JavaScript to TypeScript incrementally
- Working with truly dynamic data where you'll add runtime checks
- Third-party libraries without type definitions (though `unknown` is better)

---

### Complex Types

#### Arrays

```typescript
// Two ways to type arrays
const usernames: string[] = ["alice", "bob", "charlie"];
const scores: Array<number> = [95, 87, 92];

// TypeScript prevents mistakes
usernames.push("david");     // ✓
usernames.push(42);          // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

**Side-by-Side Comparison:**

```javascript
// JavaScript / Unsafe
const productPrices = [19.99, 29.99, 39.99];
productPrices.push("free");  // Silently adds a string to number array
const total = productPrices.reduce((sum, price) => sum + price, 0);
// Result: "059.97" - string concatenation bug!
```

```typescript
// TypeScript / Safe
const productPrices: number[] = [19.99, 29.99, 39.99];
productPrices.push("free");  // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
const total = productPrices.reduce((sum, price) => sum + price, 0);
// Type safety ensures total is always a number
```

#### Tuples: Fixed-Length, Fixed-Type Arrays

Tuples are useful when you need exactly N values of specific types:

```typescript
// TypeScript
// Tuple: [latitude, longitude]
const coordinates: [number, number] = [40.7128, -74.0060];

// Tuple: [productName, price, inStock]
const product: [string, number, boolean] = ["Laptop", 999, true];

// TypeScript enforces both length and type
const badProduct: [string, number, boolean] = ["Mouse", 25];  // ❌ Error: Source has 2 elements but target requires 3
```

**Real-world use case:**
```typescript
// User response from API: [id, username, isActive]
function getUserInfo(userId: string): [number, string, boolean] {
  // Fetch from database...
  return [12345, "alice_dev", true];
}

const [id, username, isActive] = getUserInfo("abc123");
// TypeScript knows: id is number, username is string, isActive is boolean
```

#### Enums: Named Constants

Enums create a set of named constants, making code more readable:

```javascript
// JavaScript / Unsafe
const ORDER_PENDING = 0;
const ORDER_SHIPPED = 1;
const ORDER_DELIVERED = 2;

function updateOrderStatus(orderId, status) {
  if (status === 3) {  // ❌ Invalid status - but no error!
    // ...
  }
}
```

```typescript
// TypeScript / Safe
enum OrderStatus {
  Pending = 0,
  Shipped = 1,
  Delivered = 2
}

function updateOrderStatus(orderId: string, status: OrderStatus): void {
  if (status === OrderStatus.Delivered) {
    console.log("Order has been delivered!");
  }
}

updateOrderStatus("ORD-123", OrderStatus.Shipped);  // ✓
updateOrderStatus("ORD-123", 3);  // ❌ Error: Argument of type '3' is not assignable to parameter of type 'OrderStatus'
```

---

## Objects: The "Type Alias" Solution

### The Basics: Inline Object Typing

```typescript
// TypeScript - Inline typing
const user1: { id: number; name: string; email: string } = {
  id: 1,
  name: "Alice Chen",
  email: "alice@example.com"
};
```

### The Problem: Code Duplication

Imagine you need to create multiple user objects:

```javascript
// JavaScript / Unsafe
const user1 = {
  id: 1,
  name: "Alice Chen",
  email: "alice@example.com",
  age: 28
};

const user2 = {
  id: 2,
  name: "Bob Smith",
  email: "bob@example.com",
  age: "thirty-two"  // ❌ Should be a number, but no error!
};

const user3 = {
  id: 3,
  name: "Charlie Davis",
  email: "charlie@example.com"
  // Missing age property - no warning!
};

function sendWelcomeEmail(user) {
  console.log(`Sending email to ${user.email}`);
  console.log(`User ${user.name} is ${user.age} years old`);  // May print "undefined"
}
```

With inline TypeScript types, we'd need to repeat the structure:

```typescript
// TypeScript - But with duplication
const user1: { id: number; name: string; email: string; age: number } = {
  id: 1,
  name: "Alice Chen",
  email: "alice@example.com",
  age: 28
};

const user2: { id: number; name: string; email: string; age: number } = {
  id: 2,
  name: "Bob Smith",
  email: "bob@example.com",
  age: 32
};

// This is repetitive and hard to maintain!
// What if we need to add a new property? We'd have to update every single user declaration!
```

### The Solution: Type Aliases

Type aliases let you define reusable types:

```typescript
// TypeScript / Safe & Maintainable
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

const user1: User = {
  id: 1,
  name: "Alice Chen",
  email: "alice@example.com",
  age: 28
};

const user2: User = {
  id: 2,
  name: "Bob Smith",
  email: "bob@example.com",
  age: 32  // ✓ Must be a number
};

const user3: User = {
  id: 3,
  name: "Charlie Davis",
  email: "charlie@example.com"
  // ❌ Error: Property 'age' is missing
};

function sendWelcomeEmail(user: User): void {
  console.log(`Sending email to ${user.email}`);
  console.log(`User ${user.name} is ${user.age} years old`);
  // TypeScript guarantees user.age exists and is a number
}
```

---

### Deep Dive: Object Features

#### Optional Properties (`?`)

Sometimes not all properties are required:

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;  // Optional - may or may not exist
  imageUrl?: string;      // Optional
};

const laptop: Product = {
  id: 1,
  name: "MacBook Pro",
  price: 2000
  // description and imageUrl are optional - this is valid
};

const monitor: Product = {
  id: 2,
  name: "4K Monitor",
  price: 500,
  description: "Ultra HD display"  // ✓ Can include optional properties
};

function displayProduct(product: Product): void {
  console.log(product.name);
  
  // TypeScript knows description might be undefined
  if (product.description) {
    console.log(product.description);  // Safe to use here
  }
}
```

**When to use optional properties:**
- User profiles where some fields are optional (bio, phone number)
- API responses where some fields may not be present
- Configuration objects with sensible defaults

#### Readonly Properties

**Aim**: Prevent reassignment after object creation, ensuring data immutability.

```typescript
type UserAccount = {
  readonly id: number;       // Can't be changed after creation
  readonly createdAt: Date;  // Can't be changed
  username: string;          // Can be changed
  email: string;             // Can be changed
};

const account: UserAccount = {
  id: 12345,
  createdAt: new Date(),
  username: "alice_dev",
  email: "alice@example.com"
};

// These are allowed
account.username = "alice_developer";  // ✓
account.email = "newemail@example.com";  // ✓

// These cause compile-time errors
account.id = 99999;  // ❌ Error: Cannot assign to 'id' because it is a read-only property
account.createdAt = new Date();  // ❌ Error: Cannot assign to 'createdAt' because it is a read-only property
```

**Test: What happens when you try to modify a readonly property?**

```typescript
type BankAccount = {
  readonly accountNumber: string;
  readonly openedDate: Date;
  balance: number;
};

const myAccount: BankAccount = {
  accountNumber: "ACC-123456",
  openedDate: new Date("2024-01-15"),
  balance: 5000
};

myAccount.balance = 6000;  // ✓ Allowed - balance is not readonly

myAccount.accountNumber = "ACC-999999";  
// ❌ Compile-time error:
// Cannot assign to 'accountNumber' because it is a read-only property.

// The code won't even compile - the error is caught before runtime!
```

#### Methods: Typing Object Functions

Objects can contain functions as properties:

```typescript
type ShoppingCart = {
  items: string[];
  total: number;
  
  // Method: function that returns void
  addItem: (item: string) => void;
  
  // Method: function that returns a number
  calculateTotal: () => number;
  
  // Method: function with parameters that returns a boolean
  hasItem: (item: string) => boolean;
};

const cart: ShoppingCart = {
  items: [],
  total: 0,
  
  addItem: (item: string) => {
    cart.items.push(item);
  },
  
  calculateTotal: () => {
    return cart.items.length * 10;  // Simplified calculation
  },
  
  hasItem: (item: string) => {
    return cart.items.includes(item);
  }
};

// Usage
cart.addItem("Laptop");
cart.addItem("Mouse");
console.log(cart.calculateTotal());  // TypeScript knows this returns a number
console.log(cart.hasItem("Laptop"));  // TypeScript knows this returns a boolean
```

**Real-world example: User Profile with Methods**

```typescript
type UserProfile = {
  readonly id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  
  // Methods
  getFullName: () => string;
  isAdult: () => boolean;
  updateEmail: (newEmail: string) => void;
};

const createUserProfile = (
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  age?: number
): UserProfile => {
  return {
    id,
    firstName,
    lastName,
    email,
    age,
    
    getFullName: () => {
      return `${firstName} ${lastName}`;
    },
    
    isAdult: () => {
      return age !== undefined && age >= 18;
    },
    
    updateEmail: (newEmail: string) => {
      email = newEmail;
    }
  };
};
```

---

## Advanced Type Combinations

### Union Types (`|`): "This OR That"

**Aim**: Allow a value to be one of multiple types.

Union types are incredibly common in real-world applications, especially when dealing with API responses or user input.

```javascript
// JavaScript / Unsafe
function formatInput(input) {
  if (typeof input === "string") {
    return input.toUpperCase();
  } else if (typeof input === "number") {
    return input.toFixed(2);
  }
  // What if someone passes a boolean? An object? No type safety!
}

formatInput("hello");     // "HELLO"
formatInput(42);          // "42.00"
formatInput(true);        // ❌ Runtime error: input.toFixed is not a function
```

```typescript
// TypeScript / Safe
function formatInput(input: string | number): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  } else {
    return input.toFixed(2);
  }
}

formatInput("hello");     // "HELLO" ✓
formatInput(42);          // "42.00" ✓
formatInput(true);        // ❌ Compile error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'
```

**Real-world example: API Response**

```typescript
type ApiResponse = {
  data: User[] | null;  // Data can be an array of users OR null
  error: string | null;  // Error can be a string OR null
  status: number;
};

function handleApiResponse(response: ApiResponse): void {
  if (response.error !== null) {
    console.error(`Error: ${response.error}`);
    return;
  }
  
  if (response.data !== null) {
    console.log(`Received ${response.data.length} users`);
  }
}
```

### Intersection Types (`&`): Combining Objects

**Aim**: Combine multiple type definitions into one.

Intersection types let you compose complex types from simpler ones:

```typescript
// TypeScript
type BookDetails = {
  title: string;
  isbn: string;
  pages: number;
};

type Author = {
  authorName: string;
  authorBio: string;
};

type Pricing = {
  price: number;
  currency: string;
};

// Combine all three types into one
type Book = BookDetails & Author & Pricing;

const myBook: Book = {
  // Must have ALL properties from BookDetails, Author, AND Pricing
  title: "TypeScript Mastery",
  isbn: "978-1234567890",
  pages: 450,
  authorName: "Jane Developer",
  authorBio: "Senior software engineer with 10 years experience",
  price: 39.99,
  currency: "USD"
};
```

**Side-by-Side Comparison:**

```javascript
// JavaScript / Unsafe
function createBookListing(details, author, pricing) {
  return {
    ...details,
    ...author,
    ...pricing
  };
}

const book = createBookListing(
  { title: "TS Guide", pages: 300 },  // Missing isbn - no warning!
  { authorName: "John Doe" },         // Missing authorBio - no warning!
  { price: 29.99 }                    // Missing currency - no warning!
);
```

```typescript
// TypeScript / Safe
type BookDetails = {
  title: string;
  isbn: string;
  pages: number;
};

type Author = {
  authorName: string;
  authorBio: string;
};

type Pricing = {
  price: number;
  currency: string;
};

type Book = BookDetails & Author & Pricing;

function createBookListing(
  details: BookDetails,
  author: Author,
  pricing: Pricing
): Book {
  return {
    ...details,
    ...author,
    ...pricing
  };
}

const book = createBookListing(
  { title: "TS Guide", pages: 300 },  // ❌ Error: Property 'isbn' is missing
  { authorName: "John Doe" },         // ❌ Error: Property 'authorBio' is missing
  { price: 29.99 }                    // ❌ Error: Property 'currency' is missing
);
```

### Literal Types: Exact Values Only

**Aim**: Restrict a variable to specific, exact values (not just types).

Literal types are perfect for values that should only be from a specific set:

```typescript
// TypeScript
type PaymentStatus = "pending" | "processing" | "success" | "failed";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function updatePayment(orderId: string, status: PaymentStatus): void {
  console.log(`Order ${orderId} is now ${status}`);
}

updatePayment("ORD-123", "success");     // ✓
updatePayment("ORD-456", "pending");     // ✓
updatePayment("ORD-789", "completed");   // ❌ Error: Argument of type '"completed"' is not assignable to parameter of type 'PaymentStatus'
```

**Key Distinction: Union Types vs. Literal Types**

```typescript
// Union Type - different TYPES
type ID = string | number;
const userId1: ID = "abc123";  // ✓
const userId2: ID = 42;        // ✓

// Literal Type - specific VALUES (all of the same type)
type Status = "active" | "inactive" | "suspended";
const userStatus1: Status = "active";     // ✓
const userStatus2: Status = "banned";     // ❌ Error: Type '"banned"' is not assignable to type 'Status'
```

**Real-world example: Theme Configuration**

```typescript
type Theme = "light" | "dark" | "auto";
type FontSize = "small" | "medium" | "large";

type AppSettings = {
  theme: Theme;
  fontSize: FontSize;
  notifications: boolean;
};

const userSettings: AppSettings = {
  theme: "dark",        // ✓ Must be one of the three literal values
  fontSize: "medium",   // ✓
  notifications: true
};

// This would fail:
const badSettings: AppSettings = {
  theme: "blue",        // ❌ Error: Type '"blue"' is not assignable to type 'Theme'
  fontSize: "xl",       // ❌ Error: Type '"xl"' is not assignable to type 'FontSize'
  notifications: true
};
```

**Combining Unions and Literals:**

```typescript
type SuccessResponse = {
  status: "success";  // Literal type
  data: User[];
};

type ErrorResponse = {
  status: "error";    // Literal type
  message: string;
};

// Union of two object types with literal properties
type ApiResult = SuccessResponse | ErrorResponse;

function handleResult(result: ApiResult): void {
  if (result.status === "success") {
    // TypeScript knows result is SuccessResponse here
    console.log(`Got ${result.data.length} users`);
  } else {
    // TypeScript knows result is ErrorResponse here
    console.error(result.message);
  }
}
```

---

## Student Assessment

### Check for Understanding Questions

**Question 1: Readonly Properties**
What happens when you try to modify a `readonly` property in TypeScript? When would you use `readonly` in a real application?

<details>
<summary>Answer</summary>

When you try to modify a `readonly` property, TypeScript generates a **compile-time error** stating "Cannot assign to [property name] because it is a read-only property." The code won't compile, preventing the bug before runtime.

**Real-world use cases:**
- User IDs that shouldn't change after account creation
- Timestamps (createdAt, updatedAt) that should be immutable
- Configuration values that should remain constant
- Primary keys in database records
</details>

---

**Question 2: Union vs Literal Types**
Explain the difference between a Union type and a Literal type. Provide an example of each.

<details>
<summary>Answer</summary>

**Union Types** allow a value to be one of multiple **types**:
```typescript
type ID = string | number;  // Can be string type OR number type
const id1: ID = "abc123";   // string ✓
const id2: ID = 42;         // number ✓
```

**Literal Types** restrict a value to specific **exact values** (usually of the same type):
```typescript
type Status = "pending" | "approved" | "rejected";  // Must be one of these exact strings
const status1: Status = "pending";     // ✓
const status2: Status = "approved";    // ✓
const status3: Status = "completed";   // ❌ Not one of the allowed values
```

**Key difference**: Unions are about combining different types, while literals are about restricting to specific values.
</details>

---

**Question 3: The `any` Type**
Why should you avoid using the `any` type in TypeScript? What are the consequences of using it?

<details>
<summary>Answer</summary>

You should avoid `any` because:

1. **Defeats TypeScript's purpose**: Removes all type checking, making your code as unsafe as JavaScript
2. **Hides bugs**: TypeScript can't catch errors, so bugs slip through to runtime
3. **No IntelliSense**: You lose autocomplete and helpful editor suggestions
4. **Maintenance issues**: Future developers don't know what type of data to expect
5. **False confidence**: Code looks type-safe but isn't

**Example of the problem:**
```typescript
function processUser(user: any) {
  console.log(user.name.toUpperCase());  // No error, but will crash if user.name doesn't exist
}
```

**When is `any` acceptable?**
- Incrementally migrating JavaScript to TypeScript
- Working with truly dynamic data (though `unknown` is better)
- Temporary placeholder during development (should be replaced)
</details>

---

**Question 4: Type Aliases vs Inline Types**
Why are Type Aliases better than inline object types for complex objects? What problem do they solve?

<details>
<summary>Answer</summary>

**Problems with inline types:**
1. **Code duplication**: Must repeat the entire type definition for every variable
2. **Hard to maintain**: Changing the structure requires updating every instance
3. **Inconsistency**: Easy to make typos or forget properties across different uses
4. **Poor readability**: Long type definitions clutter the code

**Type Aliases solve these by:**
1. **Single source of truth**: Define the type once, use it everywhere
2. **Easy updates**: Change the type definition in one place
3. **Consistency**: All instances automatically use the same structure
4. **Better readability**: Descriptive names (User, Product) instead of long inline types
5. **Reusability**: Can be imported and shared across files

```typescript
// ❌ Inline - repetitive and hard to maintain
const user1: { id: number; name: string; email: string } = {...};
const user2: { id: number; name: string; email: string } = {...};

// ✓ Type Alias - maintainable and clear
type User = { id: number; name: string; email: string };
const user1: User = {...};
const user2: User = {...};
```
</details>

---

### Refactoring Challenge

**Challenge: Refactor Unsafe JavaScript to Safe TypeScript**

Below is a piece of "bad" JavaScript code from an e-commerce application. Your task is to:
1. Identify the type safety issues
2. Create appropriate Type Aliases
3. Add type annotations to make it type-safe
4. Use features like `readonly`, optional properties (`?`), and proper method typing

**Original JavaScript Code:**

```javascript
// Unsafe JavaScript Code
function createProduct(id, name, price, description, inStock) {
  return {
    id: id,
    name: name,
    price: price,
    description: description,
    inStock: inStock,
    getDisplayPrice: function() {
      return "$" + this.price.toFixed(2);
    }
  };
}

const laptop = createProduct(1, "MacBook Pro", 1999, "Powerful laptop", true);
const mouse = createProduct(2, "Wireless Mouse", 29.99);  // Missing arguments
const monitor = createProduct(3, "4K Monitor", "499", null, true);  // Wrong types

function displayProduct(product) {
  console.log(product.name);
  console.log(product.getDisplayPrice());
  
  if (product.description) {
    console.log(product.description);
  }
}

// Later in the code, someone accidentally modifies the ID
laptop.id = 999;  // This shouldn't be allowed!
```

<details>
<summary>Solution</summary>

```typescript
// Safe TypeScript Code

// 1. Create a Type Alias for Product
type Product = {
  readonly id: number;           // Readonly - IDs shouldn't change
  name: string;
  price: number;
  description?: string;          // Optional - not all products have descriptions
  inStock: boolean;
  getDisplayPrice: () => string; // Method that returns a string
};

// 2. Type-safe factory function
function createProduct(
  id: number,
  name: string,
  price: number,
  description: string | undefined,  // Explicitly allow undefined
  inStock: boolean
): Product {
  return {
    id,
    name,
    price,
    description,
    inStock,
    getDisplayPrice: function(): string {
      return `$${this.price.toFixed(2)}`;
    }
  };
}

// 3. Now TypeScript catches all the errors:

const laptop: Product = createProduct(
  1,
  "MacBook Pro",
  1999,
  "Powerful laptop",
  true
);  // ✓ All correct

const mouse: Product = createProduct(
  2,
  "Wireless Mouse",
  29.99
);  
// ❌ Error: Expected 5 arguments, but got 3

const monitor: Product = createProduct(
  3,
  "4K Monitor",
  "499",  // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
  null,   // ❌ Error: Argument of type 'null' is not assignable to parameter of type 'string | undefined'
  true
);

// 4. Type-safe display function
function displayProduct(product: Product): void {
  console.log(product.name);
  console.log(product.getDisplayPrice());
  
  if (product.description) {
    console.log(product.description);
  }
}

// 5. Readonly prevents accidental ID changes
laptop.id = 999;  
// ❌ Error: Cannot assign to 'id' because it is a read-only property
```

**What we improved:**
- ✅ Created a reusable `Product` type alias
- ✅ Made `id` readonly to prevent modifications
- ✅ Made `description` optional since not all products need it
- ✅ Added proper type annotations to all parameters and return values
- ✅ TypeScript now catches missing arguments, wrong types, and property modifications
</details>

---



---

## Special Types: `unknown` and `never`

### The `unknown` Type: Safe Alternative to `any`

**Aim**: Provide type-safe handling of values whose type is truly unknown at compile time.

#### The Problem with `any`

```javascript
// JavaScript / Unsafe
function processApiData(data) {
  return data.toUpperCase();  // Will crash if data is not a string
}

processApiData("hello");      // "HELLO" ✓
processApiData(42);           // ❌ Runtime crash: data.toUpperCase is not a function
processApiData({ name: "Alice" });  // ❌ Runtime crash
```

```typescript
// TypeScript with 'any' / Still Unsafe!
function processApiData(data: any): any {
  return data.toUpperCase();  // TypeScript won't catch this error!
}

processApiData("hello");      // "HELLO" ✓
processApiData(42);           // ❌ Runtime crash - TypeScript didn't help us!
```

**The problem**: `any` disables all type checking. TypeScript can't help you catch bugs.

#### The Solution: `unknown`

```typescript
// TypeScript with 'unknown' / Safe!
function processApiData(data: unknown): string {
  // ❌ Error: Object is of type 'unknown'
  // return data.toUpperCase();  
  
  // ✓ Must check the type first
  if (typeof data === "string") {
    return data.toUpperCase();  // TypeScript knows data is a string here
  }
  
  throw new Error("Expected string data");
}

processApiData("hello");      // "HELLO" ✓
processApiData(42);           // ❌ Compile-time error forces us to handle this case
```

#### Side-by-Side Comparison: `any` vs `unknown`

```typescript
// 'any' - TypeScript trusts you blindly
function handleAny(value: any) {
  value.toUpperCase();    // ✓ No error - but will crash at runtime if value is not a string
  value.length;           // ✓ No error - but will crash if value has no length property
  value();                // ✓ No error - but will crash if value is not a function
  value[0];               // ✓ No error - but will crash if value is not indexable
}
```

```typescript
// 'unknown' - TypeScript makes you prove the type first
function handleUnknown(value: unknown) {
  value.toUpperCase();    // ❌ Error: Object is of type 'unknown'
  value.length;           // ❌ Error: Object is of type 'unknown'
  value();                // ❌ Error: Object is of type 'unknown'
  value[0];               // ❌ Error: Object is of type 'unknown'
  
  // ✓ Must narrow the type with checks
  if (typeof value === "string") {
    value.toUpperCase();  // ✓ Now TypeScript knows it's safe
  }
  
  if (typeof value === "function") {
    value();              // ✓ Now TypeScript knows it's safe
  }
}
```

#### Deep Dive: Best Practices with `unknown`

**When to use `unknown`:**
1. **API responses** where the structure is uncertain
2. **User input** from forms or external sources
3. **Third-party library data** without type definitions
4. **Parsing JSON** from external sources

**Real-world example: API Response Handler**

```typescript
type ApiResponse = {
  success: boolean;
  data: unknown;  // Could be anything from the API
};

function processUserData(response: ApiResponse): User | null {
  if (!response.success) {
    return null;
  }
  
  // Must validate the unknown data
  const data = response.data;
  
  // Type guard to check if it's a valid user object
  if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "email" in data
  ) {
    // Now we can safely use it
    return {
      id: (data as any).id,      // In real code, you'd validate each field
      name: (data as any).name,
      email: (data as any).email
    };
  }
  
  throw new Error("Invalid user data from API");
}
```

**Why `unknown` is better than `any`:**

| Feature | `any` | `unknown` |
|---------|-------|-----------|
| Type checking | ❌ Disabled | ✓ Enabled |
| Requires type guards | ❌ No | ✓ Yes |
| Catches errors | ❌ At runtime | ✓ At compile time |
| IntelliSense | ❌ No help | ✓ After type narrowing |
| Best practice | ❌ Avoid | ✓ Use when needed |

**Rule of thumb**: If you're about to use `any`, ask yourself "Can I use `unknown` instead?" The answer is almost always yes.

---

### The `never` Type: For Code That Never Returns

**Aim**: Represent values that never occur and functions that never reach their end.

#### Understanding `never` vs `void`

```typescript
// 'void' - Function completes but returns nothing useful
function logMessage(message: string): void {
  console.log(message);
  // ✓ Function reaches the end and returns (implicitly returns undefined)
}

// 'never' - Function NEVER completes normally
function throwError(message: string): never {
  throw new Error(message);
  // ❌ This line is never reached - function exits via exception
}
```

#### The Key Difference

```typescript
// VOID: Reaches the end of the function
function processOrder(orderId: string): void {
  console.log(`Processing order ${orderId}`);
  console.log("Order processed successfully");
  // Function completes and returns (undefined)
}

const result = processOrder("ORD-123");  // result is undefined
```

```typescript
// NEVER: Does NOT reach the end of the function
function handleFatalError(errorCode: number): never {
  console.error(`Fatal error: ${errorCode}`);
  throw new Error(`Application crashed with code ${errorCode}`);
  // The function stops here - never reaches the end
  // Any code after 'throw' is unreachable
}

const result = handleFatalError(500);  // This line throws, result never gets assigned
console.log("This will never run");    // Unreachable code
```

#### Deep Dive: When Does `never` Occur?

**1. Functions that throw errors**

```typescript
function validateAge(age: number): never {
  if (age < 0) {
    throw new Error("Age cannot be negative");
  }
  if (age > 150) {
    throw new Error("Age seems invalid");
  }
  // This function ALWAYS throws - it never returns normally
  throw new Error("This function demonstrates 'never'");
}
```

**2. Infinite loops**

```typescript
function infiniteLoop(): never {
  while (true) {
    console.log("Running forever...");
    // Never exits, never returns
  }
}
```

**3. Process termination**

```typescript
function exitProgram(code: number): never {
  console.log(`Exiting with code ${code}`);
  process.exit(code);  // Terminates the entire program
  // Never reaches here
}
```

#### Real-World Example: Exhaustive Type Checking

One of the most powerful uses of `never` is ensuring you've handled all cases:

```typescript
type PaymentMethod = "credit_card" | "paypal" | "crypto";

function processPayment(method: PaymentMethod): string {
  if (method === "credit_card") {
    return "Processing credit card payment";
  } else if (method === "paypal") {
    return "Processing PayPal payment";
  } else if (method === "crypto") {
    return "Processing crypto payment";
  } else {
    // This ensures we handled all cases
    const exhaustiveCheck: never = method;
    throw new Error(`Unhandled payment method: ${exhaustiveCheck}`);
  }
}

// Now if someone adds a new payment method:
type PaymentMethod = "credit_card" | "paypal" | "crypto" | "bank_transfer";

// TypeScript will error because we didn't handle "bank_transfer"
// The 'never' type catches this at compile time!
```

#### Visual Comparison: `void` vs `never`

```typescript
// VOID Example
function sendEmail(to: string, subject: string): void {
  console.log(`Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  // ✓ Execution flow reaches the end
  // Returns undefined implicitly
}

const emailResult = sendEmail("user@example.com", "Welcome!");
console.log("Email sent, continuing execution...");  // ✓ This runs


// NEVER Example
function crashApplication(reason: string): never {
  console.error(`CRITICAL ERROR: ${reason}`);
  console.error("Application must terminate");
  throw new Error(reason);
  // ❌ Execution flow NEVER reaches the end
}

const crashResult = crashApplication("Database connection failed");
console.log("This line will never execute");  // ❌ Unreachable
```

#### Summary Table: `void` vs `never`

| Aspect | `void` | `never` |
|--------|--------|---------|
| **Reaches end of function?** | ✓ Yes | ❌ No |
| **Returns a value?** | Undefined (implicitly) | Nothing (never returns) |
| **Use case** | Functions that perform actions | Functions that throw/exit |
| **Example** | `console.log()` | `throw new Error()` |
| **Code after call** | ✓ Executes | ❌ Never executes |
| **Can be assigned?** | ✓ Yes (to undefined) | ❌ No (no value exists) |

---

## Updated Quick Reference Card

```typescript
// Basic Types
const username: string = "Alice";
const age: number = 25;
const isActive: boolean = true;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"];

// Tuples
const coordinates: [number, number] = [40.7, -74.0];

// Type Alias
type User = {
  readonly id: number;
  name: string;
  email?: string;  // Optional
};

// Union (OR)
type ID = string | number;

// Intersection (AND)
type Employee = Person & JobInfo;

// Literal Types
type Status = "pending" | "approved" | "rejected";

// Function with void (completes, returns nothing)
function logMessage(msg: string): void {
  console.log(msg);
}

// Function with never (never completes)
function throwError(msg: string): never {
  throw new Error(msg);
}

// Unknown (safe alternative to any)
function handleUnknown(data: unknown): void {
  if (typeof data === "string") {
    console.log(data.toUpperCase());
  }
}

// Any (avoid! disables type checking)
function handleAny(data: any): void {
  // TypeScript won't catch errors here
}
```

---

## Updated Assessment Questions

**Question 5: `unknown` vs `any`**
Why is `unknown` considered a best practice over `any`? What must you do before using a value of type `unknown`?

<details>
<summary>Answer</summary>

**`unknown` is safer than `any` because:**

1. **Forces type checking**: You must verify the type before using the value
2. **Catches errors at compile time**: TypeScript won't let you use `unknown` values without checks
3. **Maintains type safety**: Unlike `any`, it doesn't disable TypeScript's protection
4. **Better IntelliSense**: After type narrowing, you get proper autocomplete

**Before using an `unknown` value, you must:**
- Use type guards (`typeof`, `instanceof`)
- Perform runtime checks
- Narrow the type to something specific

```typescript
function process(data: unknown) {
  // ❌ Can't use directly
  // data.toUpperCase();
  
  // ✓ Must check type first
  if (typeof data === "string") {
    data.toUpperCase();  // Now safe
  }
}
```

**Rule**: If you need `any`, use `unknown` instead and add proper type guards.
</details>

---

**Question 6: `void` vs `never`**
Explain the difference between `void` and `never` return types. Provide an example of each.

<details>
<summary>Answer</summary>

**`void`**: Function completes execution but returns nothing useful (undefined)
- Execution reaches the end of the function
- Code after the function call continues to run
- Used for side effects (logging, updating state)

```typescript
function logUser(name: string): void {
  console.log(`User: ${name}`);
  // ✓ Reaches end, returns undefined
}

logUser("Alice");
console.log("Continues running");  // ✓ This executes
```

**`never`**: Function never completes normally
- Execution NEVER reaches the end
- Code after the function call never runs
- Used for functions that throw errors or exit

```typescript
function crash(msg: string): never {
  throw new Error(msg);
  // ❌ Never reaches here
}

crash("Fatal error");
console.log("Never runs");  // ❌ Unreachable
```

**Key difference**: `void` functions complete, `never` functions don't.
</details>