import axios from 'axios';

const API_BASE = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export async function fetchRepos() {
  const res = await axios.get(`${API_BASE}/repos`, getAuthHeaders());
  console.log(res);
  return res.data;
}

export async function fetchLogs(repoName) {
  const res = await axios.get(`${API_BASE}/logs/${repoName}`, getAuthHeaders());
  return res.data;
}
