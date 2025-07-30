import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Email() {
  const router = useRouter();
  const { mobile, registrationType } = useLocalSearchParams<{ mobile?: string, registrationType?: string }>();

  const [email, setEmail] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const isValidEmail = (inputEmail: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);

  const isSendOtpButtonDisabled = !isValidEmail(email);

  const isVerifyOtpButtonDisabled = otp.length !== 6;

  const handleSendOTP = () => {
    if (isSendOtpButtonDisabled) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setOtpSent(true);
    Alert.alert('OTP Sent', 'OTP sent to your email!');
  };

  const handleVerifyOTP = () => {
    if (isVerifyOtpButtonDisabled) {
      Alert.alert('Validation Error', 'Please enter the 6-digit OTP');
      return;
    }

    if (otp === '123456') { 
      router.push({
        pathname: '/Password',
        params: { mobile, email, registrationType },
      });
    } else {
      Alert.alert('Verification Failed', 'Incorrect OTP');
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
          Registration Step 2 of 3
        </Text>

        {registrationType && (
          <Text className="text-base text-gray-600 text-center mb-2">
            <Text className="font-semibold">For {registrationType}</Text> registration
          </Text>
        )}
        {mobile && (
          <Text className="text-green-600 text-center text-base mb-4">
            Mobile Number: {mobile} ✓
          </Text>
        )}

        {!otpSent ? (
          <>
            <View className="mb-6"> 
              <Text className="text-gray-700 text-base font-medium mb-2">Enter your email address</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="user@example.com"
                  placeholderTextColor="#9ca3af" 
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 text-base text-gray-800"
                  style={Platform.OS === 'web' && styles.noOutline} 
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSendOTP}
              disabled={isSendOtpButtonDisabled} 
              className={`py-4 rounded-lg mb-4 ${isSendOtpButtonDisabled ? 'bg-blue-300' : 'bg-blue-600'}`}
            >
              <Text className="text-white text-center text-lg font-bold">SEND EMAIL OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className="text-gray-700 text-base font-medium mb-2">Enter OTP sent to {email}</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 mb-6">
              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#9ca3af" // Tailwind gray-400
                keyboardType="number-pad"
                maxLength={6}
                className="flex-1 text-base tracking-widest text-center text-gray-800"
                style={Platform.OS === 'web' && styles.noOutline} // Remove outline on web
              />
            </View>

            <TouchableOpacity
              onPress={handleVerifyOTP}
              disabled={isVerifyOtpButtonDisabled} 
              className={`py-4 rounded-lg mb-4 ${isVerifyOtpButtonDisabled ? 'bg-green-300' : 'bg-green-600'}`}
            >
              <Text className="text-white text-center text-lg font-bold">VERIFY EMAIL</Text>
            </TouchableOpacity>
          </>
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