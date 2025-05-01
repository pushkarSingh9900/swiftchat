const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.sendMessage = async (req, res) => {
  const { senderId, content, chatId } = req.body;

  if (!content || !chatId || !senderId) {
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
    res.status(500).json({ message: "Message send failed" });
  }
};
