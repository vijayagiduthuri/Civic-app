import { useAuth, useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactDetails() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (!isLoaded) return;

    const rawParamEmail = (params as Record<string, unknown>)?.email as string | string[] | undefined;
    const paramEmail = Array.isArray(rawParamEmail) ? rawParamEmail[0] : rawParamEmail;

    const clerkEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '';
    const candidate = (paramEmail && paramEmail.trim()) || clerkEmail;

    if (candidate && candidate !== email) {
      setEmail(candidate);
    }
  }, [isLoaded, params, user?.primaryEmailAddress?.emailAddress, user?.emailAddresses, email]);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!age.trim()) {
      Alert.alert('Error', 'Please enter your age');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age (1-120)');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Try to register user on backend (non-blocking)
      try {
        const registerResponse = await fetch('https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/authUsers/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            age: parseInt(age),
          }),
        });

        if (registerResponse.ok) {
          const registerJson = await registerResponse.json();
          if (!registerJson?.success) {
            console.warn('Registration failed on backend, continuing locally');
          }
        } else {
          console.warn('Registration request failed, continuing locally');
        }
      } catch (e) {
        console.warn('Registration error, continuing locally:', e);
      }

      // Store contact details in AsyncStorage
      const contactDetails = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        age: parseInt(age),
        userId: user?.id,
        completedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('userContactDetails', JSON.stringify(contactDetails));
      
      // Also update Clerk user metadata (optional - for backend sync)
      if (user) {
        try {
          await user.update({
            firstName: name.trim().split(' ')[0],
            lastName: name.trim().split(' ').slice(1).join(' ') || '',
            unsafeMetadata: {
              phone: phone.trim(),
              age: parseInt(age),
              contactDetailsCompleted: true,
            }
          });
        } catch (clerkError) {
          console.log('Clerk update failed, but local storage succeeded:', clerkError);
        }
      }
      
      Alert.alert('Success', 'Your contact details have been saved!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      console.error('Error saving contact details:', error);
      Alert.alert('Error', 'Failed to save contact details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center mb-10">
            <Text className="text-3xl font-bold text-black text-center">Contact Details</Text>
          </View>

          {/* Form */}
          <View className="flex-1">
            {/* Name Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-black mb-2">Name</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-black"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
            </View>

            {/* Phone Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-black mb-2">Phone number</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-black"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            </View>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-black mb-2">Email</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-black"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>

            {/* Age Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-black mb-2">Age</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-black"
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor="#999"
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl items-center mt-5 shadow-lg ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              onPress={handleSubmit}
              disabled={isLoading}
              style={!isLoading ? {
                shadowColor: '#007AFF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              } : {}}
            >
              <Text className="text-white text-base font-semibold">
                {isLoading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}