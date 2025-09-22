import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SkeletonLoader } from "@/components/skeletonloader";
import { Issue } from "@/services/types";
import { ActiveIssueCard, PreviousIssueCard } from "@/components/IssueCards";
import { MenuModal } from "@/components/Menu";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AppRoutes } from "../routes";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeIssue, setActiveIssue] = useState<Issue>();
  const [previousIssues, setPreviousIssues] = useState<any[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockActiveIssue = {
        id: "ISS001",
        title: "Street Light Broken",
        description: "Street light not functioning near main road junction causing safety concerns for pedestrians and drivers",
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
        category: "Street Lights",
      };

      const mockPreviousIssues = [
        {
          id: "ISS002",
          title: "Pothole Repair",
          description: "Large pothole causing traffic issues",
          location: { address: "456 Park Road, Bhimavaram, AP" },
          completedAt: "2024-01-10T14:30:00Z",
          status: "completed",
          priority: "High",
          assignedAt: "2024-01-09T10:30:00Z",
          category: "Road Maintenance",
        },
        {
          id: "ISS003", 
          title: "Garbage Collection Issue",
          description: "Garbage not collected for 3 days",
          location: { address: "789 Lake View, Bhimavaram, AP" },
          completedAt: "2024-01-08T11:15:00Z",
          status: "completed",
          priority: "Medium",
          assignedAt: "2024-01-07T10:30:00Z",
          category: "Sanitation",
        },
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

 const handleMenuNavigation = (screen: AppRoutes) => {
  setMenuVisible(false);
  router.push(screen); // ✅ type-safe now
};

const handleStartWork = (issue: Issue) => {
  router.push(`/issueDetails/${issue.id}` as AppRoutes); // ✅ matches the type
};


  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <StatusBar barStyle="dark-content" backgroundColor="#fafbfc" />
        
        {/* Header Skeleton */}
        <View className="flex-row justify-between items-center p-6 bg-background-card border-b border-neutral-100">
          <View>
            <View className="bg-neutral-200 h-4 w-28 rounded-lg mb-2"></View>
            <View className="bg-neutral-200 h-6 w-36 rounded-lg"></View>
          </View>
          <View className="bg-neutral-200 h-12 w-12 rounded-2xl"></View>
        </View>
        
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <StatusBar barStyle="dark-content" backgroundColor="#fafbfc" />
      
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        className="px-6 py-4 border-b border-neutral-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.03,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-text-secondary text-sm font-medium">Electricity</Text>
            <Text className="text-text-primary font-bold text-xl">Ramesh</Text>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></View>
              <Text className="text-text-tertiary text-xs">Ready to serve the community</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => setMenuVisible(true)}
            className="w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center border border-primary-100"
            style={{
              shadowColor: '#0ea5e9',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="menu" size={22} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Stats Cards */}
        <View className="flex-row px-6 pt-6 pb-2 gap-4">
          <View className="flex-1 bg-background-card rounded-2xl p-4 border border-neutral-100">
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-8 h-8 bg-primary-100 rounded-lg items-center justify-center">
                <Ionicons name="briefcase" size={16} color="#0ea5e9" />
              </View>
              <Text className="text-text-tertiary text-xs font-medium">ACTIVE</Text>
            </View>
            <Text className="text-text-primary font-bold text-lg">{activeIssue ? '1' : '0'}</Text>
            <Text className="text-text-secondary text-xs">Current Task</Text>
          </View>
          
          <View className="flex-1 bg-background-card rounded-2xl p-4 border border-neutral-100">
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-8 h-8 bg-secondary-100 rounded-lg items-center justify-center">
                <Ionicons name="checkmark-done" size={16} color="#10b981" />
              </View>
              <Text className="text-text-tertiary text-xs font-medium">DONE</Text>
            </View>
            <Text className="text-text-primary font-bold text-lg">{previousIssues.length}</Text>
            <Text className="text-text-secondary text-xs">Completed</Text>
          </View>
        </View>

        {/* Active Issue Section */}
        {activeIssue && (
          <View className="pt-6">
            <View className="flex-row items-center px-6 mb-4">
              <LinearGradient
                colors={['#0ea5e9', '#0284c7']}
                className="w-1 h-6 rounded-full mr-4"
              />
              <Text className="text-text-primary font-bold text-xl">Current Assignment</Text>
              <View className="ml-auto bg-accent-orange/20 px-3 py-1 rounded-full">
                <Text className="text-accent-orange font-semibold text-xs">URGENT</Text>
              </View>
            </View>
            <ActiveIssueCard 
              issue={activeIssue} 
              onStartWork={handleStartWork}
            />
          </View>
        )}

        {/* Previous Issues Section */}
        {previousIssues.length > 0 && (
          <View className="pt-6">
            <View className="flex-row items-center px-6 mb-4">
              <LinearGradient
                colors={['#10b981', '#059669']}
                className="w-1 h-6 rounded-full mr-4"
              />
              <Text className="text-text-primary font-bold text-xl">Work History</Text>
              <Text className="ml-auto text-text-tertiary text-sm">{previousIssues.length} completed</Text>
            </View>
            {previousIssues.map((issue) => (
              <PreviousIssueCard key={issue.id} issue={issue} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {!activeIssue && previousIssues.length === 0 && (
          <View className="flex-1 items-center justify-center px-6 pt-20">
            <LinearGradient
              colors={['#f0f9ff', '#e0f2fe']}
              className="w-32 h-32 rounded-4xl items-center justify-center mb-6 border-2 border-primary-100"
            >
              <View className="w-16 h-16 bg-primary-500 rounded-3xl items-center justify-center">
                <Ionicons name="briefcase-outline" size={32} color="white" />
              </View>
            </LinearGradient>
            
            <Text className="text-text-primary font-bold text-xl mb-3 text-center">
              No Issues Assigned
            </Text>
            <Text className="text-text-secondary text-center text-base leading-6 mb-8">
              You're all caught up! No active or pending{'\n'}issues at the moment. Great job!
            </Text>
            
            <TouchableOpacity 
              className="bg-primary-500 px-8 py-4 rounded-2xl flex-row items-center"
              onPress={fetchIssues}
              style={{
                shadowColor: "#0ea5e9",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Ionicons name="refresh" size={18} color="white" />
              <Text className="text-white font-bold text-base ml-3">Check for Updates</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <MenuModal 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleMenuNavigation}
      />
    </SafeAreaView>
  );
}