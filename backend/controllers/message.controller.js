import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";


export const sendMessage = async (req, res) => {
    try {
        const {message} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, recieverId]
            }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId],

            })
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        // add socket.io functionality here

        //will run in parallel
        await Promise.all([newMessage.save(), conversation.save()]);

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error)
        res.status(500).json({error: "Internal server error"});
    }
};

export const getMessages = async (req, res) => {

    try {
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, userToChatId]
            },
        }).populate("messages");
        // not reference but actual messages

        const messages = conversation.messages;

        if(!conversation){
            return res.status(200).json(messages);
        }

        res.status(200).json(conversation.messages);

    } catch (error) {
        console.log("Error in getMessage controller: ", error)
        res.status(500).json({error: "Internal server error"});
    }
};