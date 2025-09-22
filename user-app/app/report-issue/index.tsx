import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SkeletonLoader } from "@/components/skeletonloader";

export default function ReportIssueDetails() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to select images.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setError(""); // Clear error when image is selected
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera permissions to take photos.');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setError(""); // Clear error when image is taken
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleNext = async () => {
    // Validation
    if (!title.trim()) {
      setError("Please enter an issue title.");
      return;
    }
    if (title.trim().length < 5) {
      setError("Issue title should be at least 5 characters long.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (description.trim().length < 20) {
      setError("Description should be at least 20 characters long.");
      return;
    }
    if (!image) {
      setError("Please upload an image of the issue.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate API call or processing
    setTimeout(() => {
      setIsLoading(false);
      router.push({ 
        pathname: "/report-issue/location", 
        params: { 
          title: title.trim(), 
          description: description.trim(), 
          image 
        } 
      });
    }, 1000);
  };

  const handleBack = () => {
    if (title || description || image) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="px-5 pb-4 pt-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBack} className="mr-3 p-2">
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-black text-center">Report Issue</Text>
            <Text className="text-gray-500 text-center text-sm mt-1">Step 1: Issue Details</Text>
          </View>
          <View className="w-10" /> {/* Spacer for balance */}
        </View>
      </View>

      {/* Content */}
      <View className="px-5 space-y-6 mt-4">
        {/* Error Message */}
        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2 flex-row items-center">
            <Ionicons name="warning" size={20} color="#DC2626" />
            <Text className="text-red-700 text-sm ml-2 flex-1">{error}</Text>
          </View>
        ) : null}

        {/* Issue Title */}
        <View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold text-gray-800">Issue Title</Text>
            <Text className="text-sm text-gray-500">{title.length}/50</Text>
          </View>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-white"
            placeholder="e.g., Broken Street Light, Pothole on Main Road"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setError("");
            }}
            maxLength={50}
          />
        </View>

        {/* Description */}
        <View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold text-gray-800">Description</Text>
            <Text className="text-sm text-gray-500">{description.length}/200</Text>
          </View>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-white"
            placeholder="Describe the issue in detail... (minimum 20 characters)"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setError("");
            }}
            multiline
            maxLength={200}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
            numberOfLines={4}
          />
        </View>

        {/* Image Upload */}
        <View>
          <Text className="text-base font-semibold text-gray-800 mb-3">Upload Issue Image</Text>
          
          <View className="flex-row space-x-3 mb-3">
            {/* Gallery Option */}
            <TouchableOpacity
              className="flex-1 border-2 border-dashed border-blue-400 rounded-xl px-4 py-3 items-center justify-center bg-blue-50"
              onPress={pickImage}
            >
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text className="text-blue-600 font-semibold mt-1 text-center">Choose from Gallery</Text>
            </TouchableOpacity>

            {/* Camera Option */}
            <TouchableOpacity
              className="flex-1 border-2 border-dashed border-green-400 rounded-xl px-4 py-3 items-center justify-center bg-green-50"
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={24} color="#10B981" />
              <Text className="text-green-600 font-semibold mt-1 text-center">Take Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Image Preview */}
          {image && (
            <View className="mt-4 items-center">
              <View className="relative">
                <Image 
                  source={{ uri: image }} 
                  style={{ width: 200, height: 150, borderRadius: 12 }} 
                />
                <TouchableOpacity 
                  onPress={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-500 text-sm mt-2">Image preview - Tap to change</Text>
            </View>
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-xl shadow-lg mt-6 mb-8 flex-row items-center justify-center"
          onPress={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <SkeletonLoader/>
          ) : (
            <>
              <Text className="text-white text-lg font-semibold mr-2">Next: Choose Location</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View className="flex-row justify-center items-center space-x-2 mb-6">
          <View className="w-3 h-3 bg-blue-500 rounded-full"></View>
          <View className="w-3 h-3 bg-gray-300 rounded-full"></View>
          <View className="w-3 h-3 bg-gray-300 rounded-full"></View>
        </View>
      </View>
    </ScrollView>
  );
}