import { Slot } from "expo-router";
import { Provider } from "@ant-design/react-native";

import { SessionProvider } from "@/contexts/auth.context";
import React from "react";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Provider>
        <Slot />
      </Provider>
    </SessionProvider>
  );
}
