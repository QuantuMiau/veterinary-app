import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useGlobalStyles } from "@/styles/globalStyles";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCart, Product } from "@/hooks/use-cart";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useFocusEffect } from "@react-navigation/native";
import { fetchCartAPI, updateCartAPI } from "@/services/cartService";

export default function Cart() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const globalS = useGlobalStyles();
  const router = useRouter();

  const { cartProducts, removeFromCart, addToCart, calculateTotal } = useCart();
  const { replaceCart } = useCart();
  const { token } = useAuthStore();
  const [syncing, setSyncing] = useState(false);

  // Sync cart from server when this screen is focused
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setSyncing(true);
        try {
          const data: any = await fetchCartAPI(token ?? undefined);
          if (!mounted) return;

          const mapped: Product[] = (Array.isArray(data) ? data : []).map(
            (it: any, idx: number) => ({
              id: Number(it.product_id) || idx + 1,
              productId: it.product_id,
              name: it.name || it.product_name || "Producto",
              description: it.description || "",
              price: parseFloat(it.price) || 0,
              image:
                it.image_url && it.image_url.startsWith("http")
                  ? { uri: it.image_url }
                  : require("@/assets/images/products/lata-gato.png"),
              category: it.category_name || "",
              quantity: Number(it.quantity) || 1,
            })
          );

          replaceCart(mapped);
        } catch (err: any) {
          console.error("Error sincronizando carrito:", err);
        } finally {
          if (mounted) setSyncing(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [token])
  );

  const updateQuantity = async (id: number, delta: number) => {
    const product = cartProducts.find((p) => p.id === id);
    if (!product) return;

    const backendId = (product as any).productId ?? String(product.id);
    const currentQty = product.quantity || 1;
    const newQty = currentQty + delta;

    try {
      setSyncing(true);

      await updateCartAPI(
        String(backendId),
        newQty <= 0 ? 0 : newQty,
        token ?? undefined
      );

      // carga denuevo el carrito
      const data: any = await fetchCartAPI(token ?? undefined);
      const mapped: Product[] = (Array.isArray(data) ? data : []).map(
        (it: any, idx: number) => ({
          id: Number(it.product_id) || idx + 1,
          productId: it.product_id,
          name: it.name || it.product_name || "Producto",
          description: it.description || "",
          price: parseFloat(it.price) || 0,
          image:
            it.image_url && it.image_url.startsWith("http")
              ? { uri: it.image_url }
              : require("@/assets/images/products/lata-gato.png"),
          category: it.category_name || "",
          quantity: Number(it.quantity) || 1,
        })
      );

      replaceCart(mapped);
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      Alert.alert("Error", err?.message || "No se pudo actualizar la cantidad");
    } finally {
      setSyncing(false);
    }
  };

  const handlePay = () => {
    router.push("/payment/payment");
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    topHeader: {
      backgroundColor: "#0371ee",
      paddingVertical: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      color: "#fff",
      fontSize: 24,
      fontFamily: "LeagueSpartan_500Medium",
      textAlign: "center",
    },
    scrollContainer: { padding: 20, paddingBottom: 150 },
    emptyText: {
      fontSize: 16,
      fontFamily: "LeagueSpartan_400Regular",
      textAlign: "center",
      marginTop: 50,
    },
    productCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
      padding: 10,
      backgroundColor: colors.background,
      borderRadius: 10,
      elevation: 2,
    },
    productInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
    productImage: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
    productDetails: { flex: 1 },
    productName: {
      fontSize: 16,
      fontFamily: "LeagueSpartan_500Medium",
      marginBottom: 2,
    },
    productPrice: {
      fontSize: 14,
      fontFamily: "LeagueSpartan_400Regular",
      color: "#555",
      marginBottom: 5,
    },
    quantityControl: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
      gap: 10,
    },
    quantityButton: {
      width: 30,
      height: 30,
      borderRadius: 5,
      backgroundColor: "#0371ee",
      alignItems: "center",
      justifyContent: "center",
    },
    quantityButtonText: {
      color: "#fff",
      fontFamily: "LeagueSpartan_500Medium",
      fontSize: 16,
    },
    quantityText: {
      fontSize: 16,
      fontFamily: "LeagueSpartan_500Medium",
    },
    deleteButton: { marginBottom: 10 },
    deleteButtonText: {
      color: "red",
      fontFamily: "LeagueSpartan_500Medium",
      marginTop: 5,
    },
    subtotalText: { fontSize: 18, fontFamily: "LeagueSpartan_500Medium" },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      padding: 15,
      borderTopWidth: 1,
      borderColor: "#ccc",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    totalText: { fontSize: 16, fontFamily: "LeagueSpartan_500Medium" },
  });

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Text style={styles.headerText}>Carrito de compras</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cartProducts.length === 0 ? (
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
        ) : (
          cartProducts.map((product: Product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Image source={product.image} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>
                    Precio unitario: ${product.price.toFixed(2)}
                  </Text>

                  <View style={styles.quantityControl}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(product.id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.quantityText}>
                      {product.quantity || 1}
                    </Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(product.id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.subtotalText}>
                  ${(product.price * (product.quantity || 1)).toFixed(2)}
                </Text>
                <Pressable
                  style={styles.deleteButton}
                  onPress={async () => {
                    try {
                      setSyncing(true);
                      const backendId =
                        (product as any).productId ?? String(product.id);
                      // llamar api yo kese
                      await updateCartAPI(
                        String(backendId),
                        0,
                        token ?? undefined
                      );

                      // ok? lo borra xd
                      const data: any = await fetchCartAPI(token ?? undefined);
                      const mapped: Product[] = (
                        Array.isArray(data) ? data : []
                      ).map((it: any, idx: number) => ({
                        id: Number(it.product_id) || idx + 1,
                        productId: it.product_id,
                        name: it.name || it.product_name || "Producto",
                        description: it.description || "",
                        price: parseFloat(it.price) || 0,
                        image:
                          it.image_url && it.image_url.startsWith("http")
                            ? { uri: it.image_url }
                            : require("@/assets/images/products/lata-gato.png"),
                        category: it.category_name || "",
                        quantity: Number(it.quantity) || 1,
                      }));

                      replaceCart(mapped);
                    } catch (err: any) {
                      console.error("Error removing item from cart:", err);
                      Alert.alert(
                        "Error",
                        err?.message || "No se pudo eliminar el producto"
                      );
                    } finally {
                      setSyncing(false);
                    }
                  }}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
        <Button type="primary" onPress={handlePay} style={{ minWidth: 100 }}>
          Pagar
        </Button>
      </View>
    </SafeAreaProvider>
  );
}
