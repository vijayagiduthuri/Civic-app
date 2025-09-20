import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient as BVLinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const buttonScale = new Animated.Value(1);

  const validateEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text:string) => {
    setEmail(text);
    if (text.length > 0) {
      setEmailValid(validateEmail(text));
    } else {
      setEmailValid(true);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await new Promise((res) => setTimeout(res, 2000));
      router.replace("/(tabs)");
    } catch (err:any) {
      setError(err?.message || "Sign in failed. Please try again.");
      Alert.alert("Sign In Failed", err?.message || "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const { height: screenHeight } = Dimensions.get("window");

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          minHeight: screenHeight,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Illustration */}
        <View className="items-center mb-8">
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: '#1089d3',
              shadowColor: '#1089d3',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons name="lock-closed" size={32} color="#fff" />
          </View>
          <Text className="text-gray-600 text-base font-medium">Welcome back!</Text>
        </View>

        {/* Card Container */}
        <View 
          className="bg-white rounded-3xl p-8 mx-2"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          
          {/* Heading */}
          <Text className="text-center text-[#1089d3] font-bold text-3xl mb-8 tracking-wide">
            Sign In
          </Text>

          {/* Email Input */}
          <View className="mb-4">
            <View 
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${
                emailFocused ? 'border-[#12b1d1] bg-blue-50' : 
                !emailValid ? 'border-red-400 bg-red-50' : 'border-transparent'
              }`}
              style={{
                shadowColor: emailFocused ? '#12b1d1' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: emailFocused ? 0.15 : 0.05,
                shadowRadius: 4,
                elevation: emailFocused ? 4 : 2,
              }}
            >
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={emailFocused ? '#12b1d1' : !emailValid ? '#ef4444' : '#9ca3af'} 
              />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={handleEmailChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-base text-gray-800 font-medium"
              />
              {email.length > 0 && (
                <Ionicons 
                  name={emailValid ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={emailValid ? "#10b981" : "#ef4444"} 
                />
              )}
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <View 
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${
                passwordFocused ? 'border-[#12b1d1] bg-blue-50' : 'border-transparent'
              }`}
              style={{
                shadowColor: passwordFocused ? '#12b1d1' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: passwordFocused ? 0.15 : 0.05,
                shadowRadius: 4,
                elevation: passwordFocused ? 4 : 2,
              }}
            >
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={passwordFocused ? '#12b1d1' : '#9ca3af'} 
              />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                className="flex-1 ml-3 text-base text-gray-800 font-medium"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#9ca3af" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isLoading}
              className={`w-full rounded-2xl overflow-hidden ${isLoading ? "opacity-70" : ""}`}
              activeOpacity={0.9}
            >
              <BVLinearGradient
                colors={["#1089d3", "#12b1d1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full py-5 items-center justify-center rounded-2xl"
                style={{
                  shadowColor: '#1089d3',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white font-bold text-lg ml-2">Signing In...</Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold text-lg tracking-wide">Sign In</Text>
                )}
              </BVLinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Error Message */}
          {error && (
            <Animated.View 
              className="flex-row items-center bg-red-50 px-4 py-4 rounded-2xl mt-6 border border-red-200"
              style={{
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
              </View>
              <Text className="text-red-700 text-sm font-medium ml-3 flex-1 leading-5">{error}</Text>
            </Animated.View>
          )}
        </View>

        {/* Footer */}
        <View className="items-center mt-8">
          <Text className="text-gray-500 text-sm">
            Signin to access your account.
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}