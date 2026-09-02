const express = require('express');
const router = express.Router();
const { getConversations, getMessages, createOrGetConversation } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getConversations)
  .post(createOrGetConversation);

router.route('/:conversationId')
  .get(getMessages);

module.exports = router;
