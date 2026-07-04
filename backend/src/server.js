require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {app,server,io} = require("./socket/socket.js")
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true,   // aapka frontend port
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// connection mongo db
const connectDb = require("./config/db");
connectDb();

//routes
const authRoute = require("./routes/auth.routes.js");
const messageRoute = require("./routes/message.router.js");
const userRouter = require("./routes/user.router.js");
app.use("/chat",authRoute);
app.use("/chat/message",messageRoute);
app.use("/api/user",userRouter);

app.get("/",(req,res)=>{
    res.send("chatApplication")
})

server.listen(process.env.PORT||8000,()=>console.log(`server is start at ${process.env.PORT}`));