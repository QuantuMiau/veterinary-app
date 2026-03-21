const API_URL = "https://api-veterinary.onrender.com/cart";

export const addToCartAPI = async (
  conceptId: string | number,
  quantity = 1,
  token?: string
) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ conceptId, quantity }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};

export const fetchCartAPI = async (token?: string) => {
  const res = await fetch(API_URL, {
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

export const updateCartAPI = async (
  conceptId: string | number,
  quantity: number,
  token?: string
) => {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ conceptId, quantity }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};

export const deleteFromCartAPI = async (
  conceptId: string | number,
  token?: string
) => {
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ conceptId }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};
