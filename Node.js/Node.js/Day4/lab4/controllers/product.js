const {Product} = require('../models');

async function createProduct(req, res) {
  try {
    const {name, quantity, categories, owner} = req.body;

    const newProduct = new Product({
      owner, // user id to make relation btw user and product
      name,
      quantity,
      categories
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

async function getProducts(req, res) {
  try {
    const limit = Number.parseInt(req.query.limit) || 10; // defaults
    const skip = Number.parseInt(req.query.skip) || 0;
    const status = req.query.status; // if not provided so undef.

    let products = await Product.find()
      .skip(skip) // skip first n
      .limit(limit); // limit after skipping

    if (status) { // optional
      products = products.filter((product) => product.status === status);
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

async function getProductsByUser(req, res) { // /users/:userId/products
  try {
    const {userId} = req.params;

    const products = await Product.find({owner: userId});

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

async function updateProduct(req, res) { // PATCH /products/:id/stock
  try {
    const {id} = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      {new: true, runValidators: true}
    );

    if (!updatedProduct) {
      return res.status(404).json({error: 'Product not found'});
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

async function updateStock(req, res) {
  try {
    const {id} = req.params;
    const {operation, quantity} = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({error: 'Product not found'});
    }

    if (operation === 'restock') {
      product.quantity += quantity;
    } else if (operation === 'destock') {
      product.quantity -= quantity;
      if (product.quantity < 0) {
        product.quantity = 0;
      }
    } else {
      return res.status(400).json({
        error: 'Invalid operation'
      });
    }

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

async function deleteProduct(req, res) { // /products/:id
  try {
    const {id} = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({error: 'Product not found'});
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductsByUser,
  updateProduct,
  updateStock,
  deleteProduct
};
