const conversationModel = require("../models/conversation.model");
const userModel = require("../models/user.model");

const getUserBySearch =async(req,res)=>{
    try {

        const search = req.query.search || '';  
        const currentUserId = req.user._id;
        const user = await userModel.find({
            $and:[
                {
                    $or:[
                        {userName:{$regex:'.*'+search+'.*',$options:'i'}},
                        {fullName:{$regex:'.*'+search+'.*',$options:'i'}}
                    ]
                },{
                    _id:{$ne:currentUserId}
                }
            ]
        }).select("-password").select("-email");

        if(!user){
            return res.json({success:false,message:"no user found"})
        }

        res.status(200).send(user);
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error
        })
        console.log(error)
    }
}

const getCurrentChatters = async(req,res)=>{
    try {
        const currentUserId = req.user._id;
        const currentChatters = await conversationModel.find({
            participants:currentUserId
        }).sort({
            updatedAt:-1
        });

        if(!currentChatters || currentChatters.length ===0) return res.status(200).send([]);

        const participantsIds = currentChatters.reduce((ids,conversation)=>{
            const otherParticipants= conversation.participants.filter(id=>id !==currentUserId);
            return [...ids, ...otherParticipants];
        },[])

        const otherParticipantsIds = participantsIds.filter(id=>id.toString() !== currentUserId.toString());
        const dbUsers = await userModel.find({_id:{$in:otherParticipantsIds}}).select("-password").select("-email");
        const users = otherParticipantsIds.map(id => dbUsers.find(u => u._id.toString() === id.toString()));

        res.status(200).json({ success: true, users: users });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error
        })
        console.log(error)
    }
}

module.exports={
    getUserBySearch,
    getCurrentChatters
}