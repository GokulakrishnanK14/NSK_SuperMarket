var mongoose = require('mongoose');
const schema = mongoose.Schema;

const cartSchema = schema({
    userId : 
    {
        type : schema.Types.ObjectId,
        ref  : 'User'
    },
    cartItems :
    [   
        {
        p_id :
            {
                type : schema.Types.ObjectId,
                ref  : 'Product'
            },
        p_title       : String,
        p_generalName : String,
        p_price       : String,
        p_description : String,
        p_brand       : String,
        p_category    : String,
        p_subCategory : String,
        p_img         : String,
        p_quantity    : String,
        p_stock       : String,
        p_req_quan    :
        {
            type : String,
            default : '1'
        }
    }
    ]
})

module.exports = mongoose.model('Cart',cartSchema);