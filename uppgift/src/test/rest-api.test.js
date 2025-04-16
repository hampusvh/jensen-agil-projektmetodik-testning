import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  test,
  expect,
} from "vitest";

let jwtToken;

beforeAll(async () => {
  const res = await fetch(
    "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Username",
        password: "Password",
      }),
    }
  );

  jwtToken = await res.text();
});

describe("GET /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: "Testfilm",
        description:
          "Det här är en testfilm som används för att testa API:et med Vitest.",
        director: "Testregissör",
        productionYear: 2025,
      }),
    });

    console.log("POST-status:", res.status);
    const body = await res.text();
    console.log("Svar från POST:", body);

    try {
      createdMovie = JSON.parse(body);
    } catch (err) {
      console.error("Kunde inte parsa JSON från POST-svaret:", err);
    }
  });

  afterEach(async () => {
    if (createdMovie && createdMovie.id) {
      await fetch(
        `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
    }
  });

  test("GET /movies returnerar status 200 och en film", async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const data = await res.json();
    console.log("Svar från GET /movies:", data);

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
  });

  test("GET /movies/{id} returnerar rätt film", async () => {
    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie?.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    console.log("GET /movies/{id} status:", res.status);
    const text = await res.text();
    console.log("Svar från GET /movies/{id}:", text);

    expect(res.status).toBe(200);
    const data = JSON.parse(text);
    expect(data.title).toBe("Testfilm");
  });
});
