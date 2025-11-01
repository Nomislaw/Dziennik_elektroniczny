import { fetchAPI } from "./api";
import { Uzytkownik } from "../types/Uzytkownik";

export const login = async (email: string, password: string): Promise<Uzytkownik> => {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (req: {
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}): Promise<Uzytkownik> => {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(req),
  });
};
