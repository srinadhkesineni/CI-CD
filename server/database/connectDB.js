const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect("mongodb+srv://srinadhkesineni7:srinadhkesineni7@tutorialmongo.l43m31d.mongodb.net/cicd?retryWrites=true&w=majority&appName=tutorialMongo");

    console.log("mongodb connection successfull!!");
  } catch (err) {
    console.log("mongodb connection failed", err);
  }
};

module.exports = { connectToMongo };
