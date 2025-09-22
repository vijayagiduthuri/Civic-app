import { clearUserContactDetails, ContactDetails, getUserContactDetails } from '@/utils/userData';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserStats {
  issuesReported: number;
  issuesSupported: number;
  communityScore: number;
}

const sampleUserStats: UserStats = {
  issuesReported: 5,
  issuesSupported: 23,
  communityScore: 85,
};

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);

  useEffect(() => {
    loadUserData();
  }, [user?.id]);

  const loadUserData = async () => {
    try {
      const details = await getUserContactDetails(user?.id);
      setContactDetails(details);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            // Clear user contact details before signing out
            await clearUserContactDetails();
            await signOut();
            router.replace('/(auth)/signin');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This will open the profile editing form.', [
      {
        text: 'Refresh Data',
        onPress: loadUserData,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleViewReports = () => {
    Alert.alert('My Reports', 'This will show your reported issues.');
  };

  const handleViewSupports = () => {
    Alert.alert('My Supports', 'This will show issues you\'ve supported.');
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: handleEditProfile,
    },
    {
      icon: 'document-text-outline',
      title: 'My Reports',
      onPress: handleViewReports,
    },
    {
      icon: 'thumbs-up-outline',
      title: 'My Supports',
      onPress: handleViewSupports,
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      onPress: () => Alert.alert('Settings', 'Settings panel coming soon.'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => Alert.alert('Help', 'Help center coming soon.'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      onPress: () => Alert.alert('About', 'Civic App v1.0.0'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-5 pt-5 pb-4">
          <Text className="text-2xl font-bold text-black">Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="bg-white mx-5 mb-5 rounded-2xl p-6 items-center border border-gray-200 shadow-sm">
          <View className="relative mb-4">
            <View className="w-20 h-20 rounded-full bg-gray-50 justify-center items-center border-3 border-gray-200">
              <Ionicons name="person" size={40} color="#007AFF" />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 w-7 h-7 rounded-full justify-center items-center border-2 border-white">
              <Ionicons name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-xl font-bold text-black mb-1">
            {contactDetails?.name || `${user?.firstName || 'User'} ${user?.lastName || 'Name'}`}
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            {contactDetails?.email || user?.emailAddresses[0]?.emailAddress}
          </Text>
          {contactDetails?.phone && (
            <Text className="text-sm text-gray-600 mb-4">📞 {contactDetails.phone}</Text>
          )}
          {contactDetails?.age && (
            <Text className="text-sm text-gray-600 mb-4">🎂 {contactDetails.age} years old</Text>
          )}
          
          <TouchableOpacity className="bg-blue-500 px-6 py-2 rounded-full" onPress={handleEditProfile}>
            <Text className="text-white text-sm font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row bg-white mx-5 mb-5 rounded-2xl p-5 border border-gray-200 shadow-sm">
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-blue-500 mb-1">{sampleUserStats.issuesReported}</Text>
            <Text className="text-xs text-gray-600 text-center">Issues Reported</Text>
          </View>
          <View className="w-px bg-gray-200 mx-4" />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-blue-500 mb-1">{sampleUserStats.issuesSupported}</Text>
            <Text className="text-xs text-gray-600 text-center">Issues Supported</Text>
          </View>
          <View className="w-px bg-gray-200 mx-4" />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-blue-500 mb-1">{sampleUserStats.communityScore}</Text>
            <Text className="text-xs text-gray-600 text-center">Community Score</Text>
          </View>
        </View>

        {/* Settings */}
        <View className="bg-white mx-5 mb-5 rounded-2xl p-5 border border-gray-200 shadow-sm">
          <Text className="text-base font-bold text-black mb-4">Settings</Text>
          
          <View className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={20} color="#666666" />
              <Text className="text-sm text-black ml-3">Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e9ecef', true: '#007AFF' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={20} color="#666666" />
              <Text className="text-sm text-black ml-3">Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#e9ecef', true: '#007AFF' }}
              thumbColor={locationEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white mx-5 mb-5 rounded-2xl border border-gray-200 shadow-sm">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row justify-between items-center px-5 py-4 border-b border-gray-50"
              onPress={item.onPress}
            >
              <View className="flex-row items-center">
                <Ionicons name={item.icon} size={20} color="#666666" />
                <Text className="text-sm text-black ml-3">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#cccccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          className="flex-row items-center justify-center bg-white mx-5 mb-10 py-4 rounded-xl border border-red-500" 
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF4444" />
          <Text className="text-base text-red-500 font-semibold ml-2">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}