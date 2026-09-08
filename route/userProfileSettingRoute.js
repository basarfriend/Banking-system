const express = require('express');
const router = express.Router();
const path =require('path')
const fs=require('fs')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const usermodel = require('../model/usermodel');
const locationmodel=require('../model/userLocationmodel')
const upload = require('../config/multerConfig');
const userLocationmodel = require('../model/userLocationmodel');
router.use(cookieParser())
router.use(express.json())
router.use(express.urlencoded({extended:true}))
router.use(express.static(path.join(__dirname, "../public")));

// setting
router.get('/:id/setting',isUser,async(req,res)=>{
    let user=await usermodel.findOne({_id:req.params.id})
    const userLocations=user.location
    let locations=await Promise.all(userLocations.map(async(e)=>{
            let location=await locationmodel.findOne({_id:e})
            return location;
        }))
    res.render("userSetting",{user,locations})
})
// update profile
router.post(('/:id/setting/updateProfile'),isUser,async (req,res) => {
    let {username,email,password}=req.body
    let user=await usermodel.findOne({_id:req.params.id})
       bcrypt.compare(password,user.password,async function (err,result) {
            if (result) {
                await usermodel.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        username,
                        email
                    }
                },
                { new: true, runValidators: true } // 'new: true' returns the updated document
            );
                res.redirect(`/login/profile/id/${user._id}`)
            } else {
                res.render("popup", {
                    title: "Something Went Wrong!",
                    message: "Password is wrong.",
                    buttonText: "Go to homepage",
                    buttonUrl: `/login/profile/id/${user._id}/setting`
                });
            }
        })
})
// update Password
router.post('/:id/setting/updatePassword', isUser, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = await usermodel.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(404).render("popup", {
                title: "Error",
                message: "User not found.",
                buttonText: "Go to homepage",
                buttonUrl: "/"
            });
        }

        // 1. Verify Current Password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.render("popup", {
                title: "Something Went Wrong!",
                message: "Password is wrong.",
                buttonText: "Go to homepage",
                buttonUrl: `/login/profile/id/${user._id}/setting`
            });
        }

        // 2. Verify New Passwords Match
        if (newPassword !== confirmPassword) {
            return res.render("popup", {
                title: "Something Went Wrong!",
                message: "New password and confirm password doesn't match.",
                buttonText: "Go to homepage",
                buttonUrl: `/login/profile/id/${user._id}/setting`
            });
        }

        // 3. Hash the New Password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Update password for the SPECIFIC user ID
        await usermodel.findByIdAndUpdate(req.params.id, { 
            password: hashedPassword 
        });

        console.log('Password updated successfully!');
        res.redirect(`/login/profile/id/${user._id}`);

    } catch (err) {
        console.error("Password update error:", err);
        res.status(500).render("popup", {
            title: "Server Error",
            message: "Something went wrong on the server.",
            buttonText: "Try again",
            buttonUrl: `/login/profile/id/${req.params.id}/setting`
        });
    }
});

// adding location
router.post('/:id/address/upload',isUser,async (req,res) => {
    let{pincode,country,state,city,streetadress}=req.body
    let user=await usermodel.findOne({_id:req.params.id})
    let location=await locationmodel.create({
        pincode,
        country,
        state,
        city,
        streetadress,
        user:user._id
    })
    user.location.push(location._id)
    await user.save()
    res.redirect(`/login/profile/id/${user._id}/setting`)
})

// removing location
router.post('/:id/location/:locationId/remove',isUser,async (req,res) => {
    let location=await userLocationmodel.findOneAndDelete({_id:req.params.locationId})
    await usermodel.findByIdAndUpdate(req.params.id, {
            $pull: { location: req.params.locationId }
        });
    res.redirect(`/login/profile/id/${req.params.id}/setting`);
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