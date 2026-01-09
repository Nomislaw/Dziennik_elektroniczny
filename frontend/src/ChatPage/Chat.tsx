// Chat.tsx - UPROSZCZONY
import { useEffect, useRef, useState, useCallback } from "react";
import { pobierzRozmowe, wyslijWiadomosc, WiadomoscDto } from "../api/WiadomosciService";
import { startChatConnection, stopChatConnection } from "../api/api";

export interface MessageDto {
  id: number;
  tresc: string;
  nadawcaId: number;
  dataWyslania: string;
}

interface Props {
  rozmowcaId: number;
  token: string;
  currentUserId: number;
}

function ChatWindow({ messages, currentUserId }: { messages: WiadomoscDto[]; currentUserId: number }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col-reverse overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
      <div ref={messagesEndRef} />
      {messages.slice().reverse().map((msg) => {
        const isMine = msg.nadawcaId === currentUserId;
        const time = new Date(msg.dataWyslania).toLocaleTimeString([], { 
          hour: "2-digit", minute: "2-digit" 
        });
        return (
          <div key={msg.id} className={`flex px-6 py-2 ${isMine ? "justify-end" : "justify-start"} w-full`}>
            <div
              className={`max-w-[70%] p-3 rounded-2xl shadow-sm break-words ${
                isMine
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <div>{msg.tresc}</div>
              <div className={`text-xs mt-1 ${isMine ? "text-green-100" : "text-gray-500"} text-right`}>
                {time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Chat({ rozmowcaId, token, currentUserId }: Props) {
  const [messages, setMessages] = useState<WiadomoscDto[]>([]);
  const [text, setText] = useState("");

  // Funkcja do ładowania wiadomości
  const loadMessages = useCallback(async () => {
    try {
      const msgs = await pobierzRozmowe(rozmowcaId);
      const sortedMessages = msgs.sort((a: any, b: any) => 
        new Date(a.dataWyslania).getTime() - new Date(b.dataWyslania).getTime()
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Błąd ładowania wiadomości:", error);
    }
  }, [rozmowcaId]);

  useEffect(() => {
    let isMounted = true;

    loadMessages();

    // ZMIANA: WebSocket TYLKO powiadamia o nowej wiadomości
    const onNewMessage = async () => {
      // ODŚWIĘŻAJ po otrzymaniu wiadomości z WebSocket
      await loadMessages();
    };

    startChatConnection(token, onNewMessage);

    return () => {
      isMounted = false;
      stopChatConnection();
    };
  }, [rozmowcaId, token, loadMessages]);

  const send = async () => {
    if (!text.trim()) return;
    
    const messageToSend = text.trim();
    setText(""); // Czyścimy input OD RAZU
    
    try {
      await wyslijWiadomosc({ odbiorcaId: rozmowcaId, tresc: messageToSend });
      
      // ODŚWIĘŻAJ po wysłaniu
      await loadMessages();
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatWindow messages={messages} currentUserId={currentUserId} />
      <div className="border-t border-gray-200 bg-white px-6 py-4 w-full">
        <div className="flex gap-2 w-full">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Napisz wiadomość..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none w-full"
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm min-w-[100px]"
          >
            Wyślij
          </button>
        </div>
      </div>
    </div>
  );
}
