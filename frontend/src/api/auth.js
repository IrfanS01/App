import fetchHelper from "./fetchHelper";

export const login = async (email, password) => {
  return await fetchHelper("/auth/login", "POST", { email, password }, false);
};

export const register = async (formData) => {
  return await fetchHelper("/auth/register", "POST", formData, false);
};
