import { Header } from "@/components/ui/header";
import { Colors } from "@/constants/theme";
import { useGlobalStyles } from "@/styles/globalStyles";
import { useState, useCallback } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useFocusEffect } from "@react-navigation/native";
import { fetchCurrentUser, updateCurrentUser } from "@/services/userService";
import {
  nameValidator,
  emailValidator,
  phoneValidator,
  isEmpty,
} from "@/utils/validators";
import { Button } from "@/components/ui/button";
interface User {
  id: string;
  name: string;
  lastName: string;
  motherLastName: string;
  image?: any;
  email: string;
  phone?: string;
}

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const globalS = useGlobalStyles;
  const router = useRouter();

  const [dataUser, setDataUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalBox: {
      width: "90%",
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 8,
      borderRadius: 6,
      marginTop: 8,
    },
    errorText: { color: "red", marginTop: 8 },
  });

  const handlePress = (option: string) => {
    Alert.alert(`Opción seleccionada: ${option}`);
  };

  const openEdit = () => {
    // preload form
    setFormName(dataUser?.name || "");
    setFormLastName(dataUser?.lastName || "");
    setFormMotherName(dataUser?.motherLastName || "");
    setFormEmail(dataUser?.email || "");
    setFormPhone(dataUser?.phone || "");
    setFormError("");
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    // validations
    if (
      isEmpty(formName) ||
      isEmpty(formLastName) ||
      isEmpty(formMotherName) ||
      isEmpty(formEmail) ||
      isEmpty(formPhone)
    ) {
      setFormError("Ingrese todos los datos obligatorios");
      return;
    }
    if (!nameValidator(formName)) {
      setFormError("Nombre inválido");
      return;
    }
    if (!nameValidator(formLastName)) {
      setFormError("Apellido paterno inválido");
      return;
    }
    if (!nameValidator(formMotherName)) {
      setFormError("Apellido materno inválido");
      return;
    }
    const emailErr = emailValidator(formEmail);
    if (emailErr) {
      setFormError(emailErr);
      return;
    }
    if (formPhone && !phoneValidator(formPhone)) {
      setFormError("Teléfono inválido. Debe contener exactamente 10 dígitos");
      return;
    }

    const body = {
      name: formName,
      lastName: formLastName,
      motherLastName: formMotherName,
      email: formEmail,
      phone: formPhone,
      password: null,
    };

    try {
      setSaving(true);
      const res = await updateCurrentUser(body, token ?? undefined);
      setDataUser({
        id: dataUser?.id || "",
        name: formName,
        lastName: formLastName,
        motherLastName: formMotherName,
        email: formEmail,
        phone: formPhone,
      });
      setEditModalVisible(false);
      Alert.alert("Éxito", "Datos actualizados correctamente");
    } catch (err: any) {
      console.error("Error updating user:", err);
      setFormError(err?.message || "No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  };

  const ordersHandle = () => {
    router.push("/userTabs/orders");
  };

  const { logout, token } = useAuthStore();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formMotherName, setFormMotherName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        try {
          const data: any = await fetchCurrentUser(token ?? undefined);
          if (!mounted) return;
          const raw = data?.user ? data.user : data;
          if (raw) {
            setDataUser({
              id: String(raw.user_id || raw.id || ""),
              name: raw.name || "",
              lastName: raw.last_name || raw.lastName || "",
              motherLastName: raw.mother_name || raw.motherName || "",
              email: raw.email || "",
              phone: raw.phone || "",
            });
          } else {
            setDataUser(null);
          }
        } catch (err) {
          // Silently ignore and keep dataUser null
          setDataUser(null);
        } finally {
          if (mounted) setLoading(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [token])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.header}>
            <Header text="Mi perfil" onBackPress={router.back} />
          </View>

          <View style={styles.infoContainer}>
            <View>
              {loading ? (
                <ActivityIndicator size="small" color="#0371ee" />
              ) : (
                <>
                  <Text style={styles.nameLabel}>
                    {dataUser
                      ? `${dataUser.name} ${dataUser.lastName} ${dataUser.motherLastName}`
                      : "Usuario"}
                  </Text>
                  <Text style={styles.emailLabel}>{dataUser?.email || ""}</Text>
                  <Text style={styles.emailLabel}>{dataUser?.phone || ""}</Text>
                </>
              )}
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
                onPress={() => openEdit()}
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
              <Modal
                visible={editModalVisible}
                transparent
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalBox}>
                    <Text style={{ fontSize: 18, fontWeight: "700" }}>
                      Editar información
                    </Text>
                    <TextInput
                      placeholder="Nombre"
                      style={styles.input}
                      value={formName}
                      onChangeText={setFormName}
                    />
                    <TextInput
                      placeholder="Apellido paterno"
                      style={styles.input}
                      value={formLastName}
                      onChangeText={setFormLastName}
                    />
                    <TextInput
                      placeholder="Apellido materno"
                      style={styles.input}
                      value={formMotherName}
                      onChangeText={setFormMotherName}
                    />
                    <TextInput
                      placeholder="Email"
                      style={styles.input}
                      value={formEmail}
                      onChangeText={setFormEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <TextInput
                      placeholder="Teléfono (10 dígitos)"
                      style={styles.input}
                      value={formPhone}
                      onChangeText={setFormPhone}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                    {formError ? (
                      <Text style={styles.errorText}>{formError}</Text>
                    ) : null}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 12,
                      }}
                    >
                      <Button
                        type="secondary"
                        onPress={() => setEditModalVisible(false)}
                        style={{ marginRight: 8 }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="primary"
                        onPress={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Guardando..." : "Guardar"}
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
              {/* cerrar sesision idk w */}
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
