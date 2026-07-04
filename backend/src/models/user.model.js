const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({

    fullName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilePic:{
        type:String,
        required:true,
        default:"",
    }

},{timestamps:true});

const userModel = mongoose.model("user", userSchema);

module.exports= userModel;