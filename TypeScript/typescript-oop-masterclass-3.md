# TypeScript OOP Master Class: Complete Guide

## Table of Contents
1. [The Blueprint: Class Basics](#the-blueprint-class-basics)
2. [Encapsulation: Controlling Access](#encapsulation-controlling-access)
3. [Static Members: Shared Data](#static-members-shared-data)
4. [Inheritance & Polymorphism](#inheritance--polymorphism)
5. [Abstraction & Structure](#abstraction--structure)
6. [Student Assessment](#student-assessment)

---

## The Blueprint: Class Basics

### The Need for Classes

Imagine you're building an Employee Management System. You need to represent employees with their name, job title, and salary, and you need methods to display their information.

#### The Problem: Object Literals Get Messy

```javascript
// Standard JS - Object Literal Approach
const employee1 = {
  name: "Sarah Johnson",
  jobTitle: "Software Engineer",
  salary: 85000,
  getDetails: function() {
    return `${this.name} - ${this.jobTitle}`;
  }
};

const employee2 = {
  name: "Michael Chen",
  jobTitle: "Product Manager",
  salary: 95000,
  getDetails: function() {
    return `${this.name} - ${this.jobTitle}`;
  }
};

const employee3 = {
  name: "Emma Williams",
  // Oops! Forgot jobTitle - no error
  salary: 78000,
  getDetails: function() {
    return `${this.name} - ${this.jobTitle}`;  // undefined!
  }
};
```

**Problems with this approach:**
1. **Code duplication**: We repeat the same structure and methods for every employee
2. **No validation**: Easy to forget properties or use wrong types
3. **No consistency**: Each object is independent—hard to maintain
4. **No blueprint**: No clear template showing what an employee should have

#### The Solution: Classes as Blueprints

```typescript
// Modern TS - Class Approach
class Employee {
  name: string;
  jobTitle: string;
  salary: number;

  constructor(name: string, jobTitle: string, salary: number) {
    this.name = name;
    this.jobTitle = jobTitle;
    this.salary = salary;
  }

  getDetails(): string {
    return `${this.name} - ${this.jobTitle}`;
  }
}

// Create employees using the blueprint
const employee1 = new Employee("Sarah Johnson", "Software Engineer", 85000);
const employee2 = new Employee("Michael Chen", "Product Manager", 95000);

// ❌ TypeScript catches missing arguments
const employee3 = new Employee("Emma Williams");  
// Error: Expected 3 arguments, but got 1
```

### Class Syntax Breakdown

```typescript
class Employee {
  // Properties (instance variables)
  name: string;
  jobTitle: string;
  salary: number;

  // Constructor (runs when creating new instances)
  constructor(name: string, jobTitle: string, salary: number) {
    this.name = name;
    this.jobTitle = jobTitle;
    this.salary = salary;
    // Implicit return of the new object - no need to write 'return this'
  }

  // Methods (functions that belong to the class)
  getDetails(): string {
    return `${this.name} - ${this.jobTitle}`;
  }

  getSalaryInfo(): string {
    return `${this.name} earns $${this.salary.toLocaleString()}`;
  }
}

// Create instances
const emp = new Employee("Alex Thompson", "Designer", 72000);
console.log(emp.getDetails());      // "Alex Thompson - Designer"
console.log(emp.getSalaryInfo());   // "Alex Thompson earns $72,000"
```

### Recap Integration: Optional Properties

Let's make `jobTitle` optional since some employees might be in training without an assigned role:

```typescript
class Employee {
  name: string;
  jobTitle?: string;  // ✓ Recap: Optional property from basics
  salary: number;

  constructor(name: string, salary: number, jobTitle?: string) {
    this.name = name;
    this.jobTitle = jobTitle;
    this.salary = salary;
  }

  getDetails(): string {
    // Handle optional jobTitle safely
    const title = this.jobTitle ?? "Unassigned";
    return `${this.name} - ${title}`;
  }
}

const trainee = new Employee("Jordan Lee", 45000);  // No job title yet
console.log(trainee.getDetails());  // "Jordan Lee - Unassigned"

const engineer = new Employee("Sam Rivera", 85000, "Senior Engineer");
console.log(engineer.getDetails());  // "Sam Rivera - Senior Engineer"
```

### Verifying Object Types: `instanceof`

```typescript
class Employee {
  constructor(public name: string, public salary: number) {}
}

class Contractor {
  constructor(public name: string, public hourlyRate: number) {}
}

const emp = new Employee("Chris Davis", 80000);
const contractor = new Contractor("Jamie Kim", 150);

console.log(emp instanceof Employee);        // true
console.log(emp instanceof Contractor);      // false
console.log(contractor instanceof Employee); // false

// Type guard in action
function processWorker(worker: Employee | Contractor) {
  if (worker instanceof Employee) {
    console.log(`Employee salary: $${worker.salary}`);
  } else {
    console.log(`Contractor rate: $${worker.hourlyRate}/hr`);
  }
}
```

---

### Deep Dive: Class vs Type Alias

**User Question**: What is the difference between a `class` and a `type` alias? Is a type alias like an abstract class?

**Answer**: No, they are fundamentally different:

#### Type Alias - Compile-Time Only

```typescript
// Type alias exists ONLY during TypeScript compilation
type Employee = {
  name: string;
  jobTitle: string;
  salary: number;
};

const emp: Employee = {
  name: "Taylor Swift",
  jobTitle: "Singer",
  salary: 1000000
};

// ❌ Can't use instanceof with type aliases
console.log(emp instanceof Employee);  
// Error: 'Employee' only refers to a type, but is being used as a value here

// Type aliases are erased after compilation - they don't exist in JavaScript
```

#### Class - Runtime Code + Type

```typescript
// Class exists at BOTH compile-time AND runtime
class Employee {
  name: string;
  jobTitle: string;
  salary: number;

  constructor(name: string, jobTitle: string, salary: number) {
    this.name = name;
    this.jobTitle = jobTitle;
    this.salary = salary;
  }
}

const emp = new Employee("Taylor Swift", "Singer", 1000000);

// ✓ Can use instanceof because class exists at runtime
console.log(emp instanceof Employee);  // true

// Classes compile to actual JavaScript code (constructor functions)
```

**Key Differences:**

| Feature | Type Alias | Class |
|---------|-----------|-------|
| **Exists at runtime** | ❌ No | ✓ Yes |
| **Can use `instanceof`** | ❌ No | ✓ Yes |
| **Has constructor** | ❌ No | ✓ Yes |
| **Has methods** | Can define signatures only | ✓ Can implement |
| **Inheritance** | ❌ No (only composition) | ✓ Yes (`extends`) |
| **Use case** | Type checking only | Creating objects with behavior |

**Type aliases are NOT like abstract classes.** Abstract classes (covered later) are still classes—they exist at runtime and can have constructors and concrete methods. Type aliases are purely for TypeScript's type system and disappear completely after compilation.

```typescript
// This compiles to:
type Person = { name: string };  // ← Completely disappears

// This compiles to a JavaScript class:
class Person {                   // ← Becomes real JavaScript code
  constructor(public name: string) {}
}
```

### Constructor Deep Dive: Implicit Return

```typescript
class Employee {
  name: string;
  salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
    
    // ✓ Implicit return of 'this' (the new object)
    // You DON'T need to write: return this;
    
    console.log("Employee created!");
  }
}

const emp = new Employee("Alex", 75000);
// Constructor automatically returns the new Employee object
console.log(emp.name);  // "Alex"
```

**What happens under the hood:**
1. `new` creates an empty object
2. Constructor runs and populates the object
3. Constructor implicitly returns that object (you don't write `return`)
4. The returned object is assigned to `emp`

---

## Encapsulation: Controlling Access

### The Problem: Unprotected Data

```javascript
// Standard JS - No Protection
class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  getDetails() {
    return `${this.name} earns $${this.salary}`;
  }
}

const emp = new Employee("Jordan Lee", 85000);
console.log(emp.getDetails());  // "Jordan Lee earns $85000"

// 😱 Anyone can modify salary directly!
emp.salary = 0;
console.log(emp.getDetails());  // "Jordan Lee earns $0"

// 😱 Can even set invalid values
emp.salary = -50000;
emp.salary = "a million dollars";  // No type safety in JS
emp.salary = null;
```

**The problem**: Direct access to properties means:
- No validation when values change
- Anyone can break your object's state
- No control over how data is accessed or modified
- Business rules can't be enforced

### The Solution: Access Modifiers

TypeScript provides three access modifiers to control who can access class members:

#### Side-by-Side: JS Convention vs TS Strict Enforcement

```javascript
// Standard JS - Convention Only (Not Enforced!)
class Employee {
  constructor(name, salary) {
    this.name = name;
    this._salary = salary;  // _ prefix = "private by convention"
  }

  getSalary() {
    return this._salary;
  }
}

const emp = new Employee("Taylor Kim", 90000);
console.log(emp.getSalary());  // 90000

// ⚠️ Convention doesn't stop anyone - this still works!
emp._salary = 0;  // No error - just a naming convention
console.log(emp._salary);  // 0 - direct access still possible
```

```typescript
// Modern TS - Strict Enforcement
class Employee {
  name: string;
  private salary: number;  // Truly private - TypeScript enforces it

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  getSalary(): number {
    return this.salary;
  }
}

const emp = new Employee("Taylor Kim", 90000);
console.log(emp.getSalary());  // 90000

// ❌ TypeScript prevents access!
emp.salary = 0;  
// Error: Property 'salary' is private and only accessible within class 'Employee'

console.log(emp.salary);
// Error: Property 'salary' is private and only accessible within class 'Employee'
```

### Access Modifier Reference

```typescript
class Employee {
  public name: string;        // ✓ Accessible everywhere (default)
  private salary: number;     // ✓ Only within this class
  protected department: string;  // ✓ This class + subclasses (used later!)

  constructor(name: string, salary: number, department: string) {
    this.name = name;
    this.salary = salary;
    this.department = department;
  }

  // ✓ Can access private members inside the class
  private calculateBonus(): number {
    return this.salary * 0.1;
  }

  public getCompensation(): number {
    return this.salary + this.calculateBonus();  // ✓ Works
  }
}

const emp = new Employee("Sam Chen", 85000, "Engineering");
console.log(emp.name);  // ✓ public
console.log(emp.getCompensation());  // ✓ public method

console.log(emp.salary);  // ❌ private
console.log(emp.calculateBonus());  // ❌ private
console.log(emp.department);  // ❌ protected
```

**Note on `protected`**: We'll see why it's useful when we cover inheritance. It allows subclasses (like `Manager extends Employee`) to access the property, but still keeps it hidden from outside code.

### Getters and Setters: Controlled Access

Getters and setters provide controlled access to private properties with validation:

```typescript
class Employee {
  name: string;
  private _salary: number;  // Private backing field

  constructor(name: string, salary: number) {
    this.name = name;
    this._salary = salary;
  }

  // Getter - access like a property, but runs a method
  get salary(): number {
    return this._salary;
  }

  // Setter - assign like a property, but with validation
  set salary(value: number) {
    if (value < 0) {
      throw new Error("Salary cannot be negative");
    }
    if (value > 1000000) {
      console.warn("Salary seems unusually high - flagging for review");
    }
    this._salary = value;
  }

  getDetails(): string {
    return `${this.name} earns $${this._salary.toLocaleString()}`;
  }
}

const emp = new Employee("Morgan Davis", 85000);

// Use getter (looks like property access)
console.log(emp.salary);  // 85000 - calls the getter

// Use setter (looks like property assignment)
emp.salary = 90000;  // ✓ Calls the setter, validation passes
console.log(emp.salary);  // 90000

// ❌ Validation catches bad data
emp.salary = -5000;  // Throws Error: "Salary cannot be negative"
```

### Deep Dive: Naming Conventions for Getters/Setters

**User Question**: What is the best naming convention for private properties with getters/setters?

**Answer**: The most common convention is:

```typescript
class Employee {
  private _salary: number;  // Private backing field with underscore

  get salary(): number {    // Public getter (no underscore)
    return this._salary;
  }

  set salary(value: number) {  // Public setter (no underscore)
    this._salary = value;
  }
}

// Usage looks clean
const emp = new Employee("Alex", 80000);
emp.salary = 85000;  // Looks like a normal property
console.log(emp.salary);  // Looks like a normal property
```

**Why this convention?**

1. **Clear distinction**: `_salary` is the internal storage, `salary` is the public interface
2. **Clean API**: Users interact with `emp.salary`, not `emp._salary`
3. **Future-proof**: Can add validation to setters without changing the public API

**Alternative conventions:**

```typescript
// Option 2: Different names entirely
class Employee {
  private salaryAmount: number;

  get salary(): number {
    return this.salaryAmount;
  }

  set salary(value: number) {
    this.salaryAmount = value;
  }
}

// Option 3: Use methods instead (less popular with getters/setters)
class Employee {
  private salary: number;

  getSalary(): number {
    return this.salary;
  }

  setSalary(value: number): void {
    this.salary = value;
  }
}
```

**Best Practice**: Stick with `_propertyName` for private backing fields when using getters/setters.

### Refactoring: Parameter Properties

#### The Problem: Repetitive Constructor Code

```typescript
class Employee {
  // Must declare properties
  name: string;
  jobTitle: string;
  private _salary: number;
  protected department: string;

  // Then assign them in constructor
  constructor(name: string, jobTitle: string, salary: number, department: string) {
    this.name = name;
    this.jobTitle = jobTitle;
    this._salary = salary;
    this.department = department;
  }

  get salary(): number {
    return this._salary;
  }

  getDetails(): string {
    return `${this.name} - ${this.jobTitle} (${this.department})`;
  }
}
```

This is repetitive! We:
1. Declare the property
2. Add it as a constructor parameter
3. Assign `this.property = parameter`

#### The Solution: Parameter Properties (Shorthand)

```typescript
// Modern TS - Parameter Properties
class Employee {
  constructor(
    public name: string,
    public jobTitle: string,
    private _salary: number,
    protected department: string
  ) {
    // That's it! No need to write this.name = name, etc.
    // TypeScript automatically creates properties and assigns them
  }

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value < 0) throw new Error("Salary cannot be negative");
    this._salary = value;
  }

  getDetails(): string {
    return `${this.name} - ${this.jobTitle} (${this.department})`;
  }
}

const emp = new Employee("Casey Jordan", "Engineer", 88000, "Product");
console.log(emp.name);  // "Casey Jordan"
console.log(emp.salary);  // 88000
console.log(emp.getDetails());  // "Casey Jordan - Engineer (Product)"
```

**What happens under the hood:**
1. TypeScript sees `public name: string` in the constructor
2. It automatically creates a property: `public name: string;`
3. It automatically assigns it: `this.name = name;`

### Deep Dive: Which Is Best Practice?

**User Question**: Parameter properties vs traditional approach - which is best?

**Answer**: It depends on your needs:

**Use Parameter Properties when:**
- Properties are simple (just store the value)
- You want concise, readable code
- No complex initialization logic needed

```typescript
// ✓ Good use case - simple properties
class User {
  constructor(
    public id: number,
    public username: string,
    private passwordHash: string
  ) {}
}
```

**Use Traditional Approach when:**
- You need validation or transformation in the constructor
- Properties need computed values
- You want explicit property declarations for documentation

```typescript
// ✓ Good use case - complex initialization
class Employee {
  name: string;
  email: string;
  employeeId: string;

  constructor(firstName: string, lastName: string, department: string) {
    this.name = `${firstName} ${lastName}`;
    this.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    this.employeeId = `${department.toUpperCase()}-${Date.now()}`;
  }
}
```

**Hybrid Approach** (Most Common in Real Code):

```typescript
class Employee {
  // Some parameter properties (simple ones)
  constructor(
    public name: string,
    private _salary: number,
    
    // Plus traditional properties that need logic
    departmentCode: string
  ) {
    // Complex initialization for non-parameter properties
    this.department = this.resolveDepartment(departmentCode);
    this.employeeId = this.generateId();
  }

  department: string;
  employeeId: string;

  private resolveDepartment(code: string): string {
    const deptMap: { [key: string]: string } = {
      "ENG": "Engineering",
      "HR": "Human Resources",
      "SALES": "Sales"
    };
    return deptMap[code] || "Unknown";
  }

  private generateId(): string {
    return `EMP-${Date.now()}`;
  }

  get salary(): number {
    return this._salary;
  }
}
```

---

## Static Members: Shared Data

### The Problem: Repeated Company Information

```typescript
class Employee {
  constructor(
    public name: string,
    private _salary: number,
    public department: string
  ) {}

  getDetails(): string {
    // 😱 We're hardcoding "Tech Corp" for EVERY employee!
    return `${this.name} works at Tech Corp in ${this.department}`;
  }
}

const emp1 = new Employee("Alex Chen", 85000, "Engineering");
const emp2 = new Employee("Jordan Lee", 78000, "Marketing");
const emp3 = new Employee("Sam Rivera", 92000, "Sales");

console.log(emp1.getDetails());  // "Alex Chen works at Tech Corp in Engineering"
console.log(emp2.getDetails());  // "Jordan Lee works at Tech Corp in Marketing"

// Problems:
// 1. Company name is duplicated in every method call
// 2. If company name changes, we'd need to update it everywhere
// 3. Each instance doesn't need its own copy of the company name
```

### The Solution: Static Properties

```typescript
class Employee {
  // Static property - shared by ALL instances
  static companyName: string = "Tech Corp";
  static foundedYear: number = 2010;

  constructor(
    public name: string,
    private _salary: number,
    public department: string
  ) {}

  getDetails(): string {
    // Access via the CLASS name, not 'this'
    return `${this.name} works at ${Employee.companyName} in ${this.department}`;
  }

  static getCompanyAge(): number {
    return new Date().getFullYear() - Employee.foundedYear;
  }
}

const emp1 = new Employee("Alex Chen", 85000, "Engineering");
const emp2 = new Employee("Jordan Lee", 78000, "Marketing");

// ✓ Company name stored once, shared by all
console.log(emp1.getDetails());  // "Alex Chen works at Tech Corp in Engineering"
console.log(emp2.getDetails());  // "Jordan Lee works at Tech Corp in Marketing"

// ✓ Access static members through the class
console.log(Employee.companyName);  // "Tech Corp"
console.log(Employee.getCompanyAge());  // 15

// ✓ Change once, affects all instances
Employee.companyName = "TechCorp Global";
console.log(emp1.getDetails());  // "Alex Chen works at TechCorp Global in Engineering"
console.log(emp2.getDetails());  // "Jordan Lee works at TechCorp Global in Marketing"
```

### Static vs Instance Members

```typescript
class Employee {
  // Static members - shared by all instances
  static companyName: string = "Tech Corp";
  static employeeCount: number = 0;

  // Instance members - unique to each instance
  name: string;
  private _salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this._salary = salary;
    
    // ✓ Static member accessed via class name
    Employee.employeeCount++;
  }

  // Instance method - can access instance members
  getInfo(): string {
    return `${this.name} earns $${this._salary}`;
  }

  // Static method - can only access static members
  static getEmployeeCount(): number {
    return Employee.employeeCount;
  }

  static getCompanyInfo(): string {
    // ✓ Can access static members
    return `${Employee.companyName} has ${Employee.employeeCount} employees`;
    
    // ❌ Cannot access instance members
    // return this.name;  // Error: Property 'name' does not exist on type 'typeof Employee'
  }
}

console.log(Employee.employeeCount);  // 0

const emp1 = new Employee("Alex", 85000);
const emp2 = new Employee("Jordan", 78000);

console.log(Employee.employeeCount);  // 2
console.log(Employee.getCompanyInfo());  // "Tech Corp has 2 employees"
```

### Deep Dive: Why Can't Static Methods Access Instance Properties?

**User Question**: Why can static methods ONLY access static properties?

**Answer**: It's all about the `this` context.

```typescript
class Employee {
  static companyName: string = "Tech Corp";
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // Instance method - 'this' refers to a specific instance
  instanceMethod(): void {
    console.log(this.name);  // ✓ 'this' is the specific employee object
  }

  // Static method - 'this' refers to the CLASS itself
  static staticMethod(): void {
    console.log(this.companyName);  // ✓ 'this' is the Employee class
    
    // ❌ But which employee's name would this be?
    // console.log(this.name);  
    // There's no specific instance - static methods are called on the CLASS
  }
}

// When you call an instance method:
const emp = new Employee("Alex");
emp.instanceMethod();  // 'this' = emp (the specific employee object)

// When you call a static method:
Employee.staticMethod();  // 'this' = Employee (the class itself, not any instance)
```

**Think of it this way:**

```typescript
class Employee {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }

  static staticMethod(): void {
    // Which employee's name should we access?
    // emp1.name? emp2.name? emp3.name?
    // We don't have access to any specific instance!
    console.log(this.name);  // ❌ Makes no sense
  }
}

const emp1 = new Employee("Alex");
const emp2 = new Employee("Jordan");
const emp3 = new Employee("Sam");

// Static method is called on the CLASS, not an instance
Employee.staticMethod();  // Not emp1.staticMethod()!
```

**Static methods can only access:**
- Other static members (properties and methods)
- Parameters passed to them
- External data

```typescript
class MathHelper {
  static PI: number = 3.14159;

  // ✓ Static method accessing static property
  static calculateCircleArea(radius: number): number {
    return MathHelper.PI * radius * radius;
  }

  // ✓ Static method with parameters
  static add(a: number, b: number): number {
    return a + b;
  }
}

console.log(MathHelper.calculateCircleArea(5));  // 78.53975
console.log(MathHelper.add(3, 7));  // 10
```

---

## Inheritance & Polymorphism

### The Problem: Code Duplication for Similar Classes

```typescript
// We have basic employees
class Employee {
  constructor(
    public name: string,
    private _salary: number,
    public department: string
  ) {}

  get salary(): number {
    return this._salary;
  }

  getDetails(): string {
    return `${this.name} - ${this.department}`;
  }
}

// Now we need managers who have everything employees have PLUS extra features
class Manager {
  // 😱 Duplicating all the employee code!
  constructor(
    public name: string,
    private _salary: number,
    public department: string,
    public teamSize: number  // New property for managers
  ) {}

  get salary(): number {
    return this._salary;
  }

  getDetails(): string {
    // 😱 Duplicated method
    return `${this.name} - ${this.department}`;
  }

  // New method for managers
  getTeamInfo(): string {
    return `${this.name} manages ${this.teamSize} employees`;
  }
}
```

**Problems:**
1. Massive code duplication
2. If we change `Employee`, we must remember to change `Manager`
3. Violates DRY (Don't Repeat Yourself) principle

### The Solution: Inheritance with `extends`

```typescript
// Base class - shared functionality
class Employee {
  static companyName: string = "Tech Corp";

  constructor(
    public name: string,
    private _salary: number,
    protected department: string  // ✓ Recap: protected allows subclasses to access it
  ) {}

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value < 0) throw new Error("Salary cannot be negative");
    this._salary = value;
  }

  getDetails(): string {
    return `${this.name} - ${this.department} at ${Employee.companyName}`;
  }
}

// Derived class - inherits everything from Employee
class Manager extends Employee {
  constructor(
    name: string,
    salary: number,
    department: string,
    public teamSize: number  // Additional property for managers
  ) {
    // ✓ Must call super() first to initialize parent class
    super(name, salary, department);
  }

  // Additional method for managers
  getTeamInfo(): string {
    return `${this.name} manages ${this.teamSize} employees`;
  }

  // Managers can access protected 'department' from parent
  getDepartmentReport(): string {
    return `${this.name} leads the ${this.department} department`;
  }
}

const emp = new Employee("Alex Chen", 85000, "Engineering");
const mgr = new Manager("Jordan Lee", 110000, "Engineering", 8);

console.log(emp.getDetails());  // "Alex Chen - Engineering at Tech Corp"
console.log(mgr.getDetails());  // "Jordan Lee - Engineering at Tech Corp" (inherited!)
console.log(mgr.getTeamInfo());  // "Jordan Lee manages 8 employees"
```

### The `super()` Trick with Parameter Properties

**This is tricky!** When the parent class uses parameter properties:

```typescript
class Employee {
  constructor(
    public name: string,      // Parameter property
    private _salary: number,  // Parameter property
    protected department: string  // Parameter property
  ) {}
}

class Manager extends Employee {
  constructor(
    name: string,           // Regular parameter
    salary: number,         // Regular parameter
    department: string,     // Regular parameter
    public teamSize: number  // Parameter property for Manager
  ) {
    // Pass the parent's parameters to super()
    super(name, salary, department);
    // Now 'this' is available, and teamSize is already set
  }
}
```

**Key Point**: In the child constructor:
- Parent's properties: passed as regular parameters to `super()`
- Child's properties: use parameter property syntax (public/private/protected)

### Method Overriding with `override`

Managers might want to customize how they report their details:

```typescript
class Employee {
  static companyName: string = "Tech Corp";

  constructor(
    public name: string,
    private _salary: number,
    protected department: string
  ) {}

  get salary(): number {
    return this._salary;
  }

  getDetails(): string {
    return `${this.name} - ${this.department}`;
  }
}

class Manager extends Employee {
  constructor(
    name: string,
    salary: number,
    department: string,
    public teamSize: number
  ) {
    super(name, salary, department);
  }

  // Override parent's method with enhanced version
  override getDetails(): string {
    // ✓ Recap: Call parent's method first
    const baseDetails = super.getDetails();
    return `${baseDetails} [MANAGER - Team of ${this.teamSize}]`;
  }

  getTeamInfo(): string {
    return `Manages ${this.teamSize} employees in ${this.department}`;
  }
}

const emp = new Employee("Alex Chen", 85000, "Engineering");
const mgr = new Manager("Jordan Lee", 110000, "Engineering", 8);

console.log(emp.getDetails());  
// "Alex Chen - Engineering"

console.log(mgr.getDetails());  
// "Alex Chen - Engineering [MANAGER - Team of 8]"
```

**The `override` keyword**:
- Explicitly marks that you're overriding a parent method
- Helps catch typos (if you misspell the method name, TypeScript will error)
- Makes code more readable and self-documenting

### Polymorphism: One Interface, Many Forms

**Polymorphism** means treating different types through a common interface:

```typescript
class Employee {
  constructor(
    public name: string,
    private _salary: number,
    protected department: string
  ) {}

  get salary(): number {
    return this._salary;
  }

  getDetails(): string {
    return `Employee: ${this.name} - ${this.department}`;
  }

  getAnnualBonus(): number {
    return this._salary * 0.05;  // 5% bonus
  }
}

class Manager extends Employee {
  constructor(
    name: string,
    salary: number,
    department: string,
    public teamSize: number
  ) {
    super(name, salary, department);
  }

  override getDetails(): string {
    return `Manager: ${this.name} - ${this.department} (Team: ${this.teamSize})`;
  }

  override getAnnualBonus(): number {
    return this.salary * 0.15;  // 15% bonus for managers
  }
}

class SeniorManager extends Manager {
  constructor(
    name: string,
    salary: number,
    department: string,
    teamSize: number,
    public businessUnit: string
  ) {
    super(name, salary, department, teamSize);
  }

  override getDetails(): string {
    return `Senior Manager: ${this.name} - ${this.businessUnit}`;
  }

  override getAnnualBonus(): number {
    return this.salary * 0.25;  // 25% bonus for senior managers
  }
}

// Polymorphism in action - array of mixed types
const team: Employee[] = [
  new Employee("Alex Chen", 80000, "Engineering"),
  new Manager("Jordan Lee", 110000, "Engineering", 8),
  new Employee("Sam Rivera", 75000, "Engineering"),
  new SeniorManager("Casey Kim", 150000, "Engineering", 25, "Product Division")
];

console.log("=== Team Details ===");
team.forEach(member => {
  console.log(member.getDetails());
  console.log(`Annual Bonus: $${member.getAnnualBonus()}`);
  console.log("---");
});

/* Output:
=== Team Details ===
Employee: Alex Chen - Engineering
Annual Bonus: $4000
---
Manager: Jordan Lee - Engineering (Team: 8)
Annual Bonus: $16500
---
Employee: Sam Rivera - Engineering
Annual Bonus: $3750
---
Senior Manager: Casey Kim - Product Division
Annual Bonus: $37500
---
*/
```

**What makes this polymorphic?**
1. All objects in the array are treated as `Employee[]`
2. Each object calls its own version of `getDetails()` and `getAnnualBonus()`
3. The correct method runs based on the actual object type (runtime polymorphism)

---

## Abstraction & Structure

### Abstract Classes: Enforcing Implementation

#### The Problem: Creating Generic Employees

```typescript
class Employee {
  constructor(
    public name: string,
    protected department: string
  ) {}

  getDetails(): string {
    return `${this.name} - ${this.department}`;
  }
}

// 😱 This doesn't make sense - what KIND of employee are they?
const genericEmployee = new Employee("John Doe", "Unknown");
```

**The problem**: We shouldn't be able to create a "generic" employee. Every employee should have a specific role (Developer, Manager, Designer, etc.).

#### The Solution: Abstract Classes

```typescript
// Abstract class - cannot be instantiated directly
abstract class Employee {
  static companyName: string = "Tech Corp";

  constructor(
    public name: string,
    private _salary: number,
    protected department: string
  ) {}

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value < 0) throw new Error("Salary cannot be negative");
    this._salary = value;
  }

  // Concrete method - has implementation
  getDetails(): string {
    return `${this.name} - ${this.department} at ${Employee.companyName}`;
  }

  // Abstract method - must be implemented by subclasses
  abstract getRole(): string;
  abstract getAnnualBonus(): number;
}

// ❌ Cannot instantiate abstract class
// const emp = new Employee("John", 80000, "Engineering");
// Error: Cannot create an instance of an abstract class

// ✓ Must create concrete subclasses
class Developer extends Employee {
  constructor(
    name: string,
    salary: number,
    public programmingLanguages: string[]
  ) {
    super(name, salary, "Engineering");
  }

  // ✓ Must implement abstract methods
  getRole(): string {
    return "Software Developer";
  }

  getAnnualBonus(): number {
    return this.salary * 0.1;
  }

  getSkills(): string {
    return `Skills: ${this.programmingLanguages.join(", ")}`;
  }
}

class Manager extends Employee {
  constructor(
    name: string,
    salary: number,
    department: string,
    public teamSize: number
  ) {
    super(name, salary, department);
  }

  // ✓ Must implement abstract methods
  getRole(): string {
    return "Manager";
  }

  getAnnualBonus(): number {
    return this.salary * 0.15;
  }

  getTeamInfo(): string {
    return `Manages ${this.teamSize} team members`;
  }
}

const dev = new Developer("Alex Chen", 95000, ["TypeScript", "Python", "Go"]);
const mgr = new Manager("Jordan Lee", 120000, "Product", 12);

console.log(dev.getRole());  // "Software Developer"
console.log(dev.getSkills());  // "Skills: TypeScript, Python, Go"
console.log(`Bonus: $${dev.getAnnualBonus()}`);  // "Bonus: $9500"

console.log(mgr.getRole());  // "Manager"
console.log(mgr.getTeamInfo());  // "Manages 12 team members"
console.log(`Bonus: $${mgr.getAnnualBonus()}`);  // "Bonus: $18000"

// Polymorphism still works
const employees: Employee[] = [dev, mgr];
employees.forEach(emp => {
  console.log(`${emp.name} is a ${emp.getRole()}`);
});
```

### Deep Dive: Can Abstract Classes Have Constructors?

**User Question**: Can an abstract class have a constructor?

**Answer**: Yes! Abstract classes can and often do have constructors.

```typescript
abstract class Employee {
  constructor(
    public name: string,
    private _salary: number,
    protected department: string
  ) {
    // Constructor runs when creating subclass instances
    console.log(`Creating employee: ${name}`);
    
    // Can have initialization logic
    if (!name || name.trim().length === 0) {
      throw new Error("Employee must have a name");
    }
  }

  get salary(): number {
    return this._salary;
  }

  abstract getRole(): string;
}

class Developer extends Employee {
  constructor(name: string, salary: number) {
    super(name, salary, "Engineering");  // Calls parent constructor
  }

  getRole(): string {
    return "Developer";
  }
}

const dev = new Developer("Alex Chen", 95000);
// Console: "Creating employee: Alex Chen"
```

**Why abstract classes have constructors:**
1. **Initialize shared properties** that all subclasses need
2. **Enforce validation** for common fields
3. **Set up common state** before subclass customization

**Key point**: You can't call `new Employee()` directly, but when you call `new Developer()`, the `Employee` constructor runs first (via `super()`).

---

### Interfaces: Contracts for Behavior

#### Interface vs Type Alias: When to Use Which?

```typescript
// Type Alias - for data shapes
type Employee = {
  name: string;
  salary: number;
  getDetails(): string;
};

// Interface - for contracts and OOP
interface IPayable {
  salary: number;
  calculatePay(): number;
}
```

**When to use Interface**:
- Defining contracts that classes must implement
- OOP scenarios where you want classes to guarantee certain methods/properties
- When you might extend the interface later

**When to use Type Alias**:
- Unions and intersections
- Mapped types and complex type transformations
- Simple data shapes

#### Implementing Interfaces

```typescript
// Interface defines a contract
interface IPayable {
  salary: number;
  calculateMonthlyPay(): number;
  calculateAnnualPay(): number;
}

interface IBonusEligible {
  getAnnualBonus(): number;
}

// Abstract base class
abstract class Employee {
  constructor(
    public name: string,
    protected _salary: number,
    protected department: string
  ) {}

  get salary(): number {
    return this._salary;
  }

  abstract getRole(): string;
}

// Class can implement multiple interfaces
class Developer extends Employee implements IPayable, IBonusEligible {
  constructor(
    name: string,
    salary: number,
    public programmingLanguages: string[]
  ) {
    super(name, salary, "Engineering");
  }

  getRole(): string {
    return "Developer";
  }

  // ✓ Must implement IPayable methods
  calculateMonthlyPay(): number {
    return this.salary / 12;
  }

  calculateAnnualPay(): number {
    return this.salary;
  }

  // ✓ Must implement IBonusEligible methods
  getAnnualBonus(): number {
    return this.salary * 0.1;
  }
}

class Contractor implements IPayable {
  constructor(
    public name: string,
    public hourlyRate: number,
    public hoursPerMonth: number
  ) {}

  get salary(): number {
    return this.hourlyRate * this.hoursPerMonth * 12;
  }

  calculateMonthlyPay(): number {
    return this.hourlyRate * this.hoursPerMonth;
  }

  calculateAnnualPay(): number {
    return this.calculateMonthlyPay() * 12;
  }
}

// Polymorphism with interfaces
const payableWorkers: IPayable[] = [
  new Developer("Alex Chen", 95000, ["TypeScript"]),
  new Contractor("Jordan Lee", 150, 160)
];

payableWorkers.forEach(worker => {
  console.log(`Monthly pay: $${worker.calculateMonthlyPay()}`);
});
```

### Deep Dive: Interface vs Type Alias in OOP

**User Question**: What's the practical difference between Interface and Type Alias?

**Answer**: While they overlap significantly, there are key differences:

#### Interfaces are Extendable

```typescript
interface Animal {
  name: string;
}

// ✓ Can extend interfaces
interface Dog extends Animal {
  breed: string;
}

// ✓ Can merge declarations (declaration merging)
interface Animal {
  age: number;
}

// Now Animal has both 'name' and 'age'
```

#### Type Aliases are More Flexible

```typescript
// ✓ Type aliases can do unions
type Status = "pending" | "approved" | "rejected";

// ✓ Type aliases can do complex types
type Response = {
  data: User[];
} | {
  error: string;
};

// ❌ Interfaces can't do this
```

#### Classes Can Implement Both

```typescript
interface IPrintable {
  print(): void;
}

type Serializable = {
  serialize(): string;
};

// ✓ Can implement interface
class Document implements IPrintable {
  print(): void {
    console.log("Printing...");
  }
}

// ✓ Can implement type alias
class JsonDocument implements Serializable {
  serialize(): string {
    return JSON.stringify(this);
  }
}
```

**Best Practice for OOP:**
- Use **interfaces** for class contracts (what a class must implement)
- Use **type aliases** for data shapes and unions

---

### Index Signatures: Dynamic Properties

#### The Problem: Dynamic Bonus Data

```typescript
class Employee {
  bonuses: ???  // How do we type dynamic keys like "Q1", "Q2", etc.?

  constructor(public name: string, private _salary: number) {
    this.bonuses = {};
  }

  addBonus(quarter: string, amount: number): void {
    this.bonuses[quarter] = amount;  // TypeScript doesn't know about dynamic keys
  }

  getTotalBonuses(): number {
    let total = 0;
    for (const key in this.bonuses) {
      total += this.bonuses[key];
    }
    return total;
  }
}
```

#### The Solution: Index Signatures

```typescript
class Employee {
  // Index signature: [key: string] means any string key
  bonuses: { [key: string]: number } = {};

  constructor(
    public name: string,
    private _salary: number
  ) {}

  get salary(): number {
    return this._salary;
  }

  addBonus(quarter: string, amount: number): void {
    this.bonuses[quarter] = amount;
  }

  getTotalBonuses(): number {
    let total = 0;
    for (const key in this.bonuses) {
      total += this.bonuses[key];
    }
    return total;
  }

  getBonusReport(): string {
    const entries = Object.entries(this.bonuses);
    if (entries.length === 0) {
      return `${this.name} has no bonuses yet`;
    }
    
    const report = entries
      .map(([quarter, amount]) => `${quarter}: $${amount}`)
      .join(", ");
    
    return `${this.name}'s bonuses - ${report} (Total: $${this.getTotalBonuses()})`;
  }
}

const emp = new Employee("Morgan Davis", 90000);

// Add bonuses for different quarters
emp.addBonus("Q1", 5000);
emp.addBonus("Q2", 7500);
emp.addBonus("Q3", 6000);

console.log(emp.getBonusReport());
// "Morgan Davis's bonuses - Q1: $5000, Q2: $7500, Q3: $6000 (Total: $18500)"
```

### Syntax Check: Property Access Methods

```typescript
class Employee {
  bonuses: { [key: string]: number } = {};

  addBonus(quarter: string, amount: number): void {
    // Method 1: Bracket notation (required for variables)
    this.bonuses[quarter] = amount;  // ✓ quarter is a variable
    
    // Method 2: Dot notation (only for literal keys)
    this.bonuses.Q1 = 5000;  // ✓ Works, but Q1 is hardcoded
  }

  getBonus(quarter: string): number {
    // ✓ Bracket notation with variable
    return this.bonuses[quarter] || 0;
    
    // ❌ This would NOT work
    // return this.bonuses.quarter;  // Looks for a key literally named "quarter"
  }
}

const emp = new Employee("Alex", 80000);
emp.addBonus("Q1", 5000);

console.log(emp.bonuses["Q1"]);  // 5000 ✓
console.log(emp.bonuses.Q1);     // 5000 ✓ (literal key)

const quarter = "Q1";
console.log(emp.bonuses[quarter]);  // 5000 ✓ (variable)
console.log(emp.bonuses.quarter);   // undefined ❌ (looks for literal "quarter" key)
```

**Key Difference:**
- `obj.key` - Accesses a property literally named "key"
- `obj[key]` - Accesses a property with name stored in variable `key`

---

## Student Assessment

### Question 1: Spot the Error - Private Access

**Problem**: Find the error in this code:

```typescript
abstract class Employee {
  constructor(
    public name: string,
    private _salary: number
  ) {}

  get salary(): number {
    return this._salary;
  }

  abstract getRole(): string;
}

class Developer extends Employee {
  constructor(name: string, salary: number) {
    super(name, salary);
  }

  getRole(): string {
    return "Developer";
  }

  giveSalaryRaise(amount: number): void {
    this._salary += amount;  // Is this allowed?
  }
}

const dev = new Developer("Alex Chen", 90000);
dev.giveSalaryRaise(5000);
```

<details>
<summary>Answer</summary>

**Error**: The `giveSalaryRaise` method tries to access `this._salary`, but `_salary` is `private` in the parent class.

**Why it fails:**
- `private` members are ONLY accessible within the class that declares them
- Subclasses cannot access `private` members from parent classes
- Even though `Developer extends Employee`, it can't access `Employee._salary`

**How to fix:**

**Option 1**: Change `private` to `protected`
```typescript
abstract class Employee {
  constructor(
    public name: string,
    protected _salary: number  // Changed to protected
  ) {}

  get salary(): number {
    return this._salary;
  }
}

class Developer extends Employee {
  giveSalaryRaise(amount: number): void {
    this._salary += amount;  // ✓ Now works!
  }
}
```

**Option 2**: Use the public setter
```typescript
abstract class Employee {
  constructor(
    public name: string,
    private _salary: number
  ) {}

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value < 0) throw new Error("Invalid salary");
    this._salary = value;
  }
}

class Developer extends Employee {
  giveSalaryRaise(amount: number): void {
    this.salary += amount;  // ✓ Uses the public setter
  }
}
```

**Access Modifier Recap:**
- `private` - Only the declaring class
- `protected` - Declaring class + subclasses
- `public` - Everyone
</details>

---

### Question 2: Refactoring Challenge

**Challenge**: Refactor this "Long Way" JavaScript-style class to use TypeScript's Parameter Properties:

```typescript
// BEFORE: Long Way (Traditional Approach)
class Employee {
  name: string;
  employeeId: string;
  department: string;
  private _salary: number;
  protected hireDate: Date;
  public isActive: boolean;

  constructor(
    name: string,
    employeeId: string,
    department: string,
    salary: number,
    hireDate: Date,
    isActive: boolean
  ) {
    this.name = name;
    this.employeeId = employeeId;
    this.department = department;
    this._salary = salary;
    this.hireDate = hireDate;
    this.isActive = isActive;
  }

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value < 0) throw new Error("Invalid salary");
    this._salary = value;
  }

  getDetails(): string {
    return `${this.name} (${this.employeeId}) - ${this.department}`;
  }

  getYearsOfService(): number {
    const now = new Date();
    const years = now.getFullYear() - this.hireDate.getFullYear();
    return years;
  }
}
```

**Your Task**: Refactor to use Parameter Properties

<details>
<summary>Solution</summary>

```typescript
// AFTER: Parameter Properties (Modern Approach)
class Employee {
  constructor(
    public name: string,
    public employeeId: string,
    public department: string,
    private _salary: number,
    protected hireDate: Date,
    public isActive: boolean
  ) {
    // No property assignments needed - TypeScript does it automatically!
  }

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value < 0) throw new Error("Invalid salary");
    this._salary = value;
  }

  getDetails(): string {
    return `${this.name} (${this.employeeId}) - ${this.department}`;
  }

  getYearsOfService(): number {
    const now = new Date();
    const years = now.getFullYear() - this.hireDate.getFullYear();
    return years;
  }
}

