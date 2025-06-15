import { useEffect, useState } from 'react';
import { fetchRepos } from '../api';
import RepoCard from '../components/RepoCard';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetchRepos()
      .then(setRepos)
      .catch(err => console.error("Error fetching repos:", err));
    }, []);

    function addRepo(){
      navigate("/addrepo")
    }
    function logOut(){
      localStorage.removeItem("token")
      navigate("/")
    }
    return (
      <div className="dashboard-container">
      <h1>📦 Student Builds Dashboard</h1>
      <button onClick={addRepo}>Add Repo</button>
      <button onClick={logOut}>Log Out</button>
      
      <div className="repo-grid">
        {repos.map((repo, idx) => (
          <RepoCard key={idx} repo={repo} />
        ))}
      </div>
    </div>
  );
}
