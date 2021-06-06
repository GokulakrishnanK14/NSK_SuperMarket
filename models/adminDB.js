var mongoose = require('mongoose');
const schema = mongoose.Schema;

const adminSchema = new schema({

    orderList:
    [
        {
            userName   : String, 
            order_status : String,
            pdtInOrder :
            [
                {

                    p_title    : String,
                    p_price    : String,
                    p_req_quan : String,
                    date :{
                        type : Date,
                        default : Date.now
                    }
                }
            ]
        }
    ]
});

module.exports = mongoose.model('AdminDB',adminSchema);