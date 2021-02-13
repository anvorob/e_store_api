const mongoose = require('mongoose');
const Product = require('./Product').Schema;
const FavoriteSchema = mongoose.Schema({
    customer:String,
    products:[Product]
})
module.exports.Schema=FavoriteSchema;
module.exports.Favorite = mongoose.model('Favorite', FavoriteSchema);