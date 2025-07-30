import { View, Text, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Navbar from '@/components/Landing/Navbar';
import AboutUs from '@/components/Landing/AboutUs';
import { Footer } from '@/components/Landing/Footer';
import { useRegistration } from '../contexts/RegisterContext';



export default function HomePage() {
  const router = useRouter();
  const { setRegistrationType } = useRegistration();

  const handleRegister = (type: 'social' | 'matrimonial') => {
    setRegistrationType(type);
    router.push('/MobileNo');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf6ff]">
      <Navbar />

      <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="flex items-center px-4 pt-16 pb-6">
          <View className="bg-purple-500 rounded-2xl p-4 mb-6 shadow-lg">
            <Text className="text-white text-4xl">✨</Text>
          </View>

          <Text className="text-3xl font-bold text-center mb-2 text-gray-800">
            Welcome to Connect
          </Text>
          <Text className="text-base text-center text-gray-600 mb-8">
            Choose your journey to meaningful connections
          </Text>
        </View>

        <View className="flex items-center px-4">
          <Pressable
            onPress={() => {
              handleRegister('social');
            }}
            className="w-full max-w-md bg-white p-6 rounded-3xl mb-6 shadow-md"
          >
            <Text className="text-xl font-bold text-pink-600 mb-1">👥 Socializing</Text>
            <Text className="text-gray-700 mb-3">Make friends & expand your social circle</Text>
            <View className="flex-row flex-wrap gap-2">
              <Tag label="Friendship" color="bg-yellow-200" />
              <Tag label="Events" color="bg-pink-200" />
              <Tag label="Fun" color="bg-purple-200" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              handleRegister('matrimonial');
            }}
            className="w-full max-w-md bg-white p-6 rounded-3xl shadow-md"
          >
            <Text className="text-xl font-bold text-purple-600 mb-1">💖 Matrimonial</Text>
            <Text className="text-gray-700 mb-3">Find your life partner & soulmate</Text>
            <View className="flex-row flex-wrap gap-2">
              <Tag label="Marriage" color="bg-purple-200" />
              <Tag label="Serious" color="bg-pink-200" />
              <Tag label="Love" color="bg-red-200" />
            </View>
          </Pressable>
        </View>

        <View className="items-center mt-10 px-6">
          <Text className="text-gray-500 text-sm text-center">
            💬 Join thousands finding their perfect match
          </Text>
          <Text className="text-xs text-gray-400 text-center mt-1">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>

        {/* About Us Section */}
        <AboutUs />

        <View className="px-6 py-12 items-center">
          <Text className="text-2xl font-bold text-center mb-4 text-gray-800">
            Ready to Find Your Perfect Match?
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Join thousands who found love and friendship on ConnectApp
          </Text>
          <Pressable className="bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-4 rounded-full shadow-lg active:scale-95">
            <Text className="text-white font-bold text-lg">Start Your Journey</Text>
          </Pressable>
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View className={`px-3 py-1 rounded-full ${color}`}>
      <Text className="text-xs text-gray-800">{label}</Text>
    </View>
  );
}
