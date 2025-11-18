import { useState } from "react";
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

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

export default function ProductsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [search, setSearch] = useState("");
  const [products] = useState<CartProduct[]>([
    {
      id: 1,
      name: "Alimento húmedo Royal Canin para gatos",
      price: 85.5,
      image: require("@/assets/images/products/lata-gato.png"),
      quantity: 1,
      description:
        "Alimento balanceado enlatado para gatos adultos de todas las razas.",
      category: "Alimentos",
    },
    {
      id: 2,
      name: "Electrodex 450ml - Solución de electrolitos",
      price: 30,
      image: require("@/assets/images/products/electrolito-perro.png"),
      quantity: 1,
      description:
        "Solución oral para rehidratar y reponer electrolitos en perros y gatos.",
      category: "Salud",
    },
    {
      id: 3,
      name: "Pañal para perros talla mediana",
      price: 25.7,
      image: require("@/assets/images/products/dog-pads.png"),
      quantity: 1,
      description:
        "Pañales absorbentes diseñados para perros de tamaño mediano.",
      category: "Accesorios",
    },
    {
      id: 4,
      name: "Inaba Churu - Snack para gatos",
      price: 40,
      image: require("@/assets/images/products/inaba-churu.png"),
      quantity: 1,
      description: "Delicioso snack cremoso para gatos en tubo individual.",
      category: "Snacks",
    },
    {
      id: 5,
      name: "Collar para perros Modelo Top Rope",
      price: 60,
      image: require("@/assets/images/products/collar-perro.png"),
      quantity: 1,
      description:
        "Collar ajustable y resistente para perros de todas las tallas.",
      category: "Accesorios",
    },
    {
      id: 6,
      name: "Raton juguete para gatos",
      price: 15.5,
      image: require("@/assets/images/products/raton-juguete-para-gato.png"),
      quantity: 1,
      description: "Juguete interactivo en forma de ratón para gatos.",
      category: "Juguetes",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "cheap" | "expensive">("all");
  const { cartProducts, addToCart } = useCart(); // ✅ usamos el hook

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredByFilter = filteredProducts.filter((p) => {
    if (filter === "cheap") return p.price < 50;
    if (filter === "expensive") return p.price >= 50;
    return true;
  });

  const [addedIds, setAddedIds] = useState<number[]>([]);

  const handleAddToCart = (product: CartProduct) => {
    const existing = cartProducts.find((p) => p.id === product.id);
    if (existing) {
      addToCart({ ...product, quantity: (existing.quantity || 1) + 1 });
    } else {
      addToCart(product);
    }

    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
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
          <FlatList
            contentContainerStyle={styles.grid}
            data={filteredByFilter}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <Pressable
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
                        addedIds.includes(item.id) ? "cart-check" : "cart-plus"
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
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
