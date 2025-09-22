import { ContactDetails, getUserContactDetails } from "@/utils/userData";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { readAsStringAsync } from 'expo-file-system/legacy';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
// import MapView, { Marker } from "react-native-maps";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportIssueLocation() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title: string;
    description: string;
    image: string;
  }>();
  const { user } = useUser();
  const { title, description, image } = params;
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [latitide , setLatitide] = useState()
  const [selectedLocation, setSelectedLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  const loadUserData = useCallback(async () => {
    try {
      const details = await getUserContactDetails(user?.id);
      setContactDetails(details);
    } catch (error) {
      console.error("Error loading contact details:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);


const handleLocationSelect = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    
    // Set all location states properly
    setMapRegion(newRegion);
    setSelectedLocation(newRegion);
    setLocation(newRegion); // This sets the main location state with coordinates
    
    // Get address from coordinates
    let geocode = await Location.reverseGeocodeAsync(newRegion);
    if (geocode.length > 0) {
      const addr = geocode[0];
      setAddress(`${addr.street || ''} ${addr.city || ''} ${addr.region || ''} ${addr.postalCode || ''}`.trim());
    }
    setError("");
  } catch (error) {
    setError("Error getting location");
    console.error(error);
  }
};


const handleMapPress = (event: any) => {
  const { coordinate } = event.nativeEvent;
  setSelectedLocation(coordinate);
  setLocation(coordinate); // This sets the main location state
  
  // Reverse geocode the selected location
  Location.reverseGeocodeAsync(coordinate).then(geocode => {
    if (geocode.length > 0) {
      const addr = geocode[0];
      setAddress(`${addr.street || ''} ${addr.city || ''} ${addr.region || ''} ${addr.postalCode || ''}`.trim());
    }
  });
};
useEffect(() => {
  // Simulate map loading
  const timer = setTimeout(() => {
    setIsMapLoading(false);
  }, 1000);

  return () => clearTimeout(timer);
}, []);

const handleReportIssue = async () => {
  if (!title || !description || !image || !selectedLocation) {
    setError("Please fill all fields and select a location on the map.");
    return;
  }

  try {
    // 0. Get user email and fetch user id from backend
    const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
    console.log(email)
    let userId = undefined;
    if (email) {
      const response = await fetch(
        'https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/authUsers/get-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );
      if (response.ok) {
        const json = await response.json();
        if (json?.success && json?.data) {
          userId = json.data.id;
          console.log("Fetched User ID:", userId);
        }
      }
    }

    // Convert image URI to base64 if needed
    let imageBase64 = image;
    if (image && !image.startsWith('data:image')) {
      try {
        const base64 = await readAsStringAsync(image, { encoding: 'base64' });
        imageBase64 = base64;
      } catch (fsError) {
        let errorMsg = 'Failed to convert image to base64.';
        if (fsError instanceof Error) {
          errorMsg += ' ' + fsError.message;
        }
        setError(errorMsg);
        return;
      }
    }

    // 1. Upload image
    const uploadResponse = await fetch("https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/issues/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 }),
    });

    // Check response type before parsing
    const uploadText = await uploadResponse.text();
    let uploadData;
    try {
      uploadData = JSON.parse(uploadText);
    } catch (e) {
      setError("Image upload failed: Server did not return JSON. Response: " + uploadText.slice(0, 100));
      return;
    }

    if (!uploadData.success) {
      setError("Image upload failed");
      return;
    }

    console.log("Uploaded Image URL:", uploadData.imageUrl);

    // 2. Now send issue data with uploaded image URL
    if (!userId) {
      setError("Failed to fetch user ID. Cannot submit issue.");
      return;
    }
    const issueData = {
      title,
      description,
      image_url: uploadData.imageUrl, // use public URL instead of base64
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      user_id: userId,
    };

    // FIXED ENDPOINT TYPO
    const issueResponse = await fetch("https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/issues/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issueData),
    });

    // Check response type before parsing
    const issueText = await issueResponse.text();
    let issueResult;
    try {
      issueResult = JSON.parse(issueText);
    } catch (e) {
      setError("Issue upload failed: Server did not return JSON. Response: " + issueText.slice(0, 100));
      return;
    }
    console.log("Issue API response:", issueResult);

    setError("");
    setShowSuccessPopup(true);

    // Redirect after success
    setTimeout(() => {
      setShowSuccessPopup(false);
      router.replace("/(tabs)");
    }, 2000);

  } catch (error) {
    setError("Failed to report issue");
    console.error(error);
  }
};
  return (
    <View className="flex-1 bg-white">
      <View className="pt-2" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-4">
          <View className="flex-row items-center mt-2">
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Ionicons name="arrow-back" size={28} color="#007AFF" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black text-center flex-1">Location & Contact</Text>
          </View>
        </View>
        <View className="px-5 space-y-5">
        {error ? (
          <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-2">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        ) : null}
        <View>
          <Text className="text-base font-semibold mb-2">Select Location on Map</Text>
          <TouchableOpacity
            className="bg-blue-500 py-3 rounded-lg mb-3"
            onPress={handleLocationSelect}
          >
            <Text className="text-white text-center font-medium">Use Current Location</Text>
          </TouchableOpacity>
          
          <View className="border border-gray-300 rounded-xl overflow-hidden" style={{ height: 200 }}>
            {isMapLoading ? (
              <View className="flex-1 bg-gray-100 items-center justify-center">
                <Text className="text-gray-500">Loading map...</Text>
              </View>
            ) : (
              <MapView
                style={{ flex: 1 }}
                region={mapRegion}
                onPress={handleMapPress}
                showsUserLocation={true}
                onMapReady={() => setIsMapLoading(false)}
              >
                {selectedLocation && (
                  <Marker coordinate={selectedLocation} />
                )}
              </MapView>
            )}
          </View>
        </View>
        <View>
          <Text className="text-base font-semibold mb-2">Location:</Text>
          <View className="border border-gray-300 rounded-lg px-4 py-3">
            <Text className="text-gray-700">{address || "No location selected"}</Text>
          </View>
        </View>
        <View>
          <Text className="text-base font-semibold mb-2">Contact Information</Text>
          <View className="border border-gray-300 rounded-lg px-4 py-3">
            <Text className="text-gray-700">Name: {contactDetails?.name || "N/A"}</Text>
            <Text className="text-gray-700">Email: {contactDetails?.email || "N/A"}</Text>
            <Text className="text-gray-700">Phone: {contactDetails?.phone || "N/A"}</Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-xl shadow-lg mt-6"
          onPress={handleReportIssue}
        >
          <Text className="text-white text-base font-semibold text-center">Report Issue</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      {/* Success Popup */}
        {showSuccessPopup && (
          <View className="absolute inset-0 bg-gray-50 bg-opacity-40 justify-center items-center z-50">
            <View className="bg-white rounded-xl p-6 mx-4 items-center shadow-lg">
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text className="text-xl font-bold mt-3 text-gray-800">Reported Successfully!</Text>
              <Text className="text-gray-600 mt-1 text-center">Your issue has been reported and will be reviewed shortly.</Text>
              <Text className="text-gray-500 mt-2 text-sm">Redirecting to home...</Text>
            </View>
          </View>
        )}
    </View>
  );
}