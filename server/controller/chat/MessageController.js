const Message = require("../../model/chat/messageModel")

exports.CreateMessages = async (req, res) => {
    const { sender, ownerId, message, listing } = req.body
    console.log(req.body);

    if (!sender || !ownerId || !message || !listing) {
        return res.status(400).json({ error: "All fields are required" })
    }
    const newMessage = new Message({
        sender,
        receiver: ownerId,
        message,
        listing
    })
    await newMessage.save()
    return res.status(200).json({ message: "Message sent successfully" })
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

exports.getMessages = async (req, res) => {
    try {
        const { listing } = req.query;
        console.log(req.query);
        const messages = await Message.find({
            listing,
            $or: [
                { sender: req.query.sender, receiver: req.query.receiver },
                { sender: req.query.receiver, receiver: req.query.sender }
            ]
        }).sort({ createdAt: 1 });
        
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ error: "Error retrieving messages" });
    }
}