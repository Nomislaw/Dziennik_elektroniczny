import { OcenaCreateDto } from "../types/Ocena";

const API_URL = "https://localhost:7292/api/Oceny";

export async function addOcena(dto: OcenaCreateDto) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error("Nie udało się dodać oceny");
  }

  return await res.json();
}
