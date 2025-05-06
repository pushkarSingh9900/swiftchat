const mongoose = require('mongoose');
const express = require('express');
const { createChat, getChats } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');



const router = express.Router();

// Create a new chat
router.post('/', createChat);

// Get all chats for current user
router.get('/', protect, getChats);

// 🔍 Search for users by email (excluding self)
router.get('/search', protect, async (req, res) => {
  try {
    const keyword = req.query.email;

    if (!keyword) {
      return res.status(400).json({ message: 'No search query provided' });
    }
    console.log("Searching for email:", keyword);
    console.log("Excluding user ID:", req.user._id);

    const users = await User.find({
      email: { $regex: keyword, $options: 'i' },
      _id: { $ne: new mongoose.Types.ObjectId(req.user._id) }
    });

    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;
