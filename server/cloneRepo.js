const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

const basePath = path.join(__dirname, '..', 'repos');

async function cloneRepo(repoUrl, repoName) {
  const repoPath = path.join(basePath, repoName);

  // Cleanup if already exists
  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true });
  }

  console.log(`📥 Cloning ${repoUrl}...`);
  await simpleGit().clone(repoUrl, repoPath);
  console.log(`✅ Repo cloned to ${repoPath}`);
  return repoPath;
}

module.exports = cloneRepo;
