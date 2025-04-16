import { useState } from "react";

function RegisterMovie() {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    director: "",
    productionYear: "",
  });

  const [responseMsg, setResponseMsg] = useState("");

  const jwtToken =
    "eyJraWQiOiI2ODJhNDUzMi1iZjA5LTRmMDYtODFkZi02Mjk2MWQ5YmJlZWMiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiVXNlcm5hbWUiLCJleHAiOjE3NDQ3OTI5MTQsImlhdCI6MTc0NDc4OTMxNCwic2NvcGUiOiJBRE1JTiJ9.B59g-0ErVWtfR0gLBfOKnKPdUeIFV_YEiEFDFkmP8z2GnIt-BQCODxSx4YewWWgB6nWQKMkm473StffOv6fE_Pt5IZRVpb4HjSWTbPHzGaTr3EaTlmcbZnbv60Zj72dxjnNY1M5XdgtyJaal8IdaP0wpVYnGXpkrwD4vWhsiI0wDDbEGuU4anPJIIkYAPmlZtsA95DEBmjI60fUF7ZzuSU0Jk9gQ4h7cX9oshP8WNaYeaOETPNJJkHqKQ3FY-uSMK4caGXCZ8dei7B-endLP1avPLYCKOVavqIqYrFWZSky_XcZfJnncMzmCI3mCw8UufkJegGUlN5KFjPD3jnLFww";

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        ...movie,
        productionYear: parseInt(movie.productionYear),
      }),
    });

    if (res.status === 201) {
      setResponseMsg("✅ Filmen har registrerats!");
      setMovie({
        title: "",
        description: "",
        director: "",
        productionYear: "",
      });
    } else {
      const errorText = await res.text();
      setResponseMsg("❌ Något gick fel: " + errorText);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrera ny film</h2>
      <input
        type="text"
        name="title"
        placeholder="Titel"
        value={movie.title}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Beskrivning (minst 30 tecken)"
        value={movie.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="director"
        placeholder="Regissör"
        value={movie.director}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="productionYear"
        placeholder="Produktionsår"
        value={movie.productionYear}
        onChange={handleChange}
        required
      />
      <button type="submit">Skicka</button>
      <p>{responseMsg}</p>
    </form>
  );
}

export default RegisterMovie;
