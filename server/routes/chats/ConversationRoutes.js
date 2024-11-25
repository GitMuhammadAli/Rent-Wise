const conversation = require("../../controller/chat/ConversationController");
const express = require("express");
const router = express.Router();


// Get or create a conversation
router.post("/conversations", conversation.createOrGetConversation);

// Create a new message in a conversation
router.post("/messages", conversation.createMessage);

// Fetch all conversations for the sidebar
router.get("/conversations", conversation.fetchConversationsForSidebar);

// Fetch all messages for a specific conversation
router.get("/conversations/:conversationId/messages", conversation.fetchMessagesByConversation);

module.exports = router;