const API_URL = "http://192.168.1.18:3000/user/login";

export const loginRequest = async (email: string, password: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Credenciales inválidas");
  }

  return data;
};
