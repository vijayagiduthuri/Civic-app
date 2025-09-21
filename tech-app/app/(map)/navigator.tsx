import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
  Platform
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Mapbox, { Camera, MarkerView } from '@rnmapbox/maps';
import { mapService, RouteData, RouteStep, LocationCoords} from "@/services/_Mapservice";

// Initialize Mapbox with error handling
try {
  const token = process.env.MAPBOX_ACCESS_TOKEN_DEFAULT || '';
  console.log(token);
  if (token) {
    Mapbox.setAccessToken(token);
  } else {
    console.warn('Mapbox access token is missing');
  }
} catch (error) {
  console.error('Failed to initialize Mapbox:', error);
}

export default function NavigationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cameraRef = useRef<Camera>(null);
  
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Extract issue details from params with validation
  const issueLocation: LocationCoords | null = React.useMemo(() => {
    try {
      const longitude = parseFloat(params.longitude as string);
      const latitude = parseFloat(params.latitude as string);
      
      if (isNaN(longitude) || isNaN(latitude)) {
        throw new Error('Invalid coordinates in params');
      }
      
      return { longitude, latitude };
    } catch (error) {
      console.error('Invalid issue location params:', error);
      Alert.alert('Error', 'Invalid location data');
      return null;
    }
  }, [params.longitude, params.latitude]);

  // Coordinate validation
  const isValidCoordinate = (coord: LocationCoords | null): coord is LocationCoords => {
    return (
      coord !== null &&
      typeof coord.latitude === 'number' && 
      typeof coord.longitude === 'number' &&
      !isNaN(coord.latitude) && 
      !isNaN(coord.longitude) &&
      coord.latitude >= -90 && 
      coord.latitude <= 90 &&
      coord.longitude >= -180 && 
      coord.longitude <= 180
    );
  };

  // Initialize location and calculate route
  useEffect(() => {
    const initializeNavigation = async () => {
      if (!isValidCoordinate(issueLocation)) {
        setLoading(false);
        return;
      }

      try {
        // Get user location
        const userCoords = await mapService.getCurrentLocation();
        if (isValidCoordinate(userCoords)) {
          setUserLocation(userCoords);
          setHasLocationPermission(true);
          
          // Calculate route
          await calculateRoute(userCoords, issueLocation);
        } else {
          throw new Error('Could not get valid user location');
        }
        
      } catch (error: any) {
        console.error('Navigation initialization error:', error);
        Alert.alert('Error', error.message || 'Could not initialize navigation');
      } finally {
        setLoading(false);
      }
    };

    initializeNavigation();
  }, [issueLocation]);

  // Calculate route between user and issue location
  const calculateRoute = async (start: LocationCoords, end: LocationCoords) => {
    if (!isValidCoordinate(start) || !isValidCoordinate(end)) {
      Alert.alert('Error', 'Invalid coordinates for route calculation');
      return;
    }

    setRouteLoading(true);
    
    try {
      const route = await mapService.calculateRoute(start, end);
      setRouteData(route);
    } catch (error: any) {
      console.error('Route calculation error:', error);
      Alert.alert('Error', error.message || 'Could not calculate route');
    } finally {
      setRouteLoading(false);
    }
  };

  // Center map on both locations
  const fitBounds = () => {
    if (userLocation && issueLocation && cameraRef.current && isCameraReady &&
        isValidCoordinate(userLocation) && isValidCoordinate(issueLocation)) {
      try {
        const sw: [number, number] = [
          Math.min(userLocation.longitude, issueLocation.longitude),
          Math.min(userLocation.latitude, issueLocation.latitude),
        ];

        const ne: [number, number] = [
          Math.max(userLocation.longitude, issueLocation.longitude),
          Math.max(userLocation.latitude, issueLocation.latitude),
        ];

        cameraRef.current.fitBounds(ne, sw, [100, 50, 150, 50]);
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  };

  // Map error handler
  const handleMapError = () => {
    console.error('Map loading failed');
    setMapError(true);
  };

  // Camera ready handler
  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  // Open in external maps app
  const openInExternalMaps = () => {
    if (!isValidCoordinate(issueLocation)) {
      Alert.alert('Error', 'Invalid destination coordinates');
      return;
    }

    const url = Platform.select({
      ios: `maps://app?daddr=${issueLocation.latitude},${issueLocation.longitude}&dirflg=d`,
      android: `google.navigation:q=${issueLocation.latitude},${issueLocation.longitude}`
    });
    
    if (url) {
      Linking.openURL(url).catch(err => {
        Alert.alert('Error', 'Could not open maps app');
      });
    }
  };

  // Render turn-by-turn instructions
  const renderInstructions = () => {
    if (!routeData?.steps?.length) return null;

    return (
      <View className="bg-white p-4 rounded-lg mt-4">
        <Text className="text-lg font-bold mb-3">Turn-by-Turn Directions</Text>
        <ScrollView className="max-h-40">
          {routeData.steps.map((step: RouteStep, index: number) => (
            <View key={index} className="flex-row items-start py-2 border-b border-gray-100">
              <View className="bg-blue-100 p-2 rounded-full mr-3">
                <Ionicons 
                  name={getManeuverIcon(step.maneuver?.type, step.maneuver?.modifier)} 
                  size={16} 
                  color="#3B5FFD" 
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800">{step.instruction}</Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {mapService.formatDistance(step.distance)} • {mapService.formatDuration(step.duration)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Get icon for maneuver type with safe fallbacks
  const getManeuverIcon = (type?: string, modifier?: string): keyof typeof Ionicons.glyphMap => {
    if (!type) return 'navigate';
    
    switch (type) {
      case 'depart': return 'navigate';
      case 'arrive': return 'flag';
      case 'turn':
        switch (modifier) {
          case 'left': return 'arrow-back';
          case 'right': return 'arrow-forward';
          case 'sharp left': return 'return-up-back';
          case 'sharp right': return 'return-up-forward';
          default: return 'arrow-redo';
        }
      case 'continue': return 'arrow-forward';
      case 'fork': return 'git-branch';
      case 'roundabout': return 'sync';
      default: return 'navigate';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B5FFD" />
        <Text className="mt-4 text-gray-600">Getting your location...</Text>
      </View>
    );
  }

  if (!isValidCoordinate(issueLocation)) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Ionicons name="warning" size={48} color="#dc2626" />
        <Text className="mt-4 text-gray-600">Invalid location data</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View className="flex-row items-center bg-white p-4 justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 justify-center">
          <Ionicons name="arrow-back" size={24} color="#101118" />
        </TouchableOpacity>
        <Text className="text-[#101118] text-lg font-bold flex-1 text-center pr-12">
          Navigation
        </Text>
      </View>

      {/* Map Container */}
      <View className="flex-1">
        {mapError ? (
          <View className="flex-1 justify-center items-center bg-gray-100">
            <Ionicons name="map-outline" size={48} color="#666" />
            <Text className="text-gray-600 mt-2">Map unavailable</Text>
            <Text className="text-gray-500 text-sm mt-1">Please check your connection</Text>
          </View>
        ) : (
          <Mapbox.MapView 
            style={{ flex: 1 }}
            styleURL={Mapbox.StyleURL.Street}
            logoEnabled={false}
            scaleBarEnabled={false}
            onMapLoadingError={handleMapError}
          >
            <Camera
              ref={cameraRef}
              defaultSettings={{
                centerCoordinate: userLocation && isValidCoordinate(userLocation) ? 
                  [userLocation.longitude, userLocation.latitude] : 
                  [issueLocation.longitude, issueLocation.latitude],
                zoomLevel: 14,
              }}
              onUserTrackingModeChange={handleCameraReady}
            />
            
            {/* User Location Marker */}
            {userLocation && isValidCoordinate(userLocation) && (
              <MarkerView coordinate={[userLocation.longitude, userLocation.latitude]}>
                <View className="bg-blue-500 p-3 rounded-full border-4 border-white shadow-lg">
                  <Ionicons name="person" size={20} color="white" />
                </View>
              </MarkerView>
            )}
            
            {/* Issue Location Marker */}
            {isValidCoordinate(issueLocation) && (
              <MarkerView coordinate={[issueLocation.longitude, issueLocation.latitude]}>
                <View className="bg-red-500 p-3 rounded-full border-4 border-white shadow-lg">
                  <Ionicons name="warning" size={20} color="white" />
                </View>
              </MarkerView>
            )}
            
            {/* Route Line */}
            {routeData?.coordinates && (
              <Mapbox.ShapeSource
                id="route"
                shape={{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: routeData.coordinates,
                  },
                  properties: {},
                }}
              >
                <Mapbox.LineLayer
                  id="routeLine"
                  style={{
                    lineColor: '#3B5FFD',
                    lineWidth: 5,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              </Mapbox.ShapeSource>
            )}
          </Mapbox.MapView>
        )}
        
        {/* Map Controls */}
        {!mapError && isValidCoordinate(issueLocation) && (
          <TouchableOpacity 
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg"
            onPress={fitBounds}
            disabled={!isCameraReady}
          >
            <Ionicons 
              name="locate" 
              size={20} 
              color={isCameraReady ? "#3B5FFD" : "#ccc"} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Info Panel */}
      <View className="bg-white p-5 shadow-lg border-t border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            {params.title as string || 'Unknown Issue'}
          </Text>
          <View className="bg-red-100 px-3 py-1 rounded-full">
            <Text className="text-red-600 text-sm font-medium">High Priority</Text>
          </View>
        </View>
        
        <Text className="text-gray-600 text-sm mb-4">
          {params.address as string || 'Address not available'}
        </Text>
        
        {/* Route Info */}
        {routeLoading ? (
          <View className="flex-row justify-between items-center py-3">
            <ActivityIndicator size="small" color="#3B5FFD" />
            <Text className="text-gray-500">Calculating route...</Text>
          </View>
        ) : routeData ? (
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text className="text-gray-700 ml-2">
                {mapService.formatDuration(routeData.duration)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="navigate-outline" size={18} color="#666" />
              <Text className="text-gray-700 ml-2">
                {mapService.formatDistance(routeData.distance)}
              </Text>
            </View>
          </View>
        ) : null}
        
        {/* Turn-by-turn Instructions */}
        {renderInstructions()}
        
        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity 
            className="flex-1 h-12 bg-gray-100 rounded-xl justify-center items-center flex-row"
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={20} color="#666" style={{ marginRight: 8 }} />
            <Text className="text-gray-700 text-sm font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 h-12 bg-[#3f55fd] rounded-xl justify-center items-center flex-row"
            onPress={openInExternalMaps}
            disabled={routeLoading || mapError || !isValidCoordinate(issueLocation)}
            style={{ opacity: (routeLoading || mapError || !isValidCoordinate(issueLocation)) ? 0.5 : 1 }}
          >
            <Ionicons name="navigate" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-sm font-bold">
              Start Navigation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}