# TypeScript Modules & Decorators Master Class

## Table of Contents
1. [The Why: Why Learn Decorators?](#the-why-why-learn-decorators)
2. [Modules: Organizing Code](#modules-organizing-code)
3. [Decorators: The Basics](#decorators-the-basics)
4. [Decorator Factories & Composition](#decorator-factories--composition)
5. [Member Decorators](#member-decorators)
6. [Real-World Framework Examples](#real-world-framework-examples)
7. [Student Assessment](#student-assessment)

---

## The Why: Why Learn Decorators?

### Why Are We Learning This?

Before we dive into code, let's answer the most important question: **Why should you care about decorators?**

**The brutal truth**: Decorators are the **backbone of modern TypeScript frameworks**. If you want to work with:
- **Angular** (Frontend framework)
- **NestJS** (Backend framework)
- **TypeORM** (Database ORM)
- **MobX** (State management)

...you **MUST** understand decorators. There's no way around it.

**Career Impact:**
- 📈 **Junior → Mid-Level**: You can copy-paste decorator code and make it work
- 🚀 **Mid-Level → Senior**: You **understand** decorators and can create your own
- 💎 **Senior Developer**: You cannot reach this level without mastering decorators

The good news? Once you understand decorators, you'll be able to read and write code in ANY modern TypeScript framework. They all use the same patterns.

### What Are Decorators? (Non-Technical Analogy)

Think of decorators like **stickers on a package** or **phone cases**:

#### 🎁 The Package Analogy

```
Your Class = A Package
Decorator = A Sticker on the Package

The package (class) does its job: holds items
The sticker adds extra info: "Fragile", "Priority Shipping", "Handle with Care"

The sticker DOESN'T change what's inside the package
It just adds METADATA or EXTRA BEHAVIOR around it
```

#### 📱 The Phone Case Analogy

```
Your Class = A Smartphone
Decorator = A Phone Case

The phone works perfectly fine without a case
But the case adds:
- Protection (like error handling)
- Grip (better functionality)
- Style (metadata/configuration)

The case WRAPS the phone without modifying its internals
```

**In Code Terms:**
- A decorator is just a **function** that wraps your class/method/property
- It adds **extra behavior** or **metadata** without changing the original code
- It's a clean way to say "Hey, this class/method needs special treatment"

---

## Modules: Organizing Code

### The Problem: Spaghetti Code

Imagine you're building an e-commerce application. Without modules, everything goes in one file:

```typescript
// app.ts - ONE GIANT FILE (BAD!)

// User stuff
class User {
  constructor(public name: string, public email: string) {}
}

function validateUser(user: User): boolean {
  return user.email.includes("@");
}

function hashPassword(password: string): string {
  return "hashed_" + password;
}

// Product stuff
class Product {
  constructor(public name: string, public price: number) {}
}

function applyDiscount(product: Product, discount: number): number {
  return product.price * (1 - discount);
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Order stuff
class Order {
  constructor(public user: User, public products: Product[]) {}
}

function calculateTotal(order: Order): number {
  return order.products.reduce((sum, p) => sum + p.price, 0);
}

function sendConfirmationEmail(order: Order): void {
  console.log(`Email sent to ${order.user.email}`);
}

// Cart stuff
class ShoppingCart {
  items: Product[] = [];
  
  addItem(product: Product): void {
    this.items.push(product);
  }
}

// Payment stuff
class PaymentProcessor {
  processPayment(amount: number): boolean {
    return true;
  }
}

// ... 1000+ more lines ...
```

**Problems:**
1. 🔴 **Hard to navigate** - Everything is mixed together
2. 🔴 **Name collisions** - What if you want two different `User` classes?
3. 🔴 **No reusability** - Can't easily use `User` in another project
4. 🔴 **Team conflicts** - Multiple developers editing the same file = merge conflicts
5. 🔴 **No clear boundaries** - Where does user logic end and product logic begin?

### The Solution: Modules as Lego Blocks

Modules let you split your code into **separate files** (like Lego blocks) that you can:
- **Build independently** - Each module has a clear purpose
- **Snap together** - Import and combine them as needed
- **Reuse anywhere** - Take a module and use it in other projects
- **Test separately** - Each module can be tested in isolation

**File Structure (Organized):**
```
src/
├── models/
│   ├── User.ts         // User class and types
│   ├── Product.ts      // Product class and types
│   ├── Order.ts        // Order class and types
│   └── Cart.ts         // Shopping cart
├── services/
│   ├── UserService.ts      // User-related business logic
│   ├── ProductService.ts   // Product operations
│   ├── OrderService.ts     // Order processing
│   └── PaymentService.ts   // Payment handling
├── utils/
│   ├── validation.ts   // Validation helpers
│   └── formatting.ts   // Formatting utilities
└── app.ts              // Main application (imports everything)
```

### Named Exports: Sharing Multiple Things

Use **named exports** when a file exports **multiple items**:

```typescript
// models/User.ts
export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string
  ) {}
}

export interface UserProfile {
  bio: string;
  avatar: string;
}

export type UserRole = "admin" | "user" | "guest";

export function createUser(name: string, email: string): User {
  return new User(Date.now(), name, email);
}
```

**Importing named exports:**

```typescript
// app.ts

// Import specific items
import { User, UserRole } from "./models/User";

const admin: UserRole = "admin";
const user = new User(1, "Alice", "alice@example.com");

// Import multiple items
import { User, UserProfile, UserRole, createUser } from "./models/User";

// Import all items with a namespace
import * as UserModule from "./models/User";

const user = new UserModule.User(1, "Bob", "bob@example.com");
const role: UserModule.UserRole = "admin";
```

### Default Exports: One Main Thing Per File

Use **default export** when a file has **one primary thing** to export:

```typescript
// services/UserService.ts

export default class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  findUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getAllUsers(): User[] {
    return [...this.users];
  }
}
```

**Importing default exports:**

```typescript
// app.ts

// No curly braces needed - you can name it whatever you want
import UserService from "./services/UserService";

const service = new UserService();

// You can rename it anything
import MyUserService from "./services/UserService";
import UsersAPI from "./services/UserService";  // Still the same class!
```

### Named vs Default: When to Use Which?

```typescript
// ❌ BAD: Using default export for multiple utilities
// utils/helpers.ts
export default {
  formatPrice: (price: number) => `$${price}`,
  formatDate: (date: Date) => date.toISOString(),
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
};

// Import is awkward
import helpers from "./utils/helpers";
helpers.formatPrice(99);  // Verbose


// ✅ GOOD: Use named exports for utilities
// utils/helpers.ts
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Import is clean
import { formatPrice, formatDate } from "./utils/helpers";
formatPrice(99);  // Direct access


// ✅ GOOD: Use default export for main class
// services/ProductService.ts
export default class ProductService {
  // Main service logic
}

// Import is clean
import ProductService from "./services/ProductService";


// ✅ BEST: Combine both!
// services/UserService.ts
export default class UserService {
  // Main service
}

export type UserServiceConfig = {
  maxUsers: number;
  allowDuplicates: boolean;
};

// Import both
import UserService, { UserServiceConfig } from "./services/UserService";
```

**Rule of Thumb:**
- **Default Export**: One main class/component per file
- **Named Exports**: Utilities, types, interfaces, multiple related items

### Renaming Imports (Aliasing): Avoiding Collisions

Sometimes you need to import items with the same name from different modules:

```typescript
// models/User.ts
export class User {
  constructor(public name: string) {}
}

// models/AdminUser.ts
export class User {
  constructor(public name: string, public permissions: string[]) {}
}

// ❌ COLLISION - Both are named 'User'
import { User } from "./models/User";
import { User } from "./models/AdminUser";  // Error: Duplicate identifier 'User'


// ✅ SOLUTION: Rename with 'as'
import { User as RegularUser } from "./models/User";
import { User as AdminUser } from "./models/AdminUser";

const user = new RegularUser("Alice");
const admin = new AdminUser("Bob", ["read", "write", "delete"]);
```

**More renaming examples:**

```typescript
// Avoid conflicts with built-in types
import { Response as ApiResponse } from "./api/types";
// Now 'Response' from fetch API won't conflict

// Make names clearer
import { validateEmail as isValidEmail } from "./utils/validation";

if (isValidEmail("alice@example.com")) {
  // More readable
}

// Shorten long names
import { VeryLongServiceNameThatIsAnnoyingToType as UserService } from "./services";

// Import everything with namespace to avoid all conflicts
import * as UserModels from "./models/User";
import * as ProductModels from "./models/Product";

const user = new UserModels.User("Alice");
const product = new ProductModels.Product("Laptop", 999);
```

### Re-exporting: Creating Index Files

Create **barrel files** (index.ts) to simplify imports:

```typescript
// models/index.ts (barrel file)
export { User, UserProfile, UserRole } from "./User";
export { Product, ProductCategory } from "./Product";
export { Order, OrderStatus } from "./Order";
export { default as ShoppingCart } from "./Cart";

// Now importing is cleaner
// Before:
import { User } from "./models/User";
import { Product } from "./models/Product";
import { Order } from "./models/Order";

// After:
import { User, Product, Order } from "./models";
```

---

## Decorators: The Basics

### Before We Code: Setup Required

To use decorators in TypeScript, you MUST enable them in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "experimentalDecorators": true,  // ⚠️ REQUIRED for decorators
    "emitDecoratorMetadata": true    // Optional: needed for reflection
  }
}
```

**Why "experimental"?** Decorators are still being finalized in JavaScript, but TypeScript supports them with this flag. All major frameworks use them, so don't worry about the "experimental" label.

### What is a Decorator? (Technical Definition)

A decorator is a **special function** that:
1. Takes a **target** (class, method, property, etc.)
2. Adds **behavior** or **metadata** to it
3. Returns the modified target (or void)

**Simple analogy**: 
```
Normal function: add(2, 3) → returns 5
Decorator: @Sealed(MyClass) → returns modified MyClass
```

### Class Decorator: Your First Decorator

#### Scenario: Sealing a Class

We want to **freeze** a class so that no one can add new properties to instances at runtime.

```typescript
// Without decorator - manual approach
class User {
  constructor(public name: string) {}
}

const user = new User("Alice");
Object.seal(user);  // ❌ Have to remember to call this every time

// With decorator - automatic approach
@Sealed
class User {
  constructor(public name: string) {}
}

const user = new User("Alice");  // ✅ Automatically sealed
```

#### Creating the @Sealed Decorator

```typescript
// Decorator function
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// Apply it with @
@Sealed
class User {
  constructor(public name: string, public email: string) {}
  
  greet(): string {
    return `Hello, ${this.name}`;
  }
}

// Now the class is sealed
const user = new User("Alice", "alice@example.com");
console.log(user.greet());  // "Hello, Alice"

// ❌ Can't add new properties to sealed instances
(user as any).newProperty = "test";  // Fails silently in non-strict mode
```

**What's happening:**
1. `@Sealed` is placed above the class
2. TypeScript calls `Sealed(User)` automatically
3. The function seals the constructor and prototype
4. All instances are now protected

### JS vs TS: The Decorator Syntax

#### Standard JavaScript (Without Decorators)

```javascript
// Plain JS - manual wrapping
class User {
  constructor(name) {
    this.name = name;
  }
}

// Manually wrap the class
function SealedClass(OriginalClass) {
  Object.seal(OriginalClass);
  Object.seal(OriginalClass.prototype);
  return OriginalClass;
}

// Have to explicitly wrap it
User = SealedClass(User);

// Or use an IIFE (Immediately Invoked Function Expression)
const User = SealedClass(
  class {
    constructor(name) {
      this.name = name;
    }
  }
);
```

#### TypeScript (With Decorators)

```typescript
// TypeScript - clean decorator syntax
@Sealed
class User {
  constructor(public name: string) {}
}

// That's it! Much cleaner.
```

**Benefits of TypeScript decorators:**
✅ **Cleaner syntax** - No manual wrapping  
✅ **More readable** - Intent is clear from `@Sealed`  
✅ **Standardized** - All frameworks use the same pattern  
✅ **Composable** - Can stack multiple decorators easily  

### More Class Decorator Examples

#### Logging Decorator

```typescript
function LogClass(constructor: Function) {
  console.log(`Class created: ${constructor.name}`);
  console.log(`Methods: ${Object.getOwnPropertyNames(constructor.prototype)}`);
}

@LogClass
class Product {
  constructor(public name: string, public price: number) {}
  
  getDetails(): string {
    return `${this.name}: $${this.price}`;
  }
}

// Console output:
// Class created: Product
// Methods: constructor,getDetails

const product = new Product("Laptop", 999);
```

#### Timestamping Decorator

```typescript
function Timestamped<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date();
    
    getAge(): string {
      const now = new Date();
      const diff = now.getTime() - this.createdAt.getTime();
      return `Created ${Math.floor(diff / 1000)} seconds ago`;
    }
  };
}

@Timestamped
class User {
  constructor(public name: string) {}
}

const user = new User("Alice");
console.log((user as any).getAge());  // "Created 0 seconds ago"

// Wait 2 seconds
setTimeout(() => {
  console.log((user as any).getAge());  // "Created 2 seconds ago"
}, 2000);
```

---

## Decorator Factories & Composition

### The Problem: Rigid Decorators

Our `@Sealed` decorator works, but it's not flexible:

```typescript
@Sealed  // Always seals - no configuration
class User {}
```

What if we want to:
- Pass custom messages
- Toggle the decorator on/off
- Configure its behavior

**Solution**: Use a **Decorator Factory** - a function that returns a decorator.

### Decorator Factory: Decorators with Parameters

A decorator factory is a function that **returns** a decorator:

```typescript
// Decorator Factory (function that returns a decorator)
function Log(message: string) {
  // This is the actual decorator
  return function(constructor: Function) {
    console.log(`${message}: ${constructor.name}`);
  };
}

// Usage - call the factory with parameters
@Log("Creating class")
class User {
  constructor(public name: string) {}
}

@Log("Initializing service")
class ProductService {
  getProducts() {
    return [];
  }
}

// Console output:
// Creating class: User
// Initializing service: ProductService
```

**What's happening:**
1. `@Log("Creating class")` calls the factory function
2. Factory returns a decorator function
3. TypeScript applies the decorator to the class

**Think of it like:**
```
Regular decorator: @Sealed
Decorator factory: @Log("message") - you're calling a function that makes a decorator
```

### More Decorator Factory Examples

#### Component Decorator (Angular-style)

```typescript
interface ComponentConfig {
  selector: string;
  template: string;
}

function Component(config: ComponentConfig) {
  return function(constructor: Function) {
    console.log(`Component registered:`);
    console.log(`  Selector: ${config.selector}`);
    console.log(`  Template: ${config.template}`);
    console.log(`  Class: ${constructor.name}`);
  };
}

@Component({
  selector: "app-user",
  template: "<div>User Component</div>"
})
class UserComponent {
  constructor(public name: string) {}
}

// Console output:
// Component registered:
//   Selector: app-user
//   Template: <div>User Component</div>
//   Class: UserComponent
```

#### MinLength Validator

```typescript
function MinLength(length: number) {
  return function(constructor: Function) {
    const original = constructor.prototype.validate;
    
    constructor.prototype.validate = function() {
      if (this.value && this.value.length < length) {
        return `Minimum length is ${length}`;
      }
      return original?.call(this) || null;
    };
  };
}

@MinLength(5)
class Username {
  constructor(public value: string) {}
  
  validate(): string | null {
    return null;
  }
}

const username = new Username("abc");
console.log(username.validate());  // "Minimum length is 5"

const validUsername = new Username("alice123");
console.log(validUsername.validate());  // null (valid)
```

### Decorator Composition: Stacking Multiple Decorators

You can apply **multiple decorators** to the same class:

```typescript
function Sealed(constructor: Function) {
  console.log("@Sealed executed");
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function Logged(constructor: Function) {
  console.log("@Logged executed");
  console.log(`Class: ${constructor.name}`);
}

function Component(config: { name: string }) {
  console.log("@Component factory called");
  return function(constructor: Function) {
    console.log("@Component decorator executed");
    console.log(`Component name: ${config.name}`);
  };
}

// Stack multiple decorators
@Component({ name: "User" })  // Top
@Logged                        // Middle
@Sealed                        // Bottom
class User {
  constructor(public name: string) {}
}

// Console output (read bottom to top):
// @Component factory called
// @Sealed executed
// @Logged executed
// Class: User
// @Component decorator executed
// Component name: User
```

### Deep Dive: Decorator Execution Order

**Critical Understanding**: Decorators execute in a specific order:

```
1. Decorator FACTORIES are called TOP-to-BOTTOM (evaluation)
2. Decorator FUNCTIONS execute BOTTOM-to-TOP (application)
```

**Example:**

```typescript
function First() {
  console.log("1. First() factory evaluated");
  return function(target: any) {
    console.log("4. First() decorator applied");
  };
}

function Second() {
  console.log("2. Second() factory evaluated");
  return function(target: any) {
    console.log("3. Second() decorator applied");
  };
}

@First()
@Second()
class Test {}

// Console output:
// 1. First() factory evaluated    (top-to-bottom evaluation)
// 2. Second() factory evaluated   (top-to-bottom evaluation)
// 3. Second() decorator applied   (bottom-to-top application)
// 4. First() decorator applied    (bottom-to-top application)
```

**Why this order?**
- **Factories** (top-to-bottom): So outer decorators can configure themselves based on inner decorators
- **Application** (bottom-to-top): So each decorator wraps the previous one, like layers

**Think of it like putting on clothes:**
```
@Jacket     ← Evaluated first, applied last (outermost layer)
@Shirt      ← Evaluated second, applied second
@Undershirt ← Evaluated third, applied first (innermost layer)
```

**Real-world impact:**

```typescript
function Authenticated() {
  return function(target: any) {
    console.log("Check if user is authenticated");
  };
}

function Authorized(role: string) {
  return function(target: any) {
    console.log(`Check if user has role: ${role}`);
  };
}

@Authenticated()  // Must run AFTER authorization check
@Authorized("admin")  // Must run FIRST (innermost check)
class AdminPanel {}

// This makes sense: First check if they have admin role, then check if they're authenticated
```

---

## Member Decorators

Class decorators are great, but we can also decorate **individual members** of a class:
- **Methods** - Functions inside the class
- **Accessors** - Getters and setters
- **Properties** - Class fields
- **Parameters** - Function arguments

### Method Decorators: Wrapping Function Behavior

#### Scenario: Confirmable Actions

We want to ask "Are you sure?" before running dangerous methods like `deleteUser()`.

```typescript
function Confirmable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const confirm = window.confirm(`Are you sure you want to execute ${propertyKey}?`);
    
    if (confirm) {
      return originalMethod.apply(this, args);
    } else {
      console.log(`${propertyKey} was cancelled`);
      return null;
    }
  };
  
  return descriptor;
}

class UserService {
  @Confirmable
  deleteUser(userId: number): void {
    console.log(`User ${userId} deleted`);
  }
  
  @Confirmable
  deleteAllUsers(): void {
    console.log("All users deleted");
  }
  
  // Regular method - no confirmation
  getUser(userId: number): void {
    console.log(`Getting user ${userId}`);
  }
}

const service = new UserService();
service.deleteUser(1);  // Shows confirm dialog
service.getUser(1);     // No dialog - not decorated
```

**Parameters explained:**
- `target` - The class prototype (UserService.prototype)
- `propertyKey` - The method name ("deleteUser")
- `descriptor` - Object describing the method (has the actual function in `value`)

#### Logging Method Calls

```typescript
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @LogMethod
  add(a: number, b: number): number {
    return a + b;
  }
  
  @LogMethod
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(5, 3);
// Console:
// Calling add with args: [5, 3]
// add returned: 8

calc.multiply(4, 7);
// Console:
// Calling multiply with args: [4, 7]
// multiply returned: 28
```

#### Measure Execution Time

```typescript
function MeasureTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    
    console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
  
  return descriptor;
}

class DataProcessor {
  @MeasureTime
  processLargeDataset(data: number[]): number {
    // Simulate expensive operation
    return data.reduce((sum, n) => sum + n, 0);
  }
}

const processor = new DataProcessor();
processor.processLargeDataset([1, 2, 3, 4, 5]);
// Console: processLargeDataset took 0.12ms
```

### Accessor Decorators: Getters and Setters

#### Scenario: Automatic Uppercase Conversion

```typescript
function Uppercase(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalSet = descriptor.set;
  
  descriptor.set = function(value: string) {
    const uppercased = value.toUpperCase();
    originalSet?.call(this, uppercased);
  };
  
  return descriptor;
}

class User {
  private _name: string = "";
  
  @Uppercase
  set name(value: string) {
    this._name = value;
  }
  
  get name(): string {
    return this._name;
  }
}

const user = new User();
user.name = "alice chen";
console.log(user.name);  // "ALICE CHEN"

user.name = "Bob Smith";
console.log(user.name);  // "BOB SMITH"
```

#### Validation on Setters

```typescript
function ValidatePositive(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalSet = descriptor.set;
  
  descriptor.set = function(value: number) {
    if (value < 0) {
      throw new Error(`${propertyKey} must be positive`);
    }
    originalSet?.call(this, value);
  };
  
  return descriptor;
}

class Product {
  private _price: number = 0;
  
  @ValidatePositive
  set price(value: number) {
    this._price = value;
  }
  
  get price(): number {
    return this._price;
  }
}

const product = new Product();
product.price = 99.99;  // ✅ OK
console.log(product.price);  // 99.99

product.price = -10;  // ❌ Throws Error: price must be positive
```

### Property Decorators: Field Validation

#### Scenario: Required Fields

```typescript
function Required(target: any, propertyKey: string) {
  let value: any;
  
  Object.defineProperty(target, propertyKey, {
    get: () => value,
    set: (newValue: any) => {
      if (newValue === null || newValue === undefined || newValue === "") {
        throw new Error(`${propertyKey} is required`);
      }
      value = newValue;
    },
    enumerable: true,
    configurable: true
  });
}

class User {
  @Required
  email!: string;
  
  name?: string;  // Optional - no decorator
}

const user = new User();
user.email = "alice@example.com";  // ✅ OK

user.email = "";  // ❌ Throws Error: email is required
```

#### Minimum Value Validation

```typescript
function Min(minValue: number) {
  return function(target: any, propertyKey: string) {
    let value: number;
    
    Object.defineProperty(target, propertyKey, {
      get: () => value,
      set: (newValue: number) => {
        if (newValue < minValue) {
          throw new Error(`${propertyKey} must be at least ${minValue}`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class Product {
  @Min(0)
  price!: number;
  
  @Min(1)
  quantity!: number;
}

const product = new Product();
product.price = 99.99;  // ✅ OK
product.quantity = 5;   // ✅ OK

product.price = -10;    // ❌ Throws Error: price must be at least 0
product.quantity = 0;   // ❌ Throws Error: quantity must be at least 1
```

### Parameter Decorators: Marking Function Arguments

Parameter decorators are commonly used in frameworks to extract data from HTTP requests, dependency injection, etc.

#### Scenario: REST API Parameter Extraction

```typescript
// Store metadata about parameters
const paramMetadata = new Map<string, Map<number, string>>();

function Param(paramName: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    if (!paramMetadata.has(propertyKey)) {
      paramMetadata.set(propertyKey, new Map());
    }
    
    paramMetadata.get(propertyKey)!.set(parameterIndex, paramName);
    console.log(`Parameter ${parameterIndex} of ${propertyKey} is marked as @Param("${paramName}")`);
  };
}

function Body(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Parameter ${parameterIndex} of ${propertyKey} is marked as @Body`);
}

class UserController {
  getUser(@Param("id") userId: string) {
    console.log(`Getting user with ID: ${userId}`);
  }
  
  createUser(@Body userData: any, @Param("source") source: string) {
    console.log(`Creating user from ${source}:`, userData);
  }
  
  updateUser(
    @Param("id") userId: string,
    @Body updates: any
  ) {
    console.log(`Updating user ${userId} with:`, updates);
  }
}

// Console output when class is defined:
// Parameter 0 of getUser is marked as @Param("id")
// Parameter 0 of createUser is marked as @Body
// Parameter 1 of createUser is marked as @Param("source")
// Parameter 0 of updateUser is marked as @Param("id")
// Parameter 1 of updateUser is marked as @Body
```

**Real-world usage** (how frameworks like NestJS use this):

```typescript
// This is what you write in NestJS
class UserController {
  @Get(":id")  // HTTP GET /users/:id
  getUser(@Param("id") id: string) {
    return { id, name: "Alice" };
  }
  
  @Post()  // HTTP POST /users
  createUser(@Body() userData: CreateUserDto) {
    return { created: true, user: userData };
  }
  
  @Put(":id")  // HTTP PUT /users/:id
  updateUser(
    @Param("id") id: string,
    @Body() updates: UpdateUserDto
  ) {
    return { updated: true, id, updates };
  }
}
```

**What's happening:**
1. `@Param("id")` tells NestJS: "Extract the `id` from the URL path"
2. `@Body()` tells NestJS: "Extract the data from the request body"
3. Framework uses the metadata to automatically populate the parameters

---

## Real-World Framework Examples

### Angular Component

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <button (click)="onDelete()">Delete</button>
    </div>
  `,
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() delete = new EventEmitter<number>();
  
  onDelete(): void {
    this.delete.emit(this.user.id);
  }
}
```

**Decorators identified:**
- `@Component({...})` - Class decorator factory (marks this as an Angular component)
- `@Input()` - Property decorator (data flows IN from parent)
- `@Output()` - Property decorator (events flow OUT to parent)

**What each does:**
- `@Component`: Registers the class with Angular's framework, provides metadata (selector, template, styles)
- `@Input`: Allows parent components to pass data into this component
- `@Output`: Allows this component to emit events to parent components

### NestJS Controller

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  
  @Get()
  getAllUsers(): User[] {
    return this.userService.findAll();
  }
  
  @Get(':id')
  getUserById(@Param('id') id: string): User {
    return this.userService.findById(id);
  }
  
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): User {
    return this.userService.create(createUserDto);
  }
  
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): User {
    return this.userService.update(id, updateUserDto);
  }
  
  @Delete(':id')
  deleteUser(@Param('id') id: string): void {
    this.userService.delete(id);
  }
}
```

**Decorators identified:**
- `@Controller('users')` - Class decorator factory (defines route prefix)
- `@Get()`, `@Post()`, `@Put()`, `@Delete()` - Method decorators (HTTP methods)
- `@Param('id')` - Parameter decorator (extract URL parameter)
- `@Body()` - Parameter decorator (extract request body)

**What this creates:**
```
GET    /users          → getAllUsers()
GET    /users/:id      → getUserById(id)
POST   /users          → createUser(body)
PUT    /users/:id      → updateUser(id, body)
DELETE /users/:id      → deleteUser(id)
```

### TypeORM Entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ length: 100 })
  name!: string;
  
  @Column({ unique: true })
  email!: string;
  
  @Column({ nullable: true })
  phoneNumber?: string;
  
  @CreateDateColumn()
  createdAt!: Date;
  
  @UpdateDateColumn()
  updatedAt!: Date;
}
```

**Decorators identified:**
- `@Entity('users')` - Class decorator (maps to database table)
- `@PrimaryGeneratedColumn()` - Property decorator (auto-increment primary key)
- `@Column({...})` - Property decorator (maps to table column)
- `@CreateDateColumn()` - Property decorator (auto-set on insert)
- `@UpdateDateColumn()` - Property decorator (auto-update on save)

**What this creates:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phoneNumber VARCHAR(255) NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

---

## Student Assessment

### Question 1: Concept Check - Default Exports

**Question:** When should you use `export default`?

A) For utility functions that you want to export multiple times  
B) For the main class or component in a file  
C) When you want to export everything from a module  
D) Only for interfaces and types  

<details>
<summary>Answer</summary>

**B) For the main class or component in a file**

