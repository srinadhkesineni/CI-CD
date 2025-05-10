import { useEffect, useState } from 'react';
import { fetchRepos } from '../api';
import RepoCard from '../compoenents/RepoCard';

export default function Dashboard() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetchRepos()
      .then(setRepos)
      .catch(err => console.error("Error fetching repos:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <h1>📦 Student Builds Dashboard</h1>
      <div className="repo-grid">
        {repos.map((repo, idx) => (
          <RepoCard key={idx} repo={repo} />
        ))}
      </div>
    </div>
  );
}
