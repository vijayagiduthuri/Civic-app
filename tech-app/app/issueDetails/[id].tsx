import { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Linking,
  ActivityIndicator,
  Modal,
  FlatList
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { SkeletonLoader } from "@/components/skeletonloader";
import { IssueData } from "@/services/types";
import ImageViewer from "react-native-image-zoom-viewer";


const { width ,height} = Dimensions.get('window');

// Lazy Image Component with loading and error states
const LazyImage = ({ uri, style, className = "" }: { uri: string; style: any; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={style} className={className}>
      {isLoading && (
        <View className="bg-gray-200 absolute inset-0 justify-center items-center rounded-lg">
          <ActivityIndicator size="small" color="#3B5FFD" />
        </View>
      )}
      {hasError ? (
        <View className="bg-gray-100 justify-center items-center rounded-lg">
          <Ionicons name="image-outline" size={24} color="#ccc" />
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={style}
          resizeMode="cover"
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </View>
  );
};

export default function IssueDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [issue, setIssue] = useState<IssueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
const [imageModalVisible, setImageModalVisible] = useState(false);
const [selectedImageIndex, setSelectedImageIndex] = useState(1);
const flatListRef = useRef<FlatList>(null);


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
        images: [],
      latitude: 16.98408,
      longitude: 81.783829,
      };
      setIssue(mockIssue);
      setImagesLoaded(new Array(mockIssue.images.length).fill(false));
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

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
// Add this function to handle image press
const handleImagePress = (index: number) => {
  setSelectedImageIndex(index);
  setImageModalVisible(true);
};
  const navigateToNavigationScreen = () => {
    if (issue) {
      router.replace({
        pathname: "/(map)/navigator",
        params: {
          issueId: issue.id,
          latitude: issue.latitude,
          longitude: issue.longitude,
          address: issue.address,
          title: issue.title
        }
      });
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!issue) return null;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="mx-4 mb-4 rounded-xl overflow-hidden min-h-[218px]">
          <LazyImage
            uri={'https://lh3.googleusercontent.com/aida-public/AB6AXuB25OhYhpVzF3MHodq7EzNFsd4TjP9tohChwC0CfI9a6-50pBlEZlVIfOKKgUptsOm0K1bl_WwEEPqylU-BsLjAQEDVs8Amyd0pyx6JhIVrwtGRMMj3NHSwHuRxs2IIIeqOmT_Xmlykpz1nEfgC7hIViR3qHfIbonSjw31-By98-OTxLUMLQuvTdI4vpTOm35AT3nBoIB6ZKxUJOJhycI8HfaD5nKr35JeleculhlwSxIn_Ys8TxCZ5d2E3mVzNx1FMlBbGHnxld14'}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <View className="flex-1 justify-end p-4 bg-black/40">
            <Text className="text-white text-2xl font-bold">
              Issue #{issue.id}: {issue.title}
            </Text>
          </View>
        </View>

        {/* Meta Info */}
        <View className="px-4 mb-4">
          <View className="flex-row justify-between mb-3">
            <View className="flex-1">
              <Text className="text-[#A0A0A0] text-sm">Reported</Text>
              <Text className="text-[#1E1E1E] font-medium">{issue.created_at}</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[#A0A0A0] text-sm">Priority</Text>
              <View className={`px-3 py-1 rounded-full ${getPriorityColor(issue.priority)}`}>
                <Text className="text-white text-xs font-medium">{issue.priority}</Text>
              </View>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-[#A0A0A0] text-sm">Assigned</Text>
              <Text className="text-[#1E1E1E] font-medium">{issue.assigned_at}</Text>
            </View>
          </View>
        </View>
        {/* Images Section */}
        <Text className="text-[#101118] text-lg font-bold px-4 pb-2 pt-4">
          Images
        </Text>
        <View className="px-4 mb-4">
          <View className="w-full aspect-[3/2] rounded-xl overflow-hidden flex-row">
            <TouchableOpacity 
              className="flex-1 mr-1"
              onPress={() => handleImagePress(0)}
            >
              <Image
                source={{ uri: issue.images[0] }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1"
              onPress={() => handleImagePress(1)}
            >
              <Image
                source={{ uri: issue.images[1] }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          {issue.images.length > 2 && (
            <TouchableOpacity 
              className="mt-2"
              onPress={() => handleImagePress(2)}
            >
              <Image
                source={{ uri: issue.images[2] }}
                className="w-full h-32 rounded-xl"
                resizeMode="cover"
              />
              {issue.images.length > 3 && (
                <View className="absolute inset-0 bg-black/50 justify-center items-center rounded-xl">
                  <Text className="text-white text-lg font-bold">+{issue.images.length - 3} more</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
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
        <View className="flex-row items-center bg-white px-4 py-3 mb-4 mx-4 rounded-xl border border-gray-200">
          <LazyImage
            uri={'https://share.google/images/XbaPzzhTbAsuK5NJi'}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            className="rounded-full mr-4"
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
          <View className="h-48 rounded-xl overflow-hidden mb-4 bg-gray-200">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: issue.latitude,
                longitude: issue.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              minZoomLevel={10}
              maxZoomLevel={18}
              zoomEnabled={true}
              zoomControlEnabled={true}
              scrollEnabled={true}
              rotateEnabled={true}
              pitchEnabled={true}
              paddingAdjustmentBehavior="automatic"
            >
              <Marker
                coordinate={{
                  latitude: issue.latitude,
                  longitude: issue.longitude
                }}
                title="Issue Location"
                description={issue.title}
              >
                <View className="bg-red-500 p-2 rounded-full border-2 border-white">
                  <Ionicons name="location" size={16} color="white" />
                </View>
              </Marker>
            </MapView>
          </View>
          <Text className="text-[#5e638d] text-sm">
            {issue.address || "No address provided"}
          </Text>
        </View>
        {/* Navigate Button */}
        <View className="flex-row px-4 pb-8 gap-3">
          <TouchableOpacity 
            className="flex-1 h-12 bg-[#3f55fd] rounded-xl justify-center items-center flex-row"
            onPress={navigateToNavigationScreen}
          >
            <Ionicons name="navigate" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-sm font-bold">
              Navigate to Issue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Image Viewer Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 bg-black justify-center items-center">
          <FlatList
            ref={flatListRef}
            data={issue.images}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={true}
            onScrollToIndexFailed={() => {}}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => (
              <View className="w-screen justify-center items-center">
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            )}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.floor(
                event.nativeEvent.contentOffset.x / width
              );
              setSelectedImageIndex(newIndex);
            }}
          />
          <View className="absolute top-20 self-center bg-black/50 rounded-xl px-4 py-2">
            <Text className="text-white text-base">
              {selectedImageIndex + 1} / {issue.images.length}
            </Text>
          </View>
          <TouchableOpacity
            className="absolute top-14 right-5 z-10 bg-black/50 rounded-full p-2"
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}