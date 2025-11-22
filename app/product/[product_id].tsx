import { Stack } from "expo-router";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchProduct } from "@/services/productService";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { addToCartAPI } from "@/services/cartService";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/hooks/use-cart";
import { Colors } from "@/constants/theme";

export default function ProductDetail() {
  const { product_id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const { token } = useAuthStore();
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!product_id) return;
      setLoading(true);
      try {
        const data = await fetchProduct(String(product_id));
        if (!mounted) return;
        setProduct(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        if (!mounted) return;
        setError(err.message || "Error al cargar producto");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [product_id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "Producto no encontrado"}
        </Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBackBtn}>
          <Text style={styles.headerBackText}>{"<"}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Detalle del Producto</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.imageContainer}>
            <Image
              source={
                product.image_url && product.image_url.startsWith("http")
                  ? { uri: product.image_url }
                  : require("@/assets/images/products/lata-gato.png")
              }
              style={styles.image}
            />
          </View>
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
            <Image
              source={
                product.image_url && product.image_url.startsWith("http")
                  ? { uri: product.image_url }
                  : require("@/assets/images/products/lata-gato.png")
              }
              style={styles.modalImage}
            />
          </View>
        </Modal>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>
            ${parseFloat(product.price).toFixed(2)}
          </Text>
          <Text style={styles.category}>
            {product.category_name} • {product.subcategory_name}
          </Text>
          <Text style={styles.desc}>{product.description}</Text>
        </View>

        <View style={styles.stockContainer}>
          <Text style={styles.stockText}>Stock: {product.stock}</Text>
          <Text style={styles.statusText}>
            Estado: {product.status ? "Disponible" : "No disponible"}
          </Text>
        </View>

        <View style={styles.qtyRow}>
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
            disabled={quantity <= 1}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </Pressable>

          <View style={styles.qtyDisplay}>
            <Text style={styles.qtyText}>{quantity}</Text>
          </View>

          <Pressable
            onPress={() => {
              const maxAllowed = Math.min(10, product.stock ?? 10);
              setQuantity((q) => Math.min(maxAllowed, q + 1));
            }}
            style={[
              styles.qtyBtn,
              quantity >= Math.min(10, product.stock ?? 10) &&
                styles.qtyBtnDisabled,
            ]}
            disabled={quantity >= Math.min(10, product.stock ?? 10)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.addBtn, { opacity: product.stock > 0 ? 1 : 0.6 }]}
          onPress={async () => {
            if (!product.product_id) {
              Alert.alert("Error", "ID de producto no disponible");
              return;
            }

            if (product.stock <= 0) {
              Alert.alert(
                "Sin stock",
                "Este producto no tiene stock disponible"
              );
              return;
            }

            const qtyToAdd = quantity;
            try {
              await addToCartAPI(
                String(product.product_id),
                qtyToAdd,
                token ?? undefined
              );

              const localId = Number(product.product_id) || Date.now();
              const localProduct = {
                id: localId,
                name: product.name,
                description: product.description || "",
                price: parseFloat(product.price) || 0,
                image:
                  product.image_url && product.image_url.startsWith("http")
                    ? { uri: product.image_url }
                    : require("@/assets/images/products/lata-gato.png"),
                category: product.category_name || "",
              };

              addToCart(localProduct as any, qtyToAdd);
              Alert.alert("Añadido", "Producto agregado al carrito");
            } catch (err: any) {
              console.error("Error agregando al carrito desde detalle:", err);
              Alert.alert(
                "Error",
                err?.message || "No se pudo agregar al carrito"
              );
            }
          }}
          disabled={product.stock <= 0}
        >
          <Text style={styles.addBtnText}>Agregar al carrito ({quantity})</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    backgroundColor: "#3483fa",
    paddingTop: StatusBar.currentHeight || 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackBtn: { marginRight: 10 },
  headerBackText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "LeagueSpartan_500Medium",
    textAlign: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "LeagueSpartan_500Medium",
    textAlign: "center",
  },
  container: { padding: 20 },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    marginBottom: 20,
  },
  image: { width: "100%", height: 300, borderRadius: 10 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: { width: "90%", height: "70%", resizeMode: "contain" },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "LeagueSpartan_400Regular",
  },
  infoContainer: { paddingHorizontal: 10, marginBottom: 20 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    fontFamily: "LeagueSpartan_400Regular",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00a650",
    marginTop: 8,
    fontFamily: "LeagueSpartan_400Regular",
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    fontFamily: "LeagueSpartan_400Regular",
  },
  desc: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
    lineHeight: 22,
    fontFamily: "LeagueSpartan_400Regular",
  },
  stockContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 20,
  },
  stockText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "LeagueSpartan_400Regular",
  },
  statusText: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
    fontFamily: "LeagueSpartan_400Regular",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  qtyBtn: {
    backgroundColor: "#ddd",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  qtyBtnDisabled: { backgroundColor: "#eee" },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    fontFamily: "LeagueSpartan_500Medium",
  },
  qtyDisplay: {
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    fontFamily: "LeagueSpartan_500Medium",
  },
  addBtn: {
    backgroundColor: "#3483fa",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  addBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "LeagueSpartan_500Medium",
  },
  backBtn: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#333",
    fontSize: 16,
    fontFamily: "LeagueSpartan_400Regular",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "LeagueSpartan_400Regular",
  },
});
//(\___/)  <(Hi!)
//(O w O)/
//(")_(")
