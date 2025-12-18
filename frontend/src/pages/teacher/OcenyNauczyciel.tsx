import { useEffect, useState, useCallback } from "react";
import { Uzytkownik } from "../../types/Uzytkownik";
import { OcenaCreateDto } from "../../types/Ocena";
import { TypOceny } from "../../types/TypOceny";
import { pobierzUczniow } from "../../api/UzytkownikService";
import { addOcena, pobierzOcenyUczenPrzedmiot, edytujOcene, usunOcene } from "../../api/OcenyService";
import { pobierzPrzedmiotyNauczyciela } from "../../api/PrzedmiotService";
import { pobierzKlasaNauczyciela } from "../../api/KlasaService";

interface RodzicSimpleDto {
  id: number;
  imie: string;
  nazwisko: string;
}

interface UczenDto {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  klasaNazwa: string;
  klasaId: number;
  czyEmailPotwierdzony: boolean;
  rodzice: RodzicSimpleDto[];
}

interface PrzedmiotDto {
  id: number;
  nazwa: string;
}

interface KlasaDto {
  id: number;
  nazwa: string;
}

interface OcenaDraft {
  wartosc: number;
  typ: TypOceny;
  opis: string;
}

interface OcenaDoEdycji extends OcenaDraft {
  id: number;
  DataWystawienia?: string;
  UczenId: number;
  NauczycielId?: number;
  PrzedmiotId?: number;
}

interface OcenyNauczycielProps {
  nauczyciel: Uzytkownik;
}

interface ModalState {
  isOpen: boolean;
  uczenId?: number;
  ocenaId?: number;
  isEdit?: boolean;
}

