import React from 'react';
import { Slot } from 'expo-router';
import { Provider } from '@ant-design/react-native';

import { SessionProvider } from '@/contexts/auth.context';
import { EventsProvider } from '@/contexts/events.context';
import { FetusesProvider } from '@/contexts/fetuses.context';
import { UsersProvider } from '@/contexts/users.context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <FetusesProvider>
        <EventsProvider>
          <UsersProvider>
            <Provider>
              <Slot />
            </Provider>
          </UsersProvider>
        </EventsProvider>
      </FetusesProvider>
    </SessionProvider>
  );
}
