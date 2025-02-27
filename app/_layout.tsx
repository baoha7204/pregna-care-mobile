import { Slot } from "expo-router";
import { Provider } from "@ant-design/react-native";

import { SessionProvider } from "@/contexts/auth.context";
import React from "react";
import { EventsProvider } from "@/contexts/events.context";

export default function RootLayout() {
  return (
    <SessionProvider>
      <EventsProvider>
        <Provider>
          <Slot />
        </Provider>
      </EventsProvider>
    </SessionProvider>
  );
}
