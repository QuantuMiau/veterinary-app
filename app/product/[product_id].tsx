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
} from "react-native";
import { addToCartAPI } from "@/services/cartService";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/hooks/use-cart";
import { Alert } from "react-native";
import { Colors } from "@/constants/theme";

export default function ProductDetail() {
  const { product_id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          {error ?? "Producto no encontrado"}
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: Colors.light.tint, marginTop: 10 }}>
            Volver
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={
          product.image_url && product.image_url.startsWith("http")
            ? { uri: product.image_url }
            : require("@/assets/images/products/lata-gato.png")
        }
        style={styles.image}
      />

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${parseFloat(product.price).toFixed(2)}</Text>
      <Text style={styles.category}>
        {product.category_name} • {product.subcategory_name}
      </Text>

      <Text style={styles.desc}>{product.description}</Text>

      <View style={{ marginTop: 20 }}>
        <Text>Stock: {product.stock}</Text>
        <Text>Estado: {product.status ? "Disponible" : "No disponible"}</Text>
      </View>

      {/* Quantity selector */}
      <View style={styles.qtyRow}>
        <Pressable
          onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          style={styles.qtyBtn}
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
          style={styles.qtyBtn}
          disabled={quantity >= Math.min(10, product.stock ?? 10)}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </Pressable>
      </View>

      {/* Add to cart button */}
      <Pressable
        style={[styles.addBtn, { opacity: product.stock > 0 ? 1 : 0.6 }]}
        onPress={async () => {
          if (!product.product_id) {
            Alert.alert("Error", "ID de producto no disponible");
            return;
          }

          if (product.stock <= 0) {
            Alert.alert("Sin stock", "Este producto no tiene stock disponible");
            return;
          }

          const qtyToAdd = quantity;
          try {
            await addToCartAPI(
              String(product.product_id),
              qtyToAdd,
              token ?? undefined
            );

            // Build a local product shape compatible with useCart
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
        <Text style={{ color: "white", fontWeight: "700" }}>
          Agregar al carrito ({quantity})
        </Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ color: "white" }}>Volver</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 250, height: 250, resizeMode: "cover", borderRadius: 12 },
  title: { fontSize: 22, fontWeight: "700", marginTop: 12 },
  price: { fontSize: 18, color: "#333", marginTop: 6 },
  category: { color: "#666", marginTop: 6 },
  desc: { marginTop: 12, textAlign: "center" },
  backBtn: {
    marginTop: 20,
    backgroundColor: "#0371ee",
    padding: 12,
    borderRadius: 8,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  qtyBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  qtyBtnText: { fontSize: 20, fontWeight: "700" },
  qtyDisplay: {
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  qtyText: { fontSize: 18, fontWeight: "700" },
  addBtn: {
    marginTop: 16,
    backgroundColor: "#37a362",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
