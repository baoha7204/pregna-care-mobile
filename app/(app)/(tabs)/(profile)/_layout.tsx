import React from 'react';
import { Stack } from 'expo-router';

import { theme } from '@/styles/theme';
import FetusAddHeaderRight from '@/components/Fetus/FetusAddHeaderRight';

export default function ProfileLayout() {
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
      <Stack.Screen name='index' options={{ title: 'My Profile' }} />
      <Stack.Screen
        name='edit-profile/edit-profile-screen'
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name='manage-fetus'
        options={{ title: 'My Fetus', headerRight: FetusAddHeaderRight }}
      />
    </Stack>
  );
}
