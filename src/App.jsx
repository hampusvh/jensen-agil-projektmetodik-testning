import { useState } from "react";
import Login from "./components/Login/Login";
import RegisterMovie from "./components/RegisterMovie/RegisterMovie";
import ListMovies from "./components/ListMovies/ListMovies";

function App() {
  const [token, setToken] = useState("");

  return (
    <div>
      {!token && <Login onLogin={(jwt) => setToken(jwt)} />}

      {token && (
        <>
          <RegisterMovie token={token} />
          <hr />
          <ListMovies token={token} />
        </>
      )}
    </div>
  );
}

export default App;
