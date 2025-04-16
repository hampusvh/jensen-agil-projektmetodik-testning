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

describe("DELETE /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: "Film att radera",
        description: "Den här filmen skapas i beforeEach och raderas i testet.",
        director: "Testregissör",
        productionYear: 2024,
      }),
    });

    const text = await res.text();
    try {
      createdMovie = JSON.parse(text);
    } catch (err) {
      console.error("Kunde inte parsa JSON från POST-svaret:", err);
    }
  });

  test("DELETE returnerar 204", async () => {
    expect(createdMovie?.id).toBeDefined();

    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    expect(res.status).toBe(204);
  });
});

describe("POST + DELETE i ett test", () => {
  test("POST ska returnera 201 och DELETE ska returnera 204", async () => {
    const movieData = {
      title: "Testfilm",
      description: "Det här är en testfilm som raderas i samma test.",
      director: "Testregissör",
      productionYear: 2023,
    };

    const postRes = await fetch(
      "https://tokenservice-jwt-2025.fly.dev/movies",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(movieData),
      }
    );

    const postText = await postRes.text();
    console.log("POST-status:", postRes.status);
    console.log("POST-svar:", postText);
    expect(postRes.status).toBe(201);

    let createdMovie;
    try {
      createdMovie = JSON.parse(postText);
    } catch (err) {
      console.error("Kunde inte parsa JSON från POST-svaret:", err);
    }

    expect(createdMovie?.id).toBeDefined();

    const deleteRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    console.log("DELETE-status:", deleteRes.status);
    expect(deleteRes.status).toBe(204);
  });
});

describe("PUT + GET i samma test", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: "Originaltitel",
        description: "Film för att testa PUT och GET.",
        director: "Testregissör",
        productionYear: 2025,
      }),
    });

    const text = await res.text();
    try {
      createdMovie = JSON.parse(text);
    } catch (err) {
      console.error("Kunde inte parsa JSON från POST-svaret:", err);
    }
  });

  afterEach(async () => {
    if (createdMovie?.id) {
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

  test("PUT uppdaterar filmens titel och GET visar den nya titeln", async () => {
    const updatedData = {
      title: "Uppdaterad titel",
      description: createdMovie.description,
      director: createdMovie.director,
      productionYear: createdMovie.productionYear,
    };

    const putRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    expect(putRes.status).toBe(200);

    const getRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const getData = await getRes.json();
    expect(getRes.status).toBe(200);
    expect(getData.title).toBe("Uppdaterad titel");
  });
});
