import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportIssueDetails() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions to upload images."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleNext = () => {
    if (!title.trim()) {
      setError("Please enter an issue title.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (!image) {
      setError("Please upload an image.");
      return;
    }
    setError("");

    // Navigate to location page with data
    router.push({
      pathname: "/report-issue/location",
      params: {
        title: title.trim(),
        description: description.trim(),
        image: image,
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View className="px-5 pt-8 pb-4 relative">
          <TouchableOpacity
            onPress={handleBack}
            className="absolute left-5 top-6 z-10 p-2"
          >
            <Ionicons name="arrow-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black text-center">
            Report Issue
          </Text>
        </View>

        <View className="px-5 space-y-6">
          {/* Error Display */}
          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4">
              <View className="flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text className="text-red-700 text-sm ml-2 flex-1">
                  {error}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Issue Title */}
          <View>
            <Text className="text-base font-semibold text-black mb-3">
              Issue Title
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-black"
              placeholder="Enter a clear, descriptive title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setError(""); // Clear error when user types
              }}
              maxLength={50}
            />
            <Text className="text-xs text-gray-500 mt-1">
              {title.length}/50 characters
            </Text>
          </View>

          {/* Description */}
          <View>
            <Text className="text-base font-semibold text-black mb-3">
              Description
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-black"
              placeholder="Describe the issue in detail..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setError(""); // Clear error when user types
              }}
              multiline
              maxLength={200}
              style={{ minHeight: 100, textAlignVertical: "top" }}
            />
            <Text className="text-xs text-gray-500 mt-1">
              {description.length}/200 characters
            </Text>
          </View>

          {/* Image Upload */}
          <View>
            <Text className="text-base font-semibold text-black mb-3">
              Upload Issue Image
            </Text>
            <TouchableOpacity
              className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl px-4 py-8 items-center justify-center"
              onPress={pickImage}
            >
              <Ionicons name="camera" size={32} color="#666" />
              <Text className="text-gray-600 font-medium mt-2">
                Tap to select image
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                JPG, PNG up to 5MB
              </Text>
            </TouchableOpacity>

            {/* Image Preview */}
            {image && (
              <View className="mt-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Image Preview:
                </Text>
                <View className="relative">
                  <Image
                    source={{ uri: image }}
                    className="w-full h-48 rounded-xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-xl shadow-lg mt-8 mb-8"
            onPress={handleNext}
            style={{
              shadowColor: "#007AFF",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white text-base font-semibold text-center">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
