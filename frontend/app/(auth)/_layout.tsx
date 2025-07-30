import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="MobileNo" options={{
        title: 'Mobile Number', 
        animation: 'slide_from_right', 
      }} />
      <Stack.Screen name="Email" options={{
        title: 'Email Address',
        animation: 'slide_from_right',
      }} />
      <Stack.Screen name="Password" options={{
        title: 'Set Password',
        animation: 'slide_from_right',
      }} />
    </Stack>
  );
}