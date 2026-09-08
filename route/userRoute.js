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
const usermodel=require('../model/usermodel')
const upload = require('../config/multerConfig');
const ownermodel = require('../model/ownermodel');
const productmodel = require('../model/productmodel');
env=require('dotenv').config()
// GET /route
router.get('/', (req, res) => {
    if (req.cookies.token) {
        let data=jwt.verify(req.cookies.token,process.env.secret)
        if (data) {
            res.redirect(`/login/product/${data.token}`)
        }
        else{
            res.render("popup", {
                title: "Something Went Wrong!",
                message: "plese delete the cookies of this site then come again",
                buttonText: "Go to homepage",
                buttonUrl: "/"
            });
        }
    } else {
        res.render("index")
    }    
});
// signup
router.post('/create',upload.single('image'),async(req,res)=>{
    let {username,email,password,phone}=req.body
    let fn=req.file.filename
    let userCopy=await usermodel.findOne({email})
    if (userCopy) {
            res.render("popup", {
                title: "Something Went Wrong!",
                message: "May be you already exist .",
                buttonText: "Go to homepage",
                buttonUrl: "/"
            });
        fs.unlinkSync(req.file.path)   
    }
    else{
        bcrypt.genSalt(10,function (err,salt) {
            if (err) {
                res.send('404 error')
            }
            else{
                bcrypt.hash(password,salt,async function(err,hash){
                    if (err) {
                        res.send('404 error')
                    } else {
                        let user=await usermodel.create({
                            username,email,password:hash,phone,profilepic:fn
                        })
                        res.render("popup", {
                        title: "Account Created",
                        message: "GO back and login.",
                        buttonText: "Go to login page",
                        buttonUrl: "/"
                         });
                    }
                })
            }
        })
    }
})
// signin
router.post('/login',async (req,res) => {
  let {email,password}=req.body
  let user=await usermodel.findOne({email})
  if (user) {
    bcrypt.compare(password,user.password,function (err,result) {
        if (result) {
            let token = jwt.sign({ token: user._id }, process.env.secret)
            res.cookie('token',token)
            res.redirect(`/login/product/${user._id}`)
        } else {
            res.render("popup", {
                title: "Something Went Wrong!",
                message: "Email or Password is wrong.",
                buttonText: "Go to homepage",
                buttonUrl: "/"
            });
        }
    })
  } else {
         res.render("popup", {
         title: "Something Went Wrong!",
         message: "Email or Password is wrong.",
         buttonText: "Go to homepage",
         buttonUrl: "/"
            });
  }
})

//product route
router.get('/login/product/:id',isUser,async(req,res)=>{
    let products=await productmodel.find()
    let user=await usermodel.findOne({_id:req.params.id})
    res.render("product",{products:products,user:user})
})
router.post('/login/product/sort/:id',isUser,async(req,res)=>{
    let user=await usermodel.findOne({_id:req.params.id})
    let opt=req.body.sortingOpt
    let products=await productmodel.find()
    if (opt==="low") {
        products.sort((a,b)=> a.price-b.price)
        res.render("product",{products:products,user:user,opt:opt})

    }
    else if (opt==="high") {
        products.sort((a,b)=> b.price-a.price)
        res.render("product",{products:products,user:user,opt:opt})

    }
    else{
        res.render("product",{products:products,user:user,opt:opt})
    }
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
// logout
router.post('/user/:id/logout', isUser, async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "test",
            sameSite: "strict",
            path: "/"
        });

        // 3. Respond with redirect or status
        return res.redirect("/");
    } catch (err) {
        return res.status(500).send("Logout failed");
    }
});
module.exports = router;
