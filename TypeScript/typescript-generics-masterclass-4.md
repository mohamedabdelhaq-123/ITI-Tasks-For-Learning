# TypeScript Generics & Advanced Type Manipulation Master Class

## Table of Contents
1. [The Evolving Codebase: Why Generics?](#the-evolving-codebase-why-generics)
2. [Generic Classes](#generic-classes)
3. [Generic Functions & Interfaces](#generic-functions--interfaces)
4. [Generic Constraints](#generic-constraints)
5. [The `keyof` Operator](#the-keyof-operator)
6. [Type Mapping: The Formula](#type-mapping-the-formula)
7. [Utility Types](#utility-types)
8. [Student Assessment](#student-assessment)

---

## The Evolving Codebase: Why Generics?

### The Story: Building a Storage System

Imagine you're building an inventory management system. You need to store different types of data: numbers, strings, products, etc.

### The Problem: Code Duplication

#### Version 1: Number Storage

```typescript
class NumberStorage {
  private data: number[] = [];

  add(item: number): void {
    this.data.push(item);
  }

  remove(item: number): void {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  getAll(): number[] {
    return [...this.data];
  }

  getFirst(): number | undefined {
    return this.data[0];
  }
}

const prices = new NumberStorage();
prices.add(29.99);
prices.add(49.99);
console.log(prices.getAll());  // [29.99, 49.99]
```

This works! But now we need to store strings...

#### Version 2: String Storage (Duplication Begins)

```typescript
// 😱 Copy-pasting the entire class and changing 'number' to 'string'
class StringStorage {
  private data: string[] = [];

  add(item: string): void {
    this.data.push(item);
  }

  remove(item: string): void {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  getAll(): string[] {
    return [...this.data];
  }

  getFirst(): string | undefined {
    return this.data[0];
  }
}

const productNames = new StringStorage();
productNames.add("Laptop");
productNames.add("Mouse");
```

Now we need to store Book objects...

#### Version 3: Book Storage (Duplication Gets Worse)

```typescript
type Book = {
  title: string;
  author: string;
  isbn: string;
};

// 😱 Another copy-paste! This is getting ridiculous...
class BookStorage {
  private data: Book[] = [];

  add(item: Book): void {
    this.data.push(item);
  }

  remove(item: Book): void {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  getAll(): Book[] {
    return [...this.data];
  }

  getFirst(): Book | undefined {
    return this.data[0];
  }
}
```

**The Problems:**
1. 🔴 **Massive code duplication** - Same logic repeated for every type
2. 🔴 **Maintenance nightmare** - Bug fix requires updating ALL classes
3. 🔴 **Not scalable** - Need a new class for every new type
4. 🔴 **Hard to extend** - Can't easily add new methods to all storage types

### JavaScript's "Solution": Using `any` (Unsafe!)

```javascript
// Standard JS - "Flexible" but Dangerous
class Storage {
  constructor() {
    this.data = [];
  }

  add(item) {
    this.data.push(item);
  }

  remove(item) {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  getAll() {
    return [...this.data];
  }

  getFirst() {
    return this.data[0];
  }
}

const prices = new Storage();
prices.add(29.99);
prices.add("Laptop");  // 😱 Mixed types - no error!
prices.add({ invalid: true });  // 😱 No type safety!

const firstPrice = prices.getFirst();
console.log(firstPrice.toFixed(2));  // 💥 Runtime error if first item is a string!
```

TypeScript with `any` has the same problem:

```typescript
class Storage {
  private data: any[] = [];  // 😱 Defeats TypeScript's purpose

  add(item: any): void {
    this.data.push(item);
  }

  getFirst(): any {
    return this.data[0];
  }
}

const prices = new Storage();
prices.add(29.99);
prices.add("Laptop");  // No error - but this is dangerous!

const price = prices.getFirst();  // Type: any
price.toFixed(2);  // No compile-time check - might crash!
```

### The Solution: Generic Classes

```typescript
// Modern TS - Type-Safe and Reusable
class Storage<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  remove(item: T): void {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  getAll(): T[] {
    return [...this.data];
  }

  getFirst(): T | undefined {
    return this.data[0];
  }

  getCount(): number {
    return this.data.length;
  }
}

// ✅ Type-safe number storage
const prices = new Storage<number>();
prices.add(29.99);
prices.add(49.99);
prices.add("free");  // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

const firstPrice = prices.getFirst();  // Type: number | undefined
if (firstPrice !== undefined) {
  console.log(firstPrice.toFixed(2));  // ✅ TypeScript knows this is safe
}

// ✅ Type-safe string storage
const productNames = new Storage<string>();
productNames.add("Laptop");
productNames.add("Mouse");
productNames.add(123);  // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'

// ✅ Type-safe book storage
type Book = {
  title: string;
  author: string;
  isbn: string;
};

const books = new Storage<Book>();
books.add({ title: "TypeScript Handbook", author: "Microsoft", isbn: "123456" });
books.add({ title: "Clean Code", author: "Robert Martin", isbn: "789012" });

const firstBook = books.getFirst();  // Type: Book | undefined
if (firstBook) {
  console.log(firstBook.title);  // ✅ TypeScript knows Book has a 'title' property
}
```

**Benefits of Generics:**
✅ **Write once, use everywhere** - Single class for all types  
✅ **Type safety maintained** - TypeScript catches type errors at compile time  
✅ **Better IntelliSense** - Editor knows exact types  
✅ **Easy maintenance** - Fix bugs in one place  
✅ **Flexible and safe** - Reusable without sacrificing safety  

---

## Generic Classes

### Understanding the Syntax

```typescript
class Product<T> {
  private value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
  }

  display(): string {
    return `Product contains: ${this.value}`;
  }
}
```

**Syntax Breakdown:**
- `<T>` - Generic type parameter (placeholder for a type)
- `T` can be used anywhere a type is expected
- When creating an instance, replace `T` with an actual type

### Deep Dive: `T` is Just a Type Variable

Think of `<T>` like a function parameter, but for types:

```typescript
// Regular function with value parameter
function double(x: number): number {
  return x * 2;
}
double(5);  // x = 5

// Generic class with type parameter
class Box<T> {
  constructor(private value: T) {}
}
new Box<number>(5);  // T = number
new Box<string>("hello");  // T = string
```

**Common naming conventions:**
- `T` - Type (most common, generic placeholder)
- `K` - Key (often used with objects)
- `V` - Value (often paired with K)
- `E` - Element (arrays/collections)
- `R` - Return type

You can name it anything, but single capital letters are conventional:

```typescript
// These are all valid (but T is most common)
class Storage<Type> { }
class Storage<ItemType> { }
class Storage<T> { }  // ✅ Conventional
```

### Using Generic Classes

```typescript
class Product<T> {
  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
  }
}

// ✅ Number product
const priceProduct = new Product<number>(99.99);
console.log(priceProduct.getValue());  // 99.99 (Type: number)
priceProduct.setValue(89.99);  // ✅ OK
priceProduct.setValue("free");  // ❌ Error: string not assignable to number

// ✅ String product
const nameProduct = new Product<string>("Smartphone");
console.log(nameProduct.getValue());  // "Smartphone" (Type: string)
nameProduct.setValue("Tablet");  // ✅ OK
nameProduct.setValue(42);  // ❌ Error: number not assignable to string

// ✅ Object product
type Laptop = {
  brand: string;
  model: string;
  price: number;
};

const laptopProduct = new Product<Laptop>({
  brand: "Apple",
  model: "MacBook Pro",
  price: 2499
});

const laptop = laptopProduct.getValue();
console.log(laptop.brand);  // "Apple" - TypeScript knows Laptop structure
console.log(laptop.price);  // 2499

laptopProduct.setValue({
  brand: "Dell",
  model: "XPS 15",
  price: 1799
});  // ✅ OK

laptopProduct.setValue({
  brand: "HP",
  model: "Spectre"
  // ❌ Error: Property 'price' is missing
});
```

### Multiple Type Parameters

You can have more than one generic type:

```typescript
class KeyValuePair<K, V> {
  constructor(
    private key: K,
    private value: V
  ) {}

  getKey(): K {
    return this.key;
  }

  getValue(): V {
    return this.value;
  }

  setPair(key: K, value: V): void {
    this.key = key;
    this.value = value;
  }

  display(): string {
    return `${this.key}: ${this.value}`;
  }
}

// String key, Number value
const setting = new KeyValuePair<string, number>("volume", 75);
console.log(setting.display());  // "volume: 75"

// Number key, String value
const errorCode = new KeyValuePair<number, string>(404, "Not Found");
console.log(errorCode.display());  // "404: Not Found"

// String key, Object value
type User = { name: string; email: string };
const userCache = new KeyValuePair<string, User>(
  "user_123",
  { name: "Alex Chen", email: "alex@example.com" }
);

const user = userCache.getValue();
console.log(user.name);  // "Alex Chen" - TypeScript knows the structure
```

---

## Generic Functions & Interfaces

### Generic Functions

#### The Problem: Type-Specific Functions

```typescript
// Version 1: Only works with numbers
function getFirstNumber(items: number[]): number | undefined {
  return items[0];
}

// Version 2: Copy-pasted for strings
function getFirstString(items: string[]): string | undefined {
  return items[0];
}

// This is the same duplication problem we had with classes!
```

#### The Solution: Generic Functions

```typescript
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

// ✅ Works with any type
const numbers = [1, 2, 3];
const firstNumber = getFirst<number>(numbers);  // Type: number | undefined

const names = ["Alice", "Bob", "Charlie"];
const firstName = getFirst<string>(names);  // Type: string | undefined

type Product = { name: string; price: number };
const products: Product[] = [
  { name: "Laptop", price: 999 },
  { name: "Mouse", price: 29 }
];
const firstProduct = getFirst<Product>(products);  // Type: Product | undefined
```

### Type Inference: TypeScript is Smart!

You don't always need to explicitly specify the type - TypeScript can infer it:

```typescript
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

// Explicit type (optional)
const result1 = getFirst<number>([1, 2, 3]);

// Type inference (TypeScript figures it out)
const result2 = getFirst([1, 2, 3]);  // TypeScript infers T = number

const result3 = getFirst(["a", "b", "c"]);  // TypeScript infers T = string

type Book = { title: string };
const result4 = getFirst([{ title: "1984" }]);  // TypeScript infers T = Book
```

**When to use explicit types vs inference:**

```typescript
// ✅ Inference works great here
const numbers = [1, 2, 3];
const first = getFirst(numbers);  // Clear from context

// ✅ Explicit type needed for empty arrays
const emptyNumbers = getFirst<number>([]);  // Can't infer from empty array

// ✅ Explicit when you want to be clear
const mixedArray = getFirst<number | string>([1, "two", 3]);
```

### More Generic Function Examples

```typescript
// Return the same value (identity function)
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);  // Type: number
const str = identity("hello");  // Type: string

// Wrap value in an array
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const numberArray = wrapInArray(5);  // Type: number[]
const stringArray = wrapInArray("hello");  // Type: string[]

// Get last item
function getLast<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

const lastNumber = getLast([1, 2, 3]);  // Type: number | undefined
const lastString = getLast(["a", "b"]);  // Type: string | undefined

// Merge two arrays
function mergeArrays<T>(arr1: T[], arr2: T[]): T[] {
  return [...arr1, ...arr2];
}

const merged = mergeArrays([1, 2], [3, 4]);  // Type: number[]
const mergedStrings = mergeArrays(["a"], ["b", "c"]);  // Type: string[]
```

### Generic Interfaces

Interfaces can also be generic:

```typescript
interface Box<T> {
  contents: T;
  isEmpty(): boolean;
  getContents(): T;
  setContents(value: T): void;
}

// Implement the generic interface
class ProductBox<T> implements Box<T> {
  constructor(public contents: T) {}

  isEmpty(): boolean {
    return this.contents === null || this.contents === undefined;
  }

  getContents(): T {
    return this.contents;
  }

  setContents(value: T): void {
    this.contents = value;
  }
}

// Use with different types
const numberBox = new ProductBox<number>(42);
console.log(numberBox.getContents());  // 42

const stringBox = new ProductBox<string>("Hello");
console.log(stringBox.getContents());  // "Hello"
```

### Combining Generic Interfaces with Type Aliases

```typescript
// Generic interface
interface Container<T> {
  item: T;
  getItem(): T;
}

// Type aliases
type Book = {
  title: string;
  author: string;
  pages: number;
};

type Laptop = {
  brand: string;
  model: string;
  price: number;
};

// Use the generic interface with type aliases
const bookContainer: Container<Book> = {
  item: {
    title: "Clean Code",
    author: "Robert Martin",
    pages: 464
  },
  getItem() {
    return this.item;
  }
};

const laptopContainer: Container<Laptop> = {
  item: {
    brand: "Apple",
    model: "MacBook Pro",
    price: 2499
  },
  getItem() {
    return this.item;
  }
};

console.log(bookContainer.getItem().title);  // "Clean Code"
console.log(laptopContainer.getItem().brand);  // "Apple"
```

### Generic Function Types in Interfaces

```typescript
interface Repository<T> {
  items: T[];
  add(item: T): void;
  remove(id: string): void;
  findById(id: string): T | undefined;
  getAll(): T[];
}

type Product = {
  id: string;
  name: string;
  price: number;
};

class ProductRepository implements Repository<Product> {
  items: Product[] = [];

  add(item: Product): void {
    this.items.push(item);
  }

  remove(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  findById(id: string): Product | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): Product[] {
    return [...this.items];
  }
}

const repo = new ProductRepository();
repo.add({ id: "1", name: "Laptop", price: 999 });
repo.add({ id: "2", name: "Mouse", price: 29 });

const laptop = repo.findById("1");
if (laptop) {
  console.log(laptop.name);  // "Laptop"
}
```

---

## Generic Constraints

### The Problem: Unrestricted Generics

```typescript
function getPrice<T>(item: T): number {
  return item.price;  // ❌ Error: Property 'price' does not exist on type 'T'
}

// T could be ANYTHING - TypeScript doesn't know if it has a 'price' property
getPrice(42);  // No 'price' property!
getPrice("hello");  // No 'price' property!
```

TypeScript can't assume `T` has a `price` property because `T` is completely unrestricted.

### The Solution: Generic Constraints with `extends`

```typescript
// Define what T must have
interface HasPrice {
  price: number;
}

// Constrain T to types that have a price property
function getPrice<T extends HasPrice>(item: T): number {
  return item.price;  // ✅ TypeScript knows T has a 'price' property
}

// ✅ Works with anything that has a price
const laptop = { name: "MacBook", price: 2499 };
console.log(getPrice(laptop));  // 2499

const book = { title: "TypeScript Guide", price: 39.99, author: "John Doe" };
console.log(getPrice(book));  // 39.99

// ❌ Doesn't work with types that don't have price
getPrice(42);  // Error: number doesn't have 'price'
getPrice("hello");  // Error: string doesn't have 'price'
getPrice({ name: "Product" });  // Error: missing 'price' property
```

### Constraint Examples

```typescript
// Constraint: Must have an id property
interface HasId {
  id: string | number;
}

function findById<T extends HasId>(items: T[], id: string | number): T | undefined {
  return items.find(item => item.id === id);
}

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" }
];

const user = findById(users, 1);  // Works! Users have 'id'
console.log(user?.name);  // "Alice"

const products = [
  { id: "p1", name: "Laptop", price: 999 },
  { id: "p2", name: "Mouse", price: 29 }
];

const product = findById(products, "p1");  // Works! Products have 'id'
console.log(product?.name);  // "Laptop"
```

### Union Constraints

You can constrain to multiple possible types using unions:

```typescript
type Book = {
  title: string;
  author: string;
  pages: number;
};

type Laptop = {
  brand: string;
  model: string;
  price: number;
};

// T must be either Book OR Laptop
function describeProduct<T extends Book | Laptop>(item: T): string {
  // Type narrowing needed to access specific properties
  if ('title' in item) {
    return `Book: ${item.title} by ${item.author}`;
  } else {
    return `Laptop: ${item.brand} ${item.model}`;
  }
}

const book: Book = { title: "1984", author: "George Orwell", pages: 328 };
const laptop: Laptop = { brand: "Apple", model: "MacBook Pro", price: 2499 };

console.log(describeProduct(book));  // "Book: 1984 by George Orwell"
console.log(describeProduct(laptop));  // "Laptop: Apple MacBook Pro"

// ❌ Can't use other types
describeProduct("hello");  // Error: string is not Book | Laptop
```

### Constraining to Specific Base Classes

```typescript
// Base class
class Product {
  constructor(
    public name: string,
    public price: number
  ) {}

  getDetails(): string {
    return `${this.name}: $${this.price}`;
  }
}

// Subclasses
class Electronics extends Product {
  constructor(
    name: string,
    price: number,
    public warranty: number
  ) {
    super(name, price);
  }
}

class Food extends Product {
  constructor(
    name: string,
    price: number,
    public expiryDate: Date
  ) {
    super(name, price);
  }
}

// Generic function constrained to Product or its subclasses
function applyDiscount<T extends Product>(item: T, discount: number): number {
  // ✅ Can access Product properties and methods
  return item.price * (1 - discount);
}

const laptop = new Electronics("Laptop", 999, 2);
const apple = new Food("Apple", 1.5, new Date("2025-02-15"));

console.log(applyDiscount(laptop, 0.1));  // 899.1 (10% off)
console.log(applyDiscount(apple, 0.2));  // 1.2 (20% off)

// ❌ Can't use non-Product types
applyDiscount("not a product", 0.1);  // Error
```

### Generic Classes with Constraints

```typescript
interface Storable {
  id: string;
  createdAt: Date;
}

class Database<T extends Storable> {
  private items: Map<string, T> = new Map();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  getSortedByDate(): T[] {
    return this.getAll().sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type Order = {
  id: string;
  userId: string;
  total: number;
  createdAt: Date;
};

const userDb = new Database<User>();
userDb.add({
  id: "u1",
  name: "Alice Chen",
  email: "alice@example.com",
  createdAt: new Date("2025-01-15")
});

const orderDb = new Database<Order>();
orderDb.add({
  id: "o1",
  userId: "u1",
  total: 299.99,
  createdAt: new Date("2025-01-20")
});

console.log(userDb.get("u1")?.name);  // "Alice Chen"
console.log(orderDb.getSortedByDate());  // Orders sorted by date
```

### Class Inheritance with Generics

When a child class extends a generic parent, it can:
1. Keep the generic parameter
2. Specify a concrete type
3. Add additional generic parameters

```typescript
// Generic parent class
class Storage<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }

  getCount(): number {
    return this.items.length;
  }
}

// Option 1: Keep the generic (pass it through)
class SortableStorage<T> extends Storage<T> {
  getSorted(compareFn: (a: T, b: T) => number): T[] {
    return this.getAll().sort(compareFn);
  }
}

const numbers = new SortableStorage<number>();
numbers.add(5);
numbers.add(1);
numbers.add(3);
console.log(numbers.getSorted((a, b) => a - b));  // [1, 3, 5]

// Option 2: Specify a concrete type
class StringStorage extends Storage<string> {
  getCombined(separator: string = ", "): string {
    return this.getAll().join(separator);
  }
}

const names = new StringStorage();
names.add("Alice");
names.add("Bob");
console.log(names.getCombined());  // "Alice, Bob"

// Option 3: Add additional generic parameters
class KeyedStorage<K, V> extends Storage<V> {
  private keyMap: Map<K, V> = new Map();

  addWithKey(key: K, value: V): void {
    this.add(value);
    this.keyMap.set(key, value);
  }

  getByKey(key: K): V | undefined {
    return this.keyMap.get(key);
  }
}

type Product = { name: string; price: number };
const products = new KeyedStorage<string, Product>();
products.addWithKey("laptop", { name: "MacBook", price: 2499 });
console.log(products.getByKey("laptop")?.name);  // "MacBook"
```

---

## The `keyof` Operator

### The Aim: Extract Object Keys as a Type

The `keyof` operator creates a union type of all the keys in an object type:

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

// keyof User = "id" | "name" | "email" | "age"
type UserKeys = keyof User;

const key1: UserKeys = "id";     // ✅ Valid
const key2: UserKeys = "name";   // ✅ Valid
const key3: UserKeys = "email";  // ✅ Valid
const key4: UserKeys = "age";    // ✅ Valid
const key5: UserKeys = "salary"; // ❌ Error: "salary" is not a key of User
```

### Comparison: `keyof` vs Literal Types

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

// Literal Type - Manually specified
type ManualKeys = "id" | "name" | "email";

// keyof - Automatically extracted from the type
type AutoKeys = keyof User;  // "id" | "name" | "email"
```

**Key Differences:**

| Feature | Literal Types | `keyof` |
|---------|---------------|---------|
| **Definition** | Manually written | Automatically extracted |
| **Updates** | Must manually update | Updates automatically |
| **Source** | Hardcoded strings | Derived from object type |
| **Use case** | Static, unchanging values | Dynamic based on object structure |

**Example of the difference:**

```typescript
type User = {
  id: number;
  name: string;
};

type ManualKeys = "id" | "name";
type AutoKeys = keyof User;

// Now we add a property to User
type User = {
  id: number;
  name: string;
  email: string;  // New property!
};

// ❌ ManualKeys is now incomplete - still just "id" | "name"
// ✅ AutoKeys automatically includes "email" - now "id" | "name" | "email"
```

### Real-World Use Case: Type-Safe Property Access

#### The Problem: Accessing Properties Unsafely

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
};

function getProperty(obj: Product, key: string): any {
  return obj[key];  // ❌ No type safety - returns 'any'
}

const product: Product = {
  id: "p1",
  name: "Laptop",
  price: 999,
  inStock: true
};

getProperty(product, "name");     // Works
getProperty(product, "invalid");  // No error, but returns undefined!
```

#### The Solution: Using `keyof` for Safety

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
};

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const product: Product = {
  id: "p1",
  name: "Laptop",
  price: 999,
  inStock: true
};

const name = getProperty(product, "name");      // Type: string ✅
const price = getProperty(product, "price");    // Type: number ✅
const stock = getProperty(product, "inStock");  // Type: boolean ✅

// ❌ TypeScript catches invalid keys at compile time
const invalid = getProperty(product, "invalid");
// Error: Argument of type '"invalid"' is not assignable to parameter of type '"id" | "name" | "price" | "inStock"'
```

**What's happening:**
- `K extends keyof T` means K must be one of T's keys
- `T[K]` is the type of the property at key K
- TypeScript enforces that `key` must be a valid property of `obj`

### More Examples with `keyof`

```typescript
type User = {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
};

// Update a property
function updateProperty<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): void {
  obj[key] = value;
}

const user: User = {
  id: 1,
  username: "alice_dev",
  email: "alice@example.com",
  isActive: true
};

updateProperty(user, "username", "alice_developer");  // ✅ OK
updateProperty(user, "isActive", false);              // ✅ OK

// ❌ Type mismatch caught at compile time
updateProperty(user, "username", 123);  
// Error: Argument of type 'number' is not assignable to parameter of type 'string'

// ❌ Invalid key caught at compile time
updateProperty(user, "invalidKey", "value");
// Error: Argument of type '"invalidKey"' is not assignable to parameter...
```

```typescript
// Get multiple properties
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
};

const product: Product = {
  id: "p1",
  name: "Laptop",
  price: 999,
  description: "Powerful laptop",
  inStock: true
};

const summary = pick(product, ["name", "price"]);
// Type: { name: string; price: number }
console.log(summary);  // { name: "Laptop", price: 999 }
```

### `keyof` with Index Signatures

```typescript
type Dictionary = {
  [key: string]: string;
};

type DictKeys = keyof Dictionary;  // string

// With number index signature
type NumberArray = {
  [index: number]: string;
};

type ArrayKeys = keyof NumberArray;  // number

// Mixed index signatures
type MixedObject = {
  name: string;
  [key: string]: string | number;
};

type MixedKeys = keyof MixedObject;  // string | number
```

---

## Type Mapping: The Formula

### The Concept: Building Types from Other Types

**Type Mapping** is like a formula that transforms one type into another by iterating over its properties.

**The Formula:**
```
Mapped Type = Index Signature + keyof
```

Think of it as a loop that goes through each property and transforms it.

### The Anatomy of a Mapped Type

```typescript
type Example<T> = {
  [K in keyof T]: T[K]
};
```

**Breaking it down:**
1. `[K in keyof T]` - Loop through each key in T (K is the current key)
2. `: T[K]` - The value type is the original type at that key
3. `K` is like a loop variable that represents each key

It's similar to a `for...in` loop:
```javascript
// JavaScript loop
for (const key in object) {
  console.log(key, object[key]);
}

// TypeScript type loop
[K in keyof T]: T[K]
```

### Example: Creating a Readonly Type Manually

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

// Manual approach - tedious!
type ReadonlyUserManual = {
  readonly id: number;
  readonly name: string;
  readonly email: string;
};

// Mapped Type approach - automated!
type ReadonlyUser = {
  readonly [K in keyof User]: User[K]
};

// What this expands to:
// type ReadonlyUser = {
//   readonly id: number;    // K = "id", User[K] = number
//   readonly name: string;  // K = "name", User[K] = string
//   readonly email: string; // K = "email", User[K] = string
// }

const user: ReadonlyUser = {
  id: 1,
  name: "Alice Chen",
  email: "alice@example.com"
};

user.name = "Alice Developer";  
// ❌ Error: Cannot assign to 'name' because it is a read-only property
```

### Step-by-Step: How the Mapping Works

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

type ReadonlyUser = {
  readonly [K in keyof User]: User[K]
};
```

**Step 1**: `keyof User` produces `"id" | "name" | "email"`

**Step 2**: `K in keyof User` loops through each:
- First iteration: `K = "id"`
- Second iteration: `K = "name"`
- Third iteration: `K = "email"`

**Step 3**: For each `K`, create `readonly K: User[K]`:
- `readonly id: User["id"]` → `readonly id: number`
- `readonly name: User["name"]` → `readonly name: string`
- `readonly email: User["email"]` → `readonly email: string`

**Result**:
```typescript
type ReadonlyUser = {
  readonly id: number;
  readonly name: string;
  readonly email: string;
};
```

### Making It Generic: Reusable Mapped Type

```typescript
// Generic version - works with ANY type
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
};

// Use it with different types
type User = {
  id: number;
  name: string;
  email: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
};

type ReadonlyUser = MyReadonly<User>;
type ReadonlyProduct = MyReadonly<Product>;

const user: ReadonlyUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

const product: ReadonlyProduct = {
  id: "p1",
  name: "Laptop",
  price: 999
};

user.name = "Bob";      // ❌ Error: readonly
product.price = 799;    // ❌ Error: readonly
```

### More Mapped Type Examples

#### Optional Properties

```typescript
// Make all properties optional
type MyPartial<T> = {
  [K in keyof T]?: T[K]  // Note the '?' making each property optional
};

type User = {
  id: number;
  name: string;
  email: string;
};

type PartialUser = MyPartial<User>;
// Equivalent to:
// type PartialUser = {
//   id?: number;
//   name?: string;
//   email?: string;
// }

const partialUser: PartialUser = {
  name: "Alice"  // Only some properties - valid!
};
```

#### Nullable Properties

```typescript
// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null
};

type User = {
  id: number;
  name: string;
  email: string;
};

type NullableUser = Nullable<User>;
// Equivalent to:
// type NullableUser = {
//   id: number | null;
//   name: string | null;
//   email: string | null;
// }

const user: NullableUser = {
  id: 1,
  name: null,  // ✅ Can be null
  email: "alice@example.com"
};
```

#### Convert to Strings

```typescript
// Convert all properties to strings
type Stringify<T> = {
  [K in keyof T]: string
};

type User = {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
};

type StringifiedUser = Stringify<User>;
// Equivalent to:
// type StringifiedUser = {
//   id: string;
//   name: string;
//   age: string;
//   isActive: string;
// }

const stringUser: StringifiedUser = {
  id: "1",
  name: "Alice",
  age: "30",
  isActive: "true"
};
```

---

## Utility Types

### Introduction: Built-in Mapped Types

TypeScript provides built-in utility types so you don't have to write the mapping formula yourself. These are pre-defined mapped types that solve common problems.

**Remember**: Utility types are just mapped types that TypeScript has already written for you!

### `Partial<T>` - Make All Properties Optional

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

// Manual approach (what we learned in Type Mapping)
type ManualPartial = {
  [K in keyof User]?: User[K]
};

// Built-in utility type (easier!)
type PartialUser = Partial<User>;

// Both create the same result:
// type PartialUser = {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
// }

// Use case: Update functions
function updateUser(id: number, updates: Partial<User>): void {
  // updates can have any subset of User properties
  console.log(`Updating user ${id}`, updates);
}

updateUser(1, { name: "Alice" });  // ✅ Only name
updateUser(2, { email: "bob@example.com", age: 30 });  // ✅ Email and age
updateUser(3, {});  // ✅ No updates
updateUser(4, { id: 5, name: "Charlie", email: "charlie@example.com" });  // ✅ Multiple
```

**Real-world example:**

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
};

class ProductService {
  private products: Map<string, Product> = new Map();

  create(product: Product): void {
    this.products.set(product.id, product);
  }

  // Update only the fields that are provided
  update(id: string, updates: Partial<Product>): void {
    const product = this.products.get(id);
    if (product) {
      // Merge the updates into the existing product
      Object.assign(product, updates);
    }
  }
}

const service = new ProductService();
service.create({
  id: "p1",
  name: "Laptop",
  price: 999,
  description: "Powerful laptop",
  inStock: true
});

// Update only price and stock status
service.update("p1", { price: 899, inStock: false });
```

### `Pick<T, K>` - Select Specific Properties

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

// Pick only the properties we want
type PublicUser = Pick<User, "id" | "name" | "email">;

// Equivalent to:
// type PublicUser = {
//   id: number;
//   name: string;
//   email: string;
// }

// Use case: Public API response (hide sensitive data)
function getUserProfile(userId: number): PublicUser {
  // Fetch full user from database
  const fullUser: User = {
    id: userId,
    name: "Alice Chen",
    email: "alice@example.com",
    password: "hashed_password",  // Sensitive!
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Return only public fields
  return {
    id: fullUser.id,
    name: fullUser.name,
    email: fullUser.email
  };
}

const profile = getUserProfile(1);
console.log(profile.name);  // ✅ "Alice Chen"
console.log(profile.password);  // ❌ Error: Property 'password' does not exist
```

### `Omit<T, K>` - Remove Specific Properties

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

// Remove sensitive properties
type SafeUser = Omit<User, "password">;

// Equivalent to:
// type SafeUser = {
//   id: number;
//   name: string;
//   email: string;
//   createdAt: Date;
// }

// Remove multiple properties
type UserWithoutMetadata = Omit<User, "createdAt" | "password">;

// Equivalent to:
// type UserWithoutMetadata = {
//   id: number;
//   name: string;
//   email: string;
// }

// Use case: Form input (exclude auto-generated fields)
type UserInput = Omit<User, "id" | "createdAt">;

function createUser(input: UserInput): User {
  return {
    id: Date.now(),  // Auto-generated
    ...input,
    createdAt: new Date()  // Auto-generated
  };
}

const newUser = createUser({
  name: "Bob Smith",
  email: "bob@example.com",
  password: "secure_password"
});
```

### Comparison: Manual vs Utility Types

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

// ========== PARTIAL ==========

// Manual (from Type Mapping section)
type ManualPartial = {
  [K in keyof User]?: User[K]
};

// Utility Type (built-in)
type BuiltInPartial = Partial<User>;

// Both produce the same result


// ========== READONLY ==========

// Manual
type ManualReadonly = {
  readonly [K in keyof User]: User[K]
};

// Utility Type
type BuiltInReadonly = Readonly<User>;

// Both produce the same result


// ========== PICK ==========

// Manual (more complex!)
type ManualPick<T, K extends keyof T> = {
  [P in K]: T[P]
};

type MyPick = ManualPick<User, "id" | "name">;

// Utility Type (simpler!)
type BuiltInPick = Pick<User, "id" | "name">;

// Both produce the same result
```

### Other Useful Utility Types

#### `Required<T>` - Make All Properties Required

```typescript
type User = {
  id: number;
  name: string;
  email?: string;  // Optional
  phone?: string;  // Optional
};

type RequiredUser = Required<User>;
// All properties are now required:
// type RequiredUser = {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
// }

function validateUser(user: RequiredUser): boolean {
  // Can safely access all properties without checking for undefined
  return user.email.includes("@") && user.phone.length === 10;
}
```

#### `Record<K, T>` - Create an Object Type with Specific Keys

```typescript
// Create an object type where all keys are strings and values are numbers
type StringToNumber = Record<string, number>;

const ages: StringToNumber = {
  "Alice": 30,
  "Bob": 25,
  "Charlie": 35
};

// More specific keys
type Role = "admin" | "user" | "guest";
type Permissions = Record<Role, string[]>;

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};

console.log(permissions.admin);  // ["read", "write", "delete"]
```

#### `Exclude<T, U>` - Remove Types from Union

```typescript
type AllRoles = "admin" | "user" | "guest" | "moderator";

type NonAdminRoles = Exclude<AllRoles, "admin">;
// type NonAdminRoles = "user" | "guest" | "moderator"

type BasicRoles = Exclude<AllRoles, "admin" | "moderator">;
// type BasicRoles = "user" | "guest"
```

#### `Extract<T, U>` - Extract Types from Union

```typescript
type AllRoles = "admin" | "user" | "guest" | "moderator";

type SpecialRoles = Extract<AllRoles, "admin" | "moderator">;
// type SpecialRoles = "admin" | "moderator"
```

#### `NonNullable<T>` - Remove null and undefined

```typescript
type MaybeString = string | null | undefined;

type DefiniteString = NonNullable<MaybeString>;
// type DefiniteString = string

function processValue(value: NonNullable<string | null>): void {
  console.log(value.toUpperCase());  // Safe - value is definitely a string
}
```

### Combining Utility Types

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  createdAt: Date;
};

// Combine multiple utilities
type UpdateUserInput = Partial<Omit<User, "id" | "createdAt">>;

// Step by step:
// 1. Omit<User, "id" | "createdAt"> removes id and createdAt
// 2. Partial<...> makes all remaining properties optional

// Equivalent to:
// type UpdateUserInput = {
//   name?: string;
//   email?: string;
//   password?: string;
//   age?: number;
// }

function updateUser(userId: number, updates: UpdateUserInput): void {
  console.log(`Updating user ${userId}`, updates);
}

updateUser(1, { name: "Alice" });  // ✅ Only name
updateUser(2, { email: "bob@example.com", age: 30 });  // ✅ Any combination
updateUser(3, {});  // ✅ No updates
```

---

## Student Assessment

### Question 1: Refactoring Challenge - From `any` to Generic

**Challenge**: Refactor this function that uses `any` to use a proper Generic type.

```typescript
// Current implementation - uses 'any' (unsafe!)
function wrapInArray(value: any): any[] {
  return [value];
}

function getFirstItem(items: any[]): any {
  return items[0];
}

function createPair(first: any, second: any): any[] {
  return [first, second];
}

// Usage examples that show the problem
const numbers = wrapInArray(42);
numbers[0].toFixed(2);  // No type safety - what if value isn't a number?

const firstItem = getFirstItem([1, 2, 3]);
firstItem.toUpperCase();  // Runtime error - numbers don't have toUpperCase!

const pair = createPair("hello", 123);
// TypeScript doesn't know the types of items in the pair
```

**Your Task**: Rewrite all three functions using generics to make them type-safe.

<details>
<summary>Solution</summary>

```typescript
// Generic implementations - type-safe!

function wrapInArray<T>(value: T): T[] {
  return [value];
}

function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

function createPair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// Now TypeScript provides full type safety

const numbers = wrapInArray(42);  // Type: number[]
numbers[0].toFixed(2);  // ✅ TypeScript knows this is safe

const strings = wrapInArray("hello");  // Type: string[]
strings[0].toUpperCase();  // ✅ TypeScript knows this is safe

const firstNumber = getFirstItem([1, 2, 3]);  // Type: number | undefined
if (firstNumber !== undefined) {
  firstNumber.toFixed(2);  // ✅ Safe
}

const firstString = getFirstItem(["a", "b"]);  // Type: string | undefined
if (firstString) {
  firstString.toUpperCase();  // ✅ Safe
}

const pair = createPair("hello", 123);  // Type: [string, number]
const first = pair[0];   // Type: string
const second = pair[1];  // Type: number

// ❌ TypeScript catches errors
firstNumber.toUpperCase();  
// Error: Property 'toUpperCase' does not exist on type 'number | undefined'
```

**What improved:**
1. ✅ Full type inference - TypeScript knows exact types
2. ✅ Compile-time safety - errors caught before runtime
3. ✅ Better IntelliSense - editor knows what methods are available
4. ✅ No runtime surprises - invalid operations caught during development
</details>

---

### Question 2: Constraint Check - Why the Error?

**Question**: Why does this code throw an error, and how do you fix it?

```typescript
function printName<T>(obj: T): void {
  console.log(obj.name);  // ❌ Error: Property 'name' does not exist on type 'T'
}

type User = { id: number; name: string };
type Product = { id: string; name: string; price: number };

printName({ id: 1, name: "Alice" });
printName({ id: "p1", name: "Laptop", price: 999 });
```

**Tasks:**
1. Explain WHY TypeScript shows this error
2. Provide the fix using `extends`
3. Show the corrected code

<details>
<summary>Answer</summary>

**Why the error occurs:**

TypeScript doesn't know that `T` has a `name` property. The generic `T` is completely unconstrained - it could be anything:

```typescript
// T could be a number
printName(42);  // No 'name' property!

// T could be a string
printName("hello");  // No 'name' property!

// T could be a boolean
printName(true);  // No 'name' property!

// TypeScript can't assume T has 'name' because T is unrestricted
```

**The Fix: Add a constraint**

```typescript
// Define what T must have
interface HasName {
  name: string;
}

// Constrain T to types that have a 'name' property
function printName<T extends HasName>(obj: T): void {
  console.log(obj.name);  // ✅ Now TypeScript knows T has 'name'
}

type User = { id: number; name: string };
type Product = { id: string; name: string; price: number };

printName({ id: 1, name: "Alice" });  // ✅ Works - has 'name'
printName({ id: "p1", name: "Laptop", price: 999 });  // ✅ Works - has 'name'

// ❌ TypeScript catches objects without 'name'
printName({ id: 1 });  
// Error: Argument of type '{ id: number; }' is not assignable to parameter of type 'HasName'

printName(42);
// Error: Argument of type 'number' is not assignable to parameter of type 'HasName'
```

**Alternative constraint approaches:**

```typescript
// Option 1: Inline constraint
function printName<T extends { name: string }>(obj: T): void {
  console.log(obj.name);
}

// Option 2: Constrain to specific types
function printName<T extends User | Product>(obj: T): void {
  console.log(obj.name);
}

// Option 3: More specific constraint
interface Named {
  name: string;
  displayName?: string;
}

function printName<T extends Named>(obj: T): void {
  console.log(obj.displayName || obj.name);
}
```

**Key Lesson**: Always use `extends` to constrain generics when you need to access specific properties or methods. Without constraints, TypeScript can't make assumptions about what T contains.
</details>

---

### Question 3: Type Mapping Challenge

**Challenge**: Create a utility type `DeepPartial<T>` that makes all properties optional, including nested objects.

```typescript
type User = {
  id: number;
  profile: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
      zip: string;
    };
  };
  settings: {
    theme: string;
    notifications: boolean;
  };
};

// Regular Partial only makes top-level properties optional
type PartialUser = Partial<User>;
// This allows:
const user1: PartialUser = {
  profile: {
    // ❌ Still requires ALL nested properties
    name: "Alice",
    email: "alice@example.com",
    address: {
      street: "123 Main St",
      city: "NYC",
      zip: "10001"
    }
  }
};

// Your task: Create DeepPartial that makes nested properties optional too
type DeepPartialUser = DeepPartial<User>;
// This should allow:
const user2: DeepPartialUser = {
  profile: {
    name: "Alice"  // ✅ Only some nested properties
  }
};
```

<details>
<summary>Solution</summary>

```typescript
// DeepPartial utility type - recursive mapped type
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>  // If it's an object, make it DeepPartial recursively
    : T[K]                // Otherwise, keep it as is
};

type User = {
  id: number;
  profile: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
      zip: string;
    };
  };
  settings: {
    theme: string;
    notifications: boolean;
  };
};

type DeepPartialUser = DeepPartial<User>;

// Now we can have partial nested objects
const user1: DeepPartialUser = {
  id: 1,
  profile: {
    name: "Alice"  // ✅ Only name, no email or address
  }
};

const user2: DeepPartialUser = {
  profile: {
    address: {
      city: "NYC"  // ✅ Only city, no street or zip
    }
  }
};

const user3: DeepPartialUser = {
  settings: {
    theme: "dark"  // ✅ Only theme, no notifications
  }
};

const user4: DeepPartialUser = {};  // ✅ Empty object is valid

// All valid - complete flexibility with nested optional properties
```

**How it works:**

1. `[K in keyof T]?` - Make each property optional
2. `T[K] extends object` - Check if the property is an object
3. `? DeepPartial<T[K]>` - If yes, recursively apply DeepPartial
4. `: T[K]` - If no (primitive type), keep it as is

**Step-by-step expansion for User:**

```typescript
// Level 1
type DeepPartialUser = {
  id?: number;  // Primitive - kept as is
  profile?: DeepPartial<{...}>;  // Object - recursive
  settings?: DeepPartial<{...}>;  // Object - recursive
};

// Level 2 (profile)
profile?: {
  name?: string;  // Primitive
  email?: string;  // Primitive
  address?: DeepPartial<{...}>;  // Object - recursive again
};

// Level 3 (address)
address?: {
  street?: string;  // Primitive
  city?: string;    // Primitive
  zip?: string;     // Primitive
};
```

</details>

---

### Question 4: Practical Application Challenge

**Challenge**: Build a type-safe generic `Cache` class with the following requirements:

1. Can store any type of data with string keys
2. Has a maximum size limit
3. Evicts oldest entries when full
4. Type-safe get/set operations
5. Can return all keys of a specific type

```typescript
// Your implementation should work like this:

type User = { id: number; name: string };
type Product = { id: string; name: string; price: number };

const cache = new Cache<User | Product>(3);  // Max 3 items

cache.set("user1", { id: 1, name: "Alice" });
cache.set("user2", { id: 2, name: "Bob" });
cache.set("product1", { id: "p1", name: "Laptop", price: 999 });

// Adding 4th item should evict oldest
cache.set("product2", { id: "p2", name: "Mouse", price: 29 });

const user = cache.get("user1");  // Should be undefined (evicted)
const product = cache.get("product1");  // Should return the product
```

<details>
<summary>Solution</summary>

```typescript
class Cache<T> {
  private items: Map<string, T> = new Map();
  private accessOrder: string[] = [];

  constructor(private maxSize: number) {}

  set(key: string, value: T): void {
    // If key exists, remove it from accessOrder
    if (this.items.has(key)) {
      this.accessOrder = this.accessOrder.filter(k => k !== key);
    }

    // If at max size, evict oldest
    if (this.items.size >= this.maxSize && !this.items.has(key)) {
      const oldest = this.accessOrder.shift();
      if (oldest) {
        this.items.delete(oldest);
      }
    }

    // Add new item
    this.items.set(key, value);
    this.accessOrder.push(key);
  }

  get(key: string): T | undefined {
    return this.items.get(key);
  }

  has(key: string): boolean {
    return this.items.has(key);
  }

  delete(key: string): boolean {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    return this.items.delete(key);
  }

  clear(): void {
    this.items.clear();
    this.accessOrder = [];
  }

  keys(): string[] {
    return Array.from(this.items.keys());
  }

  values(): T[] {
    return Array.from(this.items.values());
  }

  size(): number {
    return this.items.size;
  }

  // Type guard helper
  filterByType<U extends T>(
    predicate: (value: T) => value is U
  ): Map<string, U> {
    const filtered = new Map<string, U>();
    for (const [key, value] of this.items.entries()) {
      if (predicate(value)) {
        filtered.set(key, value);
      }
    }
    return filtered;
  }
}

// Usage example
type User = { id: number; name: string };
type Product = { id: string; name: string; price: number };

const cache = new Cache<User | Product>(3);

cache.set("user1", { id: 1, name: "Alice" });
cache.set("user2", { id: 2, name: "Bob" });
cache.set("product1", { id: "p1", name: "Laptop", price: 999 });

console.log(cache.size());  // 3

// Adding 4th item evicts oldest (user1)
cache.set("product2", { id: "p2", name: "Mouse", price: 29 });

console.log(cache.size());  // 3
console.log(cache.get("user1"));  // undefined (evicted)
console.log(cache.get("product1"));  // { id: "p1", name: "Laptop", price: 999 }

// Filter by type
const isUser = (value: User | Product): value is User => {
  return typeof (value as User).id === "number";
};

const users = cache.filterByType(isUser);
console.log(users.size);  // 1 (only user2 remains)
```

**Key concepts demonstrated:**
1. ✅ Generic class with type parameter
2. ✅ Type-safe operations (get/set)
3. ✅ Constrained operations with generics
4. ✅ Type guards and filtering
5. ✅ Real-world cache implementation with LRU eviction
</details>

---

## Quick Reference Card

```typescript
// ========== GENERIC CLASS ==========
class Box<T> {
  constructor(private value: T) {}
  getValue(): T { return this.value; }
}

const numBox = new Box<number>(42);
const strBox = new Box<string>("hello");

// ========== GENERIC FUNCTION ==========
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);        // Type: number
const str = identity("hello");   // Type: string

// ========== GENERIC CONSTRAINT ==========
interface HasId {
  id: string | number;
}

function findById<T extends HasId>(items: T[], id: string | number): T | undefined {
  return items.find(item => item.id === id);
}

// ========== KEYOF OPERATOR ==========
type User = { id: number; name: string; email: string };

type UserKeys = keyof User;  // "id" | "name" | "email"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ========== MAPPED TYPE ==========
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
};

type MyPartial<T> = {
  [K in keyof T]?: T[K]
};

// ========== UTILITY TYPES ==========
Partial<T>       // All properties optional
Required<T>      // All properties required
Readonly<T>      // All properties readonly
Pick<T, K>       // Select specific properties
Omit<T, K>       // Remove specific properties
Record<K, T>     // Create object type with keys K and values T
Exclude<T, U>    // Remove types from union
Extract<T, U>    // Extract types from union
NonNullable<T>   // Remove null and undefined

// ========== MULTIPLE TYPE PARAMETERS ==========
class KeyValuePair<K, V> {
  constructor(private key: K, private value: V) {}
}

const pair = new KeyValuePair<string, number>("age", 30);

// ========== GENERIC INTERFACE ==========
interface Container<T> {
  value: T;
  getValue(): T;
}

const numberContainer: Container<number> = {
  value: 42,
  getValue() { return this.value; }
};
```

---

## Final Thoughts

You've completed the Generics & Advanced Type Manipulation Master Class! You now understand:

✅ **Why Generics** - Eliminate code duplication while maintaining type safety  
✅ **Generic Classes** - Create reusable, type-safe data structures  
✅ **Generic Functions** - Write flexible functions that work with any type  
✅ **Generic Constraints** - Restrict generics to types with specific properties  
✅ **keyof Operator** - Extract object keys as types  
✅ **Type Mapping** - Transform types using the mapping formula  
✅ **Utility Types** - Use built-in type transformations  

**The Power of Generics:**
- Write once, use with any type
- Maintain complete type safety
- Catch errors at compile time
- Better code reuse and maintainability

**Next Steps:**
1. Practice creating your own generic utilities
2. Explore conditional types (`T extends U ? X : Y`)
3. Learn about template literal types
4. Study advanced patterns like builder pattern with generics

Remember: Generics are about writing flexible, reusable code without sacrificing TypeScript's type safety. Master them, and you'll write cleaner, more maintainable TypeScript! 🚀
