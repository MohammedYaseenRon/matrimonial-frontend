import "@/global.css";
import { useAuth } from "@/hooks/useAuth";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top}}>
      <StatusBar 
        style='dark'
      />
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="social" options={{ headerShown: false }} />
        <Stack.Screen name="matrimonial" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}