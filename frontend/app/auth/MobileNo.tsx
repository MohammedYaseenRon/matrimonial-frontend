import { Configs } from '@/constants/Configs';
import { useRegistrationStore } from '@/stores/registrationStore';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { countryCodes } from '../../constants/Countries';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MobileNo() {
  const router = useRouter();

  const {
    mobile: storedMobile,
    setMobileData,
    canProceedToStep
  } = useRegistrationStore();
  const storedCountry = storedMobile ? countryCodes.find(country => storedMobile.startsWith(country.code)) : null;
  const storedMobileWithoutCountry = storedMobile ? storedMobile.replace(storedCountry?.code || '', '') : '';

  const [mobile, setMobile] = useState(storedMobileWithoutCountry || '');
  const [confirmMobile, setConfirmMobile] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpDisplay, setOtpDisplay] = useState(''); 
  const [finalOtp, setFinalOtp] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState(() => {
    return storedCountry || countryCodes.find(code => code.code === '+91') || countryCodes[0];
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const countryButtonRef = useRef<View>(null);
  const otpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (otpIntervalRef.current) {
        clearInterval(otpIntervalRef.current);
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const timeoutId = setTimeout(() => {
        if (!canProceedToStep(1)) {
          router.replace('/');
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }, [canProceedToStep, router])
  );

  // Clear error when user starts typing
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [mobile, confirmMobile]);

  const numbersMatch = mobile === confirmMobile && mobile.length >= 8;
  const isButtonDisabled = !numbersMatch || isLoading || isVerifying;

  const handleCountryPress = () => {
    countryButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownLayout({
        x: pageX,
        y: pageY + height,
        width: width,
        height: height
      });
      setShowCountryPicker(true);
    });
  };

  const resetOtpState = () => {
    setShowOtpField(false);
    setOtpDisplay('');
    setFinalOtp('');
    setIsVerifying(false);
    if (otpIntervalRef.current) {
      clearInterval(otpIntervalRef.current);
      otpIntervalRef.current = null;
    }
  };

  const handleGenerateOtp = async () => {
    if (isButtonDisabled) {
      setErrorMessage(`Mobile numbers do not match or are not the correct length (${8}-${selectedCountryCode.maxLength} digits)!`);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    resetOtpState();

    try {
      const response = await fetch(`${Configs.SERVER_URL}/otp/generate-mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: selectedCountryCode.code + mobile,
        }),
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
        setErrorMessage(data.message || 'Failed to generate OTP');
        setIsLoading(false);
        return;
      }

      // Success case
      const actualGeneratedOtp = data.otp;
      setFinalOtp(actualGeneratedOtp);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsLoading(false); 
      setShowOtpField(true); 

      // Animate the OTP display
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

    } catch (error) {
      console.error('Error generating OTP:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('Failed to generate OTP. Please try again.');
      }
      
      setIsLoading(false);
      resetOtpState();
    }
  };

  const handleVerifyOtp = async (receivedOtp: string) => {
    setIsVerifying(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${Configs.SERVER_URL}/otp/verify-mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: selectedCountryCode.code + mobile,
        }),
      });

      const data = await response.json();

      // Handle non-200 status codes
      if (!response.ok) {
        const errorMsg = data.message || `Verification failed: ${response.status}`;
        setErrorMessage(errorMsg);
        setIsVerifying(false);
        resetOtpState();
        return;
      }

      // Handle business logic failures (success: false)
      if (!data.success) {
        setErrorMessage(data.message || 'OTP verification failed');
        setIsVerifying(false);
        resetOtpState();
        return;
      }

      // Success case
      const fullMobile = selectedCountryCode.code + mobile;
      setMobileData(fullMobile, true);
      router.push('/auth/Email');
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('Failed to verify OTP. Please try again.');
      }
      
      setIsVerifying(false);
      resetOtpState();
    }
  };

  const handleRetryOtp = () => {
    resetOtpState();
    setErrorMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50 justify-center items-center py-8 px-4"
    >
      <View className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
          Registration Step 1 of 3
        </Text>

        {/* Error Message Display */}
        {errorMessage ? (
          <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Text className="text-red-700 text-sm font-medium text-center">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <View className="mb-6">
          <Text className="text-gray-700 text-base font-medium mb-2">Enter your mobile number</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg bg-gray-50">
            <TouchableOpacity 
              ref={countryButtonRef}
              onPress={handleCountryPress}
              className="flex-row items-center px-3 py-3 border-r border-gray-300"
              disabled={isLoading || isVerifying}
            >
              <Text className="text-lg mr-2">{selectedCountryCode.flag}</Text>
              <Text className="text-gray-600 text-base font-medium">{selectedCountryCode.code}</Text>
              <Text className="text-gray-400 ml-1 text-xs">▼</Text>
            </TouchableOpacity>
            <TextInput
              keyboardType="numeric"
              maxLength={selectedCountryCode.maxLength}
              value={mobile}
              onChangeText={setMobile}
              placeholder={`e.g., ${'9'.repeat(selectedCountryCode.maxLength)}`}
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-gray-800 px-3 py-3"
              style={Platform.OS === 'web' && styles.noOutline}
              editable={!isLoading && !isVerifying}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base font-medium mb-2">Re-enter your mobile number</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg bg-gray-50">
            <View className="flex-row items-center px-3 py-3 border-r border-gray-300">
              <Text className="text-lg mr-2">{selectedCountryCode.flag}</Text>
              <Text className="text-gray-600 text-base font-medium">{selectedCountryCode.code}</Text>
            </View>
            <TextInput
              keyboardType="numeric"
              maxLength={selectedCountryCode.maxLength}
              value={confirmMobile}
              onChangeText={setConfirmMobile}
              placeholder="Re-enter mobile"
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-gray-800 px-3 py-3"
              style={Platform.OS === 'web' && styles.noOutline}
              editable={!isLoading && !isVerifying}
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
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="#fff" size="small" />
              <Text className="text-white text-center text-lg font-bold ml-2">GENERATING OTP...</Text>
            </View>
          ) : (
            <Text className="text-white text-center text-lg font-bold">GENERATE OTP</Text>
          )}
        </TouchableOpacity>

        {showOtpField && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-700 text-base font-medium">OTP</Text>
              {isVerifying && (
                <Text className="text-blue-600 text-sm font-medium">Verifying...</Text>
              )}
            </View>
            <View className={`flex-row items-center border rounded-lg px-4 py-3 ${
              isVerifying ? 'border-blue-400 bg-blue-50' : 'border-green-400 bg-green-50'
            }`}>
              <TextInput
                value={otpDisplay}
                placeholder="******" 
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                maxLength={6}
                className={`flex-1 text-base tracking-widest text-center font-bold ${
                  isVerifying ? 'text-blue-800' : 'text-green-800'
                }`}
                style={Platform.OS === 'web' && styles.noOutline}
                editable={false} 
              />
              {isVerifying && (
                <ActivityIndicator color="#2563eb" size="small" />
              )}
            </View>
            
            {/* Retry button if there's an error */}
            {errorMessage && !isVerifying && (
              <TouchableOpacity 
                onPress={handleRetryOtp}
                className="mt-2 py-2 px-4 bg-gray-100 rounded-lg"
              >
                <Text className="text-gray-700 text-center text-sm font-medium">
                  Retry OTP Generation
                </Text>
              </TouchableOpacity>
            )}
          </View>
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

      {/* Country Code Dropdown */}
      {showCountryPicker && (
        <>
          <TouchableOpacity 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
            onPress={() => setShowCountryPicker(false)}
            activeOpacity={1}
          />
          
          <View
            style={{
              position: 'absolute',
              top: dropdownLayout.y,
              left: dropdownLayout.x,
              width: 280,
              maxHeight: 300,
              backgroundColor: 'white',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
              zIndex: 2,
            }}
          >
            <ScrollView 
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {countryCodes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedCountryCode(item);
                    setShowCountryPicker(false);
                    setMobile('');
                    setConfirmMobile('');
                    setErrorMessage('');
                    resetOtpState();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: selectedCountryCode.code === item.code ? '#eff6ff' : 'transparent',
                    borderBottomWidth: index === countryCodes.length - 1 ? 0 : 1,
                    borderBottomColor: '#f3f4f6',
                  }}
                >
                  <Text style={{ fontSize: 18, marginRight: 12 }}>{item.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#374151' }}>
                      {item.country}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#6b7280' }}>
                      {item.code}
                    </Text>
                  </View>
                  {selectedCountryCode.code === item.code && (
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2563eb' }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  noOutline: {
    outlineWidth: 0,
  },
});