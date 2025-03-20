import React, { useEffect, useState } from "react";
import { createContext, PropsWithChildren } from "react";

import { CalendarEvent } from "@/types/events";
import { deleteEvent, getEvents, saveEvent } from "@/utils/storage";

type EventsContextType = {
  events: CalendarEvent[];
  editingEvent: CalendarEvent | null;
  isAddEventModalVisible: boolean;
  handleAddEvent: (
    selectedDate: Date,
    note: string,
    selectedSymptoms: number[]
  ) => Promise<void>;
  handleEditEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (eventId: string) => void;
  handleModalOpen: () => void;
  handleModalClose: () => void;
};

const EventsContext = createContext<EventsContextType>({
  events: [],
  editingEvent: null,
  isAddEventModalVisible: false,
  handleAddEvent: () => Promise.resolve(),
  handleEditEvent: () => {},
  handleDeleteEvent: () => {},
  handleModalOpen: () => {},
  handleModalClose: () => {},
});

const EventsProvider = ({ children }: PropsWithChildren) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      const loadedEvents = await getEvents();
      setEvents(loadedEvents);
    };

    loadEvents();
  }, []);

  const handleAddEvent = async (
    selectedDate: Date,
    note: string,
    selectedSymptoms: number[]
  ) => {
    const newEvent: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      date: selectedDate.toISOString(),
      note,
      symptoms: selectedSymptoms,
    };

    const updatedEvents = await saveEvent(newEvent);
    if (updatedEvents) {
      setEvents(updatedEvents);
      setEditingEvent(null);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsAddEventModalVisible(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    const updatedEvents = await deleteEvent(eventId);
    if (updatedEvents) {
      setEvents(updatedEvents);
    }
  };

  const handleModalOpen = () => {
    setIsAddEventModalVisible(true);
  };

  const handleModalClose = () => {
    setIsAddEventModalVisible(false);
    setEditingEvent(null);
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        editingEvent,
        isAddEventModalVisible,
        handleAddEvent,
        handleEditEvent,
        handleDeleteEvent,
        handleModalOpen,
        handleModalClose,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export { EventsContext, EventsProvider };
