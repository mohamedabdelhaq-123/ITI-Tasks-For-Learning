const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/users', routes.userRoutes);
app.use('/products', routes.productRoutes);

app.get('/', (req, res) => {
  res.send('Inventory App is running');
});

const MONGO_URI = 'mongodb://127.0.0.1:27017/inventoryDB';

async function startServer() {
  await mongoose.connect(MONGO_URI);
  app.listen(3003, () => {
    console.log(`Server running on http://localhost:3003`);
  });
}

startServer();
