import { fetchAPI } from "./api";
import { User } from "../types/User";

export const login = async (email: string, haslo: string): Promise<User> => {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, haslo }),
  });
};

export const register = async (req: {
  email: string;
  haslo: string;
  imie: string;
  nazwisko: string;
  typ: string; 
}): Promise<User> => {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(req),
  });
};
