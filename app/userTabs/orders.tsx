import { Colors } from "@/constants/theme";
import { useGlobalStyles } from "@/styles/globalStyles";
import {
  useColorScheme,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Modal,
  Linking,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: "Pendiente de pago" | "Pagado" | "Cancelado";
  total: number;
  image: any;
}

export default function Orders() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const globalS = useGlobalStyles();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: "PED-001",
      date: "2025-10-07",
      status: "Pendiente de pago",
      total: 141.2,
      image: require("@/assets/images/Logo.png"),
    },
    {
      id: 2,
      orderNumber: "PED-002",
      date: "2025-10-06",
      status: "Pagado",
      total: 85.5,
      image: require("@/assets/images/Logo.png"),
    },
  ]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const openMapLocation = () => {
    const url = "https://maps.app.goo.gl/WWCwJdPs1RiXtuQe6";
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "No se pudo abrir el enlace de ubicación.")
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topHeader}>
          <Text style={styles.headerText}>Mis pedidos</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>No tienes pedidos registrados</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Image source={order.image} style={styles.productImage} />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>
                      Pedido: {order.orderNumber}
                    </Text>
                    <Text style={styles.productPrice}>Fecha: {order.date}</Text>
                    <Text style={styles.productPrice}>
                      Estado: {order.status}
                    </Text>
                    <Text style={styles.subtotalText}>
                      Total: ${order.total.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <Button
                  type="primary"
                  onPress={() => handleViewDetails(order)}
                  style={{ marginTop: 10 }}
                >
                  Ver detalles
                </Button>
              </View>
            ))
          )}
        </ScrollView>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={modalStyles.overlay}>
            <View style={modalStyles.container}>
              {selectedOrder && (
                <>
                  <Text style={modalStyles.title}>Detalles del pedido</Text>
                  <Text>Número: {selectedOrder.orderNumber}</Text>
                  <Text>Fecha: {selectedOrder.date}</Text>
                  <Text>Estado: {selectedOrder.status}</Text>
                  <Text>Total: ${selectedOrder.total.toFixed(2)}</Text>
                  {selectedOrder.status === "Pendiente de pago" && (
                    <Button
                      type="danger"
                      onPress={() => {
                        Alert.alert(
                          "Cancelado",
                          "El pedido ha sido cancelado."
                        );
                        setModalVisible(false);
                      }}
                      style={{ marginTop: 20 }}
                    >
                      Cancelar pedido
                    </Button>
                  )}
                  <Button
                    type="secondary"
                    onPress={() => setModalVisible(false)}
                    style={{ marginTop: 10 }}
                  >
                    Cerrar
                  </Button>
                </>
              )}
              <View style={modalStyles.pickupSection}>
                <Text style={modalStyles.subtitle}>
                  📍 Recolección en sucursal
                </Text>
                <Text style={modalStyles.pickupText}>
                  Tu pedido estará disponible para recoger en:
                </Text>
                <Text style={modalStyles.pickupAddress}>
                  Clínica Veterinaria San Francisco de Asís Av Francisco I
                  Madero #123, Monte Blanco, VER
                </Text>
                <Button
                  type="primary"
                  onPress={openMapLocation}
                  style={{ marginTop: 10 }}
                >
                  Ver ubicación en mapa
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { padding: 20 },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#555",
  },
  productCard: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  subtotalText: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
    color: "#0371ee",
  },
  topHeader: {
    backgroundColor: "#0371eeff",
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
});
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  pickupSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickupText: {
    fontSize: 14,
    color: "#555",
  },
  pickupAddress: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "#0371ee",
  },
});
