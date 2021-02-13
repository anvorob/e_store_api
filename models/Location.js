const mongoose = require('mongoose');
const LocationSchema = mongoose.Schema({
    name:String,
    address:String,
    workHours:String
})
module.exports.Schema=LocationSchema;
module.exports.Location = mongoose.model('Location', LocationSchema);