const formatDateToFr = (isoDate: Date) => {
  const date = new Date(isoDate);
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

export default {
  formatDateToFr,
  formatQuantity,
};
