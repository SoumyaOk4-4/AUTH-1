const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin:fakeaccount@cluster0.s44nnek.mongodb.net/auth1?retryWrites=true&w=majority")
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