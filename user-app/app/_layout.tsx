import React, { useEffect, useState } from "react";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Slot, SplashScreen, useRouter } from "expo-router";
import Splash from "@/components/splash";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
// Keep the splash screen visible until the root layout has decided on the initial route
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLICABLE_KEY||'';

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
    router.replace('/(tabs)');
      } else {
        // Redirect to the sign-in screen for unauthenticated users
        router.replace('/(auth)/signin');
      }
      // Hide the splash screen once the initial route is determined
    }
  }, [isLoaded, isSignedIn]);

  // Render a loading screen while Clerk is loading the auth state
  if (!isLoaded) {
    return null; // You can also return your custom <Splash/> component here
  }

  // Render the core layout
  return <Slot/>;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <InitialLayout />
    </ClerkProvider>
  );
}