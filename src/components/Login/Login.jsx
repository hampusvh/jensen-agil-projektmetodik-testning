import { useState } from "react";
import { getToken } from "../../services/getToken";
import "../../App.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const jwt = await getToken(username, password);
      onLogin(jwt);
      setUsername("");
      setPassword("");
    } catch (err) {
      alert("Fel användarnamn eller lösenord");
    }
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
