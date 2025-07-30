import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {  useRouter } from 'expo-router';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MobileNo() {
  const router = useRouter();

  const [mobile, setMobile] = useState('');
  const [confirmMobile, setConfirmMobile] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpDisplay, setOtpDisplay] = useState(''); 
  const [finalOtp, setFinalOtp] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

const otpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    return () => {
      if (otpIntervalRef.current) {
        clearInterval(otpIntervalRef.current);
      }
    };
  }, []);

  const numbersMatch = mobile === confirmMobile && mobile.length === 10;
  const isButtonDisabled = !numbersMatch || isLoading;

  const handleGenerateOtp = () => {
    if (isButtonDisabled) {
      Alert.alert('Validation Error', 'Mobile numbers do not match or are not 10 digits long!');
      return;
    }

    setIsLoading(true);
    setShowOtpField(false); 
    setOtpDisplay('');

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setTimeout(() => {
      const actualGeneratedOtp = '******'; 
      setFinalOtp(actualGeneratedOtp);

      setIsLoading(false); 
      setShowOtpField(true); 

      let currentIndex = 0;
      otpIntervalRef.current = setInterval(() => {
        setOtpDisplay((prev) => {
          if (currentIndex < actualGeneratedOtp.length) {
            const nextChar = actualGeneratedOtp[currentIndex];
            currentIndex++;
            return prev + nextChar;
          } else {
            if (otpIntervalRef.current) {
              clearInterval(otpIntervalRef.current);
              otpIntervalRef.current = null;
            }
            setTimeout(() => {
                handleVerifyOtp(actualGeneratedOtp);
            }, 300); 
            return actualGeneratedOtp; 
          }
        });
      }, 150); 

    }, 2000); 
  };

  const handleVerifyOtp = (receivedOtp: string) => {
    if (receivedOtp === '******') {
        router.push({
            pathname: '/Email',
            params: { mobile },
        });
    } else {
        Alert.alert('Verification Failed', 'An error occurred during OTP verification.');
        setIsLoading(false);
        setShowOtpField(false);
        setOtpDisplay('');
        setFinalOtp('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50 justify-center items-center py-8 px-4"
    >
      <View
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
          Registration Step 1 of 3
        </Text>



        <View className="mb-6">
          <Text className="text-gray-700 text-base font-medium mb-2">Enter your mobile number</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
            <Text className="text-gray-600 mr-3 text-base">+91</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
              placeholder="e.g., 9876543210"
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-gray-800"
              style={Platform.OS === 'web' && styles.noOutline}
              editable={!isLoading}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base font-medium mb-2">Re-enter your mobile number</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
            <Text className="text-gray-600 mr-3 text-base">+91</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              value={confirmMobile}
              onChangeText={setConfirmMobile}
              placeholder="Re-enter mobile"
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-gray-800"
              style={Platform.OS === 'web' && styles.noOutline}
              editable={!isLoading}
            />
          </View>
        </View>

        <Text className={`text-center text-sm font-semibold mb-6 ${numbersMatch ? 'text-green-600' : 'text-red-600'}`}>
          {numbersMatch ? '✓ Numbers match' : '✗ Numbers do not match'}
        </Text>

        <TouchableOpacity
          onPress={handleGenerateOtp}
          disabled={isButtonDisabled}
          className={`py-4 rounded-lg mb-4 ${isButtonDisabled ? 'bg-blue-300' : 'bg-blue-600'}`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-bold">GENERATE OTP</Text>
          )}
        </TouchableOpacity>

        {showOtpField && ( // Show OTP field when showOtpField is true
          <View className="mb-6">
            <Text className="text-gray-700 text-base font-medium mb-2">OTP</Text>
            <View className="flex-row items-center border border-green-400 rounded-lg px-4 py-3 bg-green-50">
              <TextInput
                value={otpDisplay}
                placeholder="******" 
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                maxLength={6}
                className="flex-1 text-base tracking-widest text-center font-bold text-green-800"
                style={Platform.OS === 'web' && styles.noOutline}
                editable={false} 
              />
            </View>
          </View>
        )}

        <TouchableOpacity onPress={() => router.back()} className="py-2">
          <Text className="text-blue-600 text-center text-base">← Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  noOutline: {
    outlineWidth: 0,
  },
});