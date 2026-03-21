const API_URL = "https://api-veterinary.onrender.com/user";

export const loginRequest = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
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

export const registerRequest = async (
  first_name: string,
  last_name: string,
  mother_name: string,
  email: string,
  phone: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name,
      last_name,
      mother_name,
      email,
      phone,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Error en el registro");
  }

  console.log(response.ok);

  return data;
};
