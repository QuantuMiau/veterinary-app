export interface RawProduct {
  product_id: string;
  name: string;
  price: string; // comes as string from API
  image_url?: string;
}

const API_URL = "http://192.168.1.18:3000/product";

export const fetchProducts = async (): Promise<RawProduct[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data;
};

export const fetchProduct = async (product_id: string) => {
  const url = `${API_URL}/${encodeURIComponent(product_id)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data;
};
