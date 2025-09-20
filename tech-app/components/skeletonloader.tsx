import { JSX, useEffect } from "react";
import { Animated, View, ScrollView } from "react-native";

export const SkeletonLoader = () :JSX.Element => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <ScrollView className="flex-1 px-4 pt-4">
      {/* Active Issue Skeleton */}
      <View className="mb-6">
        <Animated.View 
          className="bg-gray-200 rounded-3xl p-6 mb-4"
          style={{ opacity }}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="bg-gray-300 h-4 w-32 rounded"></View>
            <View className="bg-gray-300 h-6 w-16 rounded-full"></View>
          </View>
          <View className="bg-gray-300 h-6 w-48 rounded mb-3"></View>
          <View className="bg-gray-300 h-4 w-64 rounded mb-4"></View>
          <View className="flex-row justify-between items-center">
            <View className="bg-gray-300 h-4 w-28 rounded"></View>
            <View className="bg-gray-300 h-10 w-24 rounded-2xl"></View>
          </View>
        </Animated.View>
      </View>

      {/* Previous Issues Header Skeleton */}
      <Animated.View 
        className="bg-gray-200 h-6 w-40 rounded mb-4"
        style={{ opacity }}
      ></Animated.View>

      {/* Previous Issues List Skeleton */}
      {[1, 2, 3].map((item) => (
        <Animated.View 
          key={item}
          className="bg-gray-200 rounded-2xl p-4 mb-3 flex-row"
          style={{ opacity }}
        >
          <View className="bg-gray-300 w-12 h-12 rounded-full mr-4"></View>
          <View className="flex-1">
            <View className="bg-gray-300 h-4 w-48 rounded mb-2"></View>
            <View className="bg-gray-300 h-3 w-32 rounded mb-2"></View>
            <View className="bg-gray-300 h-3 w-24 rounded"></View>
          </View>
          <View className="bg-gray-300 w-16 h-6 rounded"></View>
        </Animated.View>
      ))}
    </ScrollView>
  );
};