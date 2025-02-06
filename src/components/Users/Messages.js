import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import axios from "axios";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import UserPh from "./assets/userph.jpg";
import PinkNavigationBar from "./PinkNavigationBar";

const Messages = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState(null); // Set senderId dynamically
  const receiverId = "670a04a34f63c22acf3d8c9a"; // Admin's ID

  // Get senderId from JWT Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setSenderId(decodedToken.id); // Set senderId from token
    }
  }, []);

  // Fetch messages on component mount
  useEffect(() => {
    if (senderId) {
      fetchMessages();
    }
  }, [senderId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/messages/${senderId}/${receiverId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post("http://localhost:8000/api/messages/send", {
        senderId,
        receiverId,
        message,
      });
      setMessage("");
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getLastMessage = () => {
    if (messages.length === 0) return "No messages yet";
    const lastMessage = messages[messages.length - 1];
    return lastMessage.senderId === senderId
      ? `You: ${lastMessage.message}`
      : `Admin: ${lastMessage.message}`;
  };

  return (
    <div className="box">
      <div className="navbar2">
        <PinkNavigationBar />
      </div>
      <div className="mesxbox3">
        <div className="meschat-container">
          <div className="meschat-sidebar">
            <div className="meschat-header">Messages</div>
            <div className="meschat-list">
              <div className="mesactive-chat-item">
                <Image src={UserPh} roundedCircle className="meschat-item-img" />
                <div className="meschat-item-content">
                  <div className="meschat-item-name">Admin</div>
                  <div className="meschat-item-message">{getLastMessage()}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="meschat-area">
            <div className="meschat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.senderId === senderId ? "mesrecepient" : "messender"}
                >
                  <div className="meschat-message">
                  <Image src={UserPh} roundedCircle className="mesmessage-img" />
                    <div className="mesmessage-text">{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="meschat-input">
              <input
                type="text"
                placeholder="Type your message"
                className="meschatinp"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button className="mescsend-button" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
