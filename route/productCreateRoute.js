const express=require('express');
const ownermodel = require('../model/ownermodel');
const productmodel=require('../model/productmodel')
const uploadtwo = require('../config/multerConfig2');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router({mergeParams:true});
env=require('dotenv').config()

router.get('/',isOwner, async(req, res) => {
    let admin =await ownermodel.findOne({_id:req.params.id})
    res.render('productsCreate',{admin:admin});
});
router.post("/done",uploadtwo.single('image'),isOwner,async (req,res) => {
    let admin =await ownermodel.findOne({_id:req.params.id})
    let { name,details,price,discount,panelColor,stocks}=req.body
    let fn=req.file.filename
    let products=await productmodel.create({
        name,details,price,discount,panelColor,image:fn,admin:admin._id,stocks
    })
    admin.products.push(products._id)
    await admin.save()
    res.render("popup", {
    title: "product Created!",
    message: "Your product has been created successfully.",
    buttonText: "Go to homepage",
    buttonUrl: `/admin/dashboard/${admin._id}`
});
})
// authorization
function isOwner(req,res,next) {
    if (req.cookies.ownerToken ==="") {
        res.send("Authorization denied")
    }
    else{
        let data=jwt.verify(req.cookies.ownerToken,process.env.secret)
        req.user=data
    }
    next()
}
module.exports=router