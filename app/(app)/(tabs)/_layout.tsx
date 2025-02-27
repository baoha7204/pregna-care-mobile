import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import useSession from "@/hooks/useSession";
import React from "react";
import { theme } from "@/styles/theme";

const TabsLayout = () => {
  // const {
  //   status: { authenticated },
  //   isLoading,
  // } = useSession();

  // if (isLoading) {
  //   return <Text>Loading....</Text>;
  // }

  // if (!authenticated) {
  //   return <Redirect href="/sign-in" />;
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.primaryLight,
        tabBarStyle: {
          backgroundColor: theme.secondaryLight,
        },
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)/index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "user-circle" : "user-circle-o"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(calendar)/index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "calendar" : "calendar"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
