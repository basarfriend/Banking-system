const express = require('express');
const router = express.Router();
const path =require('path')
const fs=require('fs')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
router.use(cookieParser())
router.use(express.json())
router.use(express.urlencoded({extended:true}))
router.use(express.static(path.join(__dirname, "../public")));
const usermodel = require('../model/usermodel');
upload=require('../config/multerConfig')

router.get("/:userId",isUser,async(req,res)=>{
    let user=await usermodel.findOne({_id:req.params.userId})
    res.render("userProfile",{user})
})

// update profile picture
router.post("/:userId/picture/update",isUser,upload.single('image'),async(req,res)=>{
       let user=await usermodel.findOne({_id:req.params.userId})
       const filePath = path.resolve(__dirname, '..', 'public', 'images', user.profilepic);
       await usermodel.findByIdAndUpdate(req.params.userId, 
               {
                    $set: {
                        profilepic:req.file.filename,
                    }
                },
                { new: true, runValidators: true }
            );
        fs.unlinkSync(filePath)
        res.redirect(`/login/profile/id/${user._id}`)
    })
// authorization
function isUser(req,res,next) {
    if (req.cookies.token ==="") {
        res.send("Authorization denied")
    }
    else{
        let data=jwt.verify(req.cookies.token,"BSandox")
        req.user=data
    }
    next()
}
module.exports=router;