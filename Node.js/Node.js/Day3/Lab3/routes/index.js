const express = require('express');

const router = express.Router(); // Make a router

router.use('/', require('./view'));

router.use('/products', require('./products')); // go to products to check if your crud there or no

module.exports = router; // export to acces in index.js (entry point)
