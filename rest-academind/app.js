const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');

app.use('/products'/*filter*/, productRoutes/*handler*/); 
//sets up a middleware
//forward all requests through "/products" (i.e., URL request) to ./api/routes/products(.js) code

module.exports = app; // works with: const app = require('./app');