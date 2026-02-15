const express = require('express');
const {userController, productController} = require('../controllers');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.delete('/:id', userController.deleteUser);
router.patch('/:id', userController.updateUser);

router.get('/:userId/products', productController.getProductsByUser);

module.exports = router;
