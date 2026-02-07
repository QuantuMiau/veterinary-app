import { Stack, router } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { CartProvider } from "@/hooks/use-cart";

export default function RootLayout() {
  const { isAuthenticated, loadSession } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Cargar la sesión
  useEffect(() => {
    console.log("🔵 Ejecutando loadSession...");
    loadSession().then(() => {
      console.log("🟢 Sesión cargada.");
      setLoading(false);
    });
  }, []);

  // Navegar cuando ya cargó la sesión
  useEffect(() => {
    if (!loading) {
      console.log(
        "🔁 Preparando navegación → loading:",
        loading,
        "isAuthenticated:",
        isAuthenticated
      );

      // Pequeño retraso para evitar condiciones de carrera con el router
      const t = setTimeout(() => {
        try {
          if (isAuthenticated) {
            console.log("➡️ Navegando a products (delayed)");
            router.replace("/products");
          } else {
            console.log("➡️ Navegando a auth/login (delayed)");
            router.replace("/home");
          }
        } catch (err) {
          console.error("Error al navegar (delayed):", err);
          try {
            if (isAuthenticated) router.push("/products");
            else router.push("/auth/login");
          } catch (err2) {
            console.error("Fallback navigation failed (delayed):", err2);
          }
        }
      }, 50);

      return () => clearTimeout(t);
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
