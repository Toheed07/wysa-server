const express = require("express");
const app = express();
const dotenv = require("dotenv");
var cors = require("cors");
const server = require("http").createServer(app);
const connectDB = require("./config/db.js");
const frontendUrl = "https://toheed-wysa.netlify.app/";
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = ['http://localhost:3000', 'http://gamebrag.onrender.com', 'https://gamebrag.onrender.com'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

// Import Routes
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

// Routes Middleware
app.use("/api/user", authRoutes);
app.use("/api/chats", chatRoutes);

const io = require("socket.io")(server, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST"],
  },
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected");
  let userMessage = "Hello from the client!";

  setInterval(() => {
    const message = { content: "Hello from the server!" };
    socket.emit("message", message);
  }, 5000); // Send a message every 5 seconds, we can use this to send bubbles at specific time interval

  setInterval(() => {
    socket.emit("userMessage", { content: userMessage });
  }, 7000); // Send a message every 7 seconds, we can use this to send bubbles at specific time interval

  socket.on("userMessage", (message) => {
    userMessage = message;
    console.log("Received message from client: " + userMessage);
    socket.emit("userMessage", { content: userMessage });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

connectDB().then(() => {
  //run listen
  server.listen(PORT, () => console.log("Server is live " + PORT));
});
