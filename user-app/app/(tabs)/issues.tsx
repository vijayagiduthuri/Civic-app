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

// Mock data (temporary)
const userIssues: Issue[] = [
  {
    id: '1',
    title: 'Broken Street Light',
    description: 'Street light on Main Street is not working, making the area unsafe at night.',
    location: 'Main Street, Block A',
    status: 'open',
    createdAt: '2 days ago',
    supportCount: 12,
    category: 'Infrastructure',
  },
  {
    id: '2',
    title: 'Pothole on Oak Avenue',
    description: 'Large pothole causing damage to vehicles and creating traffic hazards.',
    location: 'Oak Avenue, near City Hall',
    status: 'in-progress',
    createdAt: '1 week ago',
    supportCount: 8,
    category: 'Road Maintenance',
  },
  {
    id: '3',
    title: 'Garbage Collection Issue',
    description: 'Garbage bins not being emptied on scheduled days in residential area.',
    location: 'Residential Block B',
    status: 'open',
    createdAt: '3 days ago',
    supportCount: 15,
    category: 'Sanitation',
  },
];

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
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);

  // API Integration (commented for now)
  /*
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API endpoint
      const response = await fetch('https://your-api.com/api/issues', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token-here', // Add auth if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIssues(data.issues || []);
      
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues. Please try again.');
      // Fallback to mock data in case of error
      setIssues(userIssues);
    } finally {
      setLoading(false);
    }
  };
  */

  // Mock API simulation
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API response
      setIssues(userIssues);
      
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
  }, []);

  const handleIssuePress = (issueId: string) => {
    router.push({
      pathname: '/IssueDetails/issueDetailScreen',
      params: { issueId: issueId },
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
                      <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={14} color="#95a5a6" />
                        <Text className="text-gray-500 text-xs ml-1">
                          {issue.location}
                        </Text>
                      </View>
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