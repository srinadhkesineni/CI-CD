const Log = require("./models/Logs");
const { exec } = require("child_process");

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(stderr || err.message);
      }
      resolve(stdout.trim());
    });
  });
}

async function buildDockerImage(repoPath, repoName, userId) {
  const imageName = `student-${repoName.toLowerCase()}`;
  const dockerBuildCmd = `docker build -t ${imageName} ${repoPath}`;
  const dockerRunCmd = `docker run --name ${imageName}-container ${imageName}`;
  const dockerLogsCmd = `docker logs ${imageName}-container`;
  const dockerRemoveCmd = `docker rm ${imageName}-container`;

  try {
    console.log("🛠️ Building Docker image...");
    await execCommand(dockerBuildCmd);
    console.log("✅ Build completed");

    console.log("🏃 Running container (to execute tests)...");
    await execCommand(dockerRunCmd);
    console.log("✅ Container run completed");

    console.log("📜 Fetching logs...");
    const logs = await execCommand(dockerLogsCmd);

    console.log("🧹 Cleaning up container...");
    await execCommand(dockerRemoveCmd);

    const successLog = new Log({
      repoName,
      status: "Success",
      logContent: logs,
      user: userId,
    });
    console.log(logs)

    await successLog.save();
    return imageName;
  } catch (err) {
    const failedLog = new Log({
      repoName,
      status: "Failed",
      logContent: err.toString(),
      user: userId,
    });
    await failedLog.save();
    throw new Error(err);
  }
}

module.exports = buildDockerImage;
