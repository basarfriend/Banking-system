const express = require('express');
const router = express.Router();
const ownermodel=require("../model/ownermodel");
const productmodel = require('../model/productmodel');
const jwt= require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt=require('bcrypt')
env=require('dotenv').config()

router.get('/:id/profile',isOwner,async(req,res)=>{
    let owner=await ownermodel.findOne({_id:req.params.id})
    // res.render('ownerProfile',{owner:owner})
    let productsId=owner.products
    let prices=[]
    let stocks=[]
    let products=await Promise.all(productsId.map(async(e)=>{
        let product=await productmodel.findOne({_id:e})
        prices.push(product.price)
        stocks.push(product.stocks)
        return product;
    }))
    const totalProducts=owner.products.length
    const totalStock=stocks.reduce((acc, curr) => acc + curr, 0);
    const totalInventoryValue=prices.reduce((acc, curr) => acc + curr, 0);
    res.render('ownerProfile', { owner: owner, stats: { totalProducts, totalStock, totalInventoryValue }, products: products });
});
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
module.exports = router;