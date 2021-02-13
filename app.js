const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')
const cors = require('cors')
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to Database
mongoose.connect(process.env.DB_CONNECTION,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useFindAndModify:false
    },(err)=>console.log(err));

// Listen to port
app.listen(3001);


//Import Routes
const productsRoute = require('./routes/products');
const coloursRoute = require('./routes/colours');
const sizesRoute = require('./routes/sizes');
const categoriesRoute = require('./routes/categories');
const locationsRoute = require('./routes/locations');
const brandsRoute = require('./routes/brands');
const customersRoute = require('./routes/customers');
const cartRoute = require('./routes/carts');
const favoriteRoute = require('./routes/favorite');
const orderRoute = require('./routes/orders');

// Use imported routing instead of defined route below
app.use('/products',productsRoute); 
app.use('/colours',coloursRoute); 
app.use('/sizes',sizesRoute);
app.use('/categories',categoriesRoute); 
app.use('/locations',locationsRoute); 
app.use('/brands',brandsRoute); 
app.use('/customers',customersRoute);
app.use('/cart',cartRoute);
app.use('/favorite',favoriteRoute);
app.use('/order',orderRoute);
//ROUTES
app.get('/',(req,res)=>{
    res.send('We are at home')
});