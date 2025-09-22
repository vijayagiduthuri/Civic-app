import { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  StatusBar,
  Linking,
  ActivityIndicator,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { SkeletonLoader } from "@/components/skeletonloader";
import * as Location from 'expo-location';
import { Issue } from "@/services/types";
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

interface RouteSegment {
  coordinates: { latitude: number; longitude: number }[];
  color: string;
  distance?: number;
  duration?: number;
  instructions?: string;
}

export default function IssueDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [issue, setIssue] = useState<IssueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [activeTab, setActiveTab] = useState('Details');
  const [isMapReady, setIsMapReady] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [technicianLocation, setTechnicianLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [issueStatus, setIssueStatus] = useState<'In Progress' | 'Resolved'>('In Progress');
  const [resolvedImages, setResolvedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  interface IssueData {
    id: string;
    title: string;
    description: string;
    created_at: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    assigned_at: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    user: {
      name: string;
      phone: string;
      avatar?: string;
      role: string;
    };
    images: string[];
    latitude: number;
    longitude: number;
    category: string;
    estimatedTime?: string;
    address?: string;
  }

  useEffect(() => {
    setTimeout(() => {
      const mockIssue: IssueData = {
        id: id as string,
        title: "Network Outage",
        description: "A streetlight pole has been damaged and is leaning dangerously. This poses a safety hazard for pedestrians and vehicles. Immediate repair is required to prevent accidents and restore proper street lighting.",
        created_at: "2025-09-20",
        priority: "High",
        status: "In Progress",
        assigned_at: "2025-09-21",
        category: "Infrastructure",
        estimatedTime: "2-3 hours",
        address: "123 Main Street, Bangalore, Karnataka 560001",
        user: { 
          name: "Ethan Carter", 
          phone: "+91 9876543210",
          role: "IT Support",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVUPeelNLuTYgjiMZ44mZZZH47OXSxEVxho-tcIisWcTDskGOtCa710sf9LwMgMok4AiWGOMx2Eahv1mQbUM0DZDAVT0V2ZBhX9QuaedADfRGXbuizVn21Z7LWoAF6Vk6uLTS0HmNP9Gqa-hyl3obLDd95uMrboOjWZkfbShdVQXpji5ILPC_pjrxaSJaeeJgSBDjyFcUSJKksdm2xJ2otfe88n628yVHTadaBHMyn8bj_BoDzuBNGdVa3JeKPGxLjVjkQOdH3uN4"
        },
        images: [
          "https://media.istockphoto.com/id/1034313494/photo/storm-damaged-electric-transformer-on-a-pole-and-a-tree.jpg?s=612x612&w=0&k=20&c=Y58e1J7uRD-2n7RidLvCFJHp5Cn4yuge8a3gW7Jz9U4=",
          "https://d3i5p6znmm9yua.cloudfront.net/360_Norwalk_Live/0/0/0/0/183/464/183464_1",
        ],
        latitude: 12.9716,
        longitude: 77.5946,
      };
      setIssue(mockIssue);
      setIssueStatus(mockIssue.status as 'In Progress' | 'Resolved');
      setLoading(false);
    }, 2000);
  }, [id]);

  const handleCall = (phoneNumber: string) => Linking.openURL(`tel:${phoneNumber}`);

  const onMapReadyHandler = () => {
    setIsMapReady(true);
    fitToCoordinate();
  };

  const fitToCoordinate = () => {
    if (mapRef.current) {
      if (routeSegments.length > 0) {
        const allCoordinates = routeSegments.flatMap(segment => segment.coordinates);
        mapRef.current.fitToCoordinates(allCoordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else if (issue) {
        mapRef.current.fitToCoordinates([{ latitude: issue.latitude, longitude: issue.longitude }], {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        });
      }
    }
  };

  useEffect(() => {
    if (isMapReady) fitToCoordinate();
  }, [routeSegments, issue, isMapReady]);

  const startNavigation = async () => {
    setRouteLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for navigation');
        setRouteLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const currentLocation = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      setTechnicianLocation(currentLocation);
      await calculateRoute(currentLocation, { latitude: issue!.latitude, longitude: issue!.longitude });
      setMapVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not get your current location');
      setRouteLoading(false);
    }
  };

  const calculateRoute = async (start: any, end: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const simulatedRoute: RouteSegment[] = [
        {
          coordinates: [
            start,
            { latitude: start.latitude + 0.002, longitude: start.longitude + 0.001 },
            { latitude: start.latitude + 0.004, longitude: start.longitude + 0.002 },
            { latitude: start.latitude + 0.006, longitude: start.longitude + 0.003 },
          ],
          color: '#3B82F6',
        },
        {
          coordinates: [
            { latitude: start.latitude + 0.006, longitude: start.longitude + 0.003 },
            { latitude: start.latitude + 0.008, longitude: start.longitude + 0.002 },
            { latitude: start.latitude + 0.010, longitude: start.longitude + 0.001 },
          ],
          color: '#10B981',
        },
        {
          coordinates: [
            { latitude: start.latitude + 0.010, longitude: start.longitude + 0.001 },
            { latitude: end.latitude - 0.002, longitude: end.longitude - 0.001 },
            { latitude: end.latitude, longitude: end.longitude },
          ],
          color: '#EF4444',
        }
      ];
      setRouteSegments(simulatedRoute);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not calculate route');
    } finally {
      setRouteLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission required", "Allow photo library access");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) setResolvedImages(prev => [...prev, result.assets[0].uri]);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission required", "Allow camera access");
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) setResolvedImages(prev => [...prev, result.assets[0].uri]);
  };

  const markAsResolved = async () => {
    if (resolvedImages.length === 0) return Alert.alert('Upload Required', 'Please upload at least one image before marking as resolved.');
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIssueStatus('Resolved');
      Alert.alert('Success', 'Issue marked as resolved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update issue status');
    } finally { setUploading(false); }
  };

  if (loading || !issue) return <SkeletonLoader />;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Images */}
        <Text className="text-lg font-bold px-4 pt-4 pb-2">Images</Text>
        <View className="px-4 mb-4">
          <View className="w-full aspect-[3/2] rounded-xl overflow-hidden flex-row">
            <View className="flex-1 mr-1">
              <Image source={{ uri: issue.images[0] }} className="w-full h-full" resizeMode="cover" />
            </View>
            <View className="flex-1">
              <Image source={{ uri: issue.images[1] }} className="w-full h-full" resizeMode="cover" />
            </View>
          </View>
        </View>

        {/* Description */}
        <Text className="text-lg font-bold px-4 pb-2">Description</Text>
        <Text className="text-base px-4 pb-4">{issue.description}</Text>

        {/* Reporter Info */}
        <Text className="text-lg font-bold px-4 pb-2">Reporter Info</Text>
        <View className="flex-row items-center bg-white px-4 py-3 mb-4">
          <Image source={{ uri: issue.user.avatar }} className="w-14 h-14 rounded-full mr-4" />
          <View className="flex-1">
            <Text className="text-base font-medium">{issue.user.name}</Text>
            <Text className="text-sm text-gray-500">{issue.user.role}</Text>
          </View>
          <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-full" onPress={() => handleCall(issue.user.phone)}>
            <Text className="text-white font-semibold">Call</Text>
          </TouchableOpacity>
        </View>

        {/* Location */}
        <Text className="text-lg font-bold px-4 pb-2">Location</Text>
        <View className="px-4 mb-4">
          <View className="h-48 rounded-xl overflow-hidden mb-4 bg-gray-200">
            <MapView style={{ flex: 1 }} initialRegion={{
              latitude: issue.latitude,
              longitude: issue.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
              <Marker coordinate={{ latitude: issue.latitude, longitude: issue.longitude }} title="Issue Location" description={issue.title}>
                <View className="bg-red-500 p-2 rounded-full border-2 border-white">
                  <Ionicons name="location" size={16} color="white" />
                </View>
              </Marker>
            </MapView>
          </View>
          <Text className="text-sm text-gray-500">{issue.address || "No address provided"}</Text>
        </View>

        {/* Navigation Button */}
        <View className="flex-row px-4 pb-4 gap-3">
          <TouchableOpacity className="flex-1 h-12 bg-blue-600 rounded-xl justify-center items-center" onPress={startNavigation} disabled={routeLoading}>
            {routeLoading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-bold text-sm">Start Navigation</Text>}
          </TouchableOpacity>
        </View>

        {/* Issue Progress */}
        <View className="px-4 pb-8">
          <Text className="text-lg font-bold pb-3">Issue Progress</Text>
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-semibold">Current Status</Text>
              <View className={`px-3 py-1 rounded-full ${issueStatus === "In Progress" ? "bg-orange-100" : "bg-green-100"}`}>
                <Text className={`text-sm font-medium ${issueStatus === "In Progress" ? "text-orange-600" : "text-green-600"}`}>{issueStatus}</Text>
              </View>
            </View>

            {issueStatus === "In Progress" && (
              <View>
                <Text className="text-gray-600 text-sm mb-3">Upload images of the completed work to mark this issue as resolved.</Text>
                
                {/* New Button Design */}
                <View className="flex-row gap-2 mb-3">
                  <TouchableOpacity className="flex-1 bg-blue-100 py-3 rounded-lg flex-row justify-center items-center" onPress={pickImage} disabled={uploading}>
                    <Ionicons name="images" size={16} color="#3f55fd" />
                    <Text className="text-blue-600 font-medium ml-2">Gallery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-1 bg-green-100 py-3 rounded-lg flex-row justify-center items-center" onPress={takePhoto} disabled={uploading}>
                    <Ionicons name="camera" size={16} color="#10b981" />
                    <Text className="text-green-600 font-medium ml-2">Camera</Text>
                  </TouchableOpacity>
                </View>

                {/* Image Preview */}
                {resolvedImages.length > 0 && (
                  <View className="flex-row flex-wrap mb-3">
                    {resolvedImages.map((image, index) => (
                      <View key={index} className="w-20 h-20 rounded-lg overflow-hidden mr-2 mb-2 relative">
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setPreviewImage(image)}>
                          <Image source={{ uri: image }} className="w-full h-full" />
                        </TouchableOpacity>
                        <TouchableOpacity className="absolute top-1 right-1 bg-black/60 rounded-full p-1" onPress={() => Alert.alert("Remove Image", "Are you sure?", [
                          { text: "Cancel", style: "cancel" },
                          { text: "Remove", style: "destructive", onPress: () => setResolvedImages(prev => prev.filter((_, i) => i !== index)) }
                        ])}>
                          <Ionicons name="close" size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity className="bg-green-500 py-3 rounded-xl flex-row justify-center items-center" onPress={markAsResolved} disabled={uploading || resolvedImages.length === 0}>
                  {uploading ? <ActivityIndicator color="white" size="small" /> : (
                    <>
                      <Ionicons name="checkmark-done" size={20} color="white" />
                      <Text className="text-white font-bold ml-2">Mark as Resolved</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {issueStatus === "Resolved" && (
              <View className="bg-green-50 rounded-lg p-4">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  <Text className="text-green-800 font-semibold ml-2">Issue Resolved</Text>
                </View>
                <Text className="text-green-600 text-sm mt-1">This issue has been successfully resolved. {resolvedImages.length} images were uploaded as proof.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal visible={!!previewImage} transparent animationType="fade" onRequestClose={() => setPreviewImage(null)}>
        <View className="flex-1 bg-black justify-center items-center">
          {previewImage && <Image source={{ uri: previewImage }} style={{ width, height, resizeMode: "contain" }} />}
          <TouchableOpacity className="absolute top-12 right-5 bg-black/70 p-2 rounded-full" onPress={() => setPreviewImage(null)}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Fullscreen Map Modal */}
      <Modal visible={mapVisible} animationType="slide" onRequestClose={() => setMapVisible(false)}>
        <View className="flex-1 bg-white">
          <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
          <View className="bg-gray-800 pt-12 pb-4 px-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => setMapVisible(false)} className="bg-gray-700 p-2 rounded-full">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-lg">Navigate to Issue</Text>
            <View className="w-10" />
          </View>
          <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} ref={mapRef} onMapReady={onMapReadyHandler} showsUserLocation initialRegion={{
            latitude: issue.latitude,
            longitude: issue.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
            <Marker coordinate={{ latitude: issue.latitude, longitude: issue.longitude }} title="Issue Location" description={issue.address || issue.title}>
              <View className="bg-red-500 p-3 rounded-full border-4 border-white shadow-lg"><Ionicons name="warning" size={24} color="white" /></View>
            </Marker>
            {technicianLocation && (
              <Marker coordinate={technicianLocation} title="Your Location" description="Technician">
                <View className="bg-blue-500 p-3 rounded-full border-4 border-white shadow-lg"><Ionicons name="person" size={24} color="white" /></View>
              </Marker>
            )}
            {routeSegments.map((segment, index) => <Polyline key={index} coordinates={segment.coordinates} strokeColor={segment.color} strokeWidth={6} />)}
          </MapView>
        </View>
      </Modal>
    </View>
  );
}
