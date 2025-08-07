import AboutUs from '@/components/Landing/AboutUs';
import { Footer } from '@/components/Landing/Footer';
import Navbar from '@/components/Landing/Navbar';
import { useRegistrationStore } from '@/stores/registrationStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, ImageBackground, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    <SafeAreaView className="flex-1 bg-white">
      <Navbar />

      <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Background */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
          style={{ 
            width: '100%', 
            minHeight: Math.max(height * 0.75, 600), // Ensure minimum 600px height
            height: 'auto'
          }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(147, 51, 234, 0.8)', 'rgba(219, 39, 119, 0.8)', 'rgba(239, 68, 68, 0.6)']}
            style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingHorizontal: 20,
              paddingVertical: 60, // Add consistent vertical padding
              minHeight: Math.max(height * 0.75, 600) // Same minimum height
            }}
          >
            <View className="items-center w-full">
              <Text 
                className="font-bold text-center mb-6 text-white leading-tight"
                style={{ 
                  fontSize: width < 768 ? 36 : 48, // Responsive font size
                  lineHeight: width < 768 ? 42 : 54
                }}
              >
                Find Your{'\n'}Perfect Match
              </Text>
              <Text 
                className="text-center text-white/90 mb-12 leading-relaxed max-w-sm"
                style={{ 
                  fontSize: width < 768 ? 18 : 20,
                  lineHeight: width < 768 ? 24 : 28
                }}
              >
                Where meaningful relationships begin and lasting connections are made
              </Text>
              
              {/* CTA Buttons */}
              <View className="w-full max-w-sm" style={{ gap: 16 }}>
                <Pressable
                  onPress={() => handleRegister('matrimonial')}
                  className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl active:scale-95"
                  style={{ transform: [{ scale: 1 }] }}
                >
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-purple-700 mb-3">Find Love</Text>
                    <Text className="text-gray-700 text-center leading-6">
                      Discover your life partner through meaningful connections
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => handleRegister('social')}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg active:scale-95"
                  style={{ transform: [{ scale: 1 }] }}
                >
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-pink-600 mb-3">Make Friends</Text>
                    <Text className="text-gray-700 text-center leading-6">
                      Build lasting friendships and expand your social circle
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Trust Indicators */}
        <View className="bg-gradient-to-b from-purple-50 to-white py-12 px-6">
          <View className="flex-row justify-around items-center">
            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-600">50K+</Text>
              <Text className="text-gray-600 text-sm mt-1">Happy Members</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-pink-600">12K+</Text>
              <Text className="text-gray-600 text-sm mt-1">Success Stories</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-600">98%</Text>
              <Text className="text-gray-600 text-sm mt-1">Satisfaction</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="px-6 py-12 bg-white">
          <Text className="text-3xl font-bold text-center mb-3 text-gray-800">
            Why Choose {process.env.EXPO_PUBLIC_PROJECT_NAME}?
          </Text>
          <Text className="text-lg text-center text-gray-600 mb-12 leading-relaxed">
            Experience the future of meaningful connections
          </Text>

          <View className="space-y-6">
            <FeatureCard
              title="Verified Profiles"
              description="Every profile is verified to ensure authentic connections and a safe environment for all members."
              gradient={['#8B5CF6', '#A855F7']}
            />
            
            <FeatureCard
              title="Smart Matching"
              description="Our advanced algorithm learns your preferences to suggest the most compatible matches."
              gradient={['#EC4899', '#F472B6']}
            />
            
            <FeatureCard
              title="Privacy First"
              description="Your privacy matters. Control who sees your profile with advanced privacy settings."
              gradient={['#8B5CF6', '#EC4899']}
            />
          </View>
        </View>

        {/* About Us Section */}
        <AboutUs />

        {/* Final CTA Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
          style={{ width: '100%' }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(147, 51, 234, 0.9)', 'rgba(219, 39, 119, 0.9)']}
            style={{ paddingVertical: 60, paddingHorizontal: 24, alignItems: 'center' }}
          >
            <Text className="text-3xl font-bold text-center mb-4 text-white leading-tight">
              Ready to Start Your Journey?
            </Text>
            <Text className="text-lg text-white/90 text-center mb-8 leading-relaxed max-w-sm">
              Join thousands who found love and friendship on {process.env.EXPO_PUBLIC_PROJECT_NAME}
            </Text>
            <Pressable 
              className="bg-white px-10 py-4 rounded-full shadow-xl active:scale-95"
              onPress={() => handleRegister('matrimonial')}
            >
              <Text className="text-purple-700 font-bold text-lg">Begin Your Story</Text>
            </Pressable>
            
            <Text className="text-white/70 text-center mt-6 text-sm leading-relaxed max-w-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </LinearGradient>
        </ImageBackground>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ title, description, gradient }: { 
  title: string; 
  description: string; 
  gradient: string[];
}) {
  return (
    <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <View className="flex-row items-start">
        <View 
          className="w-3 h-12 rounded-full mr-4 mt-1"
          style={{ 
            backgroundColor: gradient[0]
          }}
        />
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800 mb-3">{title}</Text>
          <Text className="text-gray-600 leading-6">{description}</Text>
        </View>
      </View>
    </View>
  );
}
