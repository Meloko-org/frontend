import { ApiResponse, ProductCategoryData } from "../types/API";
const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const formatDateToFr = (isoDate: Date | string | undefined) => {
  if (!isoDate) return;

  const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate;

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fr-Fr", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatQuantity = (quantity: number, unit: string) => {
  if (unit === "gr") {
    if (quantity < 1000) {
      return `${quantity} gr`;
    } else {
      return `${(quantity / 1000).toFixed(1)} kg`;
    }
  }
  return `${quantity}`;
};

const weekDayLabels = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const getWeekDayLabel = (day: number): string => {
  return weekDayLabels[day - 1];
};

export default {
  formatDateToFr,
  formatQuantity,
  getWeekDayLabel,
};