**Explanation:**

Use `export default` when a file has **one primary thing** to export. This is typically:
- A main class (e.g., `UserService`)
- A primary component (e.g., `UserComponent` in Angular)
- A single configuration object
- The main function in a utility file

**Examples:**

```typescript
// ✅ GOOD: One main service per file
// services/UserService.ts
export default class UserService {
  // Main service logic
}

// ✅ GOOD: One main component per file
// components/UserCard.tsx
export default function UserCard() {
  // Component logic
}

// ❌ BAD: Multiple utility functions
// utils/helpers.ts
export default {
  formatPrice: () => {},
  formatDate: () => {},
  capitalize: () => {}
};
// Better as named exports

// ✅ GOOD: Combine default + named
// services/UserService.ts
export default class UserService {}
export type UserServiceConfig = { ... };
```

**Why B is correct:**
- Default exports work best for single, primary exports
- Makes importing clean: `import UserService from './UserService'`
- Common pattern in React, Angular, Vue components

**Why other options are wrong:**
- **A**: Utility functions should use named exports so you can import specific ones
- **C**: `export *` is for re-exporting, not default exports
- **D**: Interfaces and types should use named exports
</details>

---

### Question 2: The "Ah-ha" Moment - Real-World Code Analysis

**Challenge:** Look at this NestJS controller code and answer the questions below:

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';

