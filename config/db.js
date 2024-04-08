const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.DATABASE_URL, {
    //   useUnifiedTopology: true,
    //   useNewUrlParser: true,
    // });
    // console.log(`Connected to Mongodb Database ${conn.connection.host} `);

    const conn = mongoose.connect(
      "mongodb://localhost/heliverse-DB",
      console.log("DB connected"),
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log(`Connected to Mongodb Database`);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
  }
};
module.exports = connectDB;
