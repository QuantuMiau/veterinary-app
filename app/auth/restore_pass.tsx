import { Colors } from "@/constants/theme";
import { ScrollView, Text, useColorScheme, View } from "react-native";

export default function restorePass() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  return (
    <ScrollView>
      <View>
        <Text style={{ color: colors.text }}>Restore password Screen</Text>
      </View>
    </ScrollView>
  );
}
