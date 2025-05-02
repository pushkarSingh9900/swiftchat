const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const senderId = req.user.id;

  if (!content || !chatId) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    let newMessage = await Message.create({
      sender: senderId,
      content,
      chat: chatId 
    });

    // Optionally: update latestMessage in Chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    newMessage = await newMessage.populate("sender", "name email");
    newMessage = await newMessage.populate("chat");

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Message send error:", err); 
    res.status(500).json({ message: "Message send failed" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email')
      .populate('chat');

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: 'Failed to load messages' });
  }
};
