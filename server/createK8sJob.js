const k8s = require('@kubernetes/client-node');

async function createK8sJob(imageName, jobName) {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const batchV1 = kc.makeApiClient(k8s.BatchV1Api);
  const coreV1 = kc.makeApiClient(k8s.CoreV1Api);

  const jobManifest = {
    apiVersion: "batch/v1",
    kind: "Job",
    metadata: {
      name: jobName,
    },
    spec: {
      template: {
        spec: {
          containers: [
            {
              name: "tester",
              image: imageName,
              imagePullPolicy: "IfNotPresent",
            },
          ],
          restartPolicy: "Never",
        },
      },
      backoffLimit: 0,
    },
  };

  try {
    const res = await batchV1.createNamespacedJob('default', jobManifest);
    console.log(`✅ Kubernetes Job ${jobName} created!`);

    // Fetch the pod name after the job is created
    const pods = await coreV1.listNamespacedPod('default', undefined, undefined, undefined, undefined, `job-name=${jobName}`);
    const podName = pods.body.items[0].metadata.name;
    console.log(`🎥 Streaming logs from Pod: ${podName}`);

    // Stream logs in real-time
    coreV1.readNamespacedPodLog(podName, 'default', undefined, true, undefined, undefined, undefined, 0, (err, logStream) => {
      if (err) {
        console.error(`❌ Error streaming logs from pod:`, err);
        return;
      }

      logStream.on('data', (data) => {
        console.log(data.toString()); // Stream log data
      });

      logStream.on('end', () => {
        console.log('✅ Logs streaming finished.');
      });
    });
  } catch (err) {
    console.error(`❌ Failed to create Kubernetes job:`, err.body.message);
  }
}

module.exports = createK8sJob;
