const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  repoName: String,
  timestamp: { type: Date, default: Date.now },
  status: String,
  logContent: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
});

module.exports = mongoose.model("Log", logSchema);