// Usage (exactly the same)
const emp = new Employee(
  "Alex Chen",
  "EMP-001",
  "Engineering",
  95000,
  new Date("2020-03-15"),
  true
);

console.log(emp.getDetails());  // "Alex Chen (EMP-001) - Engineering"
console.log(emp.salary);  // 95000
console.log(emp.getYearsOfService());  // 5 (as of 2025)
```

**What changed:**
1. ✅ Removed explicit property declarations
2. ✅ Added access modifiers to constructor parameters
3. ✅ Removed all `this.property = parameter` assignments
4. ✅ Code is shorter and clearer
5. ✅ Behavior is identical

**Benefits:**
- Reduced from ~30 lines to ~20 lines
- Less repetition
- Easier to maintain
- Same functionality
</details>

---

### Question 3: Interface Implementation Challenge

**Challenge**: Create a `Contractor` class that implements the `IPayable` interface but is NOT an employee:

```typescript
interface IPayable {
  calculateMonthlyPay(): number;
  calculateAnnualPay(): number;
}

abstract class Employee implements IPayable {
  constructor(
    public name: string,
    private _salary: number
  ) {}

  get salary(): number {
    return this._salary;
  }

  calculateMonthlyPay(): number {
    return this._salary / 12;
  }

  calculateAnnualPay(): number {
    return this._salary;
  }

