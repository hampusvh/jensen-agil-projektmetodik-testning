export async function getToken() {
  const res = await fetch(
    "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Username",
        password: "Password",
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Kunde inte hämta token");
  }

  return res.text();
}
