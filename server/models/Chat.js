const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  isGroupChat: {
    type: Boolean,
    default: false
  },
  chatName: {
    type: String,
    trim: true
  },
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Chat", chatSchema);
