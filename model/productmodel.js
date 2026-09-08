const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    "name":String,
    "details":String,
    "price":Number,
    "discount":Number,
    "stocks":Number,
    "admin":{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'owner'
    },
    "panelColor":String,
    "image":String
})
module.exports=mongoose.model("product",productSchema)