import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface TechnicianProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  profileImage: string;
  phone?: string;
  address?: string;
}

interface WorkSchedule {
  monday: { start: string; end: string; active: boolean };
  tuesday: { start: string; end: string; active: boolean };
  wednesday: { start: string; end: string; active: boolean };
  thursday: { start: string; end: string; active: boolean };
  friday: { start: string; end: string; active: boolean };
  saturday: { start: string; end: string; active: boolean };
  sunday: { start: string; end: string; active: boolean };
}

// Profile Setting Item Component
const SettingItem = ({ 
  iconName, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true,
  rightElement = null,
  iconColor = '#3b82f6',
  isLogout = false,
  disabled = false
}: {
  iconName: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  iconColor?: string;
  isLogout?: boolean;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    className={`flex-row items-center py-4 px-6 bg-white rounded-2xl mb-3 mx-4 ${disabled ? 'opacity-50' : ''}`}
    onPress={disabled ? undefined : onPress}
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    }}
    disabled={disabled}
  >
    <View 
      className="w-10 h-10 rounded-xl mr-4 justify-center items-center"
      style={{ backgroundColor: isLogout ? '#fee2e2' : '#f0f9ff' }}
    >
      <Ionicons
        name={iconName as any}
        size={20}
        color={isLogout ? '#dc2626' : iconColor}
      />
    </View>
    <View className="flex-1">
      <Text className={`text-base font-semibold ${isLogout ? 'text-red-600' : 'text-gray-900'}`}>
        {title}
      </Text>
      <Text className="text-sm text-gray-500 mt-1">
        {subtitle}
      </Text>
    </View>
    {rightElement ? rightElement : (
      showArrow && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color="#9ca3af" 
        />
      )
    )}
  </TouchableOpacity>
);

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <Text className="text-lg font-bold text-gray-800 px-4 mb-4 mt-6">
    {title}
  </Text>
);

// Edit Profile Modal Component
const EditProfileModal = ({ 
  visible, 
  onClose, 
  profile, 
  onSave 
}: {
  visible: boolean;
  onClose: () => void;
  profile: TechnicianProfile;
  onSave: (updatedProfile: TechnicianProfile) => void;
}) => {
  const [editedProfile, setEditedProfile] = useState<TechnicianProfile>(profile);
  const [loading, setLoading] = useState(false);

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setEditedProfile(prev => ({
          ...prev,
          profileImage: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSave = async () => {
    if (!editedProfile.name.trim() || !editedProfile.email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(editedProfile);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-blue-600 text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <Text className="text-blue-600 text-base font-semibold">Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="items-center mb-6">
            <TouchableOpacity onPress={handleImagePicker}>
              <Image
                source={{ uri: editedProfile.profileImage }}
                className="w-24 h-24 rounded-full bg-gray-200 mb-2"
              />
              <Text className="text-blue-600 text-sm text-center">Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
              placeholder="Enter your name"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              value={editedProfile.email}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Phone</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              value={editedProfile.phone || ''}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Address</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              value={editedProfile.address || ''}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, address: text }))}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default function TechnicianProfileScreen() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Profile data
  const [profile, setProfile] = useState<TechnicianProfile>({
    id: 'TECH-2024-0127',
    name: 'Ramesh',
    email: 'ramesh.pilla@technician.gov',
    department: 'Electrical Department',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    phone: '+91 9876543210',
    address: 'Vijayawada, Andhra Pradesh, India'
  });

  // Load saved preferences on mount
  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications_enabled');
      if (savedNotifications !== null) {
        setNotificationsEnabled(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const saveNotificationPreference = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('notifications_enabled', JSON.stringify(enabled));
      setNotificationsEnabled(enabled);
      
      // Show feedback
      Alert.alert(
        'Settings Updated',
        `Notifications ${enabled ? 'enabled' : 'disabled'} successfully`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save notification settings');
    }
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = async (updatedProfile: TechnicianProfile) => {
    try {
      // Save to AsyncStorage or send to API
      await AsyncStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile changes');
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'You will be redirected to the password change screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // Navigate to change password screen
            console.log('Navigate to change password');
            // navigation.navigate('ChangePassword');
          }
        }
      ]
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'Opening civic technician guidelines...',
      [
        { text: 'OK', onPress: () => console.log('Navigate to Terms') }
      ]
    );
  };

  const handleWorkSchedule = () => {
    const scheduleInfo = `Current Schedule:
• Monday - Friday: 9:00 AM - 5:00 PM
• Weekend: On-call availability
• Emergency response: 24/7`;

    Alert.alert(
      'Work Schedule',
      scheduleInfo,
      [
        { text: 'OK' },
        { 
          text: 'Edit Schedule', 
          onPress: () => console.log('Navigate to schedule editor') 
        }
      ]
    );
  };

  const handleNotifications = () => {
    Alert.alert(
      'Notification Settings',
      'Configure your notification preferences',
      [
        { text: 'Cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => console.log('Navigate to notification settings') 
        }
      ]
    );
  };

  const handleHelpSupport = () => {
    const helpOptions = [
      { text: 'Cancel', style: 'cancel' as const },
      { text: 'FAQ', onPress: () => console.log('Open FAQ') },
      { text: 'Contact Support', onPress: () => console.log('Contact support') },
      { text: 'User Guide', onPress: () => console.log('Open user guide') }
    ];

    Alert.alert('Help & Support', 'How can we help you?', helpOptions);
  };

  const handleWorkReports = async () => {
    setLoading(true);
    try {
      // Simulate loading reports
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportsInfo = `Recent Reports:
• Tasks Completed: 2
• Average Rating: 3.9/5
• This Month: 6 tasks
• Response Time: 15 min avg`;

      Alert.alert('Work Reports', reportsInfo);
    } catch (error) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear stored data
              await AsyncStorage.multiRemove(['user_profile', 'auth_token', 'notifications_enabled']);
              
              // Navigate to login screen
              console.log('User signed out, navigate to login');
              // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
              
              Alert.alert('Success', 'You have been signed out successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Handle case where there's no previous screen
      console.log('Navigate to main screen');
    }
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Options',
      'Choose an action',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share Profile', onPress: () => console.log('Share profile') },
        { text: 'Export Data', onPress: () => console.log('Export data') }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Profile Settings</Text>
          <TouchableOpacity onPress={handleMenuPress}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#ffffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="bg-white mx-4 mt-6 rounded-2xl p-6" 
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center">
            <View className="relative mr-4">
              <Image
                source={{ uri: profile.profileImage }}
                className="w-16 h-16 rounded-full bg-gray-200"
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                {profile.name}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">
                {profile.email}
              </Text>
              <Text className="text-xs text-blue-600 font-medium mb-1">
                ID: {profile.id}
              </Text>
              <Text className="text-xs text-gray-400">
                {profile.department}
              </Text>
            </View>
          </View>
        </View>

        {/* General Section */}
        <SectionHeader title="General" />
        
        <SettingItem
          iconName="person-outline"
          title="Edit Profile"
          subtitle="Change profile picture, name, contact info"
          onPress={handleEditProfile}
          iconColor="#3b82f6"
        />
        
        <SettingItem
          iconName="lock-closed-outline"
          title="Change Password"
          subtitle="Update and strengthen account security"
          onPress={handleChangePassword}
          iconColor="#059669"
        />
        
        <SettingItem
          iconName="shield-outline"
          title="Terms of Service"
          subtitle="Review civic technician guidelines"
          onPress={handleTermsOfService}
          iconColor="#7c3aed"
        />
        
        <SettingItem
          iconName="calendar-outline"
          title="Work Schedule"
          subtitle="View and update your work schedule"
          onPress={handleWorkSchedule}
          iconColor="#ea580c"
        />

        {/* Preferences Section */}
        <SectionHeader title="Preferences" />
        
        <SettingItem
          iconName="notifications-outline"
          title="Notifications"
          subtitle="Customize task and system notifications"
          onPress={handleNotifications}
          showArrow={false}
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={saveNotificationPreference}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
            />
          }
          iconColor="#f59e0b"
        />
        
        <SettingItem
          iconName="help-circle-outline"
          title="Help & Support"
          subtitle="Get help with civic app features"
          onPress={handleHelpSupport}
          iconColor="#06b6d4"
        />
        
        <SettingItem
          iconName="document-text-outline"
          title="Work Reports"
          subtitle="Access your completed task reports"
          onPress={handleWorkReports}
          iconColor="#8b5cf6"
          disabled={loading}
          rightElement={loading ? <ActivityIndicator size="small" color="#8b5cf6" /> : null}
        />

        {/* Logout Section */}
        <View className="mt-6 mb-8">
          <SettingItem
            iconName="log-out-outline"
            title="Sign Out"
            subtitle="Securely log out of your account"
            onPress={handleLogout}
            showArrow={true}
            isLogout={true}
          />
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {loading && (
        <View className="absolute inset-0 bg-black bg-opacity-30 justify-center items-center">
          <View className="bg-white p-6 rounded-2xl">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-2 text-gray-700">Loading...</Text>
          </View>
        </View>
      )}
    </View>
  );
}