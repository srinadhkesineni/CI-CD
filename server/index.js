const express = require('express');
// const bodyParser = require('body-parser');
const cloneRepo = require('./cloneRepo');
const buildDockerImage = require('./buildDockerImage');
const createK8sJob = require('./createK8sJob');

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const repoUrl = req.body.repository.clone_url;
  const repoName = req.body.repository.name;
  const jobName = `test-job-${Date.now()}`;

  try {
    const repoPath = await cloneRepo(repoUrl, repoName);
    const imageName = await buildDockerImage(repoPath, repoName);
    await createK8sJob(imageName, jobName);

    res.status(200).send('✅ Test job created successfully!');
  } catch (error) {
    console.error('❌ Error in webhook processing:', error);
    res.status(500).send('❌ Error creating test job.');
  }
});

app.listen(3000, () => {
  console.log('🚀 Server listening on port 3000');
});
