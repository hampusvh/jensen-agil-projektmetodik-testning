import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  test,
  expect,
} from "vitest";

let jwtToken;

const baseUrl = "https://tokenservice-jwt-2025.fly.dev";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${jwtToken}`,
});

const createTestMovie = async (
  movie = {
    title: "Testfilm",
    description: "Beskrivning",
    director: "Testregissör",
    productionYear: 2025,
  }
) => {
  const res = await fetch(`${baseUrl}/movies`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(movie),
  });
  return res.json();
};

const deleteMovie = async (id) => {
  await fetch(`${baseUrl}/movies/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
};

beforeAll(async () => {
  const res = await fetch(`${baseUrl}/token-service/v1/request-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Username",
      password: "Password",
    }),
  });

  jwtToken = await res.text();
});

describe("GET /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    createdMovie = await createTestMovie({
      title: "Testfilm",
      description: "Det här är en testfilm som används för att testa API:et.",
      director: "Testregissör",
      productionYear: 2025,
    });
  });

  afterEach(async () => {
    await deleteMovie(createdMovie.id);
  });

  test("returnerar status 200 och en film", async () => {
    const res = await fetch(`${baseUrl}/movies`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
  });

  test("GET /movies/{id} returnerar rätt film", async () => {
    const res = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.title).toBe("Testfilm");
  });
});

describe("DELETE /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    createdMovie = await createTestMovie({
      title: "Film att radera",
      description: "Den här filmen raderas i testet.",
      director: "Testregissör",
      productionYear: 2024,
    });
  });

  test("raderar filmen och returnerar status 204", async () => {
    expect(createdMovie?.id).toBeDefined();

    const res = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    expect(res.status).toBe(204);
  });
});

describe("POST + DELETE i ett test", () => {
  test("skapar och raderar en film i samma test", async () => {
    const createdMovie = await createTestMovie({
      title: "Testfilm",
      description: "Det här är en testfilm som raderas i samma test.",
      director: "Testregissör",
      productionYear: 2023,
    });

    expect(createdMovie?.id).toBeDefined();

    const res = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    expect(res.status).toBe(204);
  });
});

describe("PUT + GET i samma test", () => {
  let createdMovie;

  beforeEach(async () => {
    createdMovie = await createTestMovie({
      title: "Originaltitel",
      description: "Film för att testa PUT och GET.",
      director: "Testregissör",
      productionYear: 2025,
    });
  });

  afterEach(async () => {
    await deleteMovie(createdMovie.id);
  });

  test("uppdaterar titel med PUT och bekräftar med GET", async () => {
    const updatedData = {
      title: "Uppdaterad titel",
      description: createdMovie.description,
      director: createdMovie.director,
      productionYear: createdMovie.productionYear,
    };

    const putRes = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updatedData),
    });

    expect(putRes.status).toBe(200);

    const getRes = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    const getData = await getRes.json();
    expect(getRes.status).toBe(200);
    expect(getData.title).toBe("Uppdaterad titel");
  });
});
