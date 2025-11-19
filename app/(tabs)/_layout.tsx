import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Feather from "@expo/vector-icons/Feather";
import { CartProvider } from "@/hooks/use-cart";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <StripeProvider publishableKey="pk_test_51SVEqLFwCXz8eJxFllComkIPInIr0oJ9i2T3J4ugfV9zD6m19MrKfLxmiVBOHpJ5LJ4B9LyTMX7JzzlNvNuel6bw00fwfP2Pg9">
      <CartProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
            tabBarButton: HapticTab,
          }}
        >
          <Tabs.Screen
            name="products"
            options={{
              title: "Productos",
              tabBarIcon: ({ color }) => (
                <Feather name="home" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              title: "Carrito",
              tabBarIcon: ({ color }) => (
                <Feather name="shopping-cart" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Perfil",
              tabBarIcon: ({ color }) => (
                <Feather name="user" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </CartProvider>
    </StripeProvider>
  );
}
