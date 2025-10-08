import { globalStyles } from "@/styles/globalStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label: string;
}

export const InputPassword = ({ label, ...rest }: InputProps) => {
  const globalS = globalStyles();
  const [showPassword, setShowPassword] = useState(true);

  return (
    <View>
      <Text style={globalS.label}>{label}</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          {...rest}
          secureTextEntry={showPassword}
          style={[{ flex: 1 }, rest.style]} // evita undefined en style
        />

        <TouchableOpacity
          style={styles.iconContainer}
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
  );
};

const styles = StyleSheet.create({
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
});
