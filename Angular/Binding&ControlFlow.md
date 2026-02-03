# Angular Data Binding & Control Flow - Complete Notes

---

## **1. Data Binding Types**

### **One-Way Binding**
```html
<h1>{{ title }}</h1>
<img [src]="imageUrl">
```
- Component → View only

### **Two-Way Binding**
```html
<input [(ngModel)]="username">
```
- Component ↔ View

### **Event Binding**
```html
<button (click)="handleClick()">Click</button>
<input (input)="onInput($event)">
```
- Captures user interactions

### **Class Binding**
```html
<div [class.active]="isActive"></div>
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}"></div>
```
- Dynamic CSS classes

### **Style Binding**
```html
<div [style.color]="textColor"></div>
<div [ngStyle]="{'color': textColor, 'font-size.px': fontSize}"></div>
```
- Dynamic inline styles

---

## **2. Directives**

**Definition:** Classes that add behavior or modify DOM elements

### **Types:**
1. **Component** - with template
2. **Structural** - modify DOM structure (*ngIf, *ngFor)
3. **Attribute** - modify appearance (ngClass, ngStyle)

---

## **3. New Control Flow Syntax (Angular v17+)**

### **@if**
```html
@if (isLoggedIn) {
  <div>Welcome!</div>
} @else if (role === 'guest') {
  <div>Guest Panel</div>
} @else {
  <div>Please login</div>
}
```

### **@for**
```html
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items found</p>
}
```

**Built-in Variables:**
- `$index` - current index (0-based)
- `$count` - total items
- `$first` - true if first item
- `$last` - true if last item
- `$even` - true if even index
- `$odd` - true if odd index

### **@switch**
```html
@switch (status) {
  @case ('pending') { <p>Pending...</p> }
  @case ('success') { <p>Success!</p> }
  @default { <p>Unknown</p> }
}
```

---

## **4. Track in @for - How It Works**

### **Purpose:**
Tells Angular how to identify items uniquely for performance optimization

### **Example:**
```typescript
users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
```

```html
@for (user of users; track user.id) {
  <div>{{ user.name }}</div>
}
```

### **How Angular Uses Track:**
1. Creates tracking map: `id: 1 → <div>Alice</div>`
2. On update, compares IDs
3. Only updates changed items (not recreate all)

**Result:** 50% faster DOM operations!

---

## **5. $count vs array.length**

### **Problem:**
```html
@for (item of filteredItems(); track item.id) {
  <p>{{ $index + 1 }} of {{ items.length }}</p>  ❌ WRONG
}
```
- Shows wrong count when filtered

### **Solution:**
```html
@for (item of filteredItems(); track item.id) {
  <p>{{ $index + 1 }} of {{ $count }}</p>  ✅ CORRECT
}
```
- `$count` = actual loop iterations
- `array.length` = original array length

---

## **6. ng-container**

**Purpose:** Grouping element that doesn't render in DOM

```html
<ng-container *ngIf="show">
  <h1>Title</h1>
  <p>Content</p>
</ng-container>
```
- Output: Only `<h1>` and `<p>` appear, no wrapper

---

## **7. ng-container vs ng-template**

| Feature | ng-container | ng-template |
|---------|--------------|-------------|
| Renders content | ✅ Immediately | ❌ Hidden until used |
| Use case | Grouping | Conditional templates |

```html
<!-- ng-container: shows content -->
<ng-container *ngIf="show">
  <p>Visible</p>
</ng-container>

<!-- ng-template: hidden until referenced -->
<div *ngIf="show; else hidden">Visible</div>
<ng-template #hidden>
  <p>Hidden content</p>
</ng-template>
```

---

## **8. Angular Status (v21)**

### **NgModule:**
- ✅ NOT deprecated
- ⚠️ Standalone components are now **recommended**

### **ngNonBindable:**
- ✅ NOT deprecated
- Still active and supported

---

## **9. Bootstrap Integration**

### **Best Method - CDN:**
Add to `src/index.html`:
```html
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
```

### **Alternative - angular.json:**
```json
"styles": [
  "src/styles.css",
  "bootstrap/dist/css/bootstrap.min.css"
]
```
**Note:** No `node_modules/` prefix needed!

### **Bootstrap 5 Badge:**
```html
<span class="badge text-bg-danger">Admin</span>
<span class="badge text-bg-warning">Moderator</span>
<span class="badge text-bg-success">User</span>
```

---

## **10. Sample User Interface**

```typescript
interface IuserList {
  profilePic: string;
  userName: string;
  email: string;
  phoneNumber: string;
  birthdate: string;
  role: string;
}
```

---

## **11. Common Angular Errors**

### **angular.json Schema Error:**
**Problem:** `defaultConfiguration` in wrong location

**Solution:** Move it to end of `build` section:
```json
"build": {
  "builder": "...",
  "options": { ... },
  "configurations": { ... },
  "defaultConfiguration": "production"  // ✅ Last property
}
```

### **Bootstrap Import Error:**
❌ `@import '~bootstrap/...'` (old syntax)  
❌ `@import 'node_modules/bootstrap/...'`  
✅ `@import 'bootstrap/dist/css/bootstrap.min.css'`

---

## **12. Grid Card Layout CSS**

```css
.user-list-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: #f8f9fa;
  border: 2px solid #d0d7de;
  border-radius: 20px;
  text-align: center;
}

.user-card img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 15px;
}
```

---

## **Key Takeaways:**

1. Always use `$count` instead of `array.length` in loops
2. Use `track` with unique IDs for performance
3. New `@for`, `@if`, `@switch` syntax is cleaner
4. Bootstrap: Use CDN for simplest setup
5. `ng-container` for grouping without DOM nodes
6. NgModule not deprecated, standalone is preferred

---

**End of Notes** 📝