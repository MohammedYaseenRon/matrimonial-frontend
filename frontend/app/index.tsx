import AboutUs from '@/components/Landing/AboutUs';
import { Footer } from '@/components/Landing/Footer';
import Navbar from '@/components/Landing/Navbar';
import Features from '@/components/Landing/Feauter';
import Testimonials from '@/components/Landing/Testimonial';
import FAQs from '@/components/Landing/Faqs';
import DownloadApp from '@/components/Landing/DownloadApp';
import { useRegistrationStore } from '@/stores/registrationStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';


export default function HomePage() {
  const router = useRouter();
  const { setRegistrationType, loadFromStorage, registrationType } = useRegistrationStore();

  useEffect(() => {
    loadFromStorage();
    if (registrationType) {
      router.push(`${registrationType === 'social' ? '/social' : '/matrimonial'}`);
    }
  }, []);

  const handleRegister = (type: 'social' | 'matrimonial') => {
    setRegistrationType(type);
    router.push('/auth/MobileNo');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf6ff]">
      <Navbar />

      <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false}>
        <View className="bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 px-6 py-16 h-screen">
          <View className="max-w-6xl mx-auto">
            <View className="flex-row items-center justify-between">
              {/* Left Column - Content */}
              <View className="flex-1 pr-8">
                <Text className="text-5xl font-black text-white mb-6 leading-tight">
                  Find Your{'\n'}
                  <Text className="text-yellow-300">Perfect Match</Text>
                </Text>
                <Text className="text-xl text-white/95 mb-8 leading-relaxed">
                  Join over 10 million people who found love, friendship, and meaningful connections on our platform. Your soulmate is just a click away!
                </Text>

                {/* CTA Buttons */}
                <View className="flex-row space-x-4 mb-8">
                  {/* Matrimonial Button */}
                  <TouchableOpacity
                    onPress={() => handleRegister('matrimonial')}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 rounded-xl shadow-xl transform active:scale-95"
                  >
                    <View className="flex-row items-center justify-center gap-x-3">
                      <Text className="text-2xl">💒</Text>
                      <View>
                        <Text className="text-white font-bold text-base">Matrimonial</Text>
                        <Text className="text-white/90 text-xs">Find Your Life Partner</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Social Button */}
                  <TouchableOpacity
                    onPress={() => handleRegister('social')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 rounded-xl shadow-xl transform active:scale-95"
                  >
                    <View className="flex-row items-center justify-center gap-x-3">
                      <Text className="text-xl">🌟</Text>
                      <View>
                        <Text className="text-white font-bold text-base">Social</Text>
                        <Text className="text-white/90 text-xs">Build New Friendships</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>


                {/* Trust Indicators */}
                <View className="flex-row items-center space-x-6">
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-yellow-300">10M+</Text>
                    <Text className="text-white/80 text-sm">Active Users</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-yellow-300">500K+</Text>
                    <Text className="text-white/80 text-sm">Success Stories</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-yellow-300">4.9★</Text>
                    <Text className="text-white/80 text-sm">App Rating</Text>
                  </View>
                </View>
              </View>

              {/* Right Column - Visual Element */}
              <View className="flex-1 items-center">
                <View className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                  <Text className="text-6xl mb-4 text-center">💕</Text>
                  <Text className="text-white text-center font-semibold text-lg mb-4">
                    Join Today & Get
                  </Text>
                  <View className="bg-yellow-400 rounded-2xl p-4 mb-4">
                    <Text className="text-gray-900 font-bold text-center text-lg">
                      Premium Features FREE
                    </Text>
                    <Text className="text-gray-900 text-center text-sm">
                      For First 30 Days
                    </Text>
                  </View>
                  <Text className="text-white/80 text-center text-sm">
                    ✓ Unlimited Matches{'\n'}
                    ✓ Priority Support{'\n'}
                    ✓ Advanced Filters
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* All Landing Sections */}
        <AboutUs />
        <Features />
        <Testimonials />
        <FAQs />
        <DownloadApp />
        <Footer />
      </ScrollView >
    </SafeAreaView >
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View className={`px-3 py-1 rounded-full ${color}`}>
      <Text className="text-xs text-gray-800">{label}</Text>
    </View>
  );
}
