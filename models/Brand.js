const mongoose = require('mongoose')
const BrandSchema= mongoose.Schema({
    name:String, 
    image:String,
    category:String
});
module.exports.Schema=BrandSchema;
module.exports.Brand = mongoose.model('Brand', BrandSchema);