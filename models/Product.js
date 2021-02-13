const mongoose = require('mongoose');
const Size = require('./Size').Schema;
const Brand = require('./Brand').Schema;
const Category = require('./Category').Schema;
const Location = require('./Location').Schema;
const Colour = require('./Colour').Schema;
const Price = require('./Price').Schema;
const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    colour:{
        type:[Colour], //Array of Colour schemas
        required:true
    },
    sizes:{
        type:[Size], //Array of sizes
        required:false
    },
    // brand:{
    //     type:Brand, 
    //     required:false
    // },
    location:{
        type:[Location],
        required:false
    },
    price:Number,
    price_origin:Number,
    currency:String,
    brand:String,
    image:String,
    images:[String],
    brandImage:String,
    sale_percent:Number,
    category:String,
    tag:[String],
    gender:{
        type:String,
        enum:["Male","Felame","Kids"],
        required:false
    },
    image:String,
    shipping: [{}],
    qty:Number
})
module.exports.Schema = ProductSchema;
module.exports.Product= mongoose.model('Product',ProductSchema,'products');