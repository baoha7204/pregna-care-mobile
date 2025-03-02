import React from "react";
import { Stack } from "expo-router";

import { theme } from "@/styles/theme";

export default function ProfileLayout() {
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
      <Stack.Screen name="index" options={{ title: "My Profile" }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
    </Stack>
  );
}
