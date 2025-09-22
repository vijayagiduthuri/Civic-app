import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function ReportIssueDetails() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
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
    router.push({ pathname: "/report-issue/location", params: { title, description, image } });
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="pt-2" />
      <View className="px-5 pb-4">
        {/* Back Arrow and Title with SafeAreaView */}
        <View className="flex-row items-center mt-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Ionicons name="arrow-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black text-center flex-1">Report Issue</Text>
        </View>
      </View>
      <View className="px-5 space-y-5">
        {error ? (
          <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-2">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        ) : null}
        <View>
          <Text className="text-base font-semibold mb-2">Issue Title</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="Enter issue title"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>
        <View>
          <Text className="text-base font-semibold mb-2">Description ({description.length}/200)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="Describe the issue"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
            style={{ minHeight: 80 }}
          />
        </View>
        <View>
          <Text className="text-base font-semibold mb-2">Upload Issue Image</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-lg px-4 py-3 items-center justify-center"
            onPress={pickImage}
          >
            <Text className="text-blue-500 font-semibold">Select Image</Text>
          </TouchableOpacity>
          {image && (
            <View className="mt-4 items-center">
              <Image source={{ uri: image }} style={{ width: 200, height: 150, borderRadius: 12 }} />
            </View>
          )}
        </View>
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-xl shadow-lg mt-6"
          onPress={handleNext}
        >
          <Text className="text-white text-base font-semibold text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
