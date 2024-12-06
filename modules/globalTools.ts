const formatDateToFr = (isoDate: Date) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("fr-Fr", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export default {
  formatDateToFr,
};
