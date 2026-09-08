const mongoose=require('mongoose');
const ownerSchema=mongoose.Schema({
    "username":String,
    "email":String,
    "password":String,
    "phone":Number,
    "products":[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product'
    }],
    "gstin":String,
})
module.exports=mongoose.model("owner",ownerSchema)