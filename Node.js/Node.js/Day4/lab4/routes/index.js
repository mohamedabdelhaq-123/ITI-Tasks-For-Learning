const express = require('express');

const router = express.Router();
const productRoutes = require('./product');
const userRoutes = require('./user');

router.use('./users', userRoutes);
router.use('./product', productRoutes);

module.exports = {
  userRoutes,
  productRoutes
};
