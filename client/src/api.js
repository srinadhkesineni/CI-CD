import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export async function fetchRepos() {
  const res = await axios.get(`${API_BASE}/repos`);
  return res.data;
}

export async function fetchLogs(repoName) {
  const res = await axios.get(`${API_BASE}/logs/${repoName}`);
  return res.data;
}
