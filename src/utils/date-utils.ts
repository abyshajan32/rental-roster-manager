
import { format, isAfter, isBefore, isSameDay } from "date-fns";

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd MMM yyyy");
};

export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy");
};

export const formatMonth = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMMM yyyy");
};

export const isRentalOverdue = (expectedReturnDate: Date): boolean => {
  return isAfter(new Date(), expectedReturnDate) && !isSameDay(new Date(), expectedReturnDate);
};

export const isToday = (date: Date): boolean => {
  return isSameDay(new Date(), date);
};

export const getDaysRemaining = (endDate: Date): number => {
  const diffTime = endDate.getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDaysOverdue = (expectedReturnDate: Date): number => {
  const diffTime = new Date().getTime() - expectedReturnDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDaysRented = (startDate: Date, endDate: Date | undefined): number => {
  const end = endDate || new Date();
  const diffTime = end.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
