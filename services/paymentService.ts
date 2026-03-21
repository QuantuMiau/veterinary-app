const API_URL = "https://api-veterinary.onrender.com/payment";

export const createPaymentIntent = async (amount: number, token?: string) => {
  const res = await fetch(`${API_URL}/intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ amount }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};
