import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text } from 'react-native';
import React from 'react';
import BabyDropdown from '@/components/BabyDropDown';

const HomeScreen = () => {
  return (
    <SafeAreaView>
      <BabyDropdown />
      <Text>Home screen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
