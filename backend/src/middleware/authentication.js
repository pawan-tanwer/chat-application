const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

 const isLogin = async(req, res, next) => {
    try {
        // middleware/auth.middleware.js
        const token = req.cookies.token;
        if (!token) return res.status(500).send({ success: false, message: "User Unauthorize" });
        const decode = jwt.verify(token,process.env.SECRET_KEY);
        if(!decode)  return res.status(500).send({success:false, message:"User Unauthorize -Invalid Token"})
        const user = await userModel.findById(decode.userId).select("-password");
        if(!user) return res.status(500).send({success:false, message:"User not found"})
        req.user = user,
        next()
    } catch (error) {
        console.log(`error in isLogin middleware ${error.message}`);
        res.status(500).send({
            success: false,
            message: error
        })
    }
}

module.exports={isLogin}