@Controller('api/products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}
  
  @Get()
  findAll(@Query('category') category?: string): Product[] {
    return this.productService.findAll(category);
  }
  
  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string): Product {
    return this.productService.findById(id);
  }
  
  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createProductDto: CreateProductDto): Product {
    return this.productService.create(createProductDto);
  }
  
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Product {
    return this.productService.update(id, updateProductDto);
  }
  
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string): void {
    this.productService.remove(id);
  }
}
```

**Questions:**

1. **Identify all decorators** in this code and categorize them (class, method, parameter)

2. **What HTTP routes** does this controller create? List all 5.

3. **Which decorators are factories** (take parameters)?

4. **Explain the purpose** of each decorator type:
   - `@Controller('api/products')`
   - `@Get(':id')`
   - `@Param('id')`
   - `@Body()`
   - `@UseGuards(AdminGuard)`

5. **Execution order:** If you call `GET /api/products/123`, what is the order of decorator execution?

<details>
<summary>Answers</summary>

### Answer 1: All Decorators Categorized

**Class Decorators:**
- `@Controller('api/products')` - Defines the route prefix
- `@UseGuards(AuthGuard)` - Applies authentication to all routes

**Method Decorators:**
- `@Get()` - Maps to HTTP GET requests
- `@Get(':id')` - Maps to HTTP GET with path parameter
- `@Post()` - Maps to HTTP POST requests
- `@Put(':id')` - Maps to HTTP PUT with path parameter
- `@Delete(':id')` - Maps to HTTP DELETE with path parameter
- `@UseGuards(AdminGuard)` - Applies admin check (appears 3 times)

**Parameter Decorators:**
- `@Query('category')` - Extracts query parameter
- `@Param('id')` - Extracts URL path parameter (appears 4 times)
- `@Body()` - Extracts request body (appears 2 times)

**Total count:**
- Class decorators: 2
- Method decorators: 8
- Parameter decorators: 7

---

### Answer 2: HTTP Routes Created

```
1. GET    /api/products              → findAll(category?)
2. GET    /api/products/:id          → findOne(id)
3. POST   /api/products              → create(dto)
4. PUT    /api/products/:id          → update(id, dto)
5. DELETE /api/products/:id          → remove(id)
```

---

### Answer 3: Decorator Factories (Take Parameters)

**Decorator factories** are decorators that accept arguments:

1. `@Controller('api/products')` - Takes route prefix
2. `@Get(':id')` - Takes optional route path
3. `@Post()` - Can take optional route path (here it's empty)
4. `@Put(':id')` - Takes route path
5. `@Delete(':id')` - Takes route path
6. `@UseGuards(AuthGuard)` - Takes guard class(es)
7. `@UseGuards(AdminGuard)` - Takes guard class(es)
8. `@Query('category')` - Takes query parameter name
9. `@Param('id')` - Takes path parameter name
10. `@Body()` - Can take validation pipe (here it's empty)

**NOT factories** (no parameters):
- None in this example - all decorators here are factories

---

### Answer 4: Purpose of Each Decorator

**`@Controller('api/products')`** (Class Decorator)
- **Purpose**: Marks the class as a controller and sets the route prefix
- **Effect**: All routes in this controller start with `/api/products`
- **Framework uses it to**: Register routes in the routing table

**`@Get(':id')`** (Method Decorator)
- **Purpose**: Maps this method to HTTP GET requests at `/api/products/:id`
- **Effect**: When someone visits `GET /api/products/123`, calls `findOne("123")`
- **`:id`** is a placeholder that becomes a parameter

**`@Param('id')`** (Parameter Decorator)
- **Purpose**: Extracts the `:id` value from the URL path
- **Effect**: If URL is `/api/products/123`, injects `"123"` into the parameter
- **Framework uses it to**: Parse and pass URL parameters to the method

**`@Body()`** (Parameter Decorator)
- **Purpose**: Extracts and validates the request body (JSON payload)
- **Effect**: Converts JSON to `CreateProductDto` or `UpdateProductDto` object
- **Framework uses it to**: Parse HTTP body and validate against DTO class

**`@UseGuards(AdminGuard)`** (Method/Class Decorator)
- **Purpose**: Adds authorization checks before the method runs
- **Effect**: Runs `AdminGuard` logic first; if it fails, method never executes
- **Framework uses it to**: Implement authentication/authorization middleware

---

### Answer 5: Execution Order for `GET /api/products/123`

When you call `GET /api/products/123`:

**Step 1: Class-level decorators (top-down)**
1. `@Controller('api/products')` - Matches route prefix ✓
2. `@UseGuards(AuthGuard)` - Runs authentication check ✓

**Step 2: Method-level decorators (top-down)**
3. `@Get(':id')` - Matches HTTP method and path ✓
4. `@UseGuards(AdminGuard)` - Runs admin authorization check ✓

**Step 3: Parameter decorators (as needed)**
5. `@Param('id')` - Extracts `"123"` from URL

**Step 4: Execute method**
6. `findOne("123")` - Actual method runs

**Full flow:**
```
Request: GET /api/products/123
    ↓
