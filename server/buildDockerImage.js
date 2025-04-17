const { exec } = require('child_process');

async function buildDockerImage(repoPath, repoName) {
  const imageName = `student-${repoName.toLowerCase()}`;
  const dockerBuildCmd = `docker build -t ${imageName} ${repoPath}`;

  console.log(`🐳 Building Docker image: ${imageName}`);
  
  return new Promise((resolve, reject) => {
    exec(dockerBuildCmd, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Docker build error:`, stderr);
        reject(err);
        return;
      }
      console.log(`✅ Docker build successful:\n${stdout}`);
      
      // Now run the container and stream logs
      const dockerRunCmd = `docker run -d ${imageName}`;
      exec(dockerRunCmd, (err, stdout) => {
        if (err) {
          console.error(`❌ Error running container:`, stderr);
          reject(err);
          return;
        }
        
        const containerId = stdout.trim();
        console.log(`🚀 Container started: ${containerId}`);
        
        // Start streaming logs
        exec(`docker logs -f ${containerId}`, (err, logs) => {
          if (err) {
            console.error(`❌ Error streaming logs:`, stderr);
            reject(err);
            return;
          }
          console.log(`🚨 Logs streaming from Docker container:`);
          console.log(logs);
        });
        
        resolve(imageName);
      });
    });
  });
}

module.exports = buildDockerImage;
