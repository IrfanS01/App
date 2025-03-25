import fetchHelper from "./fetchHelper";

export const getReservations = async () => {
  return await fetchHelper("/reservations");
};

export const createReservation = async (data) => {
  return await fetchHelper("/reservations", "POST", data);
};