  abstract getRole(): string;
}

// Your task: Create a Contractor class that:
// 1. Implements IPayable
// 2. Does NOT extend Employee
// 3. Has: name, hourlyRate, hoursPerWeek
// 4. Calculates pay based on hourly rate (52 weeks per year)
```

<details>
<summary>Solution</summary>

```typescript
interface IPayable {
  calculateMonthlyPay(): number;
  calculateAnnualPay(): number;
}

class Contractor implements IPayable {
  constructor(
    public name: string,
    public hourlyRate: number,
    public hoursPerWeek: number
  ) {}

  calculateMonthlyPay(): number {
    // 4.33 weeks per month on average (52 weeks / 12 months)
    return this.hourlyRate * this.hoursPerWeek * 4.33;
  }

  calculateAnnualPay(): number {
    // 52 weeks per year
    return this.hourlyRate * this.hoursPerWeek * 52;
  }

  getContractInfo(): string {
    return `${this.name} - $${this.hourlyRate}/hr, ${this.hoursPerWeek} hrs/week`;
  }
}

// Usage
const contractor = new Contractor("Jamie Taylor", 125, 40);
console.log(contractor.getContractInfo());
// "Jamie Taylor - $125/hr, 40 hrs/week"

console.log(`Monthly: $${contractor.calculateMonthlyPay().toFixed(2)}`);
// "Monthly: $21650.00"

