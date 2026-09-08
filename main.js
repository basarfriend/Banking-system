const express=require('express')
const app=express()
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config()
const db=require('./config/mongoose-connection')
// Routes
const userroute=require('./route/userRoute')
const ownerRoute=require('./route/ownerRoute')
const productCreateRoute=require('./route/productCreateRoute')
const productInfoRoute=require('./route/productInfoRoute')
const ownerProfileRoute=require('./route/ownerProfileRoute')
const productOverviewRoute=require('./route/productOverviewRoute')
const userProfileRoute=require('./route/userProfileRoute')
const userProfileSettingRoute=require('./route/userProfileSettingRoute')
const productHandleByUserRoute=require('./route/productHandleByuserRoute')

app.use('/',userroute)
app.use('/admin',ownerRoute)
app.use('/owner/:id/productsCreate',productCreateRoute)
app.use('/admin',productInfoRoute)
app.use('/admin/dashboard',ownerProfileRoute)
app.use('/login/product',productOverviewRoute)
app.use('/login/profile/id',userProfileRoute)
app.use('/login/profile/id',userProfileSettingRoute)
app.use('/',productHandleByUserRoute)
// live
app.listen(process.env.PORT)