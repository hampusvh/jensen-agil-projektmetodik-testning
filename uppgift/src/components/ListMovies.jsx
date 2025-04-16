import { useEffect, useState } from "react";

function ListMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const jwtToken =
    "eyJraWQiOiI2ODJhNDUzMi1iZjA5LTRmMDYtODFkZi02Mjk2MWQ5YmJlZWMiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiVXNlcm5hbWUiLCJleHAiOjE3NDQ3OTgyMTUsImlhdCI6MTc0NDc5NDYxNSwic2NvcGUiOiJBRE1JTiJ9.bZviQ5Kt1YzrHnr34M7l5UXf6UNwy_rbEUKQHDMgLKy5bokzWFay5qp5REqeuqY-478gIeFfKxSom7abmN_AkrDsvQ1rW7-4VN_JHiLmyYF3eqKLxcixRHq3CJ89wGdKy8aR3f6hduif9TD3ZukuYCLbbZcwlY4XFRdfoWuRxoleoZYTqA9SotTsiNJvSpEGUwvJObif0OihOmb5lRvNfNF81sgjxplbvJvJsjovqmOwiYS1wCn0L2pmgufQVbCB7mAkBS5RtYIWGgaw0VPBP0x8D7Om7vQbcrsqLFPildGh3ngrJMhl6jaKl4-UAemhagFaJu1gT4t_K6NHezSkiw";

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
