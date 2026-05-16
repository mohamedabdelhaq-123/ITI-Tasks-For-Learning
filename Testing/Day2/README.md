# Unit Testing — Session 2 Exercises

Three exercises covering mocking, async retry logic, and MongoDB with `mongodb-memory-server`.

## Setup

```bash
npm install
```

> **Exercise 03 note:** `mongodb-memory-server` downloads a MongoDB binary on the
> first run (~50 MB). This is a one-time download that gets cached locally.

---

## Run tests

```bash
# All exercises
npm test

# One at a time
npm run test:ex01   # Mocking with side effects
npm run test:ex02   # Async retry logic
npm run test:ex03   # MongoDB with mongodb-memory-server
```

---

## Project structure

```
unit-testing-exercises/
├── package.json
├── jest.config.js
│
├── ex01-mocking/
│   ├── paymentService.js       # external payment (never called in tests)
│   ├── emailService.js         # external email (never called in tests)
│   ├── orderService.js         # ← function under test
│   └── orderService.test.js    # ← your tests
│
├── ex02-retry/
│   ├── apiClient.js            # thin axios wrapper
│   ├── fetchWithRetry.js       # ← function under test
│   └── fetchWithRetry.test.js  # ← your tests
│
└── ex03-mongodb/
    ├── models/
    │   └── Product.js          # Mongoose model
    ├── services/
    │   └── productService.js   # ← functions under test
    └── tests/
        └── productService.test.js  # ← your tests
```

---

## Key concepts per exercise

| Exercise | Concepts |
|----------|----------|
| 01 | `jest.mock()`, `mockResolvedValue`, `toHaveBeenCalledWith`, `not.toHaveBeenCalled`, `beforeEach / clearAllMocks` |
| 02 | Manual mock factory, `mockRejectedValueOnce` chaining, `toHaveBeenCalledTimes` |
| 03 | `MongoMemoryServer`, `beforeAll / afterEach / afterAll`, schema validation errors, `.lean()` |
