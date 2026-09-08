const mongoose=require('mongoose');
const locationSchema=mongoose.Schema({
    "pincode":Number,
    "country":String,
    "state":String,
    "city":String,
    "streetadress":String,
    "user":{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
        }
})
module.exports=mongoose.model("location",locationSchema)