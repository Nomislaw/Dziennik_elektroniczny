import { Navigate } from "react-router-dom";
import React from "react";



export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactElement;

  allowedRoles: string[];
}) {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" />;

  const user = JSON.parse(userData);
  console.log("USER FROM LOCALSTORAGE:", user);
console.log("ROLA:", user.rola);
console.log("allowedRoles:", allowedRoles);


  if (!allowedRoles.includes(user.rola)) {
    // jeżeli ma rolę ucznia → do panelu ucznia
    if (user.rola === "Uczen") return <Navigate to="/dashboard" />;

    // jeżeli admin → do admina
    if (user.rola === "Administrator") return <Navigate to="/admin" />;

    return <Navigate to="/login" />;
  }

  return children;
}


