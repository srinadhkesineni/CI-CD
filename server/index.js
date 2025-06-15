const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cloneRepo = require("./cloneRepo");
const buildDockerImage = require("./buildDockerImage");
const createK8sJob = require("./createK8sJob");
const fs = require("fs");
const path = require("path");
const Log = require("./models/Logs");
const cors = require("cors");
const { connectToMongo } = require("./database/connectDB");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const repoRoutes = require("./routes/repo");
const Repo = require("./models/Repo");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store io globally to use in buildDockerImage
global._io = io;

app.use(express.json());
app.use(cors());

connectToMongo();

const logsDir = path.resolve(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/repo", repoRoutes);

app.get("/repos", authMiddleware, async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user.id }).sort({ timestamp: -1 });

    // Map logs to unique repo names
    const uniqueRepos = {};
    logs.forEach((log) => {
      if (!uniqueRepos[log.repoName]) {
        uniqueRepos[log.repoName] = {
          name: log.repoName,
          commit: "N/A",
          status: log.status,
          logsLink: `/logs/${log.repoName}`,
        };
      }
    });

    res.json(Object.values(uniqueRepos));
  } catch (err) {
    console.error("❌ Error fetching user repos:", err);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
});

app.get("/logs/:repoName", authMiddleware, async (req, res) => {
  try {
    const logs = await Log.find({
      repoName: req.params.repoName,
      user: req.user.id,
    }).sort({ timestamp: -1 });

    if (!logs.length) {
      return res.status(404).send("No logs found.");
    }

    const allLogs = logs.map((log, index) => {
      return `📝 Log #${logs.length - index} (Status: ${log.status})\n${log.logContent}\n\n------------------\n`;
    });

    res.send(allLogs.join(''));
  } catch (err) {
    res.status(500).send("❌ Failed to fetch logs.");
  }
});


app.post("/webhook", async (req, res) => {
  const repoUrl = req.body.repository.clone_url;
  const repoName = req.body.repository.name;

  try {
    const linkedRepo = await Repo.findOne({ repoUrl });
    console.log("linked repos : ", linkedRepo);
    if (!linkedRepo) {
      return res.status(404).send("❌ Repo not linked to any user");
    }

    const userId = linkedRepo.user;

    const repoPath = await cloneRepo(repoUrl, repoName);
    try {
      await buildDockerImage(repoPath, repoName, userId);
      console.log("✅ Image built");
    } catch (err) {
      console.error("❌ Build error", err);
    }

    res.status(200).send("✅ Build triggered!");
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("❌ Internal Server Error");
  }
});

server.listen(8080, () => {
  console.log("🚀 Server listening on port 8080");
});
