import { useState } from "react";
import { Chat } from "../ChatPage/Chat";
import { UsersList } from "../ChatPage/UsersList";

export function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const token = localStorage.getItem("token")!;
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <UsersList onSelect={setSelectedUserId} selectedUserId={selectedUserId} />
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <Chat rozmowcaId={selectedUserId} token={token} currentUserId={userId!} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Wybierz rozmówcę
          </div>
        )}
      </div>
    </div>
  );
}
