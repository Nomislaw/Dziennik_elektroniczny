// UsersList.tsx - Z SELECTED USER
import { useEffect, useState } from "react";
import { pobierzWszystkichUzytkownikow } from "../api/UzytkownikService";

interface Props {
  onSelect: (userId: number) => void;
  selectedUserId: number | null; // DODANE - aktualnie wybrany użytkownik
  className?: string;
}

export interface ChatUserDto {
  id: number;
  imie: string;
  nazwisko: string;
  rola: number;
}

export function UsersList({ onSelect, selectedUserId }: Props) {
  const [users, setUsers] = useState<ChatUserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pobierzWszystkichUzytkownikow()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  function roleConvert(role: number) {
    switch (role) {
      case 3: return "Administrator";
      case 1: return "Nauczyciel";
      case 2: return "Rodzic";
      case 0: return "Uczeń";
      default: return "Nieznana rola";
    }
  }

  if (loading) return <div className="p-4 text-gray-500">Ładowanie...</div>;

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full w-80 flex-shrink-0">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
        <h3 className="font-semibold text-gray-800 text-lg">Użytkownicy</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.map((u) => {
          const isSelected = selectedUserId === u.id;
          return (
            <div
              key={u.id}
              onClick={() => onSelect(u.id)}
              className={`p-4 cursor-pointer border-b border-gray-100 flex flex-col transition-colors hover:bg-gray-50 ${
                isSelected 
                  ? "bg-blue-50 border-blue-200" 
                  : "hover:bg-gray-50"
              }`}
            >
              <div className={`font-medium ${isSelected ? "text-blue-800" : "text-gray-900"}`}>
                {u.imie} {u.nazwisko}
              </div>
              <div className="text-sm text-gray-500">{roleConvert(u.rola)}</div>
              {isSelected && (
                <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full self-end animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
