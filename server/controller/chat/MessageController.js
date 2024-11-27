// const Message = require("../../model/chat/messageModel")
// const User = require("../../model/user/userModel")
// const mongoose = require("mongoose");








// // exports.CreateMessages = async (req, res) => {
// //     const { ownerId, message, listing, receiver } = req.body; 
// //     console.log('Received body:', req.body);

// //     const id = req.user._id; 
// //     console.log("Data For Comments sender id is", id);

// //     // if (!id || !ownerId || !message || !listing) {
// //     //     return res.status(400).json({ error: "All fields are required" });
// //     // }

// //     const sender = id;
// //     // If replyTo is not provided, receiver should be the owner
// //     console.log("sender is ", sender);
// //     // const receiverId = replyTo ? ownerId : receiver ; // Check if you need logic for a different receiver

// //     console.log("Data for chats are", sender, receiver, message, listing);

// //     try {
// //         const newMessage = new Message({
// //             sender,
// //             receiver,
// //             message,
// //             listing,
// //         });

// //         await newMessage.save();
// //         return res.status(200).json({ message: "Message sent successfully" });
// //     } catch (error) {
// //         console.error('Error saving message:', error);
// //         return res.status(500).json({ error: 'Server error while saving message' });
// //     }
// // };




// exports.checkloggeduser = async (req, res) => {
//     try {
//         const id = req.user._id;
//         console.log("Data For Comments sender id is ", id);
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" })
//         }
//         res.status(200).json({ user })
//     } catch (error) {
//         console.error("Error fetching user:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }


// // exports.getMessages = async (req, res) => {
// //     try {
// //         const { sender, receiver, listing } = req.query;
// //         console.log(req.query);
// //         const messages = await Message.find({
// //             $or: [
// //                 { sender, receiver, listing },
// //                 { sender: receiver, receiver: sender, listing }
// //             ]
// //         }).sort({ createdAt: 1 });

// //         return res.status(200).json(messages);
// //     } catch (error) {
// //         return res.status(500).json({ error: "Error retrieving messages" });
// //     }
// // }


// // exports.CreateMessages = async (req, res) => {
// //     const { sender, ownerId, message, listing } = req.body
// //     console.log(req.body);

// //     if (!sender || !ownerId || !message || !listing) {
// //         return res.status(400).json({ error: "All fields are required" })
// //     }
// //     const newMessage = new Message({
// //         sender: ownerId,
// //         receiver: sender,
// //         message,
// //         listing
// //     })
// //     await newMessage.save()
// //     return res.status(200).json({ message: "Message sent successfully" })
// // }

// // exports.getMessages = async (req, res) => {
// //     try {
// //         const { listing } = req.query;
// //         console.log(req.query);
// //         const messages = await Message.find({
// //             listing,
// //             $or: [
// //                 { sender: req.query.sender, receiver: req.query.receiver },
// //                 { sender: req.query.receiver, receiver: req.query.sender }
// //             ]
// //         }).sort({ createdAt: 1 });

// //         return res.status(200).json(messages);
// //     } catch (error) {
// //         return res.status(500).json({ error: "Error retrieving messages" });
// //     }
// // }

// //latest
// // exports.getMessages = async (req, res) => {
// //     try {
// //         const { listing, sender, receiver } = req.query;
// //         console.log(req.query);
// //         const messages = await Message.find({
// //             listing,
// //             $or: [
// //                 { sender, receiver },
// //                 { sender: receiver, receiver: sender }
// //             ]
// //         }).sort({ createdAt: 1 });

// //         const replies = await Message.find({
// //             listing,
// //             replyTo: { $exists: true, $ne: null }
// //         }).sort({ createdAt: 1 });

// //         const allMessages = messages.concat(replies);
// //         allMessages.sort((a, b) => a.createdAt - b.createdAt);

// //         return res.status(200).json(allMessages);
// //     } catch (error) {
// //         return res.status(500).json({ error: "Error retrieving messages" });
// //     }
// // }



