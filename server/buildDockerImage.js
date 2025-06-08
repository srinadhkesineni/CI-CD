const { exec } = require('child_process');
const Log = require('./models/Logs');
const { io } = require('./socket'); // import socket instance

async function buildDockerImage(repoPath, repoName) {
  const imageName = `student-${repoName.toLowerCase()}`;
  const dockerBuildCmd = `docker build -t ${imageName} ${repoPath}`;

  return new Promise((resolve, reject) => {
    const logToClient = (message) => {
      io.emit('build-log', { repoName, message }); 
    };

    logToClient(`🐳 Building Docker image: ${imageName}`);

    exec(dockerBuildCmd, (err, stdout, stderr) => {
      if (err) {
        logToClient(`❌ Docker build failed:\n${stderr}`);
        const failedLog = new Log({
          repoName,
          status: 'Failed',
          logContent: stderr.toString()
        });
        failedLog.save();
        return reject(err);
      }

      logToClient(`✅ Docker build successful:\n${stdout}`);
      const dockerRunCmd = `docker run -d ${imageName}`;
      exec(dockerRunCmd, (err, stdout, stderr) => {
        if (err) {
          logToClient(`❌ Error running container:\n${stderr}`);
          const failedLog = new Log({
            repoName,
            status: 'Failed',
            logContent: stderr.toString()
          });
          failedLog.save();
          return reject(err);
        }

        const containerId = stdout.trim();
        logToClient(`🚀 Container started: ${containerId}`);

        const dockerLogsCmd = `docker logs -f ${containerId}`;
        const logsProcess = exec(dockerLogsCmd);

        let collectedLogs = '';

        logsProcess.stdout.on('data', (chunk) => {
          const data = chunk.toString();
          collectedLogs += data;
          logToClient(data);
        });

        logsProcess.stderr.on('data', (chunk) => {
          const data = chunk.toString();
          collectedLogs += data;
          logToClient(data);
        });

        logsProcess.on('close', async () => {
          const successLog = new Log({
            repoName,
            status: 'Success',
            logContent: collectedLogs
          });

          try {
            await successLog.save();
            logToClient(`📦 Logs saved to DB for ${repoName}`);
          } catch (dbErr) {
            logToClient('❌ Failed to save logs to DB');
          }

          resolve(imageName);
        });
      });
    });
  });
}

module.exports = buildDockerImage;
