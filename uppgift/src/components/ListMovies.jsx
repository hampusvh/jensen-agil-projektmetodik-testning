import { useEffect, useState } from "react";
import { getToken } from "../utils/getToken";

function ListMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const jwtToken = await getToken();

        const res = await fetch(
          "https://tokenservice-jwt-2025.fly.dev/movies",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setMovies(data);
        } else {
          const errMsg = await res.text();
          setError("Kunde inte hämta filmer: " + errMsg);
        }
      } catch (err) {
        setError("Något gick fel: " + err.message);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <h2>Filmer i databasen</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <strong>{movie.title}</strong> ({movie.productionYear}) – ID:{" "}
            {movie.id} <br />
            Regissör: {movie.director}
            <br />
            Beskrivning: {movie.description}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListMovies;
