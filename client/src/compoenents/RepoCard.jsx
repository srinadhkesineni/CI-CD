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
      <a href={repo.logsLink} className="log-link">View Logs</a>
    </div>
  );
}
