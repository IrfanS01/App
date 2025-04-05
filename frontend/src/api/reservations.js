import fetchHelper from "./fetchHelper";

export const getReservations = async () => {
  return await fetchHelper("/reservations");
};

export const createReservation = async (data) => {
  return await fetchHelper("/reservations", "POST", data);
};

export const deleteReservation = async (reservationId) => {
  const userId = localStorage.getItem("userEmail");
  return await fetchHelper("/reservations/delete", "POST", { reservationId, userId });
};
