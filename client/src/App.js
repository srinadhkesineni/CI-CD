import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Dashboard";
import Logs from "./pages/Logs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logs/:repoName" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;
