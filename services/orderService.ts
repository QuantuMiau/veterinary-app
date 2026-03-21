const API_URL = "https://api-veterinary.onrender.com/order";

export const fetchUserOrders = async (token?: string) => {
  const res = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => null);

  // como se use  404 como "sin ordenes" envio array vacío para no romper UI
  if (res.status === 404) {
    return [];
  }

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};

export const fetchOrderDetails = async (id: string | number, token?: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};

export const createOrder = async (paymentMethod: string, token?: string) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ paymentMethod }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};

