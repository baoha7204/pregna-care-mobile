import React, { useEffect } from "react";
import { Redirect, Tabs, router } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import FetusManageHeader from "@/components/Header/FetusManageHeader";
import CalendarHeaderRight from "@/components/Header/CalendarHeaderRight";
import useSession from "@/hooks/useSession";
import useFetuses from "@/hooks/useFetuses";
import { theme } from "@/styles/theme";
import LoadingView from "@/components/LoadingView";
import { FontAwesome6 } from "@expo/vector-icons";

const TabsLayout = () => {
  const {
    status: { authenticated },
    isLoading,
    isFetchingUser,
  } = useSession();
  const { fetuses, currentFetus, switchFetus } = useFetuses();

  // Add an effect to ensure we redirect if authentication state changes
  useEffect(() => {
    if (!isLoading && !isFetchingUser && !authenticated) {
      router.replace("/sign-in");
    }
  }, [authenticated, isLoading, isFetchingUser]);

  if (isLoading || isFetchingUser) {
    return <LoadingView />;
  }

  // If not authenticated, redirect to sign-in
  if (!authenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTitleStyle: {
          color: theme.textPrimary,
          fontSize: 20,
          marginBottom: 10,
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
          tabBarLabel: "Home",
          headerTitle: () => null,
          header: (props) => (
            <FetusManageHeader
              fetuses={fetuses}
              currentFetus={currentFetus}
              onSelectedFetus={switchFetus}
              {...props}
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
          tabBarLabel: "Calendar",
          title: "My Calendar",
          headerRight: CalendarHeaderRight,
        }}
      />
      <Tabs.Screen
        name="(tracking)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6
              name={focused ? "chart-simple" : "chart-simple"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "Tracking",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "user-circle" : "user-circle-o"}
              size={28}
              color={color}
            />
          ),
          tabBarLabel: "Profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
