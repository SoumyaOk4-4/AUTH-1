const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://soumya:1234@cluster0.y20d7vp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log('db connected..');
    }).catch((err) => {
        console.log(err);
    });

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        requires: true
    },
    password:{
        type: String,
        requires: true
    },
    token:{
        type: String,
        requires: true
    }
},{timestamps:true});

const userModel = new mongoose.model('auth',userSchema);

module.exports = userModel;