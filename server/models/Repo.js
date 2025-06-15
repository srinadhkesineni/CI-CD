const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema({
  repoName: { type: String, unique: true, required: true },
  repoUrl: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Repo", repoSchema);
