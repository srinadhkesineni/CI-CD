# CI-CD

GitHub Repo Push → GitHub Webhook → Node.js Server → Clone Repo
     ↓                              ↓                          ↓
  Clone URL                    Repo Directory            Build Docker Image
     ↓                              ↓                          ↓
   Docker Image              Image Built Successfully → Create Kubernetes Job
     ↓                              ↓                          ↓
  Kubernetes Job          Job Created in Kubernetes → Run Tests in Container
     ↓                              ↓                          ↓
 Test Logs Generated ← Retrieve Logs from Kubernetes Job ← Docker Container Execution
