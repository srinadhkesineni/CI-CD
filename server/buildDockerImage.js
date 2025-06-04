const { exec } = require('child_process');
const Log = require('./models/Logs');

async function buildDockerImage(repoPath, repoName) {
  const imageName = `student-${repoName.toLowerCase()}`;
  const dockerBuildCmd = `docker build -t ${imageName} ${repoPath}`;

  console.log(`🐳 Building Docker image: ${imageName}`);

  // Helper to log each stage
  async function logStage(stage, command, error, stdout, stderr) {
    const logEntry = new Log({
      repoName,
      stage,
      command,
      status: error ? 'Failed' : 'Passed',
      logContent: stdout || stderr,
      timestamp: new Date()
    });
    await logEntry.save();
  }

  return new Promise((resolve, reject) => {
    exec(dockerBuildCmd, async (err, stdout, stderr) => {
      await logStage("docker build", dockerBuildCmd, err, stdout, stderr);

      if (err) {
        console.error(`❌ Docker build error:\n`, stderr);
        return reject(err);
      }

      console.log(`✅ Docker build successful:\n${stdout}`);

      const dockerRunCmd = `docker run -d ${imageName}`;
      exec(dockerRunCmd, async (err, stdout, stderr) => {
        await logStage("docker run", dockerRunCmd, err, stdout, stderr);

        if (err) {
          console.error(`❌ Error running container:\n`, stderr);
          return reject(err);
        }

        const containerId = stdout.trim();
        console.log(`🚀 Container started: ${containerId}`);

        const dockerLogsCmd = `docker logs -f ${containerId}`;
        const logsProcess = exec(dockerLogsCmd);

        let collectedLogs = '';

        logsProcess.stdout.on('data', (chunk) => {
          collectedLogs += chunk.toString();
        });

        logsProcess.stderr.on('data', (chunk) => {
          collectedLogs += chunk.toString();
        });

        logsProcess.on('close', async () => {
          await logStage("container logs", dockerLogsCmd, null, collectedLogs, null);
          console.log(`📦 Logs saved to database for ${repoName}`);
          resolve(imageName);
        });
      });
    });
  });
}

module.exports = buildDockerImage;
