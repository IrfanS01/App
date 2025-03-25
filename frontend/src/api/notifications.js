import fetchHelper from "./fetchHelper";

export const getNotifications = async () => {
  return await fetchHelper("/notifications");
};

export const createNotification = async (data) => {
  return await fetchHelper("/notifications", "POST", data);
};
