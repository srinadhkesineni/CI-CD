import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";
import { io } from "socket.io-client";
import { fetchLogs } from "../api";

export default function Logs() {
  const { repoName } = useParams();
  const [logs, setLogs] = useState(""); 
  // const socketRef = useRef(null);

  useEffect(() => {
    setLogs(fetchLogs(repoName))
  }, [repoName]);

  // ⚙️ Connect to WebSocket for live logs
  // useEffect(() => {
  //   socketRef.current = io("http://localhost:8080");

  //   socketRef.current.on("build-log", (logLine) => {
  //     // Append live log line
  //     setLogs((prevLogs) => prevLogs + "\n" + logLine);
  //   });

  //   return () => {
  //     socketRef.current.disconnect();
  //   };
  // }, []);

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
