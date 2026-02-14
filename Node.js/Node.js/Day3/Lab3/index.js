const express = require('express');

const app = express();

const routes = require('./routes'); // get the index file (main route) from routes dir

app.set('view engine', 'pug'); // use pug to render html
app.set('views', './views'); // need templates to render is in here

app.use(express.static('public')); // handle showing the images without accsesing url and route and so on

app.use(express.json());

app.use(routes);

app.use((req, res) => {
  res.sendStatus(404); // Not found by default
});
// if didn't match any routes

app.listen(5555, () => console.log('server is Up'));
