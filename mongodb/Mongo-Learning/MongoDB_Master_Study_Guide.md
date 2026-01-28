# MongoDB Master Study Guide 📚

A comprehensive reference guide for MongoDB covering core concepts, CRUD operations, operators, and advanced features.

---

## Table of Contents

- [Database Basics](#database-basics)
- [Data Types & BSON vs JSON](#data-types--bson-vs-json)
- [Naming Conventions](#naming-conventions)
- [CRUD Operations](#crud-operations)
- [MongoDB Operators Cheatsheet](#mongodb-operators-cheatsheet)
- [Querying & Projection](#querying--projection)
- [Write Concerns](#write-concerns)
- [Array Filters](#array-filters)
- [Cursors](#cursors)
- [Capped Collections](#capped-collections)
- [Best Practices](#best-practices)

---

## Database Basics

### Essential Commands

```javascript
// View all databases
show dbs;
show databases;

// Switch to or create a database
use ITI;

// Show current database
db;

// Show collections in current database
show collections;
show tables;

// Show logs
show logs;

// Show users
show users;
```

### Database Structure

- **Database** → Contains multiple collections
- **Collection** → Group of documents (similar to tables in SQL)
- **Document** → Individual record stored in BSON format
- **Field** → Key-value pair within a document

### Key Characteristics

- **Schema-less**: Documents in the same collection can have different fields
- **Automatic indexing**: MongoDB automatically creates an index on the `_id` field
- **Maximum document size**: 16MB per BSON document
- **Case-sensitive**: Database and collection names are case-sensitive

---

## Data Types & BSON vs JSON

### BSON vs JSON 🔄

**BSON (Binary JSON)**:
- Binary-encoded serialization of JSON-like documents
- Extends JSON with additional data types
- Used internally by MongoDB for storage and network transfer
- More efficient for storage and traversal

**Data Flow**:
1. **Input**: Application sends JSON data
2. **Serialization**: MongoDB converts JSON to BSON for storage
3. **Storage**: Data stored as BSON in database
4. **Output**: BSON converted back to JSON for retrieval

### MongoDB Data Types

| Type | Example |
|------|---------|
| **String** | `"Hello World"` |
| **Integer (32/64-bit)** | `42` |
| **Double** | `3.14` |
| **Decimal** | `NumberDecimal("100.55")` |
| **Boolean** | `true` / `false` |
| **Null** | `null` |
| **Array** | `["item1", "item2"]` |
| **Object** | `{ key: "value" }` |
| **ObjectId** | `ObjectId('507f1f77bcf86cd799439011')` |
| **Date** | `new Date()` |
| **Timestamp** | `Timestamp(23243, 1)` |
| **Binary** | Binary data |
| **RegEx** | `/pattern/` |
| **Undefined** | `undefined` |
| **MinKey/MaxKey** | Acts as -∞ and +∞ |

**ObjectId Structure** (12 bytes):
- 4 bytes: Timestamp
- 3 bytes: Machine ID
- 2 bytes: Process ID
- 3 bytes: Counter

---

## Naming Conventions

### Database Names

- ✅ Case-sensitive
- ✅ Use underscores `_` or hyphens `-` only
- ✅ Must be between 0 and 64 characters
- ❌ No spaces
- ❌ No special characters except `_` and `-`

### Document Field Names

- **`_id`**: Unique and immutable (Primary Key)
  - Can be number, string, or ObjectId
  - Auto-generated if not provided
- ✅ Use quotes optional: `{price: 12}` or `{"price": 12}`
- ❌ Avoid `$` prefix (reserved for operators)
- ❌ Avoid `.` in field names (conflicts with dot notation)
- ❌ Avoid null characters `\0`

**Examples**:

```javascript
// ✅ Good
db.collection.insertOne({ _id: 22, name: "John" });
db.collection.insertOne({ price: 12 });
db.collection.insertOne({ "firstName": "Jane" });

// ❌ Bad
db.collection.insertOne({ "$price": 12 });        // $ reserved
db.collection.insertOne({ "first\0name": "John" }); // null char
```

---

## CRUD Operations

### Create Operations 🆕

#### Create Database
```javascript
// Switch to or create new database
use newDbName;
// Note: Database won't appear until you add a document
```

#### Create Collection
```javascript
// Method 1: Explicit creation
db.createCollection("Students");

// Method 2: Implicit creation (when inserting document)
db.supervisors.insertOne({ name: "Mahmoud Helmy" });
```

#### Insert Documents

```javascript
// Insert one document
db.instructors.insertOne({ name: "MO" });
// Output: { acknowledged: true, insertedId: ObjectId('...') }

// Insert multiple documents
db.instructors.insertMany([
  { name: "MO00" },
  { name: "00oM" }
]);
// Output: { acknowledged: true, insertedIds: { '0': ObjectId('...'), '1': ObjectId('...') } }

// With options
db.instructors.insertMany(
  [{ doc1 }, { doc2 }],
  {
    writeConcern: { w: 1, j: true, wtimeout: 5000 },
    ordered: true  // Default: true (stops on error)
  }
);
```

**Insert Options**:
- `ordered: false` → Continues inserting remaining documents even if one fails
- `ordered: true` (default) → Stops on first error

---

### Read Operations 🔍

#### Basic Find

```javascript
// Find all documents
db.instructors.find();

// Find one document
db.instructors.findOne();

// Find with filter
db.instructors.find({ firstName: "noha" });

// Find with filter and projection
db.instructors.find(
  { salary: { $gt: 4000 } },           // Filter (WHERE clause)
  { _id: 0, firstName: 1, salary: 1 }  // Projection (SELECT clause)
);
```

#### Advanced Find Methods

```javascript
// Find and modify
db.instructors.findAndModify({
  query: { name: "MO" },
  update: { $inc: { score: 4 } }
});

// Find one and delete (returns deleted document)
db.instructors.findOneAndDelete({ name: "test" });

// Find one and replace (returns replaced document)
db.instructors.findOneAndReplace(
  { name: "old" },
  { name: "new", age: 25 }
);
```

---

### Update Operations ✏️

#### Update Methods

```javascript
// Update one document
db.instructors.updateOne(
  { firstName: "noha", lastName: "hesham" },  // Filter
  { $set: { age: 30 } }                       // Update
);

// Update many documents
db.instructors.updateMany(
  { age: { $lt: 25 } },
  { $set: { active: true } }
);

// Replace one document (replaces entire document)
db.Students.replaceOne(
  { Name: "Mohamed" },
  { AGE: 55 }
);

// With upsert (insert if not found)
db.Students.replaceOne(
  { Name: "Karim" },
  { AGE: 55 },
  { upsert: true }  // Creates new document if no match found
);
```

#### Update Options

```javascript
db.collection.updateOne(
  { filter },
  { update },
  {
    writeConcern: { w: 1, j: true },
    upsert: false,      // Insert if not found
    multi: false,       // Update multiple (deprecated, use updateMany)
    arrayFilters: [],   // Filter array elements
    collation: {}       // Sorting/comparison rules
  }
);
```

---

### Delete Operations 🗑️

#### Delete Documents

```javascript
// Delete one document
db.Students.deleteOne({ name: "test" });

// Delete multiple documents
db.instructors.deleteMany({ _id: { $gt: 5 } });

// Delete all documents in collection
db.instructors.deleteMany({});
```

**⚠️ Safety Tips**:
1. Test filter with `find()` before deletion
2. For large datasets, delete by index for better performance
3. Cannot delete from capped collections

#### Delete Collection

```javascript
// Drop entire collection
db.student.drop();
// Output: { "ok": 1 }
```

#### Delete Database

```javascript
// Switch to database
use ITI;

// Drop database
db.dropDatabase();
// Output: { "dropped": "ITI", "ok": 1 }
```

**⚠️ Before Dropping**:
- Backup your data
- Verify you're on the correct database
- Check user permissions (admin privileges required)
- Consider impact on applications

---

## MongoDB Operators Cheatsheet

### Reading Operators (Filtering) 🔍

#### 1. Comparison Operators

| Operator | Description | Syntax Example |
|----------|-------------|----------------|
| `$eq` | Equal to | `{ qty: { $eq: 20 } }` or `{ qty: 20 }` |
| `$gt` | Greater than | `{ age: { $gt: 18 } }` |
| `$gte` | Greater than or equal | `{ price: { $gte: 100 } }` |
| `$lt` | Less than | `{ age: { $lt: 65 } }` |
| `$lte` | Less than or equal | `{ price: { $lte: 500 } }` |
| `$ne` | Not equal to | `{ status: { $ne: "active" } }` |
| `$in` | Matches any value in array | `{ status: { $in: ["A", "D"] } }` |
| `$nin` | Matches no value in array | `{ grade: { $nin: [20, 30] } }` |

#### 2. Logical Operators

| Operator | Description | Syntax Example |
|----------|-------------|----------------|
| `$or` | Logical OR | `{ $or: [ { price: { $lt: 5 } }, { price: { $gt: 100 } } ] }` |
| `$and` | Logical AND | `{ $and: [ { price: { $ne: 0 } }, { qty: { $gt: 10 } } ] }` |
| `$not` | Inverts query expression | `{ price: { $not: { $gt: 100 } } }` |
| `$nor` | Logical NOR | `{ $nor: [ { price: 1.99 }, { sale: true } ] }` |

#### 3. Element Operators

| Operator | Description | Syntax Example |
|----------|-------------|----------------|
| `$exists` | Matches if field exists | `{ phoneNumber: { $exists: true } }` |
| `$type` | Matches field type | `{ zipCode: { $type: "string" } }` |

#### 4. Array Operators

| Operator | Description | Syntax Example |
|----------|-------------|----------------|
| `$all` | Array contains all elements | `{ tags: { $all: ["ssl", "security"] } }` |
| `$elemMatch` | Element matches all conditions | `{ results: { $elemMatch: { product: "xyz", score: { $gte: 8 } } } }` |
| `$size` | Array has specified size | `{ tags: { $size: 3 } }` |

---

### Writing Operators (Updates) 🖊️

#### 1. Field Update Operators

| Operator | Description | Syntax Example |
|----------|-------------|----------------|
| `$set` | Set field value | `{ $set: { status: "active", score: 10 } }` |
| `$unset` | Remove field | `{ $unset: { email: "" } }` |
| `$inc` | Increment value | `{ $inc: { views: 1 } }` (use negative to decrease) |
| `$rename` | Rename field | `{ $rename: { nickname: "alias" } }` |
| `$min` | Update if value is less | `{ $min: { lowScore: 50 } }` |
| `$max` | Update if value is greater | `{ $max: { highScore: 500 } }` |
| `$currentDate` | Set to current date | `{ $currentDate: { lastLogin: true } }` |

#### 2. Array Update Operators

| Operator | Description | Syntax Example |
|----------|-------------|----------------|
| `$push` | Add item to array | `{ $push: { scores: 89 } }` |
| `$pop` | Remove first (-1) or last (1) item | `{ $pop: { scores: 1 } }` |
| `$pull` | Remove matching items | `{ $pull: { votes: { $lt: 5 } } }` |
| `$addToSet` | Add if not exists | `{ $addToSet: { tags: "gadget" } }` |

---

## Querying & Projection

### Filter vs Projection

```javascript
db.collection.find(
  { /* FILTER - WHERE clause */ },
  { /* PROJECTION - SELECT clause */ }
);
```

**Filter**: What documents to retrieve (WHERE condition)  
**Projection**: What fields to display (SELECT fields)

### Projection Examples

```javascript
// Include specific fields (1 = include, 0 = exclude)
db.instructors.find(
  { salary: { $gt: 4000 } },
  { firstName: 1, salary: 1, _id: 0 }  // Show firstName & salary, hide _id
);

// Exclude specific fields
db.instructors.find(
  {},
  { password: 0, secretKey: 0 }  // Hide sensitive fields
);

// Nested field projection (dot notation)
db.instructors.find(
  { "fullAddress.city": "cairo" },
  { firstName: 1, "fullAddress.city": 1 }
);
```

### Query Examples

```javascript
// Find with comparison
db.instructors.find({ age: { $lte: 25 } });

// Find with logical operators
db.instructors.find({
  "fullAddress.city": "mansoura",
  $or: [
    { "fullAddress.street": 10 },
    { "fullAddress.street": 14 }
  ]
});

// Find documents with both courses (AND logic)
db.instructors.find({
  $and: [
    { courses: "js" },
    { courses: "jquery" }
  ]
});

// Find by array size
db.instructors.find({ courses: { $size: 5 } });
```

---

## Write Concerns

Write concerns determine the level of acknowledgment MongoDB requires for write operations.

### Three Factors

#### 1. Who Factor (`w`)
- **`w: 1`** (default): Acknowledge from primary node only
- **`w: "majority"`**: Acknowledge from majority of nodes in replica set
- Ensures data is recorded to specified number of nodes

#### 2. Journal Factor (`j`)
- **`j: true`**: Wait until data is written to journal (disk)
- **`j: false`** (default): Don't wait for journal
- Provides durability guarantee

#### 3. Patience Factor (`wtimeout`)
- **`wtimeout: <milliseconds>`**: Maximum time to wait for acknowledgment
- **`wtimeout: 0`** (default): No timeout (wait indefinitely)
- Prevents infinite waiting

### Write Concern Example

```javascript
db.student.insertOne(
  { Name: "John", Marks: 420 },
  {
    writeConcern: {
      w: 1,           // Acknowledge from primary
      j: true,        // Wait for journal
      wtimeout: 5000  // Timeout after 5 seconds
    }
  }
);
```

### Use Cases

| Scenario | Recommended Write Concern |
|----------|---------------------------|
| **High performance, data loss acceptable** | `{ w: 1, j: false }` |
| **Balanced** | `{ w: 1, j: true }` (default recommended) |
| **Critical data, replica set** | `{ w: "majority", j: true, wtimeout: 5000 }` |
| **Maximum durability** | `{ w: "majority", j: true }` |

---

## Array Filters

Array filters allow you to update specific array elements that match conditions.

### Using `$[identifier]` Syntax

The `$[identifier]` syntax is a placeholder that gets defined in the `arrayFilters` option.

### Example Problem

**Document Structure**:
```javascript
{
  _id: 1,
  name: "Student 1",
  grades: [
    { subject: "Maths", score: 70 },
    { subject: "Science", score: 85 },
    { subject: "English", score: 90 }
  ]
}
```

**Task**: Update Maths score to 85

### Solution

```javascript
db.students.updateOne(
  { _id: 1 },                                    // Filter: Find student
  { $set: { "grades.$[elem].score": 85 } },      // Update: Set score using placeholder
  {
    arrayFilters: [
      { "elem.subject": "Maths" }                // Define: elem matches Maths
    ]
  }
);
```

### Step-by-Step Explanation

1. **Filter document**: `{ _id: 1 }` finds the student
2. **Use placeholder**: `$[elem]` represents array elements to update
3. **Define placeholder**: `arrayFilters` specifies which elements `elem` refers to
4. **Update matched elements**: Only elements where `subject: "Maths"` get updated

### More Examples

```javascript
// Update course "EF" to "jquery" for specific instructor
db.instructors.updateOne(
  { firstName: "mazen", lastName: "mohammed" },
  { $set: { "courses.$[course]": "jquery" } },
  { arrayFilters: [{ "course": "EF" }] }
);

// Increment scores > 80 by 5 points
db.students.updateOne(
  { _id: 1 },
  { $inc: { "grades.$[elem].score": 5 } },
  { arrayFilters: [{ "elem.score": { $gt: 80 } }] }
);
```

### Common Mistakes ❌

```javascript
// ❌ Wrong: Trying to use index directly
{ $set: { "grades[0].score": 85 } }

// ❌ Wrong: Not defining arrayFilters
{ $set: { "grades.$[elem].score": 85 } }  // Without arrayFilters option

// ❌ Wrong: Using dot notation without array filter
{ $set: { "grades.score": 85 } }  // Updates all or none
```

---

## Cursors

A **cursor** is an object reference that points to the result set of a query. It allows you to iterate through documents one by one.

### Creating Cursors

```javascript
// Creates cursor and displays output
db.instructors.find();

// Creates cursor reference only (no output)
let cursor = db.instructors.find();
```

### Iterating Through Cursors

#### 1. Display All at Once
```javascript
let cursor = db.instructors.find();
cursor;  // Displays documents
```

#### 2. Next Method
```javascript
let cursor = db.instructors.find();
cursor.next();  // Returns first document
cursor.next();  // Returns second document
// Continue until null (cursor exhausted)
```

#### 3. forEach Loop
```javascript
let cursor = db.instructors.find();
cursor.forEach((doc) => print(doc.firstName));
```

#### 4. Convert to Array
```javascript
// Method 1
let cursor = db.instructors.find();
let arr = cursor.toArray();
arr[0];  // Access by index

// Method 2
let cursor = db.instructors.find().toArray();
let firstDoc = cursor[0];
```

### Cursor Methods

```javascript
// Count documents
cursor.count();  // Behavior changed in MongoDB v4.4+

// Size (respects limit and skip)
cursor.size();

// Limit results
db.instructors.find().limit(10);

// Sort results (1 = ascending, -1 = descending)
db.instructors.find().sort({ _id: 1 });

// Skip documents
cursor.skip(1);  // Skip first document

// Check if cursor is closed
cursor.isClosed();  // Returns true/false
```

### Cursor Behavior Notes

- **Incremental**: Cursor position advances with each operation
- **Expires**: Once cursor reaches the end, it becomes null/exhausted
- **One-time use**: After iterating through, create a new cursor to iterate again

### Count Behavior Change (v4.4+)

```javascript
// Old behavior (pre v4.4): Returns total count ignoring limit
db.instructors.find().limit(10).count();  // Returned total (e.g., 12)

// New behavior (v4.4+): Respects limit
db.instructors.find().limit(10).count();  // Returns 10 (respects limit)

// To get total count regardless of limit, use countDocuments()
db.instructors.countDocuments();
```

### Chaining Cursor Methods

```javascript
// Sort, limit, and skip
db.instructors.find()
  .sort({ firstName: 1, lastName: -1 })
  .skip(5)
  .limit(10)
  .forEach((doc) => print(doc.firstName));
```

### Practical Example

```javascript
// Count courses for each instructor
let cursor = db.instructors.find();
cursor.forEach((doc) => {
  print(doc.firstName + " has " + doc.courses.length + " courses");
});
```

---

## Capped Collections

**Capped collections** are fixed-size collections that maintain insertion order and automatically overwrite old documents when the size limit is reached.

### Key Characteristics

- **Fixed size**: Maximum size defined at creation
- **Circular buffer**: Operates like a FIFO (First In, First Out) queue
- **Insertion order preserved**: Documents maintain insertion sequence
- **Automatic overwrite**: Oldest documents deleted when limit reached
- **No deletion**: Cannot delete individual documents from capped collections
- **High performance**: Optimized for high-throughput operations

### Behavior

```
[Doc1] → [Doc2] → [Doc3] → [Doc4] → [Doc5]
                                      ↓ (at max capacity)
[Doc6] → [Doc2] → [Doc3] → [Doc4] → [Doc5]
         ↑ (Doc1 overwritten)
```

### Common Use Cases

- **Logs**: Application logs, access logs
- **Oplog**: MongoDB replication operation log
- **Cache**: Temporary data storage
- **Event streams**: Real-time event data
- **Metrics**: Performance metrics, monitoring data

### Creating Capped Collections

```javascript
// Create capped collection
db.createCollection("logs", {
  capped: true,
  size: 10240,      // Size in bytes (required)
  max: 1000         // Maximum number of documents (optional)
});
```

### Important Notes

⚠️ **Cannot delete from capped collections**:
```javascript
db.logs.deleteOne({ _id: 1 });  // ❌ Error: Cannot delete from capped collection
db.logs.deleteMany({});         // ❌ Error: Cannot delete from capped collection
```

✅ **To clear capped collection**: Drop and recreate
```javascript
db.logs.drop();
db.createCollection("logs", { capped: true, size: 10240 });
```

---

## Best Practices

### Query Optimization

1. **Test filters before deletion**
   ```javascript
   // Always test with find() first
   db.collection.find({ status: "inactive" });
   // Then delete
   db.collection.deleteMany({ status: "inactive" });
   ```

2. **Use indexes for large datasets**
   ```javascript
   // Create index on frequently queried fields
   db.collection.createIndex({ email: 1 });
   ```

3. **Use projection to limit returned data**
   ```javascript
   // Only return needed fields
   db.collection.find({}, { name: 1, email: 1, _id: 0 });
   ```

### Update Best Practices

1. **Use specific operators**
   ```javascript
   // ✅ Good: Use $inc for numbers
   db.collection.updateOne({ _id: 1 }, { $inc: { views: 1 } });
   
   // ❌ Bad: Manual calculation
   // Requires read, calculate, write
   ```

2. **Use upsert for insert-or-update logic**
   ```javascript
   db.collection.updateOne(
     { email: "user@example.com" },
     { $set: { lastLogin: new Date() } },
     { upsert: true }
   );
   ```

3. **Use arrayFilters for complex array updates**
   ```javascript
   // Update specific array elements
   db.collection.updateOne(
     { _id: 1 },
     { $set: { "items.$[elem].status": "shipped" } },
     { arrayFilters: [{ "elem.orderId": 123 }] }
   );
   ```

### Schema Design

1. **Embed vs Reference**
   - **Embed**: Data accessed together (1-to-few relationship)
   - **Reference**: Data accessed separately or large arrays (1-to-many)

2. **Avoid deeply nested documents**
   - Keep nesting to 2-3 levels maximum
   - Use references for deeper relationships

3. **Use consistent field names**
   - `firstName` not `first_name` or `fName`
   - Choose a convention and stick to it

### Security

1. **Create users with appropriate permissions**
   ```javascript
   db.createUser({
     user: "appUser",
     pwd: "securePassword",
     roles: [{ role: "readWrite", db: "myDatabase" }]
   });
   ```

2. **Never expose connection strings in code**
   - Use environment variables
   - Use secrets management

3. **Validate input before queries**
   - Prevent injection attacks
   - Sanitize user input

### Performance

1. **Monitor slow queries**
   ```javascript
   // Enable profiling
   db.setProfilingLevel(1, { slowms: 100 });
   
   // View slow queries
   db.system.profile.find().sort({ ts: -1 }).limit(5);
   ```

2. **Use explain() to analyze queries**
   ```javascript
   db.collection.find({ age: { $gt: 25 } }).explain("executionStats");
   ```

3. **Batch operations when possible**
   ```javascript
   // Better: One bulk operation
   db.collection.bulkWrite([
     { insertOne: { document: { name: "A" } } },
     { insertOne: { document: { name: "B" } } },
     { insertOne: { document: { name: "C" } } }
   ]);
   
   // Worse: Multiple individual operations
   ```

---

## Quick Reference Commands

### Database Operations
```javascript
show dbs;                          // List databases
use dbName;                        // Switch/create database
db;                                // Current database
db.dropDatabase();                 // Delete database
```

### Collection Operations
```javascript
show collections;                  // List collections
db.createCollection("name");       // Create collection
db.collectionName.drop();          // Delete collection
```

### CRUD Summary
```javascript
// Create
db.coll.insertOne({ doc });
db.coll.insertMany([{ doc1 }, { doc2 }]);

// Read
db.coll.find({ filter }, { projection });
db.coll.findOne({ filter });

// Update
db.coll.updateOne({ filter }, { $set: { field: value } });
db.coll.updateMany({ filter }, { update });
db.coll.replaceOne({ filter }, { newDoc });

// Delete
db.coll.deleteOne({ filter });
db.coll.deleteMany({ filter });
```

### User Management
```javascript
show users;                        // List users
db.createUser({ user, pwd, roles }); // Create user
db.dropUser("username");           // Delete user
```

---

## Common Patterns & Examples

### Count Documents with Condition
```javascript
db.instructors.find({ age: { $gt: 25 } }).count();
db.instructors.countDocuments({ active: true });
```

### Update Nested Fields
```javascript
// Dot notation for nested objects
db.instructors.updateOne(
  { firstName: "noha" },
  { $set: { "address.street": 20 } }
);
```

### Add to Array
```javascript
// Add course to instructor
db.instructors.updateOne(
  { firstName: "noha", lastName: "hesham" },
  { $push: { courses: "jquery" } }
);
```

### Remove from Array
```javascript
// Remove specific course
db.instructors.updateOne(
  { firstName: "mazen" },
  { $pull: { courses: "EF" } }
);
```

### Rename Field
```javascript
// Rename field for all documents
db.instructors.updateMany(
  {},
  { $rename: { "address": "fullAddress" } }
);
```

### Decrease Values
```javascript
// Decrease salary by 500 for instructors with 3 courses
db.instructors.updateMany(
  { courses: { $size: 3 } },
  { $inc: { salary: -500 } }
);
```

### Complex Query with Sort
```javascript
// Find instructors with firstName and lastName, sort by name
db.instructors.find({
  firstName: { $exists: true },
  lastName: { $exists: true }
})
.sort({ firstName: 1, lastName: -1 })
.forEach((doc) => {
  print("FullName: " + doc.firstName + " " + doc.lastName + ", Age: " + doc.age);
});
```

---

## Error Handling

### Common Errors

```javascript
// Duplicate key error
// MongoServerError: E11000 duplicate key error collection: db.collection index: _id_ dup key: { _id: 22 }

// Missing required argument
// MongoshInvalidInputError: Missing required argument at position 0

// Invalid array format
// MongoInvalidArgumentError: Argument "docs" must be an array of documents
```

### Error Prevention

1. **Check for duplicates before insert**
   ```javascript
   if (!db.collection.findOne({ _id: 22 })) {
     db.collection.insertOne({ _id: 22, name: "Test" });
   }
   ```

2. **Validate array format**
   ```javascript
   // ✅ Correct
   db.collection.insertMany([{ doc1 }, { doc2 }]);
   
   // ❌ Wrong
   db.collection.insertMany({ doc1 }, { doc2 });
   ```

3. **Provide required arguments**
   ```javascript
   // ✅ Correct
   db.collection.deleteOne({ _id: 1 });
   
   // ❌ Wrong
   db.collection.deleteOne();
   ```

---

## Summary

### Key Takeaways

✅ **MongoDB is schema-less**: Flexible document structure  
✅ **BSON format**: Binary JSON with extended data types  
✅ **Write concerns**: Control acknowledgment and durability  
✅ **Powerful operators**: Rich query and update capabilities  
✅ **Cursors**: Efficient iteration through results  
✅ **Array filters**: Precise array element updates  
✅ **Capped collections**: Fixed-size, high-performance collections  

### Next Steps

1. Practice CRUD operations on sample data
2. Experiment with different operators
3. Learn about indexes for query optimization
4. Explore aggregation framework
5. Study replica sets and sharding for scaling

---

**Happy Learning! 🚀**