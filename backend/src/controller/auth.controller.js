const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  const { fullName, userName, email, gender, password, profilePic } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ message: "User already exist With this email" });
  }

  const hashPassword = bcrypt.hashSync(password, 10);
  const profile =
    profilePic ||
    ` https://api.dicebear.com/9.x/adventurer/svg?seed=${userName}`;

  const newUser = await userModel.create({
    fullName,
    userName,
    email,
    password: hashPassword,
    profilePic: profile,
    gender,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });

  res.cookie("token", token);

  res.status(201).json({
    success: true,
    message: "User Register Successfully",
    user: {
      fullName: newUser.fullName,
      userName: newUser.userName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    },
  });
};

const userLogin = async (req, res) => {
  const { password, email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const comparePass = bcrypt.compareSync(password, user.password);

  if (!comparePass) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 din
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Login Sucessfully",
    user: {
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      gender: user.gender,
    },
  });
};

const userLogout = async (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(200).send({ success: true, message: "User LogOut" });
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
};
