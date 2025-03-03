import React from "react";
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

import { commonStyles } from "@/styles/common";

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={commonStyles.container}>
        <Text style={commonStyles.text}>
          Sorry, the page you looking for is not available
        </Text>
        <Link href="/" style={commonStyles.button}>
          Go to Home
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;
