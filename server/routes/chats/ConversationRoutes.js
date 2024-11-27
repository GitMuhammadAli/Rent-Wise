const conversation = require("../../controller/chat/ConversationController");
const express = require("express");
const router = express.Router();


// Get or create a conversation
router.post("/CreateorGetconversations", conversation.createOrGetConversation);

// Create a new message in a conversation
router.post("/CreateMessages", conversation.createMessage);

// Fetch all conversations for the sidebar
router.get("/GetAllConversations", conversation.fetchConversationsForSidebar);

// Fetch all messages for a specific conversation
router.get("/FetchAllMessages/:conversationId/messages", conversation.fetchMessagesByConversation);

module.exports = router;