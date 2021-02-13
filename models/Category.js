const mongoose = require('mongoose')
const CategorySchema= mongoose.Schema({
    name:String
});
CategorySchema.add({
    subCategory:[CategorySchema]
})
module.exports.Schema=CategorySchema;
module.exports.Category = mongoose.model('Category', CategorySchema);