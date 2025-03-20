import { useRouter } from "expo-router";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getWeek,
  startOfWeek,
  addDays,
  isSameWeek,
} from "date-fns";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AddEventModal } from "@/components/AddEventModal";
import { EventDetails } from "@/components/EventDetails";
import useEvents from "@/hooks/useEvents";
import { calculatePregnancyWeek } from "@/utils/core";
import { theme } from "@/styles/theme";
import useFetuses from "@/hooks/useFetuses";
import useSession from "@/hooks/useSession";

const CalendarScreen = () => {
  const router = useRouter();
  const { isPremium } = useSession();
  const { currentFetus } = useFetuses();
  const {
    events,
    editingEvent,
    handleAddEvent,
    handleEditEvent,
    handleDeleteEvent,
    isAddEventModalVisible,
    handleModalOpen,
    handleModalClose,
  } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  const handleAlertDeleteEvent = (eventId: string) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteEvent(eventId),
      },
    ]);
  };

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    let firstDay = startOfWeek(start, { weekStartsOn: 1 });
    const days = [];
    for (let i = 0; i < 42; i++) {
      days.push(addDays(firstDay, i));
    }
    return days;
  };

  const onPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const onNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getEventsForDate = useCallback(
    (date: Date) => {
      return events.filter(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );
    },
    [events]
  );

  const renderWeekDays = () => {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return (
      <View style={styles.weekDays}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderCalendarDays = () => {
    const days = getDaysInMonth(currentDate);
    const weeks = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <View style={styles.calendarGrid}>
        {weeks.map((week, weekIndex) => {
          const date = week[0];
          const weekNumber = currentFetus
            ? calculatePregnancyWeek(currentFetus.dueDate, date)
            : getWeek(date, { weekStartsOn: 1 });
          const isCurrentWeek = isSameWeek(date, today, { weekStartsOn: 1 });

          return (
            <View
              key={weekIndex}
              style={[
                styles.weekRow,
                isCurrentWeek && styles.currentWeekContainer,
              ]}
            >
              <View style={styles.weekNumberContainer}>
                {weekNumber > 0 && weekNumber < 41 && (
                  <Text
                    style={[
                      styles.weekNumber,
                      isCurrentWeek && styles.currentWeekNumber,
                    ]}
                  >
                    wk {weekNumber}
                  </Text>
                )}
              </View>
              <View style={styles.daysRow}>
                {week.map((date, dayIndex) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isToday = isSameDay(date, today);
                  const dateEvents = getEventsForDate(date);
                  const hasEvents = dateEvents.length > 0;

                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.day,
                        isSelected && styles.selectedDay,
                        isToday && styles.todayDay,
                      ]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          !isCurrentMonth && styles.otherMonthDay,
                          isSelected && styles.selectedDayText,
                          isToday && styles.todayText,
                        ]}
                      >
                        {format(date, "d")}
                      </Text>
                      {hasEvents && <View style={styles.eventDot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const formatPregnancyWeek = () => {
    if (!currentFetus) return "No baby yet";

    const weeks = currentFetus.weeks;

    if (weeks >= 27 && weeks <= 40) {
      return `${weeks} weeks, 3rd trimester`;
    } else if (weeks >= 14) {
      return `${weeks} weeks, 2nd trimester`;
    } else {
      return `${weeks} weeks, 1st trimester`;
    }
  };

  const selectedDateEvents = useMemo(
    () => getEventsForDate(selectedDate),
    [selectedDate, getEventsForDate]
  );

  useEffect(() => {
    if (!isPremium) {
      router.replace("/(app)/(tabs)/(home)");
    }
  }, [isPremium]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.progressContainer}>
            <FontAwesome5 name="baby-carriage" size={20} color="Brown" />
            <Text style={styles.progressText}>{formatPregnancyWeek()}</Text>
          </View>
          <View style={styles.calendarContainer}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthTitle}>
                {format(currentDate, "MMMM yyyy")}
              </Text>
              <View style={styles.monthNav}>
                <TouchableOpacity onPress={onPreviousMonth}>
                  <Feather name="chevron-left" size={24} color="brown" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onNextMonth}>
                  <Feather name="chevron-right" size={24} color="brown" />
                </TouchableOpacity>
              </View>
            </View>
            {renderWeekDays()}
            {renderCalendarDays()}
          </View>
          <View style={styles.selectedDateInfo}>
            <Text style={styles.selectedDateNumber}>
              {format(selectedDate, "d")}
            </Text>
            <Text style={styles.selectedDateDay}>
              {format(selectedDate, "EEEE").toUpperCase()}
            </Text>
            <Text style={styles.selectedDateMonth}>
              {format(selectedDate, "MM/yyyy")}
            </Text>
          </View>

          {selectedDateEvents.map((event) => (
            <EventDetails
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleAlertDeleteEvent}
            />
          ))}

          <TouchableOpacity
            style={styles.addEventButton}
            onPress={handleModalOpen}
          >
            <Feather name="plus" size={24} color="#002F35" />
            <Text style={styles.addEventText}>Add new event</Text>
          </TouchableOpacity>
        </ScrollView>

        <AddEventModal
          visible={isAddEventModalVisible}
          onClose={handleModalClose}
          onSave={(note: string, selectedSymptoms: number[]) =>
            handleAddEvent(selectedDate, note, selectedSymptoms)
          }
          date={selectedDate}
          editingEvent={editingEvent}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "android" ? 16 : 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#90EE90",
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginRight: 8,
  },
  headerRight: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 8,
    backgroundColor: "#FFCCC6",
  },
  progressText: {
    color: "#000",
    fontSize: 16,
  },
  calendarContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textTransform: "capitalize",
  },
  monthNav: {
    flexDirection: "row",
    gap: 16,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    paddingHorizontal: 8,
    marginLeft: 30,
    marginRight: -5,
  },
  weekDay: {
    color: "#352D2D",
    width: 40,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  calendarGrid: {
    flexDirection: "column",
    backgroundColor: "#FFF",
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  weekNumberContainer: {
    width: "10%",
    alignItems: "flex-start",
    paddingLeft: 8,
  },
  daysRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  currentWeekContainer: {
    backgroundColor: "#FFCCC6",
    borderRadius: 30,
    marginHorizontal: -4,
    paddingHorizontal: 4,
  },
  weekNumber: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  currentWeekNumber: {
    color: "#fff",
    fontWeight: "bold",
  },
  day: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  selectedDay: {
    backgroundColor: "#EE7A7A",
  },
  todayDay: {
    backgroundColor: "#FFAAA0",
    borderWidth: 2,
    borderColor: "#FFCCC6",
  },
  dayText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  otherMonthDay: {
    color: "lightgray",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },
  todayText: {
    color: "#000",
    fontWeight: "bold",
  },
  selectedDateInfo: {
    padding: 16,
    backgroundColor: "#FFF5F5",
  },
  selectedDateNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  selectedDateDay: {
    fontSize: 16,
    color: "#000",
    marginTop: 4,
  },
  selectedDateMonth: {
    fontSize: 16,
    color: "#000",
    marginTop: 2,
  },
  addEventButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFAAA0",
    margin: 16,
    padding: 16,
    borderRadius: 30,
    gap: 8,
  },
  addEventText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  eventDot: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.secondaryLight,
  },
});
export default CalendarScreen;
