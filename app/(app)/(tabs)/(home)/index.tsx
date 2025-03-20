import { StyleSheet, ScrollView } from 'react-native';
import React from 'react';

import BlogPreview from '@/components/Blog/BlogPreview';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <BlogPreview />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
});

export default HomeScreen;
