import { Link } from 'react-router-dom';

export default function RepoCard({ repo }) {
  return (
    <div className="repo-card">
      <h2>{repo.name}</h2>

      <p>Commit: <code>{repo.commit}</code></p>

      <p>
        Status: <span className={repo.status === 'Success' ? 'status-success' : 'status-failed'}>
          {repo.status}
        </span>
      </p>

      <Link to={`/logs/${repo.name}`}>
        <button className="log-button">View Logs</button>
      </Link>
    </div>
  );
}