// //new\-one
// // exports.getMessages = async (req, res) => {
// //     console.log(req.params);
// //     console.log(req.body);
// //     const { otherUserId, listingId } = req.params;
// //     const userId = req.body.userId;
// //     // const  otherUserId =  "670e21628426323ce4847a99" ;
// //     // const listingId  = "6717e21f92f7deab36bfdcf2";
// //     // const userId = req.user._id;
// // //  const userId = "67190918ef0a307e1e499b6f";

// //     console.log(req.params);
// //     try {
// //         const messages = await Message.find({
// //             $or: [
// //                 { sender: userId, receiver: otherUserId },
// //                 { sender: otherUserId, receiver: userId },
// //             ],
// //             listing: listingId,
// //         })
// //             .sort({ createdAt: 1 }) // Sort by timestamp
// //             .populate('sender', 'name email')
// //             .populate('receiver', 'name email');

// //         return res.status(200).json({ messages });
// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).json({ error: 'Failed to fetch messages' });
// //     }
// // };


// // exports.getChatParticipants = async (req, res) => {
// //     const userId = req.user._id; // Extracted from middleware

// //     try {
// //         const participants = await Message.aggregate([
// //             {
// //                 $match: {
// //                     $or: [
// //                         { sender: userId },
// //                         { receiver: userId },
// //                     ],
// //                 },
// //             },
// //             {
// //                 $group: {
// //                     _id: {
// //                         $cond: {
// //                             if: { $eq: ['$sender', userId] },
// //                             then: '$receiver',
// //                             else: '$sender',
// //                         },
// //                     },
// //                 },
// //             },
// //             {
// //                 $lookup: {
// //                     from: 'users',
// //                     localField: '_id',
// //                     foreignField: '_id',
// //                     as: 'user',
// //                 },
// //             },
// //             {
// //                 $unwind: '$user',
// //             },
// //             {
// //                 $project: {
// //                     _id: 0,
// //                     user: {
// //                         _id: 1,
// //                         name: 1,
// //                         email: 1,
// //                     },
// //                 },
// //             },
// //         ]);

// //         return res.status(200).json({ participants });
// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).json({ error: 'Failed to fetch chat participants' });
// //     }
// // };





























// // exports.getChatParticipants = async (req, res) => {
// //     // console.log(req.body);
// //     try {
// //         const id = req.user._id;
// //         const userId = id;
// //         console.log(userId);
// //         // const userId = "67190918ef0a307e1e499b6f";
// //         // const userId = "670e21628426323ce4847a99";

// //         // Find all messages where the user is either the sender or receiver
// //         const messages = await Message.find({
// //             chatWithUsers: userId
// //         }).populate('chatWithUsers', 'name imageUrl'); // Populate to get the user's name and avatar

// //         // Get unique chat participants (users)
// //         const participants = messages.reduce((acc, message) => {
// //             message.chatWithUsers.forEach((user) => {
// //                 if (user._id.toString() !== userId.toString() && !acc.some((u) => u._id.toString() === user._id.toString())) {
// //                     acc.push(user); // Add user to participants if not already included
// //                 }
// //             });
// //             return acc;
// //         }, []);

// //         return res.status(200).json({ participants });
// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).json({ error: 'Server error' });
// //     }
// // };





// // exports.CreateMessages = async (req, res) => {
// //     try {
// //         console.log(req.body);
// //         const { ownerId,
// //             message,
// //             listing: listingId,
// //             receiver: receiverId,
// //             senderId } = req.body;

// //         const newMessage = new Message({
// //             sender: senderId,
// //             receiver: receiverId,
// //             message,
// //             listing: listingId || null
// //         })
// //         if (!newMessage.chatWithUsers) {
// //             newMessage.chatWithUsers = [];
// //         }
// //         if (senderId && !newMessage.chatWithUsers.includes(senderId)) {
// //             newMessage.chatWithUsers.push(senderId);
// //         }
// //         if (receiverId && !newMessage.chatWithUsers.includes(receiverId)) {
// //             newMessage.chatWithUsers.push(receiverId);
// //         }

