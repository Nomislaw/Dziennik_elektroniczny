// pages/rodzic/Home.tsx
import { RodzicDto } from "../../layouts/ParentPanel";

interface HomeProps {
  rodzic: RodzicDto;
}

export default function HomeParent({ rodzic }: HomeProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Witaj {rodzic.imie} {rodzic.nazwisko}!
        </h1>
        <p className="text-lg text-gray-700">
          W panelu rodzica możesz sprawdzić informacje o swoich dzieciach:
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Co możesz zobaczyć:</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Plan lekcji wybranego dziecka</li>
          <li>• Aktualne oceny i średnie</li>
          <li>• Statystyki frekwencji</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          Wybierz dziecko z menu po lewej stronie i przejdź do odpowiedniej zakładki.
        </p>
      </div>
    </div>
  );
}
