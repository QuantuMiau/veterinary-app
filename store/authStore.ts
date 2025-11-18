import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { loginRequest } from "@/services/authService";

interface User {
  user_id: number;
  cart_id: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message?: string }>;

  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  /** LOGIN **/
  login: async (email, password) => {
    try {
      const data = await loginRequest(email, password);
      // data = { ok, user, token }

      // Guardar token
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));

      // Actualizar global
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err.message };
    }
  },

  /** LOGOUT **/
  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  /** Cargar sesión **/
  loadSession: async () => {
    console.log("🔵 Ejecutando loadSession...");

    const savedToken = await SecureStore.getItemAsync("token");
    const savedUser = await SecureStore.getItemAsync("user");

    console.log("🔹 Token encontrado en SecureStore:", savedToken);

    if (!savedToken) {
      console.log("🔴 No hay token guardado → usuario NO autenticado");
      set({ isAuthenticated: false });
      return;
    }

    console.log("🟢 Token válido, marcando sesión como autenticada");

    set({
      token: savedToken,
      user: savedUser ? JSON.parse(savedUser) : null,
      isAuthenticated: true,
    });
  },
}));
