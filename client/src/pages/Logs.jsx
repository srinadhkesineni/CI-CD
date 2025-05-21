import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Logs() {
  const { repoName } = useParams();
  const [logs, setLogs] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/logs/${repoName}`)
      .then((res) => setLogs(res.data))
      .catch((err) => setLogs("❌ Failed to load logs."));
  }, [repoName]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Logs for {repoName}</h2>
      <pre
        style={{
          backgroundColor: "#111",
          color: "#0f0",
          padding: "15px",
          borderRadius: "5px",
          maxHeight: "500px",
          overflowY: "scroll",
        }}
      >
        {logs}
      </pre>
    </div>
  );
}
