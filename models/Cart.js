const mongoose = require('mongoose');
const Address = require('./Address').Schema;
const Location = require('./Location').Schema;
const Customer = require('./Customer').Schema;
const Product = require('./Product').Schema;
const CartSchema = mongoose.Schema({
    customer:String,
    product:[Product],
    location:Location,
    totalPrice:Number,
    promoCode:String,
    billingAddress:Address,
    deliveryAddress:Address
})
module.exports.Schema = CartSchema;
module.exports.Cart = mongoose.model('Cart',CartSchema);