import React, { FC, useRef } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import { Fetus } from "@/contexts/fetuses.context";
import { theme } from "@/styles/theme";
import { commonStyles } from "@/styles/common";
import { PanGestureHandler } from "react-native-gesture-handler";

type FetusCardProps = {
  data: Fetus;
  onPress: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
};

const FetusItem: FC<FetusCardProps> = ({
  data: { id, name, weeks },
  onPress,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const onGestureEvent = ({ nativeEvent }: any) => {
    const { translationX } = nativeEvent;
    if (translationX <= 0) {
      translateX.setValue(Math.max(translationX, -100));
    }
  };

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    const { state, translationX } = nativeEvent;
    if (state === 5) {
      // END state
      if (translationX < -50) {
        // Show delete button
        Animated.spring(translateX, {
          toValue: -100,
          useNativeDriver: false,
        }).start();
      } else {
        // Reset position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Fetus", "Are you sure you want to delete this fetus?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(id),
      },
    ]);
  };
  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <TouchableOpacity style={styles.fetusItem} onPress={() => onPress(id)}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1470&auto=format&fit=crop",
            }}
            style={styles.babyIcon}
          />
          <View style={styles.fetusInfo}>
            <Text style={styles.fetusName}>{name}</Text>
            <Text style={styles.fetusWeeks}>{weeks} weeks</Text>
          </View>
          <AntDesign name="edit" size={24} color={theme.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.deleteButton}
          onPress={handleDelete}
        >
          <Feather name="trash-2" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  fetusItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.primaryDisabled,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderPrimary,
  },
  listAvatar: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  fetusInfo: {
    flex: 1,
  },
  fetusName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.secondary,
    marginBottom: 4,
  },
  fetusWeeks: {
    fontSize: 14,
    color: theme.secondaryLight,
  },
  babyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
});

export default FetusItem;
