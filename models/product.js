var mongoose = require('mongoose');
const schema = mongoose.Schema;

const pdtSchema = new schema({
    title       : String,
    generalName : String,
    price       : String,
    description : String,
    brand       : String,
    category    : String,
    subCategory : String,
    img         : String,
    quantity    : String,
    stock       : String

})


module.exports = mongoose.model('Product',pdtSchema);
