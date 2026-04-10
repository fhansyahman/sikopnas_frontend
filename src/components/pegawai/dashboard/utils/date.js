export const formatDate = (date = new Date()) => {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

export const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

export const formatDateTime = (date = new Date()) => {
  return date.toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "medium"
  });
};