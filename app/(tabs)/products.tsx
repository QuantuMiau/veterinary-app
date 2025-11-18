import { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/theme";
import { useCart, Product as CartProduct } from "@/hooks/use-cart";
import { useRouter } from "expo-router";
import { fetchProducts, RawProduct } from "@/services/productService";
import {
  ActivityIndicator,
  Text as RNText,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { addToCartAPI } from "@/services/cartService";
import { useAuthStore } from "@/store/authStore";
import { Alert } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

export default function ProductsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  // Resolve image: if image_url appears to be an http url use uri, otherwise try local mapping
  const resolveImage = (image_key?: string) => {
    if (!image_key) return require("@/assets/images/products/lata-gato.png");
    if (image_key.startsWith("http")) return { uri: image_key };

    // Map known keys to local assets (extend as needed)
    const map: Record<string, any> = {
      lata_gato: require("@/assets/images/products/lata-gato.png"),
      electrolito_perro: require("@/assets/images/products/electrolito-perro.png"),
      dog_pads: require("@/assets/images/products/dog-pads.png"),
      inaba_churu: require("@/assets/images/products/inaba-churu.png"),
      collar_perro: require("@/assets/images/products/collar-perro.png"),
      raton_juguete: require("@/assets/images/products/raton-juguete-para-gato.png"),
      shampoo_perro: require("@/assets/images/products/shampoo-perro.png"),
    };

    const key = image_key.replace(/\W+/g, "_").toLowerCase();
    return map[key] ?? require("@/assets/images/products/lata-gato.png");
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      const parsed: CartProduct[] = data.map((p, idx) => ({
        id: idx + 1,
        name: p.name,
        description: "",
        price: parseFloat(p.price) || 0,
        image: resolveImage(p.image_url),
        category: "",
        quantity: 1,
        // keep backend id for navigation
        // @ts-ignore: extended property for navigation only
        productId: p.product_id,
      }));
      setProducts(parsed);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err?.message || "Error al obtener productos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) load();
    return () => {
      mounted = false;
    };
  }, [load]);

  // Re-fetch when screen is focused (e.g., after navigating back from add-product)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const [filter, setFilter] = useState<"all" | "cheap" | "expensive">("all");
  const { cartProducts, addToCart } = useCart(); // ✅ usamos el hook
  const router = useRouter();
  const { token } = useAuthStore();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredByFilter = filteredProducts.filter((p) => {
    if (filter === "cheap") return p.price < 50;
    if (filter === "expensive") return p.price >= 50;
    return true;
  });

  const [addedIds, setAddedIds] = useState<number[]>([]);

  const handleAddToCart = async (product: CartProduct) => {
    const backendProductId = (product as any).productId as string | undefined;
    const qtyToAdd = 1;

    if (!backendProductId) {
      Alert.alert("Error", "No se encontró productId para este producto");
      return;
    }

    try {
      // Llamar al API primero
      await addToCartAPI(backendProductId, qtyToAdd, token ?? undefined);

      // Si ok, actualizar carrito local
      const existing = cartProducts.find((p) => p.id === product.id);
      if (existing) {
        addToCart({
          ...product,
          quantity: (existing.quantity || 1) + qtyToAdd,
        });
      } else {
        addToCart(product);
      }

      setAddedIds((prev) => [...prev, product.id]);
      setTimeout(() => {
        setAddedIds((prev) => prev.filter((id) => id !== product.id));
      }, 1500);
    } catch (err: any) {
      console.error("Error adding to cart API:", err);
      Alert.alert("Error", err?.message || "No se pudo agregar al carrito");
    }
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#0371ee" },
    header: {
      width: "100%",
      padding: 10,
      backgroundColor: "#0371ee",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    searchInput: {
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 100,
      marginTop: 10,
      fontFamily: "LeagueSpartan_400Regular",
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 10,
    },
    filterButton: {
      paddingHorizontal: 12,
      borderRadius: 8,
      paddingVertical: 6,
    },
    filterText: {
      fontFamily: "LeagueSpartan_400Regular",
      color: "rgba(255,255,255,0.5)",
    },
    filterTextActive: {
      fontFamily: "LeagueSpartan_500Medium",
      color: "white",
    },
    grid: { padding: 15 },
    productCard: {
      width: ITEM_WIDTH,
      marginBottom: 20,
      borderRadius: 10,
      backgroundColor: "#fafafa",
      overflow: "hidden",
      elevation: 2,
    },
    productCardPressed: {
      backgroundColor: "#e0e0e0",
    },
    productImage: { width: "100%", height: ITEM_WIDTH, resizeMode: "cover" },
    productInfo: { padding: 10 },
    productName: {
      fontSize: 16,
      fontFamily: "LeagueSpartan_500Medium",
      marginBottom: 5,
    },
    productPrice: {
      fontSize: 14,
      fontFamily: "LeagueSpartan_400Regular",
      color: "#555",
      marginBottom: 10,
    },
    cartButton: {
      position: "absolute",
      bottom: 8,
      right: 8,
      backgroundColor: "#fff",
      width: 30,
      height: 30,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { flex: 1 }]}>
        <View style={styles.header}>
          <TextInput
            placeholder="Buscar productos..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <View style={styles.filterContainer}>
            {["all", "cheap", "expensive"].map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f as "all" | "cheap" | "expensive")}
                style={styles.filterButton}
              >
                <Text
                  style={
                    filter === f ? styles.filterTextActive : styles.filterText
                  }
                >
                  {f === "all" ? "Todos" : f === "cheap" ? "Baratos" : "Caros"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {loading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" />
            </View>
          ) : error ? (
            <View style={{ padding: 20 }}>
              <RNText style={{ color: "red" }}>{error}</RNText>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={styles.grid}
              data={filteredByFilter}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={Colors[colorScheme ?? "light"].tint}
                />
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    // cast a any to satisfy expo-router strict types
                    router.push(
                      `/product/${(item as any).productId}` as unknown as any
                    )
                  }
                  style={({ pressed }) => [
                    styles.productCard,
                    pressed && styles.productCardPressed,
                  ]}
                >
                  <View style={{ position: "relative" }}>
                    <Image source={item.image} style={styles.productImage} />
                    <Pressable
                      style={styles.cartButton}
                      onPress={() => handleAddToCart(item)}
                    >
                      <MaterialCommunityIcons
                        name={
                          addedIds.includes(item.id)
                            ? "cart-check"
                            : "cart-plus"
                        }
                        size={20}
                        color={addedIds.includes(item.id) ? "green" : "black"}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
