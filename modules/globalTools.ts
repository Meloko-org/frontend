import {
  ApiResponse,
  ProductCategoryData,
  ShopFeaturesData,
} from "../types/API";
// const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

export const WEEK_DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export const formatDateToFr = (isoDate: Date | string | undefined) => {
  if (!isoDate) return;

  const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate;

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fr-Fr", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatQuantity = (quantity: number, unit: string) => {
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

const arraysEqualById = (arr1: { _id: string }[], arr2: { _id: string }[]) => {
  const ids1 = arr1.map((x) => x._id).sort();
  const ids2 = arr2.map((x) => x._id).sort();

  return JSON.stringify(ids1) === JSON.stringify(ids2);
};

/* convertit des mètres en km, arrondi à 1 décimale (ex: 12.3 km) */
const formatDistance = (meters: number): string => {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};

/* convertit des secondes en heures + minutes */
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes}min`;
  }
};

/* retourne un montant en euros sous la forme d'une string */
export const formatCentsToEuros = (cents: number): string => {
  return (cents / 100).toFixed(2) + " €";
};

/* convertit un montant en euros en centimes sous la forme d'un number */
export const formatEurosToCents = (euros: string): number => {
  return Math.round(parseFloat(euros) * 100);
};

export default {
  formatDateToFr,
  formatQuantity,
  getWeekDayLabel,
  arraysEqualById,
  formatDistance,
  formatDuration,
  formatCentsToEuros,
  formatEurosToCents,
};
