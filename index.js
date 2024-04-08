const express = require("express");
const app = express();
const dotenv = require("dotenv");
var cors = require("cors");
const connectDB = require("./config/db.js");
const frontendUrl = "https://toheed-wysa.netlify.app";
dotenv.config();
const PORT = process.env.PORT || 3000;



const allowedOrigins = [
  "http://localhost:5173",
  undefined
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS from origin : ${origin}`));
    }
  },
  credentials: true
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));


// Import Routes
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");


// Routes Middleware
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);

connectDB().then(() => {
  //run listen
  app.listen(PORT, () => console.log("Server is live " + PORT));
});
