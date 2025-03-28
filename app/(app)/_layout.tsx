import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false, title: "Sign in" }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
          title: "Sign up",
        }}
      />
      <Stack.Screen
        name="otp-verification"
        options={{
          headerShown: false,
          title: "OTP Verification",
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
