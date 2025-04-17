const express = require("express");
const router = express.Router();
const runTests = require("./createK8sJobs");

router.post("/", async (req, res) => {
  const payload = req.body;
  const repoUrl = payload?.repository?.clone_url;
  const repoName = payload?.repository?.name;

  if (!repoUrl || !repoName) {
    return res.status(400).send("Missing repo data");
  }

  console.log(`🔔 Webhook from ${repoName}`);

  await runTests(repoUrl, repoName);
  res.status(200).send("Test job started!");
});

module.exports = router;
