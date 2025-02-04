// controllers/messageController.js
const Message = require("../models/messageModel");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Save the message to the database
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Fetch messages between the sender and receiver
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};