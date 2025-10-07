import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

import {
  LeagueSpartan_100Thin,
  LeagueSpartan_300Light,
  LeagueSpartan_500Medium,
  useFonts,
} from "@expo-google-fonts/league-spartan";

interface ButtonProps extends TouchableOpacityProps {
  type: "primary" | "secondary" | "danger";
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export const Button = ({
  type,
  disabled,
  loading,
  style,
  textStyle,
  children,
  ...rest
}: ButtonProps) => {
  const textColor = type === "secondary" ? "#000" : "#fff";

  const [fontsLoaded] = useFonts({
    LeagueSpartan_100Thin,
    LeagueSpartan_500Medium,
    LeagueSpartan_300Light,
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || loading}
      {...rest}
      style={[
        styles.button,
        type === "primary" && styles.primary,
        type === "secondary" && styles.secondary,
        type === "danger" && styles.danger,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={type === "secondary" ? "#000" : "#fff"} />
      ) : (
        <View style={styles.content}>
          {typeof children === "string" || typeof children === "number" ? (
            <Text style={[styles.text, { color: textColor }, textStyle]}>
              {children}
            </Text>
          ) : React.isValidElement(children) ? (
            children
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: "#2260FF" },
  secondary: { backgroundColor: "#CAD6FF" },
  danger: { backgroundColor: "#DC2626" },
  disabled: { opacity: 0.7, minHeight: 50 },
  text: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "LeagueSpartan_500Medium",
  },
});
