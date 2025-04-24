import { useEffect, useState } from "react";
import "../../App.css";

function ListMovies({ token }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          "https://tokenservice-jwt-2025.fly.dev/movies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [token]);

  return (
    <div className="movies-container">
      <h3>Aktuell lista av filmer</h3>
      {error && <p className="error-message">{error}</p>}
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie.id}>
            <strong>
              {movie.title} ({movie.productionYear})
            </strong>
            <p>Regissör: {movie.director}</p>
            <p>Beskrivning: {movie.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListMovies;
