const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`Connected to Mongodb Database ${conn.connection.host} `);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
  }
};
module.exports = connectDB;
