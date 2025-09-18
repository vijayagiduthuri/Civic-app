// app/oauth-callback.tsx
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function OAuthCallback() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      // ✅ Session active, go to tabs
      router.replace("/(tabs)");
    }
  }, [isSignedIn]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
