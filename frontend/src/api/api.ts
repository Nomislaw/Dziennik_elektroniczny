const API_URL = "https://localhost:7292/api";

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { "Authorization": `Bearer ${token}` } : {}), 
    },
  });

  if (!res.ok) {
    const errorText = await res.text(); 
    throw new Error(errorText || "Błąd API");
  }

  return res.json();
};