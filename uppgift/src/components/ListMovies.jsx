import { useEffect, useState } from "react";

function ListMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const jwtToken =
    "eyJraWQiOiI2ODJhNDUzMi1iZjA5LTRmMDYtODFkZi02Mjk2MWQ5YmJlZWMiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiVXNlcm5hbWUiLCJleHAiOjE3NDQ3OTI5MTQsImlhdCI6MTc0NDc4OTMxNCwic2NvcGUiOiJBRE1JTiJ9.B59g-0ErVWtfR0gLBfOKnKPdUeIFV_YEiEFDFkmP8z2GnIt-BQCODxSx4YewWWgB6nWQKMkm473StffOv6fE_Pt5IZRVpb4HjSWTbPHzGaTr3EaTlmcbZnbv60Zj72dxjnNY1M5XdgtyJaal8IdaP0wpVYnGXpkrwD4vWhsiI0wDDbEGuU4anPJIIkYAPmlZtsA95DEBmjI60fUF7ZzuSU0Jk9gQ4h7cX9oshP8WNaYeaOETPNJJkHqKQ3FY-uSMK4caGXCZ8dei7B-endLP1avPLYCKOVavqIqYrFWZSky_XcZfJnncMzmCI3mCw8UufkJegGUlN5KFjPD3jnLFww";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
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
            <strong>{movie.title}</strong> ({movie.productionYear})<br />
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
