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
const ownermodel=require('../model/ownermodel');
const usermodel=require('../model/usermodel')
const productmodel = require('../model/productmodel');
env=require('dotenv').config()

// owner route
router.get('/',(req,res)=>{
        if (req.cookies.ownerToken) {
            let data=jwt.verify(req.cookies.ownerToken,process.env.secret)
            if (data) {
                res.redirect(`/admin/dashboard/${data.token}`)
            }
            else{
                res.render("popup", {
                    title: "Something Went Wrong!",
                    message: "plese delete the cookies of this site then come again",
                    buttonText: "Go to homepage",
                    buttonUrl: "/admin"
                });
            }
        } else {
            res.render("owner")
        } 
})  
// owner dashboard route
router.get('/dashboard/:id',isOwner,async(req,res)=>{
    let owner=await ownermodel.findOne({_id:req.params.id})
    let productId=owner.products
    let products= await Promise.all(productId.map(async(id)=>{
        let product=await productmodel.findOne({_id:id})
        return product
    }))
    res.render('ownerdashbord',{owner:owner,products:products})
})

// signup
router.post('/create/account',async(req,res)=>{
    let {username,email,password,phone,gstin}=req.body
    let userCopy=await ownermodel.findOne({email})
    if (userCopy) {
    res.render("popup", {
    title: "Something Went Wrong!",
    message: "May be you already exist .",
    buttonText: "Go to homepage",
    buttonUrl: "/admin"
});
    } else {
    bcrypt.genSalt(10,function (err,salt) {
        if (err) {
            res.send('404 error')
        }
        else{
            bcrypt.hash(password,salt,async function(err,hash){
                if (err) {
                    res.send('404 error')
                } else {
                 let user=await ownermodel.create({
                        username,email,password:hash,phone,gstin
                    })
                 res.render("popup", {
                title: "Account Created",
                message: "Congratulation account added to our database",
                buttonText: "Go to homepage",
                buttonUrl: "/admin"
             });          
                }
            })
        }
                })
            }
    })

// owner signin
router.post('/login',async (req,res) => {
    let {email,password}=req.body
    let owner=await ownermodel.findOne({email})
    if (owner) {
        bcrypt.compare(password,owner.password,function (err,result) {
            if (result) {
                let token=jwt.sign({"token":owner._id},process.env.secret)
                res.cookie("ownerToken",token)
                res.redirect(`/admin/dashboard/${owner._id}`)
            } else {
                    res.render("popup", {
                    title: "Something Went Wrong!",
                    message: "Your email or password is wrong .",
                    buttonText: "Go to homepage",
                    buttonUrl: "/admin"
});
            }
        })
    } else {
          res.render("popup", {
        title: "Something Went Wrong!",
        message: "Your email or password is wrong .",
        buttonText: "Go to homepage",
        buttonUrl: "/admin"
});
    }
})
// Delete all products of owner
router.post('/dashboard/:id/allProduct/delete',isOwner,async(req,res)=>{
    let ownerId=req.params.id
    let owner=await ownermodel.findOne({_id:ownerId})
    let productsIds=owner.products
    await Promise.all(productsIds.map(async(e)=>{
        let product=await productmodel.findOne({_id:e})
        // removing cart of deleted item
        await usermodel.updateMany(
                    { cart: product._id },
                    { $pull: { cart:product._id } } 
                );
        // delete product picture from productimage folder
        const filePath = `public\\productImage\\${product.image}`;
        fs.unlinkSync(filePath)
        await productmodel.findOneAndDelete({_id:e})
    }))
    owner.products=[]
    await owner.save()
    res.redirect(`/admin`)
})
// logout
router.post('/:id/logout', isOwner, async (req, res) => {
    try {
        res.clearCookie("ownerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });
        
        // 3. Respond with redirect or status
        return res.redirect("/admin");
    } catch (err) {
        return res.status(500).send("Logout failed");
    }
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