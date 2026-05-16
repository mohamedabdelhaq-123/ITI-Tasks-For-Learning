const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { createProduct, getAvailableProducts } = require('../services/productService');

let mongoServer;

// Start the in-memory instance once before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Wipe the collection after every test so each test starts clean
afterEach(async () => {
  await Product.deleteMany({});
});

// Disconnect and shut down the server after all tests finish
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('createProduct', () => {

  test('creates and returns a product with correct fields and inStock defaulting to true', async () => {
    const product = await createProduct({ name: 'Keyboard', slug: 'keyboard', price: 99 });

    expect(product.name).toBe('Keyboard');
    expect(product.slug).toBe('keyboard');
    expect(product.inStock).toBe(true);
  });

  test('throws Slug already in use when the slug is a duplicate', async () => {
    await Product.create({ name: 'Keyboard', slug: 'keyboard', price: 99 });

    await expect(createProduct({ name: 'Other', slug: 'keyboard', price: 49 }))
      .rejects.toThrow('Slug already in use');
  });

  test('throws a Mongoose ValidationError when price is negative (min: 0)', async () => {
    await expect(createProduct({ name: 'Keyboard', slug: 'keyboard', price: -1 }))
      .rejects.toThrow('min');
  });

});

describe('getAvailableProducts', () => {

  test('returns only products where inStock is true and excludes out-of-stock ones', async () => {
    await Product.create({ name: 'Keyboard', slug: 'keyboard', price: 99, inStock: true });
    await Product.create({ name: 'Mouse', slug: 'mouse', price: 29, inStock: false });

    const products = await getAvailableProducts();

    expect(products).toHaveLength(1);
    expect(products[0].slug).toBe('keyboard');
  });

});
