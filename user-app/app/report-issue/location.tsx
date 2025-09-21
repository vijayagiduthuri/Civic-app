import { ContactDetails, getUserContactDetails } from "@/utils/userData";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportIssueLocation() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title: string;
    description: string;
    image: string;
  }>();
  const { user } = useAuth();
  const { title, description, image } = params;
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      const details = await getUserContactDetails(user?.id);
      setContactDetails(details);
    } catch (error) {
      console.error("Error loading contact details:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLocationSelect = () => {
    // For demo purposes, we'll use a mock location
    const mockLocation = {
      latitude: 37.78825,
      longitude: -122.4324
    };
    setLocation(mockLocation);
    setAddress("123 Main Street, San Francisco, CA 94102");
    setError(""); // Clear any previous errors
  };

  const handleReportIssue = () => {
    if (!title || !description || !image || !location) {
      setError("Please fill all fields and select a location.");
      return;
    }
    setError("");
    // Submit logic here
    alert("Issue reported successfully!");
    router.replace("/(tabs)"); // Go to Home tab
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-2" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-4">
          <View className="flex-row items-center mt-2">
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Ionicons name="arrow-back" size={28} color="#007AFF" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black text-center flex-1">Location & Contact</Text>
          </View>
        </View>
        <View className="px-5 space-y-5">
        {error ? (
          <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-2">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        ) : null}
        <View>
          <Text className="text-base font-semibold mb-2">Select Location</Text>
          <TouchableOpacity
            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl px-4 py-8 items-center justify-center"
            onPress={handleLocationSelect}
          >
            <Ionicons name="location" size={32} color="#666" />
            <Text className="text-gray-600 font-medium mt-2">Tap to select location</Text>
            <Text className="text-gray-400 text-sm mt-1">Current location will be used</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-base font-semibold mb-2">Location:</Text>
          <View className="border border-gray-300 rounded-lg px-4 py-3">
            <Text className="text-gray-700">{address || "No location selected"}</Text>
          </View>
        </View>
        <View>
          <Text className="text-base font-semibold mb-2">Contact Information</Text>
          <View className="border border-gray-300 rounded-lg px-4 py-3">
            <Text className="text-gray-700">Name: {contactDetails?.name || "N/A"}</Text>
            <Text className="text-gray-700">Email: {contactDetails?.email || "N/A"}</Text>
            <Text className="text-gray-700">Phone: {contactDetails?.phone || "N/A"}</Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-xl shadow-lg mt-6"
          onPress={handleReportIssue}
        >
          <Text className="text-white text-base font-semibold text-center">Report Issue</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}
