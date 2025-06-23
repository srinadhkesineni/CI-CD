import React, { useState } from "react";
import axios from "axios";

export default function LinkRepo() {
  const [repoName, setRepoName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleLink = async () => {
    const token = localStorage.getItem("token"); 

    try {
      const response = await axios.post(
        "https://ci-cd-backend-2zmd.onrender.com/api/repo/link",
        { repoName, repoUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Repo linked!");
      setRepoName("");
      setRepoUrl("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔗 Link Your GitHub Repository</h2>
      <input
        style={styles.input}
        type="text"
        placeholder="Repository Name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Repository Clone URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button style={styles.button} onClick={handleLink}>
        Link Repo
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    marginTop: "50px",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};
