import React from "react";
import { ActivityIndicator, View } from "@ant-design/react-native";
import { Image, StyleSheet, Text } from "react-native";
import { theme } from "@/styles/theme";

const LoadingView = () => {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.viewLoading}>
        <Image
          style={styles.tinyLogo}
          source={require("../assets/images/Group 34499.png")}
        />
        <Text style={styles.titleLoading}>PregnaCare</Text>
      </View>

      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  viewLoading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  titleLoading: { fontSize: 24, fontWeight: "bold", color: theme.primary },
  tinyLogo: {
    width: 100,
    height: 100,
  },
});

export default LoadingView;
