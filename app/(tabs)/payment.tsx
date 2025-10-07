import { Colors } from "@/constants/theme";
import {
  cardNumberMask,
  cvvMask,
  expiryDateMask,
  paymentValidator,
} from "@/utils/validators";
import { useState } from "react";
import {
  ScrollView,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useGlobalStyles } from "@/styles/globalStyles";
import PayPalButton from "@/components/ui/paypal-button";
import { useRouter } from "expo-router";

export default function PaymentScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const globalS = useGlobalStyles();
  const router = useRouter();

  const [remember, setRemember] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setaddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  function paymentForm() {
    const errorVal = paymentValidator(
      cardNumber,
      expiryDate,
      cvv,
      fullName,
      address
    );
    if (errorVal !== "") {
      setErrorMsg(errorVal);
      console.log(errorVal);
      return;
    }
    setErrorMsg("");
    setLoadingButton(true);

    setTimeout(() => {
      Alert.alert("", "Pago exitoso", [
        {
          text: "OK",
          onPress: () => {
            setLoadingButton(false);
            router.replace("/(tabs)/cart");
          },
        },
      ]);
    }, 1000);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.topHeader}>
            <Text style={styles.headerText}>Pago</Text>
          </View>
          <View style={globalS.container}>
            <View style={globalS.errorMsg}>
              <Text style={globalS.errorText}>{errorMsg}</Text>
            </View>
            <Text style={globalS.label}> Número de tarjeta </Text>
            <TextInput
              placeholder="XXXX-XXXX-XXXX-XXXX"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(cardNumberMask(text))}
              maxLength={19}
              style={globalS.input}
            />
            <Text style={globalS.label}> Fecha de expiración </Text>
            <TextInput
              placeholder="MM/AA"
              keyboardType="numeric"
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(expiryDateMask(text))}
              maxLength={5}
              style={globalS.input}
            />
            <Text style={globalS.label}> CVV </Text>
            <TextInput
              placeholder="XXX"
              keyboardType="numeric"
              value={cvv}
              onChangeText={(text) => setCvv(cvvMask(text))}
              maxLength={3}
              style={globalS.input}
            />
            <Text style={globalS.label}> Nombre del titular </Text>
            <TextInput
              placeholder="Nombre(s) Apellido"
              value={fullName}
              onChangeText={setFullName}
              maxLength={40}
              style={globalS.input}
            />
            <Text style={globalS.label}> Dirección de tarjeta </Text>
            <TextInput
              placeholder=""
              value={address}
              onChangeText={setaddress}
              maxLength={50}
              style={globalS.input}
            />
            <View>
              <Text style={globalS.label}>Recordar método de pago</Text>
              <TouchableOpacity
                onPress={() => setRemember(!remember)}
                style={styles.checkbox}
              >
                {remember ? <Text style={styles.checkmark}>✓</Text> : null}
              </TouchableOpacity>
            </View>

            <View>
              <Button
                type="primary"
                onPress={paymentForm}
                loading={loadingButton}
              >
                Confirmar
              </Button>
            </View>
            <View>
              <PayPalButton></PayPalButton>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "white",
  },
  checkmark: {
    fontSize: 18,
    color: "blue",
  },
  checkboxLabel: {
    fontSize: 16,
  },
});
