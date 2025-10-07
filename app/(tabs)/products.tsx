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

interface Product {
  id: number;
  name: string;
  price: number;
  image: any;
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

export default function ProductsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [search, setSearch] = useState("");
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Producto 1",
      price: 85.5,
      image: require("@/assets/images/Logo.png"),
    },
    {
      id: 2,
      name: "Producto 2",
      price: 30,
      image: require("@/assets/images/Logo.png"),
    },
    {
      id: 3,
      name: "Producto 3",
      price: 25.7,
      image: require("@/assets/images/Logo.png"),
    },
    {
      id: 4,
      name: "Producto 4",
      price: 40,
      image: require("@/assets/images/Logo.png"),
    },
    {
      id: 5,
      name: "Producto 5",
      price: 60,
      image: require("@/assets/images/Logo.png"),
    },
    {
      id: 6,
      name: "Producto 6",
      price: 15.5,
      image: require("@/assets/images/Logo.png"),
    },
  ]);

  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "cheap" | "expensive">("all");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredByFilter = filteredProducts.filter((p) => {
    if (filter === "cheap") return p.price < 50;
    if (filter === "expensive") return p.price >= 50;
    return true;
  });

  const toggleAdd = (id: number) => {
    setAddedIds((prev) => [...prev, id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((i) => i !== id)), 1500);
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
      <SafeAreaView style={styles.safeArea}>
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

        <View style={{ backgroundColor: colors.background }}>
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
                onPress={() => console.log("Card pressed", item.name)}
              >
                <View style={{ position: "relative" }}>
                  <Image source={item.image} style={styles.productImage} />
                  <Pressable
                    style={styles.cartButton}
                    onPress={() => toggleAdd(item.id)}
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

/* 

(\_/)    /\_/\ 
( ^_^)  ( ^.^ )
/ >🥕    

*/
