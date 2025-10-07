import { Colors } from "@/constants/theme";
import { StyleSheet, useColorScheme } from "react-native";

export const globalStyles = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return StyleSheet.create({
    container: {
      padding: 30,
    },
    subtitle: {
      fontSize: 24,
      fontFamily: "LeagueSpartan_500Medium",
      color: colors.textTheme,
    },
    description: {
      fontSize: 16,
      fontFamily: "LeagueSpartan_400Regular",
      textAlign: "justify",
      marginBottom: 25,
    },
    input: {
      borderColor: "#90AAF5",
      borderWidth: 1,
      borderRadius: 12,
    },
    label: {
      fontSize: 20,
      color: colors.text,
    },
    form: {
      gap: 12,
      marginBottom: 35,
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
    iconContainer: {
      marginLeft: 8,
    },
    errorMsg: {
      minHeight: 22,
    },
    errorText: {
      fontSize: 16,
      color: colors.text,
    },
    buttons: {
      gap: 12,
    },
    headerText: {
      color: "#fff",
      fontSize: 24,
      fontFamily: "LeagueSpartan_500Medium",
      textAlign: "center",
    },
  });
};

/* 

(\_/)    /\_/\ 
( ^_^)  ( ^.^ )
/ >🥕    

*/
