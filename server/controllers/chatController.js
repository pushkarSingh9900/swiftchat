const Chat = require('../models/Chat');
const User = require('../models/User');

exports.createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).send("User ID is required");

  try {
    // Check if chat already exists
    let existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.body.userId, req.body.currentUserId] }
    }).populate("users", "-password");

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create new chat
    const newChat = await Chat.create({
      users: [req.body.currentUserId, req.body.userId]
    });

    const fullChat = await newChat.populate("users", "-password");
    res.status(201).json(fullChat);
  } catch (err) {
    res.status(500).json({ message: "Failed to create chat" });
  }
};
