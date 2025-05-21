# Project Flow

1->GitHub Repo Push

A student pushes their code to their GitHub repository.

2->GitHub Webhook

The push triggers a webhook to the Node.js server.

3->Node.js Server

The server receives the webhook and handles the logic:

Clones the student’s repository.

Builds a Docker image for the project.

4->Docker Image Build

A Docker image is created based on the student's repository.

5->Kubernetes Job Creation

The Docker image is used to create a Kubernetes job.

6->Kubernetes Job Execution

The job runs on a Kubernetes cluster and executes the student’s tests.

7->Test Logs Retrieval

After execution, the test logs are fetched from the Kubernetes pod.

8->Log Display

The logs are displayed, and the result of the test execution is shown to the user.

# need to do

1. Persist Build History

📦 What: Store the build status, logs, and timestamps for each repo build.

🛠️ Tech: MongoDB or SQLite.

✅ Why: Right now everything is in memory or just in logs. A DB allows you to show historical builds in the dashboard.

2. Improve Frontend UI/UX

🎨 Add animations, better card designs, and filters.

📊 Show build time, status icons, timestamps.

🧠 Use a library like React Table or Tailwind CSS.

3. Live Build Logs (WebSockets)

🔁 Replace static logs with live streaming logs.

📡 Use socket.io to push log updates in real time while the container is running.

4. Email or Slack Notifications

📬 Send a notification when a build fails or succeeds.

🔌 Use nodemailer (for email) or Slack webhook integration.

5. Secure Webhooks

🔐 Validate the GitHub webhook with a secret to prevent misuse.

GitHub lets you define a secret on webhook, and you can verify it in your Express app.

6. Authentication for Dashboard

🔒 Add login/logout (JWT-based or simple session auth).

Only logged-in users can see logs or manage builds.

7. Kubernetes Job Integration (Later)

Once you revisit K8s, each build can run as a K8s job instead of a local Docker container.

Helps simulate production CI/CD like GitHub Actions.

8. Support for Multiple Branches or PRs

You can include branch name in builds.

Display separate logs for main, dev, or PRs.

9. Add Retry Button

🔁 If a build fails, allow retrying it manually via the dashboard.

10. Deploy the Dashboard

🎯 Deploy to Render, Railway, or Vercel.

Run backend on Railway, frontend on Vercel.

Bonus: Add your own GitHub repo as a test user.