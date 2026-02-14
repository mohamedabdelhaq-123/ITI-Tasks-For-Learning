const express = require('express');

const router = express.Router();
// console.log("MO");
const fs = require('node:fs');
const path = require('node:path');
const validationMiddleware = require('../controllers'); // file contain only 1 export

const inventoryPath = path.join(__dirname, '..', 'inventory.json'); // , '..',  because the file is at root level

const myData = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8')); // now is string  so convert to obj

// console.log(typeof myData);

router.get('/', (req, res) => {
  // console.log("M33333O");
  res.status(200).json(myData); // send back as json
});

router.get('/:id', (req, res) => {
  const {id} = req.params;
  const idData = myData.find((item) => item.id === Number(id));
  if (typeof idData === 'undefined')
    return res.status(404).json({error: 'Product not Found'});
  else
    res.status(200).json(idData);
});

router.post('/:id/restock/:newIncQuantity', (req, res) => {
  console.log(req.params);
  const {id, newIncQuantity} = req.params;
  const itemRestock = myData.find((item) => item.id === Number(id));

  if (typeof itemRestock === 'undefined')
    return res.status(404).json({error: 'Product not Found'});

  itemRestock.quantity += Number(newIncQuantity);
  fs.writeFileSync(inventoryPath, JSON.stringify(myData));
  res.status(200).json(itemRestock);
});

router.post('/:id/destock/:newDecQuantity', (req, res) => {
  console.log(req.params);
  const {id, newDecQuantity} = req.params;
  const itemDestock = myData.find((item) => item.id === Number(id));

  if (typeof itemDestock === 'undefined')
    return res.status(404).json({error: 'Product not Found'});

  itemDestock.quantity -= Number(newDecQuantity);

  if (itemDestock.quantity < 0)
    itemDestock.quantity = 0;

  fs.writeFileSync(inventoryPath, JSON.stringify(myData));
  res.status(200).json(itemDestock);
});

router.post('/', validationMiddleware, (req, res) => {
  const {body} = req;

  const newId = myData.length > 0 ? Math.max(...myData.map((p) => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    ...body
  };

  myData.push(newProduct);
  fs.writeFileSync(inventoryPath, JSON.stringify(myData, null, 2));

  res.status(201).json(newProduct); // show the new product
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const myNewData = myData.filter(
    (item) => item.id !== Number(id)
  );

  // console.log("MOlenght",myData.length);
  if (myNewData.length === myData.length) {
    res.status(404).json({error: 'Product Not Found'}); // error becase nothing filetered
  } else {
    fs.writeFileSync(inventoryPath, JSON.stringify(myNewData));
    res.status(204).send();
  }
});

router.patch('/:id', validationMiddleware, (req, res) => {
  const {id} = req.params;
  const {body} = req;

  const itemEdit = myData.find((item) => item.id === Number(id));
  if (typeof itemEdit === 'undefined')
    return res.status(404).json({error: 'Product not Found'});

  const itemEditArr = Object.keys(itemEdit);
  const bodyArr = Object.keys(body);

  for (const itemKey of itemEditArr) { // for strict schema
    for (const bodyKey of bodyArr) {
      if (itemKey === bodyKey) {
        itemEdit[itemKey] = body[bodyKey];
      }
    }
  }

  // Object.assign(itemEdit,body) // priorty for req.body schema

  fs.writeFileSync(inventoryPath, JSON.stringify(myData));
  res.status(200).json(itemEdit); // edited item
});

module.exports = router;
