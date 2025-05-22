const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  repoName: String,
  timestamp: { type: Date, default: Date.now },
  status: String,
  logContent: String,
});

module.exports = mongoose.model("Log", logSchema);
