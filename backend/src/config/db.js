const mongoose = require("mongoose")

async function connectDb() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("dataBase is connected"))
    .catch((err)=>console.log("dataBase is failed to connect"));
}


module.exports= connectDb;