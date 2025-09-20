import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SkeletonLoader} from "../../components/skeletonloader";
import { Issue } from "@/services/types";
import { ActiveIssueCard, PreviousIssueCard } from "@/components/IssueCards";
import { MenuModal } from "@/components/Menu";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeIssue, setActiveIssue] = useState<Issue>();
  const [previousIssues, setPreviousIssues] = useState<any[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  // Mock API call simulation
  const fetchIssues = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock data - replace with actual API call
      const mockActiveIssue = {
        id: "ISS001",
        title: "Current Poll broken",
        description: "asdfghjkl",
        location: {
          latitude: 16.5062,
          longitude: 81.8077,
          address: "123 Main St, Bhimavaram, AP 534201"
        },
        customer: {
          name: "Ravi Kumar",
          phone: "+91 9876543210",
          email: "ravi.kumar@email.com"
        },
        priority: "High",
        assignedAt: "2024-01-15T10:30:00Z",
        status: "assigned",         
        completedAt: "2024-01-10T14:30:00Z",

      };

      const mockPreviousIssues = [
        {
          id: "ISS002",
          title: "Current Poll not working",
          location: { address: "456 Park Road, Bhimavaram, AP" },
          completedAt: "2024-01-10T14:30:00Z",
          status: "completed",
          priority: "High",
          assignedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "ISS003", 
          title: "Streel Lamp flickering",
          location: { address: "789 Lake View, Bhimavaram, AP" },
          completedAt: "2024-01-08T11:15:00Z",
          status: "completed",
          priority: "High",
          assignedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "ISS004",
          title: "Electricity Wire Brokedown",
          location: { address: "321 Garden Street, Bhimavaram, AP" },
          completedAt: "2024-01-05T16:45:00Z",
          status: "completed"
        }
      ];

      setActiveIssue(mockActiveIssue);
      setPreviousIssues(mockPreviousIssues);
      
    } catch (error) {
      Alert.alert("Error", "Failed to fetch issues. Please try again.");
      console.error("Fetch issues error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStartWork = (issue:object) => {
    // // Navigate to issue details screen
    // router.push({
    //   pathname: "/issue-details",
    //   params: { issueId: issue.id }
    // });
  };

  const handleMenuNavigation = (screen:string) => {
    // setMenuVisible(false);
    // router.push(`/${screen}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        
        {/* Header Skeleton */}
        <View className="flex-row justify-between items-center p-4 bg-white">
          <View className="bg-gray-200 h-8 w-32 rounded"></View>
          <View className="bg-gray-200 h-8 w-8 rounded-full"></View>
        </View>
        
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View>
          <Text className="text-gray-500 text-sm">Welcome back,</Text>
          <Text className="text-gray-800 font-bold text-lg">Technician</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setMenuVisible(true)}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="menu" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Active Issue Section */}
        {activeIssue && (
          <View className="pt-4">
            <Text className="text-gray-800 font-bold text-xl px-4 mb-4">Current Assignment</Text>
            <ActiveIssueCard issue={activeIssue} onStartWork={handleStartWork} />
          </View>
        )}

        {/* Previous Issues Section */}
        {previousIssues.length > 0 && (
          <View>
            <Text className="text-gray-800 font-bold text-xl px-4 mb-4">Previous Work</Text>
            {previousIssues.map((issue) => (
              <PreviousIssueCard key={issue.id} issue={issue} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {!activeIssue && previousIssues.length === 0 && (
          <View className="flex-1 items-center justify-center px-4 pt-20">
            <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-4">
              <Ionicons name="briefcase-outline" size={32} color="#1089d3" />
            </View>
            <Text className="text-gray-800 font-semibold text-lg mb-2">No Issues Assigned</Text>
            <Text className="text-gray-500 text-center">
              You don't have any active or previous issues at the moment.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleMenuNavigation}
      />
    </SafeAreaView>
  );
}