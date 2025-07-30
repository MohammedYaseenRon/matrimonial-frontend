import { Stack } from 'expo-router';
import { RegistrationProvider } from '../contexts/RegisterContext';
import "@/global.css"


export default function RootLayout() {
  return (
    <RegistrationProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </RegistrationProvider>
  );
}