export default function OcenyNauczyciel({ nauczyciel }: OcenyNauczycielProps) {
  const [uczniowie, setUczniowie] = useState<UczenDto[]>([]);
  const [przedmioty, setPrzedmioty] = useState<PrzedmiotDto[]>([]);
  const [klasy, setKlasy] = useState<KlasaDto[]>([]);
  const [wybranyPrzedmiot, setWybranyPrzedmiot] = useState<number | null>(null);
  const [wybranaKlasa, setWybranaKlasa] = useState<number | null>(null);
  const [ocenyDraft, setOcenyDraft] = useState<Record<number, OcenaDraft>>({});
  const [ocenyUcznia, setOcenyUcznia] = useState<Record<number, OcenaDoEdycji[]>>({});
  const [loading, setLoading] = useState(false);
  
  const [modal, setModal] = useState<ModalState>({ isOpen: false });
  const [tempOcena, setTempOcena] = useState<OcenaDraft>({ wartosc: 0, typ: TypOceny.INNE, opis: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [uczniowieData, przedmiotyData, klasyData] = await Promise.all([
          pobierzUczniow(),
          pobierzPrzedmiotyNauczyciela(nauczyciel.id),
          pobierzKlasaNauczyciela(nauczyciel.id)
        ]);
        setUczniowie(uczniowieData);
        setPrzedmioty(przedmiotyData);
        setKlasy(klasyData);
      } catch (err) {
        console.error('Błąd pobierania danych:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [nauczyciel.id]);

  const uczniowieFiltrowani = wybranaKlasa 
    ? uczniowie.filter(u => u.klasaId === wybranaKlasa)
    : [];

  useEffect(() => {
    if (uczniowieFiltrowani.length > 0) {
      const drafts: Record<number, OcenaDraft> = {};
      uczniowieFiltrowani.forEach((u) => {
        drafts[u.id] = { wartosc: 0, typ: TypOceny.INNE, opis: "" };
      });
      setOcenyDraft(drafts);
    }
  }, [uczniowieFiltrowani.length]);

  useEffect(() => {
    const odswiezWszystkieOceny = async () => {
      if (!wybranaKlasa || !wybranyPrzedmiot || uczniowieFiltrowani.length === 0) return;
      
      try {
        const ocenyPromises = uczniowieFiltrowani.map(u => 
          pobierzOcenyUczenPrzedmiot(u.id, wybranyPrzedmiot)
            .then(oceny => ({ uczenId: u.id, oceny: oceny as OcenaDoEdycji[] }))
            .catch(() => ({ uczenId: u.id, oceny: [] }))
        );
        
        const wyniki = await Promise.all(ocenyPromises);
        const nowyStan: Record<number, OcenaDoEdycji[]> = {};
        wyniki.forEach(({ uczenId, oceny }) => {
          nowyStan[uczenId] = oceny;
        });
        setOcenyUcznia(nowyStan);
      } catch (err) {
        console.error('Błąd pobierania ocen:', err);
      }
    };
    
    odswiezWszystkieOceny();
  }, [wybranaKlasa, wybranyPrzedmiot, uczniowieFiltrowani]);

  const odswiezOceny = useCallback(async (uczenId: number) => {
    if (!wybranyPrzedmiot) return;
    try {
      const ocenyDlaUcznia = await pobierzOcenyUczenPrzedmiot(uczenId, wybranyPrzedmiot);
      setOcenyUcznia((prev) => ({ ...prev, [uczenId]: ocenyDlaUcznia as OcenaDoEdycji[] }));
    } catch (err) {
      console.error('Błąd odświeżania ocen:', err);
    }
  }, [wybranyPrzedmiot]);

  const openDodajModal = (uczenId: number) => {
    const draft = ocenyDraft[uczenId];
    setTempOcena(draft || { wartosc: 0, typ: TypOceny.INNE, opis: "" });
    setModal({ isOpen: true, uczenId });
  };

  const openEdytujModal = (uczenId: number, ocena: OcenaDoEdycji) => {
    setTempOcena({ wartosc: ocena.wartosc, typ: ocena.typ, opis: ocena.opis });
    setModal({ isOpen: true, uczenId, ocenaId: ocena.id, isEdit: true });
  };

  const handleUsunOcene = async (ocenaId: number, uczenId: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę ocenę?")) return;
    
    setLoading(true);
    try {
      await usunOcene(ocenaId);
      await odswiezOceny(uczenId);
    } catch (err) {
      console.error(err);
      alert("Błąd usuwania oceny");
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async () => {
    if (tempOcena.wartosc === 0) {
      alert("Wybierz ocenę z listy (1-6)");
      return;
    }

    setLoading(true);
    try {
      if (modal.isEdit && modal.ocenaId) {
        await edytujOcene(modal.ocenaId, tempOcena);
      } else if (modal.uczenId) {
        await addOcena({
          DataWystawienia: new Date().toISOString(),
          Wartosc: tempOcena.wartosc,
          Typ: tempOcena.typ,
          Opis: tempOcena.opis,
          UczenId: modal.uczenId,
          NauczycielId: nauczyciel.id,
          PrzedmiotId: wybranyPrzedmiot!,
        });
      }
      
      await odswiezOceny(modal.uczenId!);
      zamknijModal();
    } catch (err) {
      console.error(err);
      alert("Błąd operacji");
    } finally {
      setLoading(false);
    }
  };

  const zamknijModal = () => {
    setModal({ isOpen: false });
    setTempOcena({ wartosc: 0, typ: TypOceny.INNE, opis: "" });
  };

  const saWybraneFiltry = wybranyPrzedmiot !== null && wybranaKlasa !== null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Panel zarządzania ocenami</h2>

      {/* FILTRY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Przedmiot</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={wybranyPrzedmiot ?? ""}
            onChange={(e) => setWybranyPrzedmiot(Number(e.target.value))}
            disabled={loading}
          >
            <option value="">Wybierz przedmiot</option>
            {przedmioty.map((p) => (
              <option key={p.id} value={p.id}>{p.nazwa}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Klasa</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={wybranaKlasa ?? ""}
            onChange={(e) => setWybranaKlasa(Number(e.target.value))}
            disabled={loading}
          >
            <option value="">Wybierz klasę</option>
            {klasy.map((k) => (
              <option key={k.id} value={k.id}>{k.nazwa}</option>
            ))}
          </select>
        </div>
      </div>

      {/* INFO */}
      {saWybraneFiltry && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
          <p className="text-sm text-blue-800">
            Wybrano: <span className="font-medium">{przedmioty.find(p => p.id === wybranyPrzedmiot)?.nazwa} </span> 
            dla klasy <span className="font-medium">{klasy.find(k => k.id === wybranaKlasa)?.nazwa} </span> 
            ({uczniowieFiltrowani.length} uczniów)
          </p>
        </div>
      )}

      {/* TABELA */}
      {saWybraneFiltry && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Oceny uczniów ({uczniowieFiltrowani.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 w-72">Uczeń</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Oceny</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 w-24">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uczniowieFiltrowani.map((u) => {
                  const oceny = ocenyUcznia[u.id] ?? [];
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-sm text-gray-900">{u.imie} {u.nazwisko}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                        <div className="text-xs text-gray-400 mt-1">Oceny: {oceny.length}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="max-h-32 overflow-y-auto space-y-2">
                          {oceny.length === 0 ? (
                            <div className="text-sm text-gray-500 italic">Brak ocen</div>
                          ) : (
                            oceny.map((o) => (
                              <div key={o.id} className="flex items-start gap-2 p-2.5 bg-gray-50 rounded border hover:bg-gray-100 transition-colors">
                                <span className="text-lg font-semibold text-gray-900 flex-shrink-0 min-w-[1.5rem]">{o.wartosc}</span>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{o.opis || "—"}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {Object.keys(TypOceny).find(k => TypOceny[k as keyof typeof TypOceny] === o.typ)}
                                    {o.DataWystawienia && ` • ${new Date(o.DataWystawienia).toLocaleDateString('pl-PL')}`}
                                  </div>
                                </div>

                                <div className="flex gap-1 flex-shrink-0 ml-2">
                                  <button
                                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                                    onClick={() => openEdytujModal(u.id, o)}
                                    disabled={loading}
                                    title="Edytuj"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                    onClick={() => handleUsunOcene(o.id, u.id)}
                                    disabled={loading}
                                    title="Usuń"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                          onClick={() => openDodajModal(u.id)}
                          disabled={loading}
                        >
                          Dodaj
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {modal.isEdit ? "Edytuj ocenę" : "Dodaj ocenę"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ocena</label>
                <select
                  value={tempOcena.wartosc}
                  onChange={(e) => setTempOcena({...tempOcena, wartosc: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl font-semibold text-center"
                  disabled={loading}
                >
                  <option value={0} disabled>Wybierz</option>
                  {[1,2,3,4,5,6].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Typ</label>
                <select
                  value={tempOcena.typ}
                  onChange={(e) => setTempOcena({...tempOcena, typ: Number(e.target.value) as TypOceny})}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {Object.keys(TypOceny)
                    .filter((k) => isNaN(Number(k)))
                    .map((k) => (
                      <option key={k} value={TypOceny[k as any]}>
                        {k}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
                <input
                  type="text"
                  value={tempOcena.opis}
                  onChange={(e) => setTempOcena({...tempOcena, opis: e.target.value})}
                  placeholder="Wpisz opis..."
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
              <button
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                onClick={zamknijModal}
                disabled={loading}
              >
                Anuluj
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                onClick={handleModalSubmit}
                disabled={loading || tempOcena.wartosc === 0}
              >
                {loading ? "Zapisywanie..." : (modal.isEdit ? "Zapisz" : "Dodaj")}
              </button>
            </div>
          </div>
        </div>
      )}

      {!saWybraneFiltry && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4 text-gray-400">📋</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">Wybierz przedmiot i klasę</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Aby zobaczyć oceny uczniów, wybierz przedmiot i klasę z filtrów powyżej.
          </p>
        </div>
      )}
    </div>
  );
}
