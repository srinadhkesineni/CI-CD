const express = require("express");
const http = require("http"); // Add this
const { Server } = require("socket.io"); // Add this
const cloneRepo = require("./cloneRepo");
const buildDockerImage = require("./buildDockerImage");
const createK8sJob = require("./createK8sJob");
const fs = require("fs");
const path = require("path");
const Log = require("./models/Logs");
const cors = require("cors");
const { connectToMongo } = require("./database/connectDB");
const authRoutes = require("./routes/auth")
const dashboardRoutes = require("./routes/dashboard")

const app = express();
const server = http.createServer(app); // Use http server
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as needed
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

connectToMongo();

// ✅ Ensure logs folder exists at startup
const logsDir = path.resolve(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}


app.use('/api/auth',authRoutes)
app.use('/api/dashboard',dashboardRoutes)

// Socket.IO connection
// io.on("connection", (socket) => {
//   console.log("🔌 New client connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("🔌 Client disconnected:", socket.id);
//   });
// });

app.get("/repos", (req, res) => {
  const reposDir = path.resolve(__dirname, "../repos");

  fs.readdir(reposDir, (err, folders) => {
    if (err) {
      console.error("❌ Error reading repos folder:", err);
      return res.status(500).json({ error: "Failed to read repos" });
    }

    const repoData = folders.map((folder) => ({
      name: folder,
      commit: "N/A",
      status: "Unknown",
      logsLink: `/logs/${folder}`,
    }));

    res.json(repoData);
  });
});

app.get("/logs/:repoName", async (req, res) => {
  try {
    const logs = await Log.find({ repoName: req.params.repoName }).sort({
      timestamp: -1,
    });
    res.send(logs.length ? logs[0].logContent : "No logs found.");
  } catch (err) {
    res.status(500).send("❌ Failed to fetch logs.");
  }
});

app.post("/webhook", async (req, res) => {
  const repoUrl = req.body.repository.clone_url;
  const repoName = req.body.repository.name;
  const jobName = `test-job-${Date.now()}`;

  try {
    const repoPath = await cloneRepo(repoUrl, repoName);
    const imageName = await buildDockerImage(repoPath, repoName);
    // await createK8sJob(imageName, jobName);

    res.status(200).send("✅ Test job created successfully!");
  } catch (error) {
    console.error("❌ Error in webhook processing:", error);
    res.status(500).send("❌ Error creating test job.");
  }
});

server.listen(8080, () => {
  console.log("🚀 Server listening on port 8080");
});
