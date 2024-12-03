const conversation = require("../../controller/chat/ConversationController");
const express = require("express");
const router = express.Router();
const { AuthorizeUser, FindUser } = require("../../middleware/auth");


// Get or create a conversation
router.post("/CreateorGetconversations", AuthorizeUser("user" , "admin") ,conversation.createOrGetConversation);

// Create a new message in a conversation
router.post("/CreateMessages", AuthorizeUser("user" , "admin") , conversation.createMessage);

// Fetch all conversations for the sidebar
router.get("/GetAllConversations", AuthorizeUser("user" , "admin") ,conversation.fetchConversationsForSidebar);

// Fetch all messages for a specific conversation
router.get("/FetchAllMessages/:conversationId/messages", AuthorizeUser("user" , "admin") , conversation.fetchMessagesByConversation);
// Fetch all messages for a specific conversation to the sidebar
router.get("/sidebar", AuthorizeUser("user" , "admin") ,conversation.getChatParticipants);



module.exports = router;