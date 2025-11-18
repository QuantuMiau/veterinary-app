import { Header } from "@/components/ui/header";
import { Colors } from "@/constants/theme";
import { useGlobalStyles } from "@/styles/globalStyles";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
interface User {
  id: string;
  name: string;
  lastName: string;
  motherLastName: string;
  image?: any;
  email: string;
}

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const globalS = useGlobalStyles;
  const router = useRouter();

  const [dataUser, setDataUser] = useState<User>({
    id: "1",
    name: "Mauricio",
    lastName: "Esperón",
    motherLastName: "Andrade",
    email: "mauricio@example.com",
    image: require("@/assets/images/user.jpg"),
  });

  const styles = StyleSheet.create({
    infoContainer: {
      backgroundColor: "#CAD6FF",
      minHeight: 150,
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 10,
    },
    userImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    option: {
      flexDirection: "row",
      paddingVertical: 10,
      backgroundColor: "transparent",
      borderBottomWidth: 0.5,
      borderColor: colors.text,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
      marginRight: "auto",
      fontFamily: "LeagueSpartan_500Medium",
    },
    optionsContainer: {
      marginTop: 20,
      paddingLeft: 30,
      paddingRight: 30,
      gap: 20,
    },
    otherOptions: {
      gap: 10,
    },
    nameLabel: {
      fontFamily: "LeagueSpartan_500Medium",
      fontSize: 20,
    },
    emailLabel: {
      fontFamily: "LeagueSpartan_400Regular",
      fontSize: 16,
    },
    subHeader: {
      fontFamily: "LeagueSpartan_500Medium",
      color: colors.textTheme,
      fontSize: 20,
    },
    header: {
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 10,
    },
  });

  const handlePress = (option: string) => {
    Alert.alert(`Opción seleccionada: ${option}`);
  };

  const ordersHandle = () => {
    router.push("/userTabs/orders");
  };

  const { logout } = useAuthStore();

  const handleLogout = () => {
    // Confirm before logging out
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              // Después de logout, navegar al login
              router.replace("/auth/login");
            } catch (err) {
              console.error("Error during logout:", err);
              Alert.alert(
                "Error",
                "No se pudo cerrar sesión. Intenta de nuevo."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.header}>
            <Header text="Mi perfil" onBackPress={router.back} />
          </View>

          <View style={styles.infoContainer}>
            <Image source={dataUser.image} style={styles.userImage} />
            <View>
              <Text style={styles.nameLabel}>
                {dataUser.name} {dataUser.lastName} {dataUser.motherLastName}
              </Text>
              <Text style={styles.emailLabel}>{dataUser.email}</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && { backgroundColor: "#e9e9e991" },
              ]}
              onPress={() => ordersHandle()}
            >
              <Feather
                name="package"
                size={24}
                color="black"
                style={{ marginRight: 15 }}
              />
              <Text style={styles.optionText}>Mis pedidos</Text>
              <FontAwesome6 name="angle-right" size={24} color="black" />
            </Pressable>

            <Text style={styles.subHeader}>Cuenta y seguridad</Text>

            <View style={styles.otherOptions}>
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && { backgroundColor: "#e9e9e991" },
                ]}
                onPress={() => handlePress("Editar información")}
              >
                <Feather
                  name="user"
                  size={24}
                  color="black"
                  style={{ marginRight: 15 }}
                />
                <Text style={styles.optionText}>Editar información</Text>
                <FontAwesome6 name="angle-right" size={24} color="black" />
              </Pressable>
              {/* cerrar sesision idk */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  pressed && { backgroundColor: "#e9e9e991" },
                ]}
                onPress={handleLogout}
              >
                <Feather
                  name="log-out"
                  size={24}
                  color="black"
                  style={{ marginRight: 15 }}
                />
                <Text style={[styles.optionText, { color: "black" }]}>
                  Cerrar sesión
                </Text>
                <FontAwesome6 name="angle-right" size={24} color="black" />
              </Pressable>
            </View>
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
