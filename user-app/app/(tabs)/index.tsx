import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const complaints = [
  { id: "1", type: "Noise", description: "Loud music from neighbors", supportCount: 5 },
  { id: "2", type: "Maintenance", description: "Broken elevator", supportCount: 3 },
];

export default function ComplaintsScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Complaints
        </Text>

        {/* Complaint List */}
        {complaints.map((c) => (
          <TouchableOpacity
            key={c.id}
            className={`p-4 rounded-xl shadow-sm mb-4 ${
              selectedId === c.id ? "bg-blue-100" : "bg-white"
            }`}
            onPress={() => setSelectedId(c.id)}
          >
            <Text className="text-lg font-semibold text-gray-800 mb-1">{c.type}</Text>
            <Text className="text-sm text-gray-600 mb-2">{c.description}</Text>
            <Text className="text-xs text-gray-500">Supports: {c.supportCount}</Text>
          </TouchableOpacity>
        ))}

        {/* CTA Section */}
        <View className="mt-8 bg-blue-50 p-6 rounded-2xl items-center">
          <Text className="text-xl font-bold text-gray-900 mb-2">Raise your voice</Text>
          <Text className="text-sm text-gray-600 text-center mb-4">
            Support complaints or create your own to improve the community.
          </Text>
          <TouchableOpacity className="bg-blue-500 w-full py-3 rounded-full items-center">
            <Text className="text-white font-semibold text-center">Create Complaint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
