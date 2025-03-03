import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { View } from "@ant-design/react-native";

import { theme } from "@/styles/theme";
import { NativeStackHeaderRightProps } from "@/types/header";
import useFetuses from "@/hooks/useFetuses";

const FetusAddHeaderRight = (props: NativeStackHeaderRightProps) => {
  const { handleModalOpen } = useFetuses();
  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.iconButton} onPress={handleModalOpen}>
        <Feather name="plus" size={24} color={theme.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
});

export default FetusAddHeaderRight;
