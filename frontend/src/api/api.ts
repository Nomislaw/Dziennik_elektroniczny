import * as signalR from "@microsoft/signalr";

const URL = "http://localhost:5273";
const API_URL = `${URL}/api`;

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
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      throw new Error("Nie udało się odczytać błędu z serwera");
    }

    console.log("Błąd API:", errorData);

    let errorMessage = "";

    if (errorData.errors) {
      if (Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.join("\n");
      } else if (typeof errorData.errors === "object") {
        errorMessage = Object.values(errorData.errors).flat().join("\n");
      } else {
        errorMessage = String(errorData.errors);
      }
    } else {
      errorMessage = "Nieznany błąd API";
    }

    console.log(errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
};



let connection: signalR.HubConnection | null = null;

export function startChatConnection(token: string, onMessage: (msg: any) => void) {
  if (connection) return;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${URL}/chatHub`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", onMessage);

  connection
    .start()
    .then(() => console.log("✅ SignalR chat connected"))
    .catch(console.error);
}

export function stopChatConnection() {
  if (connection) {
    connection.stop();
    connection = null;
  }
}