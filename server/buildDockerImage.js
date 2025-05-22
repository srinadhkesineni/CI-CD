const { exec } = require('child_process');
const Log = require('./models/Logs');

async function buildDockerImage(repoPath, repoName) {
  const imageName = `student-${repoName.toLowerCase()}`;
  const dockerBuildCmd = `docker build -t ${imageName} ${repoPath}`;

  console.log(`🐳 Building Docker image: ${imageName}`);

  return new Promise((resolve, reject) => {
    exec(dockerBuildCmd, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Docker build error:`, stderr);
        const failedLog = new Log({
          repoName,
          status: 'Failed',
          logContent: stderr.toString()
        });
        failedLog.save();
        return reject(err);
      }

      console.log(`✅ Docker build successful:\n${stdout}`);

      const dockerRunCmd = `docker run -d ${imageName}`;
      exec(dockerRunCmd, (err, stdout, stderr) => {
        if (err) {
          console.error(`❌ Error running container:`, stderr);
          const failedLog = new Log({
            repoName,
            status: 'Failed',
            logContent: stderr.toString()
          });
          failedLog.save();
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
          const successLog = new Log({
            repoName,
            status: 'Success',
            logContent: collectedLogs
          });

          try {
            await successLog.save();
            console.log(`📦 Logs saved to database for ${repoName}`);
          } catch (dbErr) {
            console.error('❌ Failed to save logs to DB:', dbErr);
          }

          resolve(imageName);
        });
      });
    });
  });
}

module.exports = buildDockerImage;
