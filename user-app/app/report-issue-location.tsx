import { ContactDetails, getUserContactDetails } from "@/utils/userData";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    title: string;
    description: string;
    image: string;
  }>();
  const { title, description, image } = params;

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [error, setError] = useState("");
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
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

  // Get user's current location
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
      
      // Auto-select current location
      await handleLocationSelect({ latitude, longitude });
    } catch (error) {
      console.error('Error getting current location:', error);
      setError('Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Reverse geocoding to get address details
  const getAddressFromCoords = async (latitude: number, longitude: number): Promise<LocationDetails | null> => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocode.length > 0) {
        const result = geocode[0];
        return {
          latitude,
          longitude,
          address: `${result.name || ''} ${result.street || ''}`.trim() || 'Unknown Address',
          city: result.city || result.subregion || 'Unknown City',
          country: result.country || 'Unknown Country',
          postalCode: result.postalCode || 'N/A',
          region: result.region || result.district || 'Unknown Region',
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
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
      } else {
        setLocationDetails({
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
          city: 'Unknown',
          country: 'Unknown',
          postalCode: 'N/A',
          region: 'Unknown',
        });
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
    getCurrentLocation(); // Get user's current location on mount
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
      // Simulate API call with location details
      const reportData = {
        title,
        description,
        image,
        location: locationDetails,
        contactDetails,
        timestamp: new Date().toISOString(),
      };
      
      console.log('Report Data:', reportData);
      
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Success!",
        "Your issue has been reported successfully. We'll review it and take appropriate action.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
      );
    } catch (error) {
      setError("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pb-4" style={{ marginTop: 80 }}>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBack} className="mr-2">
            <Ionicons name="arrow-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black text-center flex-1">
            Location & Contact
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Display */}
        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 flex-row items-center mt-4">
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text className="text-red-700 text-sm ml-2 flex-1">{error}</Text>
          </View>
        ) : null}

        {/* Map Section */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-black">
              Select Location on Map
            </Text>
            <TouchableOpacity
              onPress={getCurrentLocation}
              disabled={isLoadingLocation}
              className="flex-row items-center bg-blue-100 px-3 py-1 rounded-full"
            >
              <Ionicons 
                name={isLoadingLocation ? "refresh" : "location"} 
                size={16} 
                color="#007AFF" 
              />
              <Text className="text-blue-600 text-xs ml-1 font-medium">
                {isLoadingLocation ? "Loading..." : "Current"}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <MapView
              style={{ width: "100%", height: 300 }}
              region={mapRegion}
              onPress={handleMapPress}
              mapType="standard"
              showsUserLocation={true}
              showsMyLocationButton={false}
              zoomEnabled={true}
              scrollEnabled={true}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {location && (
                <Marker
                  coordinate={location}
                  title="Issue Location"
                  description={locationDetails?.address || "Selected location"}
                />
              )}
            </MapView>
          </View>
          
          <Text className="text-xs text-gray-500 mt-2">
            Tap on the map to select the issue location. Use pinch to zoom in/out.
          </Text>
        </View>

        {/* Location Details Display */}
        <View className="mt-6">
          <Text className="text-base font-semibold text-black mb-3">
            Selected Location Details
          </Text>
          <View className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            {locationDetails ? (
              <View className="space-y-3">
                <View className="flex-row items-start">
                  <Ionicons name="location" size={20} color="#007AFF" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Address</Text>
                    <Text className="text-gray-600 text-sm">{locationDetails.address}</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="business" size={20} color="#007AFF" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">City, Region</Text>
                    <Text className="text-gray-600 text-sm">
                      {locationDetails.city}, {locationDetails.region}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="globe" size={20} color="#007AFF" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Country</Text>
                    <Text className="text-gray-600 text-sm">{locationDetails.country}</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="mail" size={20} color="#007AFF" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Postal Code</Text>
                    <Text className="text-gray-600 text-sm">{locationDetails.postalCode}</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="compass" size={20} color="#007AFF" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Coordinates</Text>
                    <Text className="text-gray-600 text-sm">
                      {locationDetails.latitude.toFixed(6)}, {locationDetails.longitude.toFixed(6)}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={20} color="#999" />
                <Text className="text-gray-500 ml-3">
                  {isLoadingLocation ? "Getting location details..." : "No location selected"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Information */}
        <View className="mt-6">
          <Text className="text-base font-semibold text-black mb-3">
            Your Contact Information
          </Text>
          <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="person" size={20} color="#007AFF" />
              <Text className="text-gray-700 ml-3">
                <Text className="font-medium">Name:</Text>{" "}
                {contactDetails?.name || "Not provided"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="mail" size={20} color="#007AFF" />
              <Text className="text-gray-700 ml-3">
                <Text className="font-medium">Email:</Text>{" "}
                {contactDetails?.email || "Not provided"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call" size={20} color="#007AFF" />
              <Text className="text-gray-700 ml-3">
                <Text className="font-medium">Phone:</Text>{" "}
                {contactDetails?.phone || "Not provided"}
              </Text>
            </View>
          </View>
        </View>

        {/* Issue Summary */}
        <View className="mt-6">
          <Text className="text-base font-semibold text-black mb-3">
            Issue Summary
          </Text>
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
            <Text className="text-gray-700">
              <Text className="font-medium">Title:</Text> {title}
            </Text>
            <Text className="text-gray-700">
              <Text className="font-medium">Description:</Text> {description}
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`py-4 rounded-xl shadow-lg mt-8 mb-8 ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500"
          }`}
          onPress={handleReportIssue}
          disabled={isSubmitting}
          style={
            !isSubmitting
              ? {
                  shadowColor: "#007AFF",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }
              : {}
          }
        >
          <Text className="text-white text-base font-semibold text-center">
            {isSubmitting ? "Submitting..." : "Report Issue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}