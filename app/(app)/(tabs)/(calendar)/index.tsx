import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
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
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AddEventModal } from '@/components/AddEventModal';
import { EventDetails } from '@/components/EventDetails';
import { CalendarEvent } from '@/types/events';
import { saveEvent, getEvents, deleteEvent } from '@/utils/storage';

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();
  const today = new Date();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const loadedEvents = await getEvents();
    setEvents(loadedEvents);
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

  const handleAddEvent = async (note: string, selectedSymptoms: number[]) => {
    const newEvent: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      date: selectedDate.toISOString(),
      note,
      symptoms: selectedSymptoms,
    };

    const updatedEvents = await saveEvent(newEvent);
    if (updatedEvents) {
      setEvents(updatedEvents);
      setEditingEvent(undefined);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsAddEventModalVisible(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedEvents = await deleteEvent(eventId);
            if (updatedEvents) {
              setEvents(updatedEvents);
            }
          }
        }
      ]
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileEmoji}>🥰</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>My Calendar</Text>
          <Feather name="chevron-down" size={20} color="white" />
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWeekDays = () => {
    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
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
          const weekNumber = getWeek(date, { weekStartsOn: 1 });
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
                <Text style={[
                  styles.weekNumber,
                  isCurrentWeek && styles.currentWeekNumber
                ]}>
                  wk {weekNumber}
                </Text>
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
                        {format(date, 'd')}
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

  const calculatePregnancyWeek = () => {
    const dueDate = addDays(new Date(), 280 - 203);
    const totalDays = Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7) + 40;
    
    if (weeks >= 27 && weeks <= 40) {
      return `${weeks} weeks, 3rd trimester`;
    } else if (weeks >= 14) {
      return `${weeks} weeks, 2nd trimester`;
    } else {
      return `${weeks} weeks, 1st trimester`;
    }
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.progressContainer}>
            <FontAwesome5 name="baby-carriage" size={20} color="#FFD700" />
            <Text style={styles.progressText}>{calculatePregnancyWeek()}</Text>
          </View>
          <View style={styles.calendarContainer}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthTitle}>
                {format(currentDate, 'MMMM yyyy', { locale: vi })}
              </Text>
              <View style={styles.monthNav}>
                <TouchableOpacity onPress={onPreviousMonth}>
                  <Feather name="chevron-left" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onNextMonth}>
                  <Feather name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            {renderWeekDays()}
            {renderCalendarDays()}
          </View>
          <View style={styles.selectedDateInfo}>
            <Text style={styles.selectedDateNumber}>
              {format(selectedDate, 'd')}
            </Text>
            <Text style={styles.selectedDateDay}>
              {format(selectedDate, 'EEEE', { locale: vi }).toUpperCase()}
            </Text>
            <Text style={styles.selectedDateMonth}>
              {format(selectedDate, 'MM/yyyy')}
            </Text>
          </View>

          {selectedDateEvents.map(event => (
            <EventDetails 
              key={event.id} 
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}

          <TouchableOpacity 
            style={styles.addEventButton}
            onPress={() => setIsAddEventModalVisible(true)}
          >
            <Feather name="plus" size={24} color="#002F35" />
            <Text style={styles.addEventText}>Add new event</Text>
          </TouchableOpacity>
        </ScrollView>

        <AddEventModal
          visible={isAddEventModalVisible}
          onClose={() => {
            setIsAddEventModalVisible(false);
            setEditingEvent(undefined);
          }}
          onSave={handleAddEvent}
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
    backgroundColor: '#002F35',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#90EE90',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
    backgroundColor: '#004952',
  },
  progressText: {
    color: 'white',
    fontSize: 16,
  },
  calendarContainer: {
    padding: 16,
    backgroundColor: '#004952',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  monthNav: {
    flexDirection: 'row',
    gap: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    paddingHorizontal: 8,
    marginLeft: 30,
    marginRight: -5,
  },
  weekDay: {
    color: '#9CA3AF',
    width: 40,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'column',
    backgroundColor: '#004952',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekNumberContainer: {
    width: '10%',
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  currentWeekContainer: {
    backgroundColor: '#355F51',
    borderRadius: 30,
    marginHorizontal: -4,
    paddingHorizontal: 4,
  },
  weekNumber: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  currentWeekNumber: {
    color: '#80DEEA',
    fontWeight: 'bold',
  },
  day: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  selectedDay: {
    backgroundColor: '#0EA5E9',
  },
  todayDay: {
    backgroundColor: '#007A87',
    borderWidth: 2,
    borderColor: '#80DEEA',
  },
  dayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  otherMonthDay: {
    color: '#4B5563',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDateInfo: {
    padding: 16,
    backgroundColor: '#002F35',
  },
  selectedDateNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  selectedDateDay: {
    fontSize: 16,
    color: 'white',
    marginTop: 4,
  },
  selectedDateMonth: {
    fontSize: 16,
    color: 'white',
    marginTop: 2,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#80DEEA',
    margin: 16,
    padding: 16,
    borderRadius: 30,
    gap: 8,
  },
  addEventText: {
    color: '#002F35',
    fontSize: 16,
    fontWeight: '600',
  },
  eventDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#80DEEA',
  },
});

export default CalendarScreen;