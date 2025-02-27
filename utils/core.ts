import { addDays } from "date-fns";

export const calculatePregnancyWeek = (dueDateInSeconds: number) => {
  const dueDate = addDays(new Date(dueDateInSeconds * 1000), 280 - 203);
  const totalDays = Math.floor(
    (new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeks = Math.floor(totalDays / 7) + 40;

  return weeks;
};
