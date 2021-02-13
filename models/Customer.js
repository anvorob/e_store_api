const mongoose = require('mongoose')
const Address = require('./Address').Schema;
const CustomerSchema= mongoose.Schema({
    name:String, 
    password:String,
    email:String,
    deliveryAddress:[Address],
    billingAddress:[Address],
    lastLoggedIn:Date,
    isLoggedIn:Boolean
});
module.exports.Schema=CustomerSchema;
module.exports.Customer = mongoose.model('Customer', CustomerSchema);