import React from "react";
import { StyleSheet, View } from "react-native";

import BlogDetail from "@/components/Blog/BlogDetail";

const BlogDetailScreen = () => {
  return (
    <View style={styles.container}>
      <BlogDetail />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
});

export default BlogDetailScreen;
