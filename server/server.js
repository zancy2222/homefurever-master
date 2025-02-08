require('dotenv').config({ path: "../.env" });
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Environment Variables:', process.env);

const express = require("express");
const app = express();
const port = 8000;  
const nodemailer = require('nodemailer');
require("./config/mongo_config");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

app.use((req, res, next) => {
    console.log('Authorization header:', req.headers['authorization']);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

const UserRoutes = require("./routes/data_routes");
UserRoutes(app, upload);
// Import and use message routes
const MessageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", MessageRoutes);
app.listen(port, () => console.log("The server is all fired up on port 8000."));
// Add this code to server.js
const Adoption = require("./models/adoption_model"); // Import the Adoption model

app.get('/api/adoptions/status/:userId', (req, res) => {
    const userId = req.params.userId;

    // Fetch the adoption status based on the logged-in user (you can match based on userId, or a session if necessary)
    Adoption.find({ v_id: userId })
        .then(adoptions => {
            // Transform adoption status into something meaningful
            const notifications = adoptions.map(adoption => {
                let statusText = "";

                switch (adoption.status) {
                    case "accepted":
                        statusText = "Your adoption has been accepted!";
                        break;
                    case "failed":
                        statusText = `Your adoption failed: ${adoption.failedReason}`;
                        break;
                    case "declined":
                        statusText = "Your adoption has been declined.";
                        break;
                    case "complete":
                        statusText = "Your adoption process is complete.";
                        break;
                    default:
                        statusText = "Your adoption is still pending.";
                        break;
                }

                return {
                    id: adoption.a_id,
                     text: statusText
                };
            });

            res.json(notifications);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "Error fetching adoption status" });
        });
});
