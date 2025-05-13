const express = require('express');
// const bodyParser = require('body-parser');
const cloneRepo = require('./cloneRepo');
const buildDockerImage = require('./buildDockerImage');
const createK8sJob = require('./createK8sJob');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 



app.get('/repos', (req, res) => {
  const reposDir = path.resolve(__dirname, '../repos');

  fs.readdir(reposDir, (err, folders) => {
    if (err) {
      console.error('❌ Error reading repos folder:', err);
      return res.status(500).json({ error: 'Failed to read repos' });
    }

    const repoData = folders.map(folder => ({
      name: folder,
      commit: 'N/A',              // Replace if you store commit info
      status: 'Unknown',          // Replace if you track build status
      logsLink: `/logs/${folder}`
    }));

    res.json(repoData);
  });
});



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

app.listen(8080, () => {
  console.log('🚀 Server listening on port 3000');
});
