const API_URL = "http://192.168.10.14:3000/user";

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
  name: string,
  lastName: string,
  motherLastname: string,
  email: string,
  phone: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      lastName,
      motherLastname,
      email,
      phone,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error en el registro");
  }

  console.log(response.ok);

  return data;
};
