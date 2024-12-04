const mongoose = require("mongoose");
const Conversation = require("../../model/chat/ConversationModel");
const Messsage = require("../../model/chat/MesssageModel");






const createOrGetConversation = async (req, res) => {
    try {
        const { receiver, listing } = req.body;
        const senderId = req.user._id;

        if (!senderId || !receiver || !listing) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiver] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiver],
                listing: [listing],
            });
            await conversation.save();
        } else if (!conversation.listing.includes(listing)) {
            conversation.listing.push(listing);
            await conversation.save();
        }

        const participants = await Conversation.aggregate([
            { $match: { _id: conversation._id } },
            { $unwind: "$participants" },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    user: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        imageUrl: 1,
                    },
                },
            },
        ]);

        // const messages = await Messsage.find({ conversation: conversation._id }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            message: "Conversation retrieved/created successfully",
            data: {
                conversation,
                participants: participants.map((p) => p.user),
                // messages,
            },
        });

        return conversation;

    } catch (error) {
        console.error("Error creating/getting conversation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getChatParticipants = async (req, res) => {
    try {
        const userId = req.user._id;

        const participants = await Conversation.aggregate([
            {
                $match: {
                    participants: new mongoose.Types.ObjectId(userId),
                },
            },
            { $unwind: "$participants" },
            {
                $match: {
                    participants: { $ne: new mongoose.Types.ObjectId(userId) },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    user: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        imageUrl: 1,
                    },
                },
            },
        ]);

        res.status(200).json({ success: true, participants });
    } catch (error) {
        console.error("Error fetching participants:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



const createOrGetConversations = async(receiver,listing , senderId ,  )=>{
    try {
        // const { receiver, listing } = req.body;
        // const senderId = req.user._id;

        
        console.log("listing", listing);
        console.log("receiver", receiver);
        console.log("senderId", senderId);

        if (!senderId || !receiver || !listing) {
            return { error: "All fields are required" };
        }


        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiver] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiver],
                listing: [listing],
            });
            await conversation.save();
        } else if (!conversation.listing.includes(listing)) {
            conversation.listing.push(listing);
            await conversation.save();
        }

        const participants = await Conversation.aggregate([
            { $match: { _id: conversation._id } },
            { $unwind: "$participants" },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    user: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        imageUrl: 1,
                    },
                },
            },
        ]);

        // const messages = await Messsage.find({ conversation: conversation._id }).sort({ createdAt: 1 });

        // res.status(200).json({
        //     success: true,
        //     message: "Conversation retrieved/created successfully",
        //     data: {
        //         conversation,
        //         participants: participants.map((p) => p.user),
        //         // messages,
        //     },
        // });

            return {
                conversation,
                participants: participants.map((p) => p.user),
            };

    } catch (error) {
        console.error("Error creating/getting conversation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const createMessage = async (req, res) => {
        try {
            const { message, listing } = req.body;
            
            
            const senderId = req.user._id;
            const receiver = req.body.receiver;

            const conversationData = await createOrGetConversations(receiver , listing , senderId);
            console.log("conversationData", conversationData);
  

            const conversationId = conversationData.conversation._id;
            console.log("conversationId", conversationId);

            if (!conversationId || !message || !listing || !senderId || !receiver) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Ensure the conversation exists
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // Create the message
        const newMessage = new Messsage({
            sender: senderId,
            receiver,
            conversation: conversationId,
            listing,
            message,
        });

        await newMessage.save();

        // Update the conversation's `updatedAt` timestamp
        conversation.updatedAt = new Date();
        await conversation.save();

        res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("Error creating message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



const fetchConversationsForSidebarOld = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
        })
            .sort({ updatedAt: -1 })
            .populate("participants", "name imageUrl")
            .populate("listing", "title image");

        if (!conversations.length) {
            return res.status(200).json({ message: "No conversations found.", data: [] });
        }

        res.status(200).json({ success: true, data: conversations });
    } catch (error) {
        console.error("Error fetching sidebar conversations:", error);
        return res.status(500).json({ error: "Failed to fetch conversations." });
    }
};




  const fetchConversationsForSidebar = async (req, res) => {
      try {
          const userId = req.user._id;

          const conversations = await Conversation.aggregate([
              {
                  $match: {
                      participants: new mongoose.Types.ObjectId(userId),
                  },
              },
              { $unwind: "$participants" },
              {
                  $match: {
                      participants: { $ne: new mongoose.Types.ObjectId(userId) },
                  },
              },
              {
                  $lookup: {
                      from: "users",
                      localField: "participants",
                      foreignField: "_id",
                      as: "user"
                  },
              },
              {
                  $lookup: {
                      from: "rentalitems",
                      localField: "listing",
                      foreignField: "_id",
                      as: "listing"
                  },
              },
              { $unwind: "$user" },
              {
                  $project: {
                      user: {
                          _id: 1,
                          name: 1,
                          email: 1,
                          imageUrl: 1,
                      },
                      listing: {
                          _id: 1,
                          title: 1,
                          image: 1
                      },
                      createdAt: 1,
                      updatedAt: 1
                  },
              },
              {
                  $group: {
                      _id: "$_id",
                      participants: { $push: "$user" },
                      listing: { $first: "$listing" },
                      createdAt: { $first: "$createdAt" },
                      updatedAt: { $first: "$updatedAt" }
                  }
              }
          ]);

          res.status(200).json({ success: true, data: conversations });
      } catch (error) {
          console.error("Error fetching sidebar conversations:", error);
          return res.status(500).json({ error: "Failed to fetch conversations." });
      }
  };

const fetchMessagesByConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id; 

        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID is required" });
        }

        // Verify if the user is a participant in the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ error: "You are not authorized to view this conversation" });
        }

        // Fetch all messages for this conversation
        const messages = await Messsage.find({ conversation: conversationId })
            .sort({ createdAt: 1 }) // Sort messages in chronological order
            .populate("sender", "name imageUrl") // Include sender details
            .populate("receiver", "name imageUrl") // Include receiver details
            .populate("listing", "title image"); // Include listing details if needed

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ error: "Failed to fetch messages." });
    }
};





module.exports = {
    createOrGetConversation,
    createMessage,
    fetchConversationsForSidebar,
    fetchConversationsForSidebarOld,
    fetchMessagesByConversation,
    getChatParticipants
};

// const fetchMessagesByConversation = async (req, res) => {
//     try {
//         const { conversationId } = req.params;

//         if (!conversationId) {
//             return res.status(400).json({ error: "Conversation ID is required" });
//         }

//         const messages = await Messsage.find({ conversation: conversationId })
//             .sort({ createdAt: 1 })

//             .populate("sender", "name imageUrl")
            
//             .populate("receiver", "name imageUrl")
//             .populate("listing", "title image");

//         if (!messages.length) {
//             return res.status(200).json({ message: "No messages found.", data: [] });
//         }

//         res.status(200).json({ success: true, data: messages });
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//         return res.status(500).json({ error: "Failed to fetch messages." });
//     }
// };



// const createOrGetConversation = async (req, res) => {
//     try {
//         const { receiver, listing } = req.body;
//         const senderId = req.user._id;
//         console.log("Data For Comments sender id is", senderId);
//         console.log(req.body);


//         if (!senderId || !receiver || !listing) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // Check if a conversation already exists between these participants for the given listing
//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiver] }, // Match both participants
//             // listing,
//         });

//         console.log("Conversation is here avalible already", conversation);
//         if (!conversation) {
//             conversation = new Conversation({
//                 participants: [senderId, receiver],
//                 listing: [listing],
//             });

//             await conversation.save();
//         } else if (!conversation.listing.includes(listing)) {
//             // Add the listing to the existing conversation if it's not already included
//             conversation.listing.push(listing);
//             await conversation.save();
//         }

//         res.status(200).json({
//             success: true,
//             message: "Conversation retrieved/created successfully",
//             data: conversation,
//         });
//     } catch (error) {
//         console.error("Error creating/getting conversation:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };
