import { getUserContactDetails, setUserContactDetails } from "@/utils/userData";
import { ClerkProvider, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
// Keep the splash screen visible until the root layout has decided on the initial route
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLICABLE_KEY||'';

function InitialLayout() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  useEffect(() => {
    const checkUserStatus = async () => {
      if (isLoaded) {
        if (isSignedIn) {
          // First, attempt to fetch existing user profile from backend using Clerk email
          try {
            const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
            console.log('User email:', email);
            if (email) {
              const response = await fetch(
                'https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/authUsers/get-user',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                }
              );

              if (response.ok) {
                const json = await response.json();
                if (json?.success && json?.data) {
                  const apiData = json.data as {
                    id: string;
                    name?: string;
                    email: string;
                    age?: number;
                    phone?: string;
                  };

                  await setUserContactDetails({
                    name: apiData.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User',
                    phone: apiData.phone || '',
                    email: apiData.email,
                    age: typeof apiData.age === 'number' ? apiData.age : 0,
                    userId: user?.id as string,
                    completedAt: new Date().toISOString(),
                  });

                  router.replace('/(tabs)');
                  return; // Stop further checks
                } else if (json && json.success === false) {
                  // Backend says user not found; go to contact details and prefill email
                  router.replace(`/contact-details?email=${encodeURIComponent(email)}`);
                  return;
                }
              }
            }

            // If no backend record, fall back to local contact details check
            const contactDetails = await getUserContactDetails(user?.id);
            if (contactDetails) {
              router.replace('/(tabs)');
            } else {
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