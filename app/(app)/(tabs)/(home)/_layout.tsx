import React from "react";
import { Stack } from "expo-router";

import { theme } from "@/styles/theme";
import FetusManageHeader from "@/components/Header/FetusManageHeader";
import useFetuses from "@/hooks/useFetuses";

export default function ProfileLayout() {
  const { fetuses, currentFetus, switchFetus } = useFetuses();
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
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => null,
          header: (props) => (
            <FetusManageHeader
              fetuses={fetuses}
              currentFetus={currentFetus}
              onSelectedFetus={switchFetus}
              {...props}
            />
          ),
          title: "Home",
        }}
      />
      <Stack.Screen name="blog/[id]" options={{ title: "Blog Detail" }} />
    </Stack>
  );
}
