const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    "username":String,
    "email":String,
    "password":String,
    "phone":Number,
    "cart":[],
    "order":[],
    "location":[{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'location'
        }],
    "profilepic":{
        type:String,
        default:"default.png"
    }
})
module.exports=mongoose.model("user",userSchema)