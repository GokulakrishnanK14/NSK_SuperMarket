var mongoose = require('mongoose');
const schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new schema({
    email : {
        type : String,
        required : true
    },
    doorNo : String,
    street : String, 
    area: String, 
    Thanjavur: String, 
    pincode: String, 
    phNum : String,
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
        p_req_quan    : String
    }
    ]   
})





//adds username and pwd field to schema
userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User',userSchema);