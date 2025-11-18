import { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: any;
  category?: string;
  quantity?: number;
}

interface CartContextType {
  cartProducts: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  calculateTotal: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        // Si ya existe, aumentamos la cantidad
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + quantity }
            : p
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCartProducts([]);

  const calculateTotal = () => {
    return cartProducts
      .reduce(
        (total, product) => total + product.price * (product.quantity || 1),
        0
      )
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addToCart,
        removeFromCart,
        clearCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