1. Match @Controller('api/products') ✓
    ↓
2. Run @UseGuards(AuthGuard) ✓
    ↓
3. Match @Get(':id') ✓
    ↓
4. Run @UseGuards(AdminGuard) ✓
    ↓
5. Extract @Param('id') → "123"
    ↓
6. Execute findOne("123")
    ↓
Response: Product object
```

**Key insights:**
- Guards run **before** the method (middleware pattern)
- Class-level guards run **before** method-level guards
- Parameter decorators extract data **just before** method execution
- If any guard fails, the method never runs

</details>

---

### Question 3: Build Your Own Decorator

**Challenge:** Create a `@Retry` decorator that retries a method up to N times if it throws an error.

**Requirements:**
1. Should be a decorator factory that takes `maxRetries` parameter
2. If the method throws an error, retry up to `maxRetries` times
3. If all retries fail, throw the last error
4. Log each retry attempt

**Example usage:**
```typescript
class ApiService {
  @Retry(3)
  async fetchData(url: string): Promise<any> {
    // Might fail due to network issues
    const response = await fetch(url);
    if (!response.ok) throw new Error('Fetch failed');
    return response.json();
  }
}

// If fetch fails, it will retry up to 3 times
```

<details>
<summary>Solution</summary>

```typescript
function Retry(maxRetries: number) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
          console.log(`${propertyKey}: Attempt ${attempt}/${maxRetries + 1}`);
          const result = await originalMethod.apply(this, args);
          console.log(`${propertyKey}: Success on attempt ${attempt}`);
          return result;
        } catch (error) {
          lastError = error;
          console.log(`${propertyKey}: Attempt ${attempt} failed:`, error);
          
          if (attempt <= maxRetries) {
            console.log(`${propertyKey}: Retrying...`);
            // Optional: Add delay between retries
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      console.log(`${propertyKey}: All ${maxRetries + 1} attempts failed`);
      throw lastError;
    };
    
    return descriptor;
  };
}

