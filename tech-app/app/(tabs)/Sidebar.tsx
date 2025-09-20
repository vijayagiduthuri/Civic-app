import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from 'expo-router';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const sidebarWidth = screenWidth;

// MenuItem component
const MenuItem = ({ icon,title,isActive = false,onPress }:{icon: string;title: string;isActive?: boolean;onPress: () => void;}) => (
  <TouchableOpacity
    className={`flex-row items-center py-4 px-6 rounded-xl mb-2 ${isActive ? 'bg-white' : ''}`}
    onPress={onPress}
  >
    <View className="mr-4">
      <Text className={`text-lg ${isActive ? 'text-blue-600' : 'text-white'}`}>
        {icon}
      </Text>
    </View>
    <Text className={`text-lg font-medium ${isActive ? 'text-blue-600' : 'text-white'}`}>
      {title}
    </Text>
    {title === "Settings" && (
      <View className="ml-auto w-6 h-6 justify-center items-center">
        <View className="w-2 h-2 rounded-full bg-blue-600" />
      </View>
    )}
  </TouchableOpacity>
);

// SettingsToggle component for the checklist items
const SettingsToggle = ({ title, isEnabled }: { title: string; isEnabled: boolean }) => (
  <View className="flex-row items-center justify-between py-3 px-2">
    <Text className="text-gray-800 text-base">{title}</Text>
    <View className={`w-6 h-6 rounded-md border-2 ${isEnabled ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
      {isEnabled && (
        <Text className="text-white text-center text-xs">✓</Text>
      )}
    </View>
  </View>
);

export default function SidebarScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Settings');
  
  const profileImage = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80';
  const userName = 'John Doe';
  const userEmail = 'john.doe@example.com';

  const handleMenuItemPress = (title: string) => {
    setActiveTab(title);
    // You can add navigation logic here if needed
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Semi-circle background */}
        <View className="absolute inset-0">
          <Svg
            width={sidebarWidth}
            height={screenHeight * 0.6}
            viewBox={`0 0 ${sidebarWidth} ${screenHeight * 0.6}`}
          >
            <Path
              d={`M 0 0 
                  Q ${sidebarWidth * 0.3} ${screenHeight * 0.1} ${sidebarWidth * 0.1} ${screenHeight * 0.3}
                  Q ${sidebarWidth * 0.3} ${screenHeight * 0.5} 0 ${screenHeight * 0.6}
                  L ${sidebarWidth} ${screenHeight * 0.6}
                  L ${sidebarWidth} 0 
                  Z`}
              fill="#3B82F6"
            />
          </Svg>
        </View>

        {/* Content */}
        <View className="flex-1 pt-16 px-6">
          {/* Profile section */}
          <View className="items-center mb-12">
            <View className="w-28 h-28 rounded-full bg-white/20 justify-center items-center p-1 mb-4">
              <Image
                source={{ uri: profileImage }}
                className="w-26 h-26 rounded-full bg-gray-200"
                style={{ width: 104, height: 104, borderRadius: 52 }}
              />
            </View>
            <Text className="text-white text-xl font-semibold">{userName}</Text>
            <Text className="text-white/80 text-sm">{userEmail}</Text>
          </View>

          {/* Menu items */}
          <View className="flex-1">
            <MenuItem 
              icon="👤" 
              title="Profile" 
              isActive={activeTab === 'Profile'}
              onPress={() => handleMenuItemPress('Profile')} 
            />
            <MenuItem 
              icon="⚙️" 
              title="Settings" 
              isActive={activeTab === 'Settings'}
              onPress={() => handleMenuItemPress('Settings')} 
            />
            <MenuItem 
              icon="📊" 
              title="Dashboard" 
              isActive={activeTab === 'Dashboard'}
              onPress={() => handleMenuItemPress('Dashboard')} 
            />
            <MenuItem 
              icon="❓" 
              title="Help" 
              isActive={activeTab === 'Help'}
              onPress={() => handleMenuItemPress('Help')} 
            />
          </View>
          {/* Logout button */}
          <View className="pb-8">
            <MenuItem 
              icon="🚪" 
              title="Logout" 
              isActive={false}
              onPress={() => console.log('Logout pressed')} 
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}