const express = require('express');
const { createChat, getChats } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createChat);
router.get('/', protect, getChats);

module.exports = router;
