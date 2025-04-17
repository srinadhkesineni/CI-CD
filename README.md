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
