const mongoose = require('mongoose');
const AddressSchema = mongoose.Schema({
    streetNumber:String,
    companyName:String,
    suburb:String,
    city:String,
    postCode:Number
});
module.exports.Schema = AddressSchema;
module.exports.Address = mongoose.model('Address',AddressSchema);