// Usage example
class ApiService {
  private failCount = 0;
  
  @Retry(3)
  async fetchData(url: string): Promise<any> {
    this.failCount++;
    
    // Simulate: succeed on 3rd attempt
    if (this.failCount < 3) {
      throw new Error(`Network error (attempt ${this.failCount})`);
    }
    
    return { data: "Success!", url };
  }
  
  @Retry(2)
  async saveData(data: any): Promise<void> {
    // Always fails for demonstration
    throw new Error("Save failed");
  }
}

// Test it
async function test() {
  const api = new ApiService();
  
  try {
    const data = await api.fetchData("https://api.example.com/data");
    console.log("Final result:", data);
  } catch (error) {
    console.error("fetchData ultimately failed:", error);
  }
  
  try {
    await api.saveData({ test: true });
  } catch (error) {
    console.error("saveData ultimately failed:", error);
  }
}

test();

// Console output:
// fetchData: Attempt 1/4
// fetchData: Attempt 1 failed: Error: Network error (attempt 1)
// fetchData: Retrying...
// (1 second delay)
// fetchData: Attempt 2/4
// fetchData: Attempt 2 failed: Error: Network error (attempt 2)
// fetchData: Retrying...
// (2 second delay)
// fetchData: Attempt 3/4
// fetchData: Success on attempt 3
// Final result: { data: "Success!", url: "https://api.example.com/data" }
//
// saveData: Attempt 1/3
// saveData: Attempt 1 failed: Error: Save failed
// saveData: Retrying...
// (1 second delay)
// saveData: Attempt 2/3
// saveData: Attempt 2 failed: Error: Save failed
// saveData: Retrying...
// (2 second delay)
// saveData: Attempt 3/3
// saveData: Attempt 3 failed: Error: Save failed
// saveData: All 3 attempts failed
// saveData ultimately failed: Error: Save failed
```

**How it works:**
1. `@Retry(3)` calls the factory, which returns the actual decorator
2. The decorator wraps the original method
3. On each call, it tries up to `maxRetries + 1` times (initial + retries)
4. If successful, returns immediately
5. If all attempts fail, throws the last error
6. Includes exponential backoff delay between retries

**Bonus features added:**
- Async/await support
- Exponential backoff (1s, 2s, 3s delays)
- Detailed logging of each attempt
- Works with both sync and async methods
</details>

---

## Quick Reference Card

```typescript
// ========== MODULES ==========

