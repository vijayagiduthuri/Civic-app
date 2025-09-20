import { Issue } from "@/services/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient as BVLinearGradient } from "expo-linear-gradient";

// Active Issue Card Component
export const ActiveIssueCard = ({ issue, onStartWork }:{issue: Issue; onStartWork: (issue:Issue) => void })=> (
  <View 
    className="bg-white rounded-3xl p-6 mx-4 mb-6"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    }}
  >
    <View className="flex-row justify-between items-start mb-4">
      <View className="bg-orange-100 px-3 py-1 rounded-full">
        <Text className="text-orange-600 font-semibold text-xs">ASSIGNED</Text>
      </View>
      <View className={`px-3 py-1 rounded-full ${
        issue.priority === 'High' ? 'bg-red-100' : 
        issue.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
      }`}>
        <Text className={`font-semibold text-xs ${
          issue.priority === 'High' ? 'text-red-600' : 
          issue.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
        }`}>{issue.priority}</Text>
      </View>
    </View>

    <Text className="text-gray-800 font-bold text-lg mb-2">{issue.title}</Text>
    <Text className="text-gray-600 text-sm mb-4">{issue.description}</Text>

    <View className="flex-row items-center mb-4">
      <Ionicons name="location-outline" size={16} color="#6b7280" />
      <Text className="text-gray-600 text-sm ml-2 flex-1">{issue.location.address}</Text>
    </View>

    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center">
        <Ionicons name="time-outline" size={16} color="#6b7280" />
        <Text className="text-gray-500 text-sm ml-2">
          Assigned {new Date(issue.assignedAt).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity onPress={() => onStartWork(issue)}>
        <BVLinearGradient
          colors={["#1089d3", "#12b1d1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold text-sm">Start Work</Text>
        </BVLinearGradient>
      </TouchableOpacity>
    </View>
  </View>
);

// Previous Issue Card Component
export const PreviousIssueCard = ({ issue }:{issue:Issue}) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-4 mx-4 mb-3 flex-row"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    }}
  >
    <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-4">
      <Ionicons name="checkmark" size={20} color="#10b981" />
    </View>
    
    <View className="flex-1">
      <Text className="text-gray-800 font-semibold text-base mb-1">{issue.title}</Text>
      <Text className="text-gray-500 text-sm mb-1">{issue.location.address}</Text>
      <Text className="text-gray-400 text-xs">
        Completed {new Date(issue.completedAt).toLocaleDateString()}
      </Text>
    </View>
    
    <View className="items-end justify-center">
      <View className="bg-green-100 px-2 py-1 rounded">
        <Text className="text-green-600 font-medium text-xs">SOLVED</Text>
      </View>
    </View>
  </TouchableOpacity>
);