// //         // Save the message
// //         await newMessage.save();
// //         return res.status(200).json({ message: "Message sent successfully" });
// //     } catch (error) {
// //         console.log(error);
// //         return res.status(500).json({ error: "Error sending message" });
// //     }
// // };























// exports.getMessages = async (req, res) => {
//     try {
//         const { listingId, receiverId  } = req.params;
//         const userId = req.user._id;
//         console.log("params from get messages",req.params);
//         console.log("loogeed user id in getmessages" ,  userId); 

//         console.log("Listing ID:", listingId);
//         console.log("Other User ID:", receiverId);
//         console.log("User ID:", userId);

//         const messages = await Message.find({
//             listing: listingId,
//             $or: [
//                 { sender: userId, receiver: receiverId },
//                 { sender: receiverId, receiver: userId },
//             ],
//         })
//             .sort({ createdAt: 1 })
//             .populate('sender', 'name email')
//             .populate('receiver', 'name email');

//         return res.status(200).json({ success: true, messages });
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//         return res.status(500).json({ error: "Failed to fetch messages" });
//     }
// };


// // for html
// // exports.getMessages = async (req, res) => {   
// //     try {
// //         const { listingId, receiverId , userId } = req.params;
// //         // const userId = req.query.userId; // Get logged user ID from query

// //         console.log("Listing ID:", listingId);
// //         console.log("Other User ID:", receiverId);
// //         console.log("User ID:", userId);

// //         const messages = await Message.find({
// //             listing: listingId,
// //             $or: [
// //                 { sender: userId, receiver: receiverId },
// //                 { sender: receiverId, receiver: userId },
// //             ],
// //         })
// //             .sort({ createdAt: 1 })
// //             .populate('sender', 'name email')
// //             .populate('receiver', 'name email');

// //         return res.status(200).json({ success: true, messages });
// //     } catch (error) {
// //         console.error("Error fetching messages:", error);
// //         return res.status(500).json({ error: "Failed to fetch messages" });
// //     }
// // };







// exports.CreateMessages = async (req, res) => {
//     try {
//         const {  receiver, message, listing } = req.body;

//         const  userId = req.user._id;
//         const senderId = userId;
//         console.log("datat recieved", req.body);
//         console.log("user id in create message", userId);
//         // Validate input
//         if (!senderId || !receiver || !message || !listing) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         const newMessage = new Message({
//             sender: senderId,
//             receiver,
//             message,
//             listing,
//             chatWithUsers: [senderId, receiver], // Initialize with both users
//         });

//         // Save the message
//         await newMessage.save();
//         return res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
//     } catch (error) {
//         console.error("Error creating message:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };












// exports.getChatParticipants = async (req, res) => {
//     try {
//         const userId = req.user._id; 
//         console.log("Logged in user ID:", userId);

//         const participants = await Message.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { sender: new mongoose.Types.ObjectId(userId) },
//                         { receiver: new mongoose.Types.ObjectId(userId) },
//                     ],
//                 },
//             },
//             {
//                 $group: {
//                     _id: {
//                         $cond: [
//                             { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
//                             "$receiver",
//                             "$sender",
//                         ],
//                     },
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "users", // MongoDB collection name for User model
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "user",
//                 },
//             },
//             { $unwind: "$user" },
//             {
//                 $project: {
//                     _id: 0, // Exclude the aggregation's _id field
//                     user: {
//                         _id: 1,
//                         name: 1,
//                         email: 1,
//                         imageUrl: 1, // Include avatar if available
//                     },
//                 },
//             },
//         ]);

//         return res.status(200).json({ success: true, participants });
//     } catch (error) {
//         console.error("Error fetching participants:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };