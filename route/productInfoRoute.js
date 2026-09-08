const express = require('express');
const router = express.Router();
const path =require('path')
const fs=require('fs')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
router.use(express.json())
router.use(express.urlencoded({extended:true}))
router.use(express.static(path.join(__dirname, "../public")));
const ownermodel=require('../model/ownermodel');
const productmodel = require('../model/productmodel');
const usermodel = require('../model/usermodel');
env=require('dotenv').config()

router.get('/:ownerid/:id/info',isOwner,async(req,res)=>{
    let ownerid = req.params.ownerid;
    let productid = req.params.id;
    let product = await productmodel.findOne({_id:productid});
    let owner = await ownermodel.findOne({_id:ownerid});
    res.render('productInfo',{product:product,owner:owner})
})
// delete product
router.post('/Side/products/delete/:id',isOwner,async(req,res)=>{
    let productid = req.params.id;
    let product = await productmodel.findOne({_id:productid});
    await usermodel.updateMany(
            { cart: product._id },
            { $pull: { cart:product._id } } 
        );
    const filePath = `public\\productImage\\${product.image}`;
    fs.unlinkSync(filePath)
    await productmodel.findOneAndDelete({_id:productid})
    await ownermodel.findByIdAndUpdate(product.admin, {
        $pull: { products: productid }
    });
    res.redirect(`/admin/dashboard/${product.admin}`)
})
// edit product
router.post('/side/product/edit/:id',isOwner,async(req,res)=>{
    let productid = req.params.id;
    let {price,discount,stocks} = req.body;
    let product = await productmodel.findOneAndUpdate({_id:productid}, {
        price,
        discount,
        stocks
    });
    res.redirect(`/admin/dashboard/${product.admin}`)
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