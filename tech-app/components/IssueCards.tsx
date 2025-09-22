import { Issue } from "@/services/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

// Helper function to safely format dates
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Date not available';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Invalid date';
  }
};

// Active Issue Card Component
export const ActiveIssueCard = ({ issue, onStartWork }: { issue: Issue; onStartWork: (issue: Issue) => void }) => (
  <View 
    className="bg-white rounded-3xl p-6 mx-4 mb-6 border border-gray-200"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    }}
  >
    <View className="flex-row justify-between items-start mb-4">
      <View className="bg-primary-100 px-3 py-1 rounded-full">
        <Text className="text-primary-600 font-semibold text-xs">ACTIVE</Text>
      </View>
      <View className={`px-3 py-1 rounded-full ${
        issue.priority === 'High' ? 'bg-status-error/20' : 
        issue.priority === 'Medium' ? 'bg-status-warning/20' : 'bg-status-success/20'
      }`}>
        <Text className={`font-semibold text-xs ${
          issue.priority === 'High' ? 'text-status-error' : 
          issue.priority === 'Medium' ? 'text-status-warning' : 'text-status-success'
        }`}>{issue.priority || 'Normal'} PRIORITY</Text>
      </View>
    </View>

    <Text className="text-gray-900 font-bold text-lg mb-2">{issue.title}</Text>
    <Text className="text-gray-600 text-sm mb-4">{issue.description}</Text>

    <View className="flex-row items-center mb-4">
      <Ionicons name="location-outline" size={16} color="#757575" />
      <Text className="text-gray-600 text-sm ml-2 flex-1">
        {issue.location?.address || 'Address not available'}
      </Text>
    </View>

    <View className="flex-row items-center mb-4">
      <Ionicons name="person-outline" size={16} color="#757575" />
      <Text className="text-gray-600 text-sm ml-2">
        {issue.customer?.name || 'Customer information not available'}
      </Text>
    </View>

    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center">
        <Ionicons name="time-outline" size={16} color="#757575" />
        <Text className="text-gray-500 text-sm ml-2">
          Assigned {formatDate(issue.assignedAt)}
        </Text>
      </View>
      
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push({
          pathname: "/issueDetails/[id]",
          params: { id: issue.id },
        })}
      >
        <LinearGradient
          colors={["#0066ff", "#3385ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center px-6 py-3 rounded-full"
          style={{
            shadowColor: "#0066ff",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Ionicons name="play-circle" size={16} color="white" />
          <Text className="text-white font-bold ml-2">Start Work</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
);

// Previous Issue Card Component
export const PreviousIssueCard = ({ issue }: { issue: Issue }) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-4 mx-4 mb-3 flex-row border border-gray-200"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    }}
    onPress={() => router.push({
      pathname: "/issueDetails/[id]",
      params: { id: issue.id },
    })}
  >
    <View className="w-12 h-12 rounded-full bg-status-success/20 items-center justify-center mr-4">
      <Ionicons name="checkmark-done" size={20} color="#00c853" />
    </View>
    
    <View className="flex-1">
      <Text className="text-gray-900 font-semibold text-base mb-1">{issue.title}</Text>
      <Text className="text-gray-600 text-sm mb-1">
        {issue.location?.address || 'Address not available'}
      </Text>
      <Text className="text-gray-500 text-xs">
        Completed {formatDate(issue.completedAt)}
      </Text>
    </View>
    
    <View className="items-end justify-center">
      <View className="bg-status-success/20 px-2 py-1 rounded-full">
        <Text className="text-status-success font-medium text-xs">SOLVED</Text>
      </View>
      <Text className="text-gray-400 text-xs mt-1">
        {issue.priority || 'Normal'}
      </Text>
    </View>
  </TouchableOpacity>
);