// Named exports (multiple items)
export class User {}
export interface UserConfig {}
export type UserRole = "admin" | "user";

// Import named exports
import { User, UserConfig } from "./models/User";
import * as UserModule from "./models/User";  // Namespace import

// Default export (one main item)
export default class UserService {}

// Import default export
import UserService from "./services/UserService";

// Renaming (aliasing)
import { User as AppUser } from "./models/User";

// ========== CLASS DECORATOR ==========
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@Sealed
class User {}

// ========== DECORATOR FACTORY ==========
function Component(config: { selector: string }) {
  return function(constructor: Function) {
    console.log(`Component: ${config.selector}`);
  };
}

@Component({ selector: "app-user" })
class UserComponent {}

// ========== METHOD DECORATOR ==========
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey}`);
    return originalMethod.apply(this, args);
  };
}

class Service {
  @LogMethod
  doSomething() {}
}

// ========== PROPERTY DECORATOR ==========
function Required(target: any, propertyKey: string) {
  // Add validation logic
}

class User {
  @Required
  email!: string;
}

// ========== PARAMETER DECORATOR ==========
function Param(name: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    console.log(`Parameter ${parameterIndex} is @Param("${name}")`);
  };
}

class Controller {
  getUser(@Param("id") id: string) {}
}

// ========== DECORATOR COMPOSITION ==========
@First()
@Second()
@Third()
class Example {}
// Evaluation: First() → Second() → Third() (top-to-bottom)
// Application: Third → Second → First (bottom-to-top)

// ========== TSCONFIG SETUP ==========
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## Final Thoughts

Congratulations! You've completed the Modules & Decorators Master Class! You now understand:

✅ **Why decorators matter** - They're essential for modern frameworks (Angular, NestJS, TypeORM)  
✅ **What decorators are** - Functions that wrap and enhance classes/methods/properties  
✅ **How modules work** - Organizing code into reusable pieces  
✅ **Class decorators** - Enhance entire classes  
✅ **Decorator factories** - Decorators that accept parameters  
✅ **Member decorators** - Enhance methods, properties, accessors, and parameters  
✅ **Real-world usage** - Reading and understanding framework code  

**The Career Path:**
- **Junior Dev**: Use decorators from frameworks
- **Mid-Level Dev**: Understand what decorators do
- **Senior Dev**: Create custom decorators for your team

**Next Steps:**
1. Practice reading Angular/NestJS codebases
2. Try creating your own custom decorators
3. Explore `reflect-metadata` for advanced decorator patterns
4. Study how popular libraries implement decorators

Remember: Decorators are just **functions that wrap other code**. Once you understand that simple concept, everything else falls into place. You're now ready to work with any modern TypeScript framework! 🚀

**Pro Tip**: Every time you see `@Something` in a codebase, ask yourself:
- Is it a class, method, property, or parameter decorator?
- Is it a factory (does it take parameters)?
- What behavior is it adding?

Master decorators, and you master modern TypeScript development! 💪
