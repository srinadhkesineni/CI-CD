import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import './Register.css'; 

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        username,
        email,
        password,
      });
      navigate("/");
    } catch (err) {
      alert("❌ Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>📝 Register</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            className="register-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="register-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button className="register-button" onClick={handleRegister}>
            Register
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
