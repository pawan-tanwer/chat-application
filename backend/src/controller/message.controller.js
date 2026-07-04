const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");
const { getReciverSocketId,io } = require("../socket/socket");

const sendMessage = async(req,res)=>{
    try {
        const{message}= req.body;
        const{id:reciverId}= req.params;
        const senderId = req.user._id;

        let chats = await conversationModel.findOne({
            participants:{$all:[senderId,reciverId]}
        })
        if(!chats){
            chats = await conversationModel.create({
                participants:[senderId,reciverId]
            })
        }
        const newMessage = new messageModel({
            senderId,
            reciverId,
            message,
            conversationId:chats._id
        })
        if(newMessage){
            chats.messages.push(newMessage._id)
        }
        await Promise.all([chats.save(),newMessage.save()]);

        // socket.io
        const reciverSocketId = getReciverSocketId(reciverId);
        if(reciverSocketId){
             io.to(reciverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).send(newMessage)

    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error)
    }
}

const getMessage = async(req,res)=>{
    try {

        const{id:reciverId}= req.params;
        const senderId = req.user._id;
        const chats = await conversationModel.findOne({
            participants:{$all:[senderId,reciverId]}
        }).populate("messages")

        if(!chats){
            return res.status(200).send([]);
        }

        const message = chats.messages;
        res.status(200).send(message);
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error)
    }
}

module.exports ={
    sendMessage,
    getMessage
}