import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Colors } from "@/constants/theme";
import { globalStyles } from "@/styles/globalStyles";
import { emailValidator } from "@/utils/validators";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function restorePass() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const globalS = globalStyles();
  const router = useRouter();

  // * states
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  // * fns
  function restorePass() {
    const erroVal = emailValidator(email);
    if (erroVal != "") {
      setErrorMsg(erroVal);
      return;
    }

    setErrorMsg("");
    setLoadingButton(true);

    setTimeout(() => {
      Alert.alert("", `Código enviado al correo ${email}`, [
        {
          text: "OK",
          onPress: () => {
            setLoadingButton(false);
            setEmail("");
          },
        },
      ]);
    }, 1000);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={globalS.container}>
          <Header text="Recuperar contraseña"></Header>
          <Text style={globalS.description}>
            Introduce tu correo electrónico registrado y recibirás un código en
            tu bandeja de entrada para restablecer tu contraseña. Asegúrate de
            ingresar la dirección correcta para completar el proceso sin
            inconvenientes.
          </Text>

          <View style={globalS.errorMsg}>
            <Text style={globalS.errorText}>{errorMsg}</Text>
          </View>
          <View style={globalS.form}>
            <View>
              <Text style={globalS.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@gmail.com"
                style={globalS.input}
              />
            </View>
          </View>

          <View style={globalS.buttons}>
            <Button
              type="primary"
              loading={loadingButton}
              onPress={restorePass}
            >
              Enviar
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
