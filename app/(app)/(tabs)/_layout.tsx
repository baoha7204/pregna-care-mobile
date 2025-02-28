import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import useSession from "@/hooks/useSession";
import React from "react";
import { theme } from "@/styles/theme";
import CalendarHeaderRight from "@/components/Header/CalendarHeaderRight";
import FetusManageHeader from "@/components/Header/FetusManageHeader";

const TabsLayout = () => {
  // const {
  //   status: { authenticated },
  //   isLoading,
  //   user,
  //   currentFetus,
  //   switchFetus,
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
          // header: (props) => (
          //   <FetusManageHeader
          //     fetuses={user?.fetuses}
          //     currentFetus={currentFetus}
          //     onSelectedFetus={switchFetus}
          //     {...props}
          //   />
          // ),
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
        name="(profile)/index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "user-circle" : "user-circle-o"}
              size={28}
              color={color}
            />
          ),
          tabBarLabel: "Profile",
          title: "My Profile",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
