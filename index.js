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
  server.listen(PORT, () =>
      console.log("Server is live " + PORT)
    );
});

