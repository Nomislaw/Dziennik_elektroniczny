import { useState, useEffect } from "react";
import {
  pobierzPodsumowanieUcznia,
  OcenaUczenDto,
  ZajeciaUczniaDto,
} from "../../api/PanelUczniaService";

interface StudentHomeProps {
  uczenId: number;
}

interface PodsumowanieData {
  imieNazwisko: string;
  klasaNazwa: string;
  sredniaOcen: number;
  ostatnieOceny: OcenaUczenDto[];
  planLekcji: ZajeciaUczniaDto[];
  procentObecnosci: number;
}

export default function Home({ uczenId }: StudentHomeProps) {
  const [data, setData] = useState<PodsumowanieData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await pobierzPodsumowanieUcznia(uczenId);
        if (!result) {
          setError("Nie znaleziono danych ucznia");
        } else {
          setData(result);
        }
      } catch (err) {
        console.error(err);
        setError("Błąd podczas ładowania danych");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uczenId]);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-full bg-white rounded-xl shadow-lg p-8">
        <span className="text-xl text-gray-600">Ładowanie danych…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {error || "Brak danych"}
        </h2>
        <p className="text-gray-600">Spróbuj odświeżyć stronę.</p>
      </div>
    );
  }

  /* ================= VIEW ================= */

  return (
    <div className="flex flex-col min-h-full bg-white rounded-xl shadow-lg p-8">
      {/* Nagłówek */}
      <h2 className="text-4xl font-extrabold text-blue-800 mb-2">
        👋 Witaj, {data.imieNazwisko}
      </h2>
      <p className="text-gray-600 mb-8 text-xl">
        Klasa <strong className="text-blue-700">{data.klasaNazwa}</strong>
      </p>

      {/* Kafelki */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ŚREDNIA */}
        <StatCard
          title="📊 Średnia ocen"
          value={data.sredniaOcen.toFixed(2)}
          subtitle="Ze wszystkich ocen"
        />

        {/* FREKWENCJA */}
        <StatCard
          title="✅ Frekwencja"
          value={`${data.procentObecnosci.toFixed(2)}%`}
          subtitle="Od początku roku szkolnego"
        />

        {/* OCENY */}
        <StatCard
  title="📰 Ostatnie oceny"
  value={``}
  subtitle={
    data.ostatnieOceny.length > 0 ? (
      <ul className="text-sm mt-1 space-y-1">
        {data.ostatnieOceny.slice(0, 3).map(o => (
          <li key={o.id}>
            {o.przedmiotNazwa}: <strong>{o.wartosc}</strong>
          </li>
        ))}
      </ul>
    ) : (
      "Brak ocen"
    )
  }
/>


        {/* PLAN */}
        <StatCard
          title="📅 Dzisiejsze lekcje"
          value={`${data.planLekcji.length}`}
          subtitle={
            ''
          }
        />
      </div>

      {/* PLAN LEKCJI – LISTA */}
      {data.planLekcji.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            📅 Dzisiejszy plan lekcji
          </h3>

          <ul className="space-y-3">
            {data.planLekcji.map((z) => (
              <li
                key={z.id}
                className="flex justify-between items-center bg-gray-50 border rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {z.przedmiotNazwa}
                  </p>
                  <p className="text-sm text-gray-600">
                    {z.godzinaRozpoczecia} – {z.godzinaZakonczenia} • {z.nauczycielImieNazwisko}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Sala {z.salaNumer}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENT ================= */

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
   subtitle?: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
