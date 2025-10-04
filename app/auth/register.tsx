import { Colors } from "@/constants/theme";
import { ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function register() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <View>
            <Text style={{ color: colors.text }}>Register Screen</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
