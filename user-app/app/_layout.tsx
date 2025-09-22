import { getUserContactDetails } from "@/utils/userData";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
// Keep the splash screen visible until the root layout has decided on the initial route
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLICABLE_KEY||'';

function InitialLayout() {
  const { isLoaded, isSignedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isLoaded) {
        if (isSignedIn) {
          // Check if user has completed contact details
          try {
            const contactDetails = await getUserContactDetails(user?.id);
            if (contactDetails) {
              // User has completed contact details, go to main app
              router.replace('/(tabs)');
            } else {
              // User needs to complete contact details
              router.replace('/contact-details');
            }
          } catch (error) {
            console.error('Error checking contact details:', error);
            // If there's an error, assume user needs to complete contact details
            router.replace('/contact-details');
          }
        } else {
          // Redirect to the sign-in screen for unauthenticated users
          router.replace('/(auth)/signin');
        }
      }
    };

    checkUserStatus();
  }, [isLoaded, isSignedIn, user]);

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