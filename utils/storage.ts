import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarEvent } from '@/types/events';

const EVENTS_STORAGE_KEY = '@calendar_events';

export const saveEvent = async (event: CalendarEvent) => {
  try {
    const existingEventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    const existingEvents: CalendarEvent[] = existingEventsJson ? JSON.parse(existingEventsJson) : [];
    
    // If event has an id, update it instead of adding new
    const eventIndex = existingEvents.findIndex(e => e.id === event.id);
    let updatedEvents: CalendarEvent[];
    
    if (eventIndex >= 0) {
      updatedEvents = existingEvents.map(e => 
        e.id === event.id ? event : e
      );
    } else {
      updatedEvents = [...existingEvents, event];
    }
    
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    return updatedEvents;
  } catch (error) {
    console.error('Error saving event:', error);
    return null;
  }
};

export const getEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

export const deleteEvent = async (eventId: string): Promise<CalendarEvent[]> => {
  try {
    const existingEventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    const existingEvents: CalendarEvent[] = existingEventsJson ? JSON.parse(existingEventsJson) : [];
    
    const updatedEvents = existingEvents.filter(event => event.id !== eventId);
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    
    return updatedEvents;
  } catch (error) {
    console.error('Error deleting event:', error);
    return [];
  }
};