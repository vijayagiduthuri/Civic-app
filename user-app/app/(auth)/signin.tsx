import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image } from "react-native";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

export default function SignIn(): React.ReactElement {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const onGoogleSignIn = async (): Promise<void> => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);

    try {
      const redirectUrl = Linking.createURL("oauth-callback");
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl,
      });

      if (!createdSessionId || !setActive) {
        throw new Error("Session not created");
      }

      await setActive({ session: createdSessionId });
      // The root layout will handle the redirect to contact details
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      Alert.alert(
        "Sign In Failed",
        errorObj?.message || "Unable to sign in with Google."
      );
      setError(errorObj?.message || "Unable to sign in with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Emoji */}
      <View style={{ marginTop: -30, marginBottom: 38, alignItems: "center" }}>
        <Image
          source={require("../../assets/images/Civi-User-app.png")}
          style={{ width: 300, height: 300, resizeMode: "contain" }}
        />
      </View>

      {/* Google Sign In Button */}
      <Pressable
        onPress={onGoogleSignIn}
        disabled={isGoogleLoading}
        className={`flex-row items-center justify-center rounded-xl px-8 py-4 w-full max-w-sm 
    ${
      isGoogleLoading ? "bg-blue-400" : "bg-blue-500 active:bg-blue-600"
    } shadow-lg`}
      >
        {isGoogleLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text className="text-white text-base font-semibold ml-3">
              Continue with Google
            </Text>
          </>
        )}
      </Pressable>

      {/* Error Box */}
      {error ? (
        <View className="flex-row items-center bg-red-50 px-4 py-3 rounded-lg mt-4 border-l-4 border-red-500">
          <Ionicons name="alert-circle" size={16} color="#FF4444" />
          <Text className="text-red-500 text-sm ml-2 flex-1">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
