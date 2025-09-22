import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from "@clerk/clerk-expo";

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  supportCount: number;
  category: string;
}


// Helper functions
const getStatusColor = (status: 'open' | 'in-progress' | 'resolved') => {
  const colors = {
    'open': '#e74c3c',
    'in-progress': '#f1c40f',
    'resolved': '#2ecc71'
  };
  return colors[status] || '#95a5a6';
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Infrastructure': '#3498db',
    'Road Maintenance': '#9b59b6',
    'Sanitation': '#1abc9c',
    'Public Safety': '#e67e22'
  };
  return colors[category] || '#34495e';
};

export default function IssuesScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get user email and user_id
      const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
      let userId = undefined;
      if (email) {
        const response = await fetch(
          'https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/authUsers/get-user',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          }
        );
        if (response.ok) {
          const json = await response.json();
          if (json?.success && json?.data) {
            userId = json.data.id;
            console.log('Fetched user ID:', userId);
          }
        }
      }
      // Fetch all issues
      const issuesResponse = await fetch('https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/issues/all-issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!issuesResponse.ok) {
        throw new Error(`HTTP error! status: ${issuesResponse.status}`);
      }
      const issuesJson = await issuesResponse.json();
      // Map API data to Issue[]
      const apiIssues = (issuesJson.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        location: '', // No location in API, leave blank
        status: item.status === 'in_progress' ? 'in-progress' : (item.status === 'pending' ? 'open' : item.status),
        createdAt: item.createdAt || '',
        supportCount: item.supportCount || 0,
        category: item.category || '',
      }));
      setIssues(apiIssues);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues. Please try again.');
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleIssuePress = (issueId: string) => {
    router.push({
      pathname: '/IssueDetails/issueDetailScreen',
      params: { issueId },
    });
  };

  const handleReportIssue = () => {
    router.push('/report-issue'); // Navigate to report issue screen
  };

  const handleRetry = () => {
    fetchIssues();
  };

  // Loading State
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-blue-500 pt-5 pb-4 px-5 shadow-lg">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-2xl font-semibold text-white">Reported Issues</Text>
          </View>
        </View>

        {/* Loading Indicator */}
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3498db" />
          <Text className="text-gray-600 mt-4 text-lg">Loading issues...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error && issues.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-blue-500 pt-5 pb-4 px-5 shadow-lg">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-2xl font-semibold text-white">Reported Issues</Text>
          </View>
        </View>

        {/* Error Message */}
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text className="text-gray-600 text-lg text-center mt-4 mb-2">
            {error}
          </Text>
          <TouchableOpacity 
            className="bg-blue-500 px-6 py-3 rounded-lg mt-4"
            onPress={handleRetry}
          >
            <Text className="text-white text-base font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Empty State
  if (!loading && issues.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-blue-500 pt-5 pb-4 px-5 shadow-lg">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-2xl font-semibold text-white">Reported Issues</Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="document-text-outline" size={64} color="#bdc3c7" />
          <Text className="text-gray-600 text-lg text-center mt-4 mb-2">
            You haven't reported any issues yet.
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Be the first to report an issue in your community.
          </Text>
          <TouchableOpacity 
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={handleReportIssue}
          >
            <Text className="text-white text-base font-semibold">Report an Issue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 pt-5 pb-4 px-5 shadow-lg">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white">Reported Issues</Text>
        </View>
      </View>

      {/* Error Banner (if any) */}
      {error && (
        <View className="bg-red-100 border-l-4 border-red-500 p-4 mx-5 mt-4 rounded">
          <View className="flex-row items-center">
            <Ionicons name="warning-outline" size={20} color="#e74c3c" />
            <Text className="text-red-700 ml-2 flex-1">{error}</Text>
            <TouchableOpacity onPress={handleRetry}>
              <Text className="text-red-700 font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Issues List */}
      <ScrollView 
        className="flex-1 px-5 py-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <ScrollView refreshControl={undefined} /> // Add pull-to-refresh here if needed
        }
      >
        <View className="space-y-4">
          {issues.map((issue) => (
            <Pressable 
              key={issue.id}
              onPress={() => handleIssuePress(issue.id)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:opacity-90 active:scale-95"
            >
              {/* Status Indicator */}
              <View className="flex-row items-start mb-3">
                <View 
                  className="w-2 h-2 rounded-full mr-3 mt-2"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                />
                <View className="flex-1">
                  {/* Header */}
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-semibold text-gray-800 flex-1 mr-3">
                      {issue.title}
                    </Text>
                    <View 
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: getCategoryColor(issue.category) }}
                    >
                      <Text className="text-white text-xs font-medium">
                        {issue.category}
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  <Text className="text-gray-600 text-sm leading-5 mb-3" numberOfLines={2}>
                    {issue.description}
                  </Text>

                  {/* Footer */}
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center space-x-4">
                      {/*
                      <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={14} color="#95a5a6" />
                        <Text className="text-gray-500 text-xs ml-1">
                          {issue.location}
                        </Text>
                      </View>
                      */}
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#95a5a6" />
                        <Text className="text-gray-500 text-xs ml-1">
                          {issue.createdAt}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center bg-gray-50 px-3 py-1 rounded-full">
                      <Ionicons name="people-outline" size={14} color="#7f8c8d" />
                      <Text className="text-gray-600 text-xs ml-1">
                        {issue.supportCount} supports
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* FAB Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-xl"
        onPress={handleReportIssue}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}