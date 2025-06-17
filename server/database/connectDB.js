const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("mongodb connection successfull!!");
  } catch (err) {
    console.log("mongodb connection failed", err);
  }
};

module.exports = { connectToMongo };
