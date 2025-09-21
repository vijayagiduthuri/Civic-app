import React from "react";
import {Stack } from "expo-router";
import './global.css';
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="issueDetails/[id]" options={{ title: "Issue Details" }} />
    </Stack>
  );
}