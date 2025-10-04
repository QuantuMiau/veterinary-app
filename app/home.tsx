import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

// ! recordar importar Button de @/components/ui/button
// ? porque importarlo desde ahi ?
// ** Es el componente personalizado para botones
import { Button } from "@/components/ui/button";

// ! recordar importar useFonts y las fuentes
import {
  LeagueSpartan_100Thin,
  LeagueSpartan_300Light,
  LeagueSpartan_600SemiBold,
  useFonts,
} from "@expo-google-fonts/league-spartan";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function validateLogin(email: string, password: string) {}

export default function Home() {
  // * Hook para detectar el esquema de color claro/oscuro
  const colorScheme = useColorScheme();
  // * Selección dinámica de colores según el esquema de color
  // ? de donde viene los colores ?
  // ** Vienen del archivo constants/theme.ts
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  // ! siempre cargar las fuentes antes de renderer
  // * La cosa para cargar las fuentes ww
  const [fontsLoaded] = useFonts({
    LeagueSpartan_100Thin,
    LeagueSpartan_600SemiBold,
    LeagueSpartan_300Light,
  });

  /* // ?  por qué la hoja de estilos va aquí?
    - Para tener acceso a las variables y constantes del componente
    - Permite usar los colores dinámicos  dark/light idk
  */
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: 25,
    },
    buttons: {
      width: "100%",
      gap: 10,
    },
    logoContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 40,
      marginTop: 20,
      textAlign: "center",
      fontFamily: "LeagueSpartan_100Thin",
      color: colors.textTheme,
    },
    subTitle: {
      fontSize: 20,
      textAlign: "center",
      fontFamily: "LeagueSpartan-600SemiBold",
      color: colors.textTheme,
    },
    description: {
      width: "100%",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "LeagueSpartan_300Light",
      color: colors.text,
    },
  });

  return (
    // ! usar siempre SafeAreaProvider y SafeAreaView
    // <safeAreaProvider> y <SafeAreaView> dan la separación necesaria en dispositivos con notch
    // ** <SafeAreaProvider>
    // **   <SafeAreaView>
    // TODO   aquí va todo el contenido "<ScrollView>...</ScrollView>"
    // **   </SafeAreaView>
    // ** </SafeAreaProvider>

    <SafeAreaProvider>
      <SafeAreaView
        style={[{ flex: 1 }, { backgroundColor: colors.background }]}
      >
        {/*// ** ScrollView:
        // - Nos permite hacer scroll en la pantalla // 
        // -Podemos usar "View" para agrupar elementos 
        // - Podemos usar "Text""Image" "Button",etc 
        // ? Qué es contentContainerStyle? // 
        // - Es una propiedad que estiliza el contenedor principal 
        //  - A diferencia de style, que estiliza el contenedor sin Scroll 
        //  - Útil porque un Scroll no se comporta como un View normal
        */}
        <ScrollView contentContainerStyle={styles.container}>
          {/*
      // ** Contenedor de la imagen y textos
      // ? porque usamos otro View aquí?
      - Agrupamos la imagen y textos en un <View>
      - Permite mantener a estos dos juntos para usar estilos de posicionamiento
      - Si no, estarían separados y no podríamos aplicar estilos conjuntos
      - usamos la propiedad gap en styles.logoContainer para separar
    */}
          <View style={styles.logoContainer}>
            {/*
      // ** Contenedor de la imagen
      - Usamos <View> para agrupar la imagen y poder aplicar estilos
    */}
            <View>
              <Image source={require("@/assets/images/Logo.png")} />
            </View>

            {/*
      // ** Contenedor de textos
      - Agrupamos los textos en un <View>
      - Permite aplicar estilos y posicionamiento al conjunto
      */}
            <View>
              <Text style={styles.title}>San Francisco de Asís</Text>
              <Text style={styles.subTitle}>Clínica Veterinaria</Text>
            </View>
          </View>

          {
            //**   Texto descriptivo no forma de un view solo del ScrollView
          }

          <Text style={styles.description}>
            El mejor camino a la salud y bienestar de tu mascota
          </Text>

          {/* // * agrupación de los botones 
      -sirve para mover ambos botones 
      - uso de botón personalizado (components/ui/button.tsx)
      // ? cuales son la propiedades del botón?
      - tiene todas las propiedades heredadas de TouchableOpacity
      - type: "primary" | "secondary" | "danger" (define el estilo del botón) obligatorio
      - onPress: () => void (función que elijamos cuando se presione) 
      - children: React.ReactNode (contenido del botón, texto o icono)
      - style: StyleProp<ViewStyle> (estilos adicionales para el botón) por si acaso idk
      // ? por qué no usar TouchableOpacity directamente?
      - Button ya tiene estilos predefinidos ww
      // ! EL botón tiene la propiedad loading 
      - muestra un indicador de carga cuando loading es true
      - deshabilita el botón para evitar múltiples pulsaciones
      - podemos manejarlo con un estado (useState) y simular una carga
      - ejemplo: loading={true}  / loading={buttonState}  
      - buttonState  es la variable para saber cuando presionamos el botón

      */}
          <View style={styles.buttons}>
            <Button type="primary" onPress={() => router.push("/auth/login")}>
              Iniciar Sesión
            </Button>

            <Button
              type="secondary"
              onPress={() => router.push("/auth/register")}
            >
              Registrarse
            </Button>

            <Button
              type="danger"
              onPress={() => {
                console.log("botón presionado");
              }}
              loading={true}
            >
              Botón eliminar
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
