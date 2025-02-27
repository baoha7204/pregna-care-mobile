import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { CalendarEvent } from "@/types/events";
import { symptoms } from "@/data/symptoms";

interface EventDetailsProps {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onEdit,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const itemHeight = useRef(new Animated.Value(80)).current;

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

  const selectedSymptoms = symptoms.filter((s) =>
    event.symptoms.includes(s.id)
  );

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
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
          <TouchableOpacity
            style={styles.content}
            onPress={() => onEdit(event)}
            activeOpacity={0.7}
          >
            <View style={styles.noteContainer}>
              <Text style={styles.note}>{event.note}</Text>
              {selectedSymptoms.length > 0 && (
                <View style={styles.symptomsContainer}>
                  {selectedSymptoms.map((symptom) => (
                    <View key={symptom.id} style={styles.symptomTag}>
                      <Text style={styles.symptomText}>{symptom.icon}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(event.id)}
          >
            <Feather name="trash-2" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureContainer: {
    backgroundColor: "#002F35",
  },
  container: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#004952",
    borderRadius: 12,
    padding: 16,
    paddingRight: 12,
  },
  noteContainer: {
    flex: 1,
  },
  note: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
  symptomsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomTag: {
    backgroundColor: "#0D3A41",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  symptomText: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    borderRadius: 12,
    marginLeft: 5,
  },
});
