import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useGlobalStyles } from "@/styles/globalStyles";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  SafeAreaView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Product {
  id: number;
  name: string;
  price: number;
  image: any;
  quantity: number;
}

export default function Cart() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const globalS = useGlobalStyles();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Shampoo para perros Grisi - 280ml",
      price: 85.5,
      image: require("@/assets/images/products/shampoo-perro.png"),
      quantity: 1,
    },
    {
      id: 2,
      name: "Electrodex 450ml - Solución de electrolitos",
      price: 30,
      image: require("@/assets/images/products/electrolito-perro.png"),
      quantity: 1,
    },
    {
      id: 3,
      name: "Pañal para perros talla mediana",
      price: 25.7,
      image: require("@/assets/images/products/dog-pads.png"),
      quantity: 1,
    },
  ]);

  const eliminateProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setProducts((prev) =>
      prev
        .map((p) => {
          if (p.id === id) {
            const newQty = p.quantity + delta;
            return { ...p, quantity: newQty };
          }
          return p;
        })
        .filter((p) => p.quantity > 0)
    );
  };

  const calculateTotal = () =>
    products.reduce((total, p) => total + p.price * p.quantity, 0).toFixed(2);

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topHeader}>
          <Text style={styles.headerText}>Carrito de compras</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {products.length === 0 ? (
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          ) : (
            products.map((product) => (
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
                        {product.quantity}
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
                    ${(product.price * product.quantity).toFixed(2)}
                  </Text>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => eliminateProduct(product.id)}
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
/* 

(\_/)    /\_/\ 
( ^_^)  ( ^.^ )
/ >🥕    

*/
