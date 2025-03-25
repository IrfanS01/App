import fetchHelper from "./fetchHelper";

// Dohvatanje svih korisnika (samo za styrelse/admin)
export const getUsers = async () => {
  return await fetchHelper("/users");
};
