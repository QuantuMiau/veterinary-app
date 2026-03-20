export interface RawProduct {
  concept_id: number;
  product_id: string;
  name: string;
  description: string;
  price: string;
  cost: string;
  stock: number;
  category: string;
  subcategory: string;
  image_url: string;
  active: boolean;
  category_id: number;
}

const API_URL = "http://192.168.1.6:3000/product";

export const fetchProducts = async (): Promise<RawProduct[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data;
};

export const fetchProduct = async (concept_id: string | number) => {
  const url = `${API_URL}/${encodeURIComponent(concept_id)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data;
};
