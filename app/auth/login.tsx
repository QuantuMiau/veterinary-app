import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Colors } from "@/constants/theme";
import { globalStyles } from "@/styles/globalStyles";
import { loginValidator } from "@/utils/validators";
import {
  LeagueSpartan_400Regular,
  LeagueSpartan_500Medium,
  LeagueSpartan_600SemiBold,
  LeagueSpartan_700Bold,
  useFonts,
} from "@expo-google-fonts/league-spartan";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation, useRouter } from "expo-router";

import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function login() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const navigation = useNavigation();
  // estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const [fontsLoaded] = useFonts({
    LeagueSpartan_600SemiBold,
    LeagueSpartan_400Regular,
    LeagueSpartan_500Medium,
    LeagueSpartan_700Bold,
  });
  const globalS = globalStyles();
  const styles = StyleSheet.create({
    input: {
      borderColor: "#90AAF5",
      borderWidth: 1,
      borderRadius: 12,
    },

    iconContainer: {
      marginLeft: 8,
    },
    passwordContainer: {
      borderColor: "#90AAF5",
      flexDirection: "row",
      borderWidth: 1,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 5,
      paddingRight: 5,
    },
    errorMsg: {
      minHeight: 22,
    },
    errorText: {
      fontSize: 16,
      color: colors.text,
    },
    forgotPass: {
      textAlign: "left",
      color: colors.textTheme,
    },
    forgotContainer: {
      alignItems: "flex-end",
    },
  });

  function login(email: string, password: string) {
    const erroVal = loginValidator(email, password);
    if (erroVal != "") {
      setErrorMsg(erroVal);
      return;
    }
    setErrorMsg("");
    setLoadingButton(true);

    setTimeout(() => {
      Alert.alert("", "Sesion iniciada", [
        {
          text: "OK",
          onPress: () => {
            setLoadingButton(false);
            router.replace("/(tabs)/home");
          },
        },
      ]);
    }, 1000);
    setEmail("");
    setPassword("");
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={globalS.container}>
          <Header text="Hola!!" onBackPress={() => router.back()} />
          <Text style={[globalS.subtitle, { marginBottom: 20 }]}>
            Inicia sesión para continuar
          </Text>
          <View style={styles.errorMsg}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
          <View style={globalS.form}>
            {/*email */}
            <View>
              <Text style={globalS.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@gmail.com"
                style={styles.input}
              />
            </View>
            {/*password */}
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

            <View style={styles.forgotContainer}>
              <Pressable
                onPress={() => {
                  router.push("/auth/restore_pass");
                }}
              >
                <Text style={styles.forgotPass}>Olvide mi contraseña</Text>
              </Pressable>
            </View>
          </View>

          <View style={globalS.buttons}>
            <Button
              type="primary"
              onPress={() => {
                login(email, password);
              }}
              loading={loadingButton}
            >
              Iniciar Sesion
            </Button>
            <Button
              type="secondary"
              onPress={() => {
                router.push("/auth/register");
              }}
            >
              Registrarse
            </Button>
          </View>

          <View></View>
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
