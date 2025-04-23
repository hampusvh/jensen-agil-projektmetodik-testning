import { useState } from "react";
import { getToken } from "../utils/getToken";
import "../App.css";

function RegisterMovie() {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    director: "",
    productionYear: "",
  });

  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jwtToken = await getToken();

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
        setResponseMsg("Filmen har registrerats!");
        setMovie({
          title: "",
          description: "",
          director: "",
          productionYear: "",
        });
      } else {
        const errorText = await res.text();
        setResponseMsg("Något gick fel: " + errorText);
      }
    } catch (err) {
      setResponseMsg("Kunde inte hämta token: " + err.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h3>Registrera ny film</h3>
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
    </div>
  );
}

export default RegisterMovie;
