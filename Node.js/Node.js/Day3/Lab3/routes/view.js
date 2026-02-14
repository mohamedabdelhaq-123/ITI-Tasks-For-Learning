const express = require('express');

const router = express.Router();

const fs = require('node:fs');
const path = require('node:path');

const inventoryPath = path.join(__dirname, '..', 'inventory.json');

router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));
  res.render('products', {products});
});

module.exports = router;
