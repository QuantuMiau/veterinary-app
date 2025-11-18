import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Colors } from "@/constants/theme";
import { useGlobalStyles } from "@/styles/globalStyles";
import { formatPhone, registerValidator } from "@/utils/validators";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function register() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const globalS = useGlobalStyles();
  const router = useRouter();

  // ** states
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [motherLastName, setMotherLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loadingButton, setLoadingButton] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const [erroMsg, setErroMsg] = useState("");

  // * functions
  function register() {
    const errorVal = registerValidator(
      name,
      lastName,
      motherLastName,
      email,
      phone,
      password
    );

    if (errorVal !== "") {
      setErroMsg(errorVal);
      return;
    }

    setLoadingButton(true);
    setErroMsg("");

    setTimeout(() => {
      Alert.alert("", "Cuenta creada correctamente", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/auth/login");
            setLoadingButton(false);
            clearInfo();
          },
        },
      ]);
    }, 1000);
  }

  function clearInfo() {
    setName("");
    setLastName("");
    setMotherLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView style={globalS.container}>
          <Header text="Nueva cuenta" onBackPress={router.back}></Header>
          <View style={globalS.form}>
            <View style={globalS.errorMsg}>
              <Text style={globalS.errorText}>{erroMsg}</Text>
            </View>
            <View>
              <Text style={globalS.label}>Nombre</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Mauricio"
                style={globalS.input}
              />
            </View>
            <View>
              <Text style={globalS.label}>Apellido paterno</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Esperon"
                style={globalS.input}
              />
            </View>

            <View>
              <Text style={globalS.label}>Apellido materno</Text>
              <TextInput
                value={motherLastName}
                onChangeText={setMotherLastName}
                placeholder="Mauricio"
                style={globalS.input}
              />
            </View>
            <View>
              <Text style={globalS.label}>Correo</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Mauricio"
                style={globalS.input}
              />
            </View>
            <View>
              <Text style={globalS.label}>Teléfono</Text>
              <TextInput
                value={phone}
                onChangeText={(text) => setPhone(formatPhone(text))}
                placeholder="Mauricio"
                style={globalS.input}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text style={globalS.label}>Contraseña</Text>
              <View style={globalS.passwordContainer}>
                <TextInput
                  value={password}
                  secureTextEntry={showPassword}
                  onChangeText={setPassword}
                  placeholder="********"
                  style={{ flex: 1 }}
                />
                <TouchableOpacity
                  style={globalS.iconContainer}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome6
                    name={showPassword ? "eye-slash" : "eye"}
                    size={22}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <Button
              type="primary"
              loading={loadingButton}
              onPressOut={() => register()}
            >
              Registrarse
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* 

(\_/)    /\_/\ 
( ^_^)  ( ^.^ )
/ >🥕    

*/
