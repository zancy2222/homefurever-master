// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const Message = require("../models/messageModel");
const User = require("../models/user_model");
router.get("/users", async (req, res) => {
    try {
        const uniqueSenders = await Message.aggregate([
            { $group: { _id: "$senderId" } }
        ]);

        // Fetch user details for each sender
        const users = await User.find(
            { _id: { $in: uniqueSenders.map(u => u._id) } },
            { _id: 1, p_username: 1, a_username: 1 } // Select relevant fields
        );

        // Format users to include a common `name` field
        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.p_username || user.a_username // Use either field based on role
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Send a message
router.post("/send", messageController.sendMessage);

// Get messages between two users
router.get("/:senderId/:receiverId", messageController.getMessages);

module.exports = router;