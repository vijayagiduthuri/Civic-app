import React from "react";
import { ActivityIndicator, Text, View, Image } from "react-native";

export default function Splash() {
  return (
    <View className="flex-1 items-center justify-center bg-[#E6F4FE]">
      {/* App Icon */}
      <Image
        source={require("../assets/images/appicon.png")}
        className="w-24 h-24 mb-6 rounded-2xl shadow-lg"
        resizeMode="contain"
      />

      {/* Title */}
      <Text className="text-3xl font-extrabold text-gray-900 mb-4">
        Civic App
      </Text>

      {/* Loader */}
      <View className="items-center mt-2">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-2 text-gray-600 text-base">Loading...</Text>
      </View>
    </View>
  );
}
