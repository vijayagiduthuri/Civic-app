import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
export default function AuthRoutesLayout() {

 return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" options={{ title: "Sign In" }} />
    </Stack>
  );
}