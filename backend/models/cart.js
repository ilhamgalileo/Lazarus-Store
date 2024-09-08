const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
    productId :{type :mongoose.Schema.Types.ObjectId, ref: 'Product', require: true },
    quantity :{type :Number, require: true}
}]
},
{
    timestamps: true
})
schema.method("toJSON", function(){
    const {__v,_id,...object} = this.toObject()
    object.id= _id
    return object
})
const Cart = mongoose.model("Cart", schema)
module.exports = Cart 
// module.exports = mongoose.model('cart', cartSchema)