import { ContactDetails, getUserContactDetails } from "@/utils/userData";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RecentIssue {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: "open" | "in-progress" | "resolved";
}

interface NearbyIssue {
  id: string;
  title: string;
  description: string;
  distance: string;
  supportCount: number;
  category: string;
}

const recentIssues: RecentIssue[] = [
  {
    id: "1",
    title: "Broken Street Light",
    description: "Reported 2 days ago",
    createdAt: "2 days ago",
    status: "open",
  },
];

const nearbyIssues: NearbyIssue[] = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    distance: "0.2 km away",
    supportCount: 12,
    category: "Road Maintenance",
  },
  {
    id: "2",
    title: "Garbage Collection Delay",
    description: "Bins not emptied for 3 days",
    distance: "0.5 km away",
    supportCount: 8,
    category: "Sanitation",
  },
  {
    id: "3",
    title: "Noisy Construction",
    description: "Construction work during late hours",
    distance: "0.8 km away",
    supportCount: 5,
    category: "Noise",
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedRecent, setSelectedRecent] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const router = useRouter();

  const loadUserData = useCallback(async () => {
    try {
      const details = await getUserContactDetails(user?.id);
      setContactDetails(details);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserName = () => {
    if (contactDetails?.name) {
      return contactDetails.name.split(" ")[0];
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return "User";
  };

  const handleRaiseIssue = () => {
    router.push("/report-issue-details");
  };

  const handleViewMoreRecent = () => {
    Alert.alert("Recent Issues", "View all your recent reports.");
  };

  const handleSupportIssue = (issueId: string) => {
    Alert.alert("Support Issue", "Thank you for supporting this issue!");
  };

  const handleViewIssue = (issueId: string) => {
    Alert.alert("View Issue", `Viewing details for issue ${issueId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-5 pb-4">
          <Text className="text-2xl font-bold text-black">
            {getGreeting()}, {getUserName()}
          </Text>
        </View>

        {/* Raise New Issue Button */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-blue-500 py-4 rounded-xl shadow-lg"
            onPress={handleRaiseIssue}
          >
            <Ionicons name="add-circle" size={24} color="#ffffff" />
            <Text className="text-white text-base font-semibold ml-2">Raise New Issue</Text>
          </TouchableOpacity>
        </View>

        {/* Recently Reported Section */}
        <View className="px-5 mb-6">
          <Text className="text-lg font-bold text-black mb-4">Recently reported by you</Text>
          <View className="flex-row items-center">
            {recentIssues.map((issue) => (
              <TouchableOpacity
                key={issue.id}
                className={`bg-white rounded-xl p-4 mr-3 flex-1 border ${
                  selectedRecent === issue.id ? "border-blue-500 border-2" : "border-gray-200"
                }`}
                onPress={() => setSelectedRecent(issue.id)}
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-blue-50 justify-center items-center mr-3">
                    <Ionicons name="document-text" size={24} color="#007AFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-black mb-1">{issue.title}</Text>
                    <Text className="text-xs text-gray-600">{issue.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-gray-50 justify-center items-center border border-gray-200"
              onPress={handleViewMoreRecent}
            >
              <Ionicons name="chevron-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Issues Nearby Section */}
        <View className="px-5 mb-6">
          <Text className="text-lg font-bold text-black mb-4">Issues Nearby You</Text>
          <View className="space-y-3">
            {nearbyIssues.map((issue) => (
              <TouchableOpacity
                key={issue.id}
                className="bg-white rounded-xl p-4 border border-gray-200"
                onPress={() => handleViewIssue(issue.id)}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base font-semibold text-black flex-1 mr-2">
                    {issue.title}
                  </Text>
                  <View className="flex-row items-center bg-blue-500 px-2 py-1 rounded-xl">
                    <Ionicons name="thumbs-up" size={12} color="#ffffff" />
                    <Text className="text-white text-xs font-semibold ml-1">
                      {issue.supportCount}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-700 mb-3">{issue.description}</Text>
                <View className="flex-row justify-between items-center mb-3">
                  <View className="bg-gray-50 px-2 py-1 rounded-lg">
                    <Text className="text-xs text-gray-600 font-medium">{issue.category}</Text>
                  </View>
                  <Text className="text-xs text-gray-600">{issue.distance}</Text>
                </View>
                <TouchableOpacity
                  className="bg-blue-50 py-2 px-4 rounded-lg self-start"
                  onPress={() => handleSupportIssue(issue.id)}
                >
                  <Text className="text-blue-500 text-sm font-semibold">Support</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
