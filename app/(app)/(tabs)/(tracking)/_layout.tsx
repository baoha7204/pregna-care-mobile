import React from "react";
import { Stack } from "expo-router";
import { theme } from "@/styles/theme";

export default function TrackingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTitleStyle: {
          color: theme.textPrimary,
          fontSize: 20,
        },
        headerTintColor: theme.textPrimary,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pregnancy Tracking" }} />
      <Stack.Screen
        name="measurements"
        options={{ title: "Growth Measurements" }}
      />
    </Stack>
  );
}
