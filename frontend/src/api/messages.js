import fetchHelper from "./fetchHelper";

// Slanje poruke
export const sendMessage = async ({ from, to, message }) => {
  return await fetchHelper("/messages/send", "POST", { from, to, message });
};

// Dohvatanje poruka za korisnika (GET /messages?email=...)
export const getMessages = async (email) => {
  return await fetchHelper(`/messages?email=${encodeURIComponent(email)}`);
};