console.log(`Annual: $${contractor.calculateAnnualPay().toFixed(2)}`);
// "Annual: $260000.00"

// Polymorphism - treat as IPayable
const workers: IPayable[] = [
  new Contractor("Jamie Taylor", 125, 40),
  // Could also add Employee instances here
];

workers.forEach(worker => {
  console.log(`Annual pay: $${worker.calculateAnnualPay()}`);
});
```

**Key Points:**
1. ✅ `Contractor` implements `IPayable` without extending `Employee`
2. ✅ Different pay calculation logic (hourly vs salary)
3. ✅ Can still be used polymorphically with employees
4. ✅ Shows interfaces enable "has-a" relationship, not just "is-a"
</details>

---

## Quick Reference Card

```typescript
// ============ CLASS BASICS ============
class Employee {
  // Properties
  name: string;
  private _salary: number;
  
  // Constructor
  constructor(name: string, salary: number) {
    this.name = name;
    this._salary = salary;
  }
  
  // Method
  getInfo(): string {
    return `${this.name}: $${this._salary}`;
  }
}

// ============ PARAMETER PROPERTIES ============
class Employee {
  constructor(
    public name: string,        // Auto-creates public property
    private _salary: number,    // Auto-creates private property
    protected dept: string      // Auto-creates protected property
  ) {}
}

