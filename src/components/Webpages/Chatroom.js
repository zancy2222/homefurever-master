import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Homepage from "./Homepage";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "./Homepage.css";
import Image from "react-bootstrap/Image";
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import UserPh from "./assets/userph.jpg";
import Attachment from "./assets/attachment.png";
import axios from "axios";

const Chatroom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const adminId = "670a04a34f63c22acf3d8c9a"; // Admin's ID
  const { userId } = useParams(); // Get the user ID from the URL params

  // Fetch messages between the admin and the selected user
  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId]);

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/messages/${userId}/${adminId}`
      );
      setMessages(response.data);
      setSelectedUser(userId);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post("http://localhost:8000/api/messages/send", {
        senderId: adminId,
        receiverId: selectedUser,
        message,
      });
      setMessage("");
      fetchMessages(selectedUser); // Refresh messages after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Mock list of users (replace with actual data from your backend)
  const users = [
    { _id: "670d541f377eee8ae50b2bae", name: "Bipolar" }
  ];

  return (
    <>
      <div className="ulbox">
        <div className="navbox">
          <NavigationBar />
        </div>
        <div className="box2">
          <TaskBar />
          <div className="box3">
            <div className="chat-container">
              <div className="chat-sidebar">
                <div className="chat-header">Messages</div>
                <div className="chat-search">
                  <input type="text" placeholder="Search for people" />
                </div>
                <div className="chat-list">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className={`chat-item ${
                        selectedUser === user._id ? "active-chat-item" : ""
                      }`}
                      onClick={() => fetchMessages(user._id)}
                    >
                      <Image src={UserPh} roundedCircle className="chat-item-img" />
                      <div className="chat-item-content">
                        <div className="chat-item-name">{user.name}</div>
                        <div className="chat-item-message">
                          {messages.length > 0
                            ? messages[messages.length - 1].message
                            : "No messages yet"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chat-area">
                <div className="chat-area-header">
                  <Image src={UserPh} roundedCircle className="chat-area-img" />
                  <div className="chat-area-name">
                    {users.find((user) => user._id === selectedUser)?.name ||
                      "Select a user"}
                  </div>
                </div>
                <div className="cline" />
                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={
                        msg.senderId === adminId ? "csender" : "recepient"
                      }
                    >
                      <div
                        className={
                          msg.senderId === adminId ? "chat-message" : "rchat-message"
                        }
                      >
                        {msg.senderId !== adminId && (
                          <Image src={UserPh} roundedCircle className="message-img" />
                        )}
                        <div
                          className={
                            msg.senderId === adminId ? "message-text" : "rmessage-text"
                          }
                        >
                          {msg.message}
                        </div>
                        {msg.senderId === adminId && (
                          <Image src={UserPh} roundedCircle className="message-img" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <Image src={Attachment} className="cattachment" />
                  <input
                    type="text"
                    placeholder="Type your message"
                    className="chatinp"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div>
                    <Button className="csend-button" onClick={handleSendMessage}>
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatroom;