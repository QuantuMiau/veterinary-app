import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  View,
} from "react-native";

const PayPalButton = () => {
  const handlePress = () => {
    Alert.alert(
      "Simulación de Pago",
      "Aquí se iniciaría el proceso de pago con PayPal."
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <View style={styles.content}>
        <Image
          source={{
            uri: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
          }}
          style={styles.logo}
        />
        <Text style={styles.text}>Pagar con PayPal</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFC439",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: "#003087",
    fontWeight: "bold",
  },
});

export default PayPalButton;
