const Chat = require('../models/Chat');
const User = require('../models/User');

exports.createChat = async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user.id;

  if (!userId) return res.status(400).send("User ID is required");

  try {
    let existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userId, currentUserId] }
    }).populate("users", "-password");

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await Chat.create({
      users: [currentUserId, userId]
    });

    const fullChat = await newChat.populate("users", "-password");
    res.status(201).json(fullChat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ message: "Failed to create chat" });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $in: [req.user.id] } })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name email" }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Failed to load chats" });
  }
};
