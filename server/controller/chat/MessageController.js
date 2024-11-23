const Message = require("../../model/chat/messageModel")
const User = require("../../model/user/userModel")
exports.CreateMessages = async (req, res) => {
    const { ownerId, message, listing, receiver } = req.body; 
    console.log('Received body:', req.body);

    const id = req.user._id; 
    console.log("Data For Comments sender id is", id);

    // if (!id || !ownerId || !message || !listing) {
    //     return res.status(400).json({ error: "All fields are required" });
    // }

    const sender = id;
    // If replyTo is not provided, receiver should be the owner
    console.log("sender is ", sender);
    // const receiverId = replyTo ? ownerId : receiver ; // Check if you need logic for a different receiver

    console.log("Data for chats are", sender, receiver, message, listing);

    try {
        const newMessage = new Message({
            sender,
            receiver,
            message,
            listing,
        });

        await newMessage.save();
        return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({ error: 'Server error while saving message' });
    }
};




exports.checkloggeduser = async(req,res)=>{
    try {
        const id = req.user._id;
        console.log("Data For Comments sender id is " , id);
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({user})
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// exports.getMessages = async (req, res) => {
//     try {
//         const { sender, receiver, listing } = req.query;
//         console.log(req.query);
//         const messages = await Message.find({
//             $or: [
//                 { sender, receiver, listing },
//                 { sender: receiver, receiver: sender, listing }
//             ]
//         }).sort({ createdAt: 1 });
        
//         return res.status(200).json(messages);
//     } catch (error) {
//         return res.status(500).json({ error: "Error retrieving messages" });
//     }
// }


// exports.CreateMessages = async (req, res) => {
//     const { sender, ownerId, message, listing } = req.body
//     console.log(req.body);

//     if (!sender || !ownerId || !message || !listing) {
//         return res.status(400).json({ error: "All fields are required" })
//     }
//     const newMessage = new Message({
//         sender: ownerId,
//         receiver: sender,
//         message,
//         listing
//     })
//     await newMessage.save()
//     return res.status(200).json({ message: "Message sent successfully" })
// }

// exports.getMessages = async (req, res) => {
//     try {
//         const { listing } = req.query;
//         console.log(req.query);
//         const messages = await Message.find({
//             listing,
//             $or: [
//                 { sender: req.query.sender, receiver: req.query.receiver },
//                 { sender: req.query.receiver, receiver: req.query.sender }
//             ]
//         }).sort({ createdAt: 1 });
        
//         return res.status(200).json(messages);
//     } catch (error) {
//         return res.status(500).json({ error: "Error retrieving messages" });
//     }
// }

//latest
// exports.getMessages = async (req, res) => {
//     try {
//         const { listing, sender, receiver } = req.query;
//         console.log(req.query);
//         const messages = await Message.find({
//             listing,
//             $or: [
//                 { sender, receiver },
//                 { sender: receiver, receiver: sender }
//             ]
//         }).sort({ createdAt: 1 });
        
//         const replies = await Message.find({
//             listing,
//             replyTo: { $exists: true, $ne: null }
//         }).sort({ createdAt: 1 });
        
//         const allMessages = messages.concat(replies);
//         allMessages.sort((a, b) => a.createdAt - b.createdAt);
        
//         return res.status(200).json(allMessages);
//     } catch (error) {
//         return res.status(500).json({ error: "Error retrieving messages" });
//     }
// }



//new\-one
exports.getMessages = async (req, res) => {
    const { otherUserId, listingId } = req.params;
    const userId = req.user._id;

    console.log(req.params);
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId },
            ],
            listing: listingId,
        })
            .sort({ createdAt: 1 }) // Sort by timestamp
            .populate('sender', 'name email')
            .populate('receiver', 'name email');

        return res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
};


exports.getChatParticipants = async (req, res) => {
    const userId = req.user._id; // Extracted from middleware

    try {
        const participants = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId },
                    ],
                },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$sender', userId] },
                            then: '$receiver',
                            else: '$sender',
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 0,
                    user: {
                        _id: 1,
                        name: 1,
                        email: 1,
                    },
                },
            },
        ]);

        return res.status(200).json({ participants });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch chat participants' });
    }
};