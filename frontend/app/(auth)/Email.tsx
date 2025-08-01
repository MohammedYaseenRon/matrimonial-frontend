import { Configs } from '@/constants/Configs';
import { useRegistrationStore } from '@/stores/registrationStore';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Email() {
  const router = useRouter();
  const { 
    mobile,
    email: storedEmail,
    setEmailData,
    canProceedToStep,
    registrationType
  } = useRegistrationStore();

  const [email, setEmail] = useState<string>(storedEmail || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isValidEmail = (inputEmail: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);

  const isSendOtpButtonDisabled = !isValidEmail(email) || isLoading;
  const isVerifyOtpButtonDisabled = otp.length !== 6 || isVerifying;

  useFocusEffect(
    React.useCallback(() => {
      // Add a small delay to ensure the layout is mounted
      const timeoutId = setTimeout(() => {
        if (!canProceedToStep(2)) {
          router.replace('/MobileNo');
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }, [canProceedToStep, router])
  );

  useEffect(() => {
    if (errorMessage || successMessage) {
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [email, otp]);

  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(300); // 5 minutes = 300 seconds

    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendOTP = async () => {
    if (isSendOtpButtonDisabled) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!email) {
      setErrorMessage('Email address is required');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${Configs.SERVER_URL}/otp/generate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Handle non-200 status codes
      if (!response.ok) {
        const errorMsg = data.message || `Server error: ${response.status}`;
        setErrorMessage(errorMsg);
        setIsLoading(false);
        return;
      }

      // Handle business logic failures (success: false)
      if (!data.success) {
        setErrorMessage(data.message || 'Failed to send OTP');
        setIsLoading(false);
        return;
      }

      // Success case
      setSuccessMessage(data.message || 'OTP sent successfully to your email');
      setOtpSent(true);
      setIsLoading(false);
      startResendTimer();

    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('Failed to send OTP. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${Configs.SERVER_URL}/otp/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Handle rate limiting (429) and other errors
      if (!response.ok) {
        if (response.status === 429) {
          setErrorMessage('Too many requests. Please wait before requesting another OTP.');
        } else {
          const errorMsg = data.message || `Server error: ${response.status}`;
          setErrorMessage(errorMsg);
        }
        setIsLoading(false);
        return;
      }

      // Handle business logic failures (success: false)
      if (!data.success) {
        setErrorMessage(data.message || 'Failed to resend OTP');
        setIsLoading(false);
        return;
      }

      // Success case
      setSuccessMessage(data.message || 'OTP resent successfully to your email');
      setIsLoading(false);
      startResendTimer();

    } catch (error) {
      console.error('Error resending OTP:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('Failed to resend OTP. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (isVerifyOtpButtonDisabled) {
      setErrorMessage('Please enter the 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${Configs.SERVER_URL}/otp/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp: parseInt(otp) 
        }),
      });

      const data = await response.json();

      // Handle non-200 status codes
      if (!response.ok) {
        const errorMsg = data.message || `Verification failed: ${response.status}`;
        setErrorMessage(errorMsg);
        setIsVerifying(false);
        return;
      }

      // Handle business logic failures (success: false)
      if (!data.success) {
        setErrorMessage(data.message || 'OTP verification failed');
        setIsVerifying(false);
        return;
      }

      // Success case
      setSuccessMessage(data.message || 'Email verified successfully');
      setEmailData(email, true);
      
      // Navigate after a brief delay to show success message
      setTimeout(() => {
        router.push('/Password');
      }, 1000);

    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('Failed to verify OTP. Please try again.');
      }
      
      setIsVerifying(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50 justify-center items-center py-8 px-4"
    >
      <View className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
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

        {/* Error Message Display */}
        {errorMessage ? (
          <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Text className="text-red-700 text-sm font-medium text-center">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Success Message Display */}
        {successMessage ? (
          <View className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Text className="text-green-700 text-sm font-medium text-center">
              {successMessage}
            </Text>
          </View>
        ) : null}

        {!otpSent ? (
          <>
            <View className="mb-6"> 
              <Text className="text-gray-700 text-base font-medium mb-2">
                Enter your email address
              </Text>
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
                  editable={!isLoading}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSendOTP}
              disabled={isSendOtpButtonDisabled} 
              className={`py-4 rounded-lg mb-4 ${isSendOtpButtonDisabled ? 'bg-blue-300' : 'bg-blue-600'}`}
            >
              {isLoading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="#fff" size="small" />
                  <Text className="text-white text-center text-lg font-bold ml-2">
                    SENDING OTP...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center text-lg font-bold">
                  SEND EMAIL OTP
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View className="mb-4">
              <Text className="text-gray-700 text-base font-medium mb-2">
                Enter OTP sent to {email}
              </Text>
              <View className={`flex-row items-center border rounded-lg px-4 py-3 mb-4 ${
                isVerifying ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
              }`}>
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  maxLength={6}
                  className={`flex-1 text-base tracking-widest text-center font-bold ${
                    isVerifying ? 'text-blue-800' : 'text-gray-800'
                  }`}
                  style={Platform.OS === 'web' && styles.noOutline}
                  editable={!isVerifying}
                />
                {isVerifying && (
                  <ActivityIndicator color="#2563eb" size="small" />
                )}
              </View>

              {/* Resend OTP Section */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm text-gray-600">
                  Didn't receive the OTP?
                </Text>
                {canResend ? (
                  <TouchableOpacity 
                    onPress={handleResendOTP}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#374151" size="small" />
                    ) : (
                      <Text className="text-blue-600 text-sm font-medium">
                        Resend OTP
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text className="text-sm text-gray-500">
                    Resend in {formatTime(resendTimer)}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleVerifyOTP}
              disabled={isVerifyOtpButtonDisabled} 
              className={`py-4 rounded-lg mb-4 ${isVerifyOtpButtonDisabled ? 'bg-green-300' : 'bg-green-600'}`}
            >
              {isVerifying ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="#fff" size="small" />
                  <Text className="text-white text-center text-lg font-bold ml-2">
                    VERIFYING...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center text-lg font-bold">
                  VERIFY EMAIL
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity 
          onPress={() => router.back()} 
          className="py-2"
          disabled={isLoading || isVerifying}
        >
          <Text className={`text-center text-base ${
            isLoading || isVerifying ? 'text-gray-400' : 'text-blue-600'
          }`}>
            ← Back
          </Text>
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