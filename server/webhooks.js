const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const payload = req.body;

  console.log(payload);

  const repoUrl = payload?.repository?.clone_url;
  const latestCommit = payload?.head_commit?.message;

  console.log("repo URL : ", repoUrl);
  console.log("latest Commit : ", latestCommit);

  res.status(200).send("Webhook received");
});

module.exports = router;