// ============ ACCESS MODIFIERS ============
class Example {
  public x: number;      // Accessible everywhere (default)
  private y: number;     // Only in this class
  protected z: number;   // This class + subclasses
}

// ============ GETTERS & SETTERS ============
class Employee {
  private _salary: number;
  
  get salary(): number {
    return this._salary;
  }
  
  set salary(value: number) {
    if (value < 0) throw new Error("Invalid");
    this._salary = value;
  }
}

// ============ STATIC MEMBERS ============
class Employee {
  static companyName: string = "Tech Corp";
  
  static getInfo(): string {
    return Employee.companyName;
  }
}

// Access: Employee.companyName

// ============ INHERITANCE ============
class Manager extends Employee {
  constructor(name: string, salary: number, public teamSize: number) {
    super(name, salary);  // Call parent constructor
  }
  
  override getInfo(): string {
    return super.getInfo() + ` [Manager]`;
  }
}

// ============ ABSTRACT CLASSES ============
abstract class Employee {
  constructor(public name: string) {}
  
  abstract getRole(): string;  // Must implement in subclass
  
  getInfo(): string {          // Concrete method
    return `${this.name} - ${this.getRole()}`;
  }
}

// Cannot instantiate: new Employee() ❌
// Must subclass: class Dev extends Employee ✓

// ============ INTERFACES ============
interface IPayable {
  calculatePay(): number;
}

class Employee implements IPayable {
  calculatePay(): number {
    return 5000;
  }
}

// ============ INDEX SIGNATURES ============
class Employee {
  bonuses: { [key: string]: number } = {};
  
  addBonus(quarter: string, amount: number): void {
    this.bonuses[quarter] = amount;
  }
}

// ============ INSTANCEOF ============
if (worker instanceof Manager) {
  console.log(worker.teamSize);  // TypeScript knows it's a Manager
}
```

---

