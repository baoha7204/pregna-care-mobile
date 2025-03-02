import { EventsContext } from "@/contexts/events.context";
import { useContext } from "react";

const useEvents = () => {
  const value = useContext(EventsContext);
  if (!value) {
    throw new Error("useEvents must be wrapped in a <EventsProvider />");
  }

  return value;
};

export default useEvents;
