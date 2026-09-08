const express = require('express');
const router = express.Router();
const path =require('path')
const fs=require('fs')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const productmodel = require('../model/productmodel');
const usermodel = require('../model/usermodel');
const { default: mongoose } = require('mongoose');
const userLocationmodel = require('../model/userLocationmodel');
router.use(express.json())
router.use(express.urlencoded({extended:true}))
router.use(express.static(path.join(__dirname, "../public")));
// adding cart
router.post('/login/:userid/product/:productid/addToCart',async (req,res) => {
    let product=await productmodel.findOne({_id:req.params.productid})
    let user=await usermodel.findOne({_id:req.params.userid})
    const userId=req.params.userid
    user.cart.push(product._id)
    await user.save()
    return res.send(`
            <script>
                alert("addad to cart");
                window.location.href = "/login/product/${userId}"; // Alert ke baad redirect URL
            </script>
        `);
})
// renderin cart
router.get('/login/:userid/cart',async (req,res) => {
    let user=await usermodel.findOne({_id:req.params.userid})
    let cartItemIds=user.cart
    let cartItems=await Promise.all(cartItemIds.map(async (id) => {
        let cart=await productmodel.findOne({_id:id})
        return cart
    }))
    res.render('cart',{cartItems,user})
})
// remove cart
router.post('/:userid/remove/cart/:productid/',async (req,res) => {
    let userId=req.params.userid
    let productid=req.params.productid 
    let objectProductId = new mongoose.Types.ObjectId(productid);
    await usermodel.findByIdAndUpdate(userId, {
            $pull: { cart: objectProductId} 
        });
    res.redirect(`/login/${req.params.userid}/cart`)
})

// buying product page rander
router.post('/login/:userid/product/:productid/buyPage',async (req,res) => {
    let user=await usermodel.findOne({_id:req.params.userid})
    let product=await productmodel.findOne({_id:req.params.productid})
    let locationsId=user.location
    let locations=await Promise.all(locationsId.map(async (e) => {
        let location =await userLocationmodel.findOne({_id:e})
        return location
    }))
    let productsId=req.params.productid
    res.render("buyPage",{product,user,locations,productsId})
})
// payment confirmation
router.post('/login/:userid/product/:productid/:paid/done',async (req,res) => {
    let user=await usermodel.findOne({_id:req.params.userid})
    let productsIdStr=req.params.productid
    let productsId = productsIdStr.replace(/[\[\]]/g, '').split(',');
    let location=await userLocationmodel.findOne({_id:req.body.locate})
    if (location) {
        let order=await Promise.all(productsId.map(async (id) => {
            let product=await productmodel.findOne({_id:id})
            await productmodel.findByIdAndUpdate(id, {stocks:product.stocks-1
            });
            const discountAmount = (product.price * product.discount) / 100;
            let data= {
                "product":product.name,
                "productId":product._id,
                "id":"#"+product._id,
                "paid":product.price-discountAmount,
                "location":location
            }
            return data
        }))
        order.forEach(async (e) => {
            user.order.push(e)
        })
        await user.save()
        res.redirect(`/login/${user._id}/order`)
    }
    else{
        res.render("popup", {
                    title: "Order failed",
                    message: `hey ${user.username} Please provide us location`,
                    buttonText: "Add address",
                    buttonUrl: `/login/profile/id/${user._id}/setting`
                });  
    }
})

//rendering my cart for buy
router.post('/login/:id/buyCart',async (req,res) => {
    let user=await usermodel.findOne({_id:req.params.id})
    let cartItemIds=user.cart
    let cartItems=await Promise.all(cartItemIds.map(async (id) => {
        let cart=await productmodel.findOne({_id:id})
        return cart
    }))
    let locationsId=user.location
    let locations=await Promise.all(locationsId.map(async (e) => {
        let location =await userLocationmodel.findOne({_id:e})
        return location
    }))
    res.render("buyPage",{product:cartItems,user,locations,productsId:cartItemIds})
}) 

// rendering my order
router.get('/login/:id/order',async (req,res) => {
    let user=await usermodel.findOne({_id:req.params.id})
    let orders=user.order
    res.render('myOrders',{orders,user})
})
module.exports=router