import { Colors } from "@/constants/theme";
import { ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function login() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View>
            <Text>Hola Bienvenido!</Text>
          </View>

          <Text>Inicia sesión para continuar</Text>

          <View></View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
