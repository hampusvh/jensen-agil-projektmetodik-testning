import { useState } from "react";
import "../../App.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch(
      "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!res.ok) {
      alert("Fel användarnamn eller lösenord");
      return;
    }

    const jwt = await res.text();
    onLogin(jwt);

    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <h3>Login</h3>
      <input
        type="text"
        placeholder="Användarnamn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Logga in</button>
    </div>
  );
}

export default Login;
