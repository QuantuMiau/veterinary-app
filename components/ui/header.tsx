import { Colors } from "@/constants/theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

interface HeaderProps {
  text: string;
  onBackPress?: () => void;
}

export const Header = ({ text, onBackPress }: HeaderProps) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const styles = StyleSheet.create({
    title: {
      fontSize: 28,
      marginLeft: "auto",
      marginRight: "auto",
      fontFamily: "LeagueSpartan_600SemiBold",
      color: colors.textTheme,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 40,
    },
    button: {
      minWidth: 30,
    },
  });

  return (
    <View style={styles.header}>
      <Pressable onPress={onBackPress} style={styles.button}>
        <FontAwesome6 name="angle-left" size={28} color="black" />
      </Pressable>
      <Text style={styles.title}>{text}</Text>
    </View>
  );
};
