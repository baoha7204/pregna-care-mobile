import React from "react";
import { Slot } from "expo-router";
import { Provider } from "@ant-design/react-native";

import { SessionProvider } from "@/contexts/auth.context";
import { EventsProvider } from "@/contexts/events.context";
import { FetusesProvider } from "@/contexts/fetuses.context";

export default function RootLayout() {
  return (
    <SessionProvider>
      <FetusesProvider>
        <EventsProvider>
          <Provider>
            <Slot />
          </Provider>
        </EventsProvider>
      </FetusesProvider>
    </SessionProvider>
  );
}
