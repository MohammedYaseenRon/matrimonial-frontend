import "@/global.css";
import { useAuth } from "@/hooks/useAuth";
import { Stack } from 'expo-router';


export default function RootLayout() {
  useAuth();
  return (
    <>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}