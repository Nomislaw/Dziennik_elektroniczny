// layouts/Dashboard.tsx - Teraz tylko pusta skorupa, którą usuniemy w App.tsx

import { Outlet } from "react-router-dom";
//import { ReactNode } from "react";

// Dashboard w tej wersji nie jest już potrzebny,
// ponieważ logikę i UI ucznia przenosimy do StudentPanel.tsx.
// Dziecko może być renderowane bezpośrednio jako podstrony.

export default function Dashboard() {
  return (
    <div className="flex justify-center items-center h-screen bg-red-100">
      <h1 className="text-2xl font-bold text-red-700">
        Dashboard nie powinien być już używany! Sprawdź App.tsx.
      </h1>
      <Outlet />
    </div>
  );
}

// Jeśli chcesz po prostu go usunąć, zignoruj ten krok i przejdź do kroku 3.