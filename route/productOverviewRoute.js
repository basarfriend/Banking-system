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
const usermodel=require('../model/usermodel');
const productmodel = require('../model/productmodel');
const ownermodel = require('../model/ownermodel');
env=require('dotenv').config()

router.get("/:userId/:productId",isUser,async(req,res)=>{
    const userId=req.params.userId
    const productId=req.params.productId
    let product=await productmodel.findOne({_id:productId})
    let seller=await ownermodel.findOne({_id:product.admin})
    res.render('productOverview',{product,seller,userId})
})
// authorization
function isUser(req,res,next) {
    if (req.cookies.token ==="") {
        res.send("Authorization denied")
    }
    else{
        let data=jwt.verify(req.cookies.token,process.env.secret)
        req.user=data
    }
    next()
}
module.exports=router;