import { ContactDetails, getUserContactDetails } from "@/utils/userData";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationDetails {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  region: string;
}

export default function ReportIssueLocation() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    title: string;
    description: string;
    image: string;
  }>();
  const { title, description, image } = params;

  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [error, setError] = useState("");
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const loadUserData = useCallback(async () => {
    try {
      const details = await getUserContactDetails(user?.id);
      setContactDetails(details);
    } catch (error) {
      console.error("Error loading contact details:", error);
    }
  }, [user?.id]);

  // Get address from coordinates (enhanced version)
  const getAddressFromCoords = async (latitude: number, longitude: number): Promise<LocationDetails | null> => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (geocode.length > 0) {
        const result = geocode[0];
        return {
          latitude,
          longitude,
          address: `${result.name || ''} ${result.street || ''}`.trim() || 'Address not available',
          city: result.city || result.subregion || 'Unknown area',
          country: result.country || 'Unknown country',
          postalCode: result.postalCode || 'N/A',
          region: result.region || result.district || 'Unknown region',
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;
      
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      await handleLocationSelect({ latitude, longitude });
    } catch (error) {
      console.error('Error getting current location:', error);
      setError('Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSelect = async (coords: { latitude: number; longitude: number }) => {
    setLocation(coords);
    setIsLoadingLocation(true);
    
    try {
      const details = await getAddressFromCoords(coords.latitude, coords.longitude);
      if (details) {
        setLocationDetails(details);
        setError("");
      }
    } catch (error) {
      console.error('Error processing location:', error);
      setError('Failed to get location details');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapPress = (e: MapPressEvent) => {
    const coords = e.nativeEvent.coordinate;
    handleLocationSelect(coords);
  };

  useEffect(() => {
    loadUserData();
    getCurrentLocation();
    
    // Map loading simulation
    const timer = setTimeout(() => {
      setIsMapLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [loadUserData]);

  const handleReportIssue = async () => {
    if (!title || !description || !image || !location) {
      setError("Please fill all fields and select a location on the map.");
      return;
    }

    if (!contactDetails) {
      setError("Contact details not found. Please complete your profile first.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate API call
      const reportData = {
        title,
        description,
        image,
        location: locationDetails,
        contactDetails,
        timestamp: new Date().toISOString(),
      };
      
      console.log('Report Data:', reportData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success popup instead of Alert
      setShowSuccessPopup(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.replace("/(tabs)");
      }, 2000);
      
    } catch (error) {
      setError("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pb-4 pt-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Ionicons name="arrow-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black text-center flex-1">
            Location & Contact
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 space-y-6">
          {/* Error Display */}
          {error ? (
            <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-2">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Map Section */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-black">
                Select Location on Map
              </Text>
              <TouchableOpacity
                onPress={getCurrentLocation}
                disabled={isLoadingLocation}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-sm font-medium">
                  {isLoadingLocation ? "Loading..." : "Use Current Location"}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View className="border border-gray-300 rounded-xl overflow-hidden" style={{ height: 520 }}>
              {isMapLoading ? (
                <View className="flex-1 bg-gray-100 items-center justify-center">
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text className="text-gray-500 mt-2">Loading map...</Text>
                </View>
              ) : (
                <MapView
                  style={{ flex: 1 }}
                  region={mapRegion}
                  onPress={handleMapPress}
                  showsUserLocation={true}
                  onMapReady={() => setIsMapLoading(false)}
                >
                  {location && (
                    <Marker coordinate={location} />
                  )}
                </MapView>
              )}
            </View>
          </View>

          {/* Location Details */}
          <View>
            <Text className="text-base font-semibold mb-2">Location Details</Text>
            <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
              {locationDetails ? (
                <View className="space-y-2">
                  <Text className="text-gray-700">
                    <Text className="font-medium">Address:</Text> {locationDetails.address}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-medium">Area:</Text> {locationDetails.city}, {locationDetails.region}
                  </Text>
                </View>
              ) : (
                <Text className="text-gray-700">
                  {isLoadingLocation ? "Getting location details..." : "No location selected"}
                </Text>
              )}
            </View>
          </View>

          {/* Contact Information */}
          <View>
            <Text className="text-base font-semibold mb-2">Contact Information</Text>
            <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
              <Text className="text-gray-700">Name: {contactDetails?.name || "N/A"}</Text>
              <Text className="text-gray-700">Email: {contactDetails?.email || "N/A"}</Text>
              <Text className="text-gray-700">Phone: {contactDetails?.phone || "N/A"}</Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`py-4 rounded-xl shadow-lg mt-6 ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500"
            }`}
            onPress={handleReportIssue}
            disabled={isSubmitting}
          >
            <Text className="text-white text-base font-semibold text-center">
              {isSubmitting ? "Submitting..." : "Report Issue"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Popup */}
      {showSuccessPopup && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-50">
          <View className="bg-white rounded-xl p-6 mx-4 items-center shadow-lg">
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text className="text-xl font-bold mt-3 text-gray-800">Reported Successfully!</Text>
            <Text className="text-gray-600 mt-1 text-center">Your issue has been reported and will be reviewed shortly.</Text>
            <Text className="text-gray-500 mt-2 text-sm">Redirecting to home...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}