// models/messageModel.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the sender (user or admin)
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the receiver (admin or user)
  message: { type: String, required: true }, // The message content
  timestamp: { type: Date, default: Date.now }, // Timestamp of the message
});

module.exports = mongoose.model("Message", messageSchema);