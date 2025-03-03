import React from "react";
import { Redirect, Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import FetusManageHeader from "@/components/Header/FetusManageHeader";
import CalendarHeaderRight from "@/components/Header/CalendarHeaderRight";
import useSession from "@/hooks/useSession";
import useFetuses from "@/hooks/useFetuses";
import { theme } from "@/styles/theme";
import LoadingView from "@/components/LoadingView";

const TabsLayout = () => {
  const {
    status: { authenticated },
    isLoading,
    isFetchingUser,
    user,
  } = useSession();
  const { fetuses, currentFetus, switchFetus } = useFetuses();

  if (isLoading || isFetchingUser) {
    return <LoadingView />;
  }

  if (!authenticated || !user) {
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
