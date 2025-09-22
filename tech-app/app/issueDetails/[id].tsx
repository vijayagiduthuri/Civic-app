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
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { SkeletonLoader } from "@/components/skeletonloader";
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// Interface for route segments with different colors
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

  // Proper TypeScript interface
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

  // Dummy fetch simulation with proper typing
  useEffect(() => {
    setTimeout(() => {
      const mockIssue: IssueData = {
        id: id as string,
        title: "Network Outage",
        description: "Network outage reported in the main office building. Users are unable to access the internet or internal network resources. Please investigate and resolve the issue as soon as possible.",
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
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCF8g4vO5Qdo1c88UeuTaS7g9xybx1BuvmceCyda-zDJvFVJUmYzdCBanETSqhTUkIm7OwAmvnOOgthJ9o7teBJvNjQ8R_4E3TwGMZ3ufmuyGtYXvUUipkKrndGMyktnp9YN8QPHi4wEQJzpflHFbp3WJwOcZ8Fit1ZXeDu1USghTQCrMdhN5QkbEdT1uRC_VYDbJZj0PoJtZxWvElhHLE7SY7VvmhFK34swm2J_dayWe75jF6BQ9GhC2CsEr0rDFXv0wM0YG-ACnk",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDivs1IqNbdgjW07iSEntT9D9yoewNh2AEl-_1D2Dyq4SyR4NczeXsPkTEGWkXNxJoHLtUzwPeu5Vyz115hzJarE3V7LsNmROKmGSdgo7mRR89QqmLlmt0r-9pSym8DirjAt-NekQLk6nbi9-V3YIkRyb5r9OGVSIpm_dTIgXsOHrHJxIAYfKlGbfLeAcIp3O6UkQca4XJkXkyKxDBg6bBvKNyJIb62aQYKYEjP9qeFvnzjWMNqwS7pvGa7cye0N8eWXhze8u3AT8U",
          "https://via.placeholder.com/400x300",
        ],
        latitude: 12.9716,
        longitude: 77.5946,
      };
      setIssue(mockIssue);
      setLoading(false);
    }, 2000);
  }, [id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-500';
      case 'In Progress': return 'bg-orange-500';
      case 'Resolved': return 'bg-green-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const onMapReadyHandler = () => {
    setIsMapReady(true);
    fitToCoordinate();
  };

  const fitToCoordinate = () => {
    if (mapRef.current) {
      if (routeSegments.length > 0) {
        // Fit to route when navigation is active
        const allCoordinates = routeSegments.flatMap(segment => segment.coordinates);
        mapRef.current.fitToCoordinates(allCoordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else if (issue) {
        // Fit to issue location when no navigation is active
        mapRef.current.fitToCoordinates([{
          latitude: issue.latitude,
          longitude: issue.longitude
        }], {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        });
      }
    }
  };

  // Update the useEffect to also trigger when issue changes
  useEffect(() => {
    if (isMapReady) {
      fitToCoordinate();
    }
  }, [routeSegments, issue, isMapReady]);

  // Function to get current location and calculate route
  const startNavigation = async () => {
    setRouteLoading(true);
    
    try {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for navigation');
        setRouteLoading(false);
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      
      setTechnicianLocation(currentLocation);
      
      // Calculate route from current location to issue location
      await calculateRoute(currentLocation, {
        latitude: issue!.latitude,
        longitude: issue!.longitude
      });
      
      // Show the map
      setMapVisible(true);
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location');
      setRouteLoading(false);
    }
  };

  // Function to calculate route (mock implementation)
  const calculateRoute = async (start: any, end: any) => {
    try {
      // In a real app, you would call an actual Directions API here
      // For example: Google Directions API, Mapbox Directions API, or OSRM
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate road-following coordinates (not straight line)
      const simulatedRoute: RouteSegment[] = [
        {
          coordinates: [
            start,
            { latitude: start.latitude + 0.002, longitude: start.longitude + 0.001 },
            { latitude: start.latitude + 0.004, longitude: start.longitude + 0.002 },
            { latitude: start.latitude + 0.006, longitude: start.longitude + 0.003 },
          ],
          color: '#3B82F6', // Blue for normal traffic
          distance: 0.8,
          duration: 2,
          instructions: "Head northeast on Main St"
        },
        {
          coordinates: [
            { latitude: start.latitude + 0.006, longitude: start.longitude + 0.003 },
            { latitude: start.latitude + 0.008, longitude: start.longitude + 0.002 },
            { latitude: start.latitude + 0.010, longitude: start.longitude + 0.001 },
          ],
          color: '#10B981', // Green for clear road
          distance: 0.5,
          duration: 1,
          instructions: "Turn right onto Oak Ave"
        },
        {
          coordinates: [
            { latitude: start.latitude + 0.010, longitude: start.longitude + 0.001 },
            { latitude: end.latitude - 0.002, longitude: end.longitude - 0.001 },
            { latitude: end.latitude, longitude: end.longitude },
          ],
          color: '#EF4444', // Red for traffic
          distance: 0.7,
          duration: 3,
          instructions: "Continue on Pine St - Heavy traffic"
        }
      ];
      
      setRouteSegments(simulatedRoute);
      
    } catch (error) {
      console.error('Error calculating route:', error);
      Alert.alert('Error', 'Could not calculate route');
    } finally {
      setRouteLoading(false);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!issue) return null;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View className="flex-row items-center bg-white p-4 pb-2 justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 justify-center">
          <Ionicons name="arrow-back" size={24} color="#101118" />
        </TouchableOpacity>
        <Text className="text-[#101118] text-lg font-bold flex-1 text-center pr-12">
          Issue Details
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="mx-4 mb-4 rounded-xl overflow-hidden min-h-[218px]">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB25OhYhpVzF3MHodq7EzNFsd4TjP9tohChwC0CfI9a6-50pBlEZlVIfOKKgUptsOm0K1bl_WwEEPqylU-BsLjAQEDVs8Amyd0pyx6JhIVrwtGRMMj3NHSwHuRxs2IIIeqOmT_Xmlykpz1nEfgC7hIViR3qHfIbonSjw31-By98-OTxLUMLQuvTdI4vpTOm35AT3nBoIB6ZKxUJOJhycI8HfaD5nKr35JeleculhlwSxIn_Ys8TxCZ5d2E3mVzNx1FMlBbGHnxld14',
            }}
            className="w-full h-full absolute"
          />
          <View className="flex-1 justify-end p-4 bg-black/40">
            <Text className="text-white text-2xl font-bold">
              Issue #{issue.id}: {issue.title}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-[#dadce7] px-4 gap-8">
          <TouchableOpacity 
            className={`flex-col items-center justify-center border-b-[3px] pb-3 pt-4 ${activeTab === 'Details' ? 'border-b-[#101118]' : 'border-b-transparent'}`}
            onPress={() => setActiveTab('Details')}
          >
            <Text className={`text-sm font-bold ${activeTab === 'Details' ? 'text-[#101118]' : 'text-[#5e638d]'}`}>
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-col items-center justify-center border-b-[3px] pb-3 pt-4 ${activeTab === 'Activity' ? 'border-b-[#101118]' : 'border-b-transparent'}`}
            onPress={() => setActiveTab('Activity')}
          >
            <Text className={`text-sm font-bold ${activeTab === 'Activity' ? 'text-[#101118]' : 'text-[#5e638d]'}`}>
              Activity
            </Text>
          </TouchableOpacity>
        </View>
          <>
            {/* Images Section */}
            <Text className="text-[#101118] text-lg font-bold px-4 pb-2 pt-4">
              Images
            </Text>
            <View className="px-4 mb-4">
              <View className="w-full aspect-[3/2] rounded-xl overflow-hidden flex-row">
                <View className="flex-1 mr-1">
                  <Image
                    source={{ uri: issue.images[0] }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <Image
                    source={{ uri: issue.images[1] }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>

            {/* Description */}
            <Text className="text-[#101118] text-lg font-bold px-4 pb-2">
              Description
            </Text>
            <Text className="text-[#101118] text-base px-4 pb-4">
              {issue.description}
            </Text>

            {/* Reporter Info */}
            <Text className="text-[#101118] text-lg font-bold px-4 pb-2">
              Reporter Info
            </Text>
            <View className="flex-row items-center bg-white px-4 py-3 mb-4">
              <Image
                source={{ uri: issue.user.avatar }}
                className="w-14 h-14 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="text-[#101118] text-base font-medium">
                  {issue.user.name}
                </Text>
                <Text className="text-[#5e638d] text-sm">
                  {issue.user.role}
                </Text>
              </View>
              <TouchableOpacity 
                className="bg-green-500 px-4 py-2 rounded-full"
                onPress={() => handleCall(issue.user.phone)}
              >
                <Text className="text-white font-semibold">Call</Text>
              </TouchableOpacity>
            </View>

            {/* Location */}
            <Text className="text-[#101118] text-lg font-bold px-4 pb-2">
              Location
            </Text>
            <View className="px-4 mb-4">
              <View className="h-48 rounded-xl overflow-hidden mb-4">
                {/* Static map preview - removed MapView to avoid duplicate registration */}
                <Image
                  source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${issue.latitude},${issue.longitude}&zoom=15&size=400x200&markers=color:red%7C${issue.latitude},${issue.longitude}&key=YOUR_API_KEY` }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 justify-center items-center">
                  <Text className="text-white bg-black/50 px-3 py-1 rounded-lg">
                    Tap "Start Navigation" for interactive map
                  </Text>
                </View>
              </View>
              <Text className="text-[#5e638d] text-sm">
                {issue.address || "No address provided"}
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row px-4 pb-8 gap-3">
              <TouchableOpacity 
                className="flex-1 h-10 bg-[#3f55fd] rounded-xl justify-center items-center"
                onPress={startNavigation}
                disabled={routeLoading}
              >
                {routeLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white text-sm font-bold">
                    Start Navigation
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
      </ScrollView>

      {/* Full Screen Map Modal */}
      <Modal
        visible={mapVisible}
        animationType="slide"
        onRequestClose={() => setMapVisible(false)}
      >
        <View className="flex-1 bg-white">
          <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
          
          {/* Map Header */}
          <View className="bg-gray-800 pt-12 pb-4 px-4 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => setMapVisible(false)}
              className="bg-gray-700 p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-lg">
              Navigate to Issue
            </Text>
            <View className="w-10" />
          </View>

          {/* Full Screen Map */}
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            minZoomLevel={10}
            maxZoomLevel={18}
            zoomEnabled={true}
            zoomControlEnabled={true}
            scrollEnabled={true}
            rotateEnabled={true}
            pitchEnabled={true}
            paddingAdjustmentBehavior="automatic"
            ref={mapRef}
            onMapReady={onMapReadyHandler}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
            initialRegion={{
              latitude: issue.latitude,
              longitude: issue.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Issue Location Marker */}
            <Marker
              coordinate={{
                latitude: issue.latitude,
                longitude: issue.longitude
              }}
              title="Issue Location"
              description={issue.address || issue.title}
            >
              <View className="bg-red-500 p-3 rounded-full border-4 border-white shadow-lg">
                <Ionicons name="warning" size={24} color="white" />
              </View>
            </Marker>

            {/* Technician Location Marker */}
            {technicianLocation && (
              <Marker
                coordinate={technicianLocation}
                title="Your Location"
                description="Technician position"
              >
                <View className="bg-blue-500 p-3 rounded-full border-4 border-white shadow-lg">
                  <Ionicons name="person" size={24} color="white" />
                </View>
              </Marker>
            )}

            {/* Route Polylines */}
            {routeSegments.map((segment, index) => (
              <Polyline
                key={index}
                coordinates={segment.coordinates}
                strokeColor={segment.color}
                strokeWidth={6}
                lineCap="round"
                lineJoin="round"
              />
            ))}

            {/* Circle around issue location */}
            <Circle
              center={{
                latitude: issue.latitude,
                longitude: issue.longitude
              }}
              radius={100}
              fillColor="rgba(255, 0, 0, 0.1)"
              strokeColor="rgba(255, 0, 0, 0.3)"
              strokeWidth={2}
            />
          </MapView>

          {/* Map Controls */}
          <View className="absolute bottom-8 left-4 right-4">
            <View className="bg-white rounded-2xl p-4 shadow-lg">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-900 font-bold text-base">
                  {issue.title}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm mb-3">
                {issue.address}
              </Text>
              <TouchableOpacity 
                className="bg-blue-600 py-3 rounded-xl flex-row justify-center items-center"
                onPress={fitToCoordinate}
              >
                <Ionicons name="locate" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold">
                  Re-center Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}