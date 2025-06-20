# 🚀 CI/CD Pipeline for Student Projects

This project implements a simple CI/CD system that automatically:
- Clones a GitHub repository when a commit is pushed.
- Builds and runs the project inside Docker.
- Runs test cases using the project's `Dockerfile`.
- Stores logs in MongoDB and displays them on a dashboard.

## 🧰 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Docker**: For containerized builds and tests
- **JWT**: For user authentication

---

## 📦 Local Setup Instructions

> ❗ **This project is not deployed** because of insufficient credits on my cloud accounts. You can run it locally and simulate the GitHub webhook using `ngrok`.

### Prerequisites

- Node.js
- Docker
- MongoDB running locally (`mongodb://127.0.0.1:27017/CICD_project`)
- Git
- [ngrok](https://ngrok.com/) for exposing localhost to the internet

---

## 🔧 Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/your-username/ci-cd-student-project.git
   cd ci-cd-student-project

2. **Install backend dependencies**
    ```bash
    cd server
    npm install

3. **Start MongoDB locally**

   Make sure MongoDB is running

4. Start the backend server
   ```bash
   npm start

5. ## 🌐 Expose Backend using ngrok

    To receive GitHub webhook events, your localhost must be publicly accessible.

6. ### Start ngrok in a new terminal:
    ```bash
    ngrok http 8080
    eg: https://random-id.ngrok.io

###  🤝 Contributing

Feel free to fork the repo and submit a pull request.

If you face any issues, open a GitHub Issue with steps to reproduce. 

