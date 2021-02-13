const mongoose = require('mongoose');
const Product = require('./Product').Schema;
const Address = require('./Address').Schema;
const OrderSchema = mongoose.Schema({
    reference:String,
    customer:String,
    date:Date,
    products:[Product],
    totalPrice:Number,
    deliveryAddress:Address,
    billingAddress:Address
})
module.exports.Schema = OrderSchema;
module.exports.Order = mongoose.model('Order',OrderSchema)