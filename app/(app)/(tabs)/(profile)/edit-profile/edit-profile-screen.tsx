import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import UpdateProfileForm from './edit-profile-form';
import { theme } from '@/styles/theme';

export default function UpdateProfileScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: theme.primary,
          },
          headerTintColor: '#fff',
        }}
      />
      <UpdateProfileForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
