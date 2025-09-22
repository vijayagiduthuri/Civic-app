import React from "react";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack>
      {/* Main Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Issue Details */}
      <Stack.Screen
        name="issueDetails/[id]"
        options={{ title: "Issue Details" }}
      />
    </Stack>
  );
}
