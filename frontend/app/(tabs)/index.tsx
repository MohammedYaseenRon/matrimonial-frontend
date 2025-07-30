// app/index.tsx
import { View, Text, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-4 bg-[#fdf6ff]">
      <Text>Tabs</Text>
    </View>
  );
}
