const express = require('express');
const {productController} = require('../controllers');

const router = express.Router();

router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.patch('/:id/stock', productController.updateStock);

module.exports = router;
