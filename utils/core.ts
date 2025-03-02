import { subDays } from "date-fns";

export const calculateLmpDate = (dueDateUnknown: number | Date) => {
  let dueDate: Date;
  if (typeof dueDateUnknown === "number")
    // number in seconds
    dueDate = new Date(dueDateUnknown * 1000);
  else dueDate = dueDateUnknown;
  return subDays(dueDate, 280); // LMP is 280 days before due date
};

export const calculatePregnancyWeek = (
  dueDateUnknown: number | Date,
  calculatedDate: Date
) => {
  const lmpDate = calculateLmpDate(dueDateUnknown);
  const totalDays = Math.floor(
    (calculatedDate.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeks = Math.floor(totalDays / 7);

  return weeks;
};
