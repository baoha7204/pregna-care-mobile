import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { View } from "@ant-design/react-native";

import { theme } from "@/styles/theme";
import { HeaderRightProps } from "@/types/header";
import { EventsContext } from "@/contexts/events.context";

const CalendarHeaderRight = (props: HeaderRightProps) => {
  const { handleModalOpen } = useContext(EventsContext);
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
    marginBottom: 10,
    marginRight: 16,
  },
  iconButton: {
    marginLeft: 16,
  },
});

export default CalendarHeaderRight;
