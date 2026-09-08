const mongoose=require('mongoose');
require('dotenv').config();
// mongoose.connect(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));
module.exports=mongoose.connection