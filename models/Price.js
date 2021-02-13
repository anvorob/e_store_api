const mongoose = require('mongoose');
const PriceSchema = mongoose.Schema({
    price:Number,
    currency:String,
    sign:String
})
module.exports.Schema = PriceSchema;
module.exports.Price= mongoose.model('Price',PriceSchema);