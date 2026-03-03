import { format, differenceInDays, isToday, isYesterday } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const getRelativeDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDate(date);
};

export const calculateStreak = (dates: Date[]): number => {
  if (dates.length === 0) return 0;

  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;
  let currentDate = new Date(sortedDates[0]);

  for (let i = 1; i < sortedDates.length; i++) {
    const daysDiff = differenceInDays(currentDate, sortedDates[i]);

    if (daysDiff === 1) {
      streak++;
      currentDate = new Date(sortedDates[i]);
    } else if (daysDiff > 1) {
      break;
    }
  }

  return streak;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
