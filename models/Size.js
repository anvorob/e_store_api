const mongoose = require('mongoose');
const SizeSchema = mongoose.Schema({
    size:{
        type:Number
    },
    type:{
        type:String,
        enum:["UK","US","EU","US WOMENS","US MENS"]
    },
    isAvailable:{
        type:Boolean,
        default: true
    }
})
module.exports.Schema=SizeSchema;
module.exports.Size = mongoose.model('Size', SizeSchema);