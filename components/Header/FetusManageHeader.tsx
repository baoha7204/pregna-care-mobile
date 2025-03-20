import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";

import FetusSelectionModal from "./FetusSelectionModal";
import { theme } from "@/styles/theme";
import { Fetus } from "@/contexts/fetuses.context";
import { NativeStackHeaderRightProps } from "@/types/header";

type FetusManageHeaderProps = NativeStackHeaderRightProps & {
  fetuses?: Fetus[];
  currentFetus: Fetus | null;
  onSelectedFetus: (fetus: Fetus) => void;
};

const FetusManageHeader = (props: FetusManageHeaderProps) => {
  const { fetuses, currentFetus, onSelectedFetus } = props;
  const styles = useStyles();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.headerLeft}>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleModal}
        activeOpacity={0.7}
      >
        <View style={styles.babyInfo}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1470&auto=format&fit=crop",
            }}
            style={styles.babyIcon}
          />
          <View>
            <Text style={styles.babyName}>
              {currentFetus ? currentFetus.name : "No baby yet"}
            </Text>
            <Text style={styles.babyWeeks}>
              {currentFetus ? `${currentFetus.weeks} weeks` : ""}
            </Text>
          </View>
          <Feather
            name="chevron-down"
            size={20}
            color={theme.textPrimary}
            style={styles.dropDownIcon}
          />
        </View>
      </TouchableOpacity>
      <FetusSelectionModal
        visible={modalVisible}
        fetuses={fetuses || []}
        currentFetus={currentFetus}
        onClose={toggleModal}
        onSelect={onSelectedFetus}
      />
    </View>
  );
};

const useStyles = () =>
  StyleSheet.create({
    headerLeft: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.primary,
      paddingBottom: 16,
    },
    button: {
      flex: 1,
    },
    babyInfo: {
      flex: 1,
      gap: 10,
      flexDirection: "row",
      alignItems: "flex-end",
      marginLeft: 16,
    },
    babyIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 12,
    },
    babyName: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: "600",
    },
    babyWeeks: {
      color: "#333",
      fontSize: 14,
    },
    dropDownIcon: {
      marginBottom: 10,
    },
  });

export default FetusManageHeader;
