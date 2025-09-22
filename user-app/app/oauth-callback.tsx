// app/oauth-callback.tsx
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, Text, View } from "react-native";

export default function OAuthCallback() {
  const { isSignedIn } = useAuth();

  // The root layout will handle the redirect based on authentication status
  // This component just shows a loading state while Clerk processes the OAuth

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#007AFF" />
      <Text className="mt-4 text-base text-gray-600">Setting up your account...</Text>
    </View>
  );
}
