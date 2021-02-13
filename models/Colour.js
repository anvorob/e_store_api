const mongoose = require('mongoose');
const ColourSchema = mongoose.Schema({
    name:String,
    sample:String,
    isAvailable:Boolean
})
module.exports.Schema = ColourSchema;
module.exports.Colour= mongoose.model('Colour',ColourSchema);