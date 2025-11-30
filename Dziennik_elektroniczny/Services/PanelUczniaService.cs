using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.DTOs.UczenDto;
using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;
using Microsoft.EntityFrameworkCore;
namespace Dziennik_elektroniczny.Services
{
    public class PanelUczniaService : IPanelUczniaService
    {
        private readonly AppDbContext _context;

        public PanelUczniaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<OcenyUczniaResponseDto> GetOcenyAsync(int uczenId)
        {
            var oceny = await _context.Oceny
                .Include(o => o.Przedmiot)
                .Include(o => o.Nauczyciel)
                .Where(o => o.UczenId == uczenId)
                .OrderByDescending(o => o.DataWystawienia)
                .Select(o => new OcenaUczenDto
                {
                    Id = o.Id,
                    PrzedmiotNazwa = o.Przedmiot.Nazwa,
                    Wartosc = o.Wartosc,
                    TypOceny = o.Typ.ToString(),
                    Opis = o.Opis,
                    DataWystawienia = o.DataWystawienia,
                    Nauczyciel = $"{o.Nauczyciel.Imie} {o.Nauczyciel.Nazwisko}"
                })
                .ToListAsync();

            
            var ocenyPoPrzedmiotach = oceny
                .GroupBy(o => o.PrzedmiotNazwa)
                .Select(group => new OcenyPoPrzedmiotachDto
                {
                    PrzedmiotNazwa = group.Key,
                    Oceny = group.ToList(),
                    SredniaArytmetyczna = group.Any() ? (float)Math.Round(group.Average(o => o.Wartosc), 2) : 0
                })
                .ToList();

            var sredniaOgolna = ocenyPoPrzedmiotach.Any()
                ? (float)Math.Round(ocenyPoPrzedmiotach.Average(p => p.SredniaArytmetyczna), 2)
                : 0;

            return new OcenyUczniaResponseDto
            {
                OcenyPoPrzedmiotach = ocenyPoPrzedmiotach,
                SredniaOgolna = sredniaOgolna
            };
        }

        public async Task<PlanLekcjiResponseDto> GetPlanLekcjiAsync(int uczenId)
        {
            var uczen = await _context.Uzytkownicy
                .Include(u => u.Klasa)
                    .ThenInclude(k => k.Plan)
                        .ThenInclude(p => p.Zajecia)
                            .ThenInclude(z => z.Przedmiot)
                .Include(u => u.Klasa)
                    .ThenInclude(k => k.Plan)
                        .ThenInclude(p => p.Zajecia)
                            .ThenInclude(z => z.Nauczyciel)
                //.Include(u => u.Klasa)
                //    .ThenInclude(k => k.Plan)
                //        .ThenInclude(p => p.Zajecia)
                //            .ThenInclude(z => z.Sala)
                .FirstOrDefaultAsync(u => u.Id == uczenId && u.Rola == Rola.Uczen);

            if (uczen?.Klasa?.Plan == null)
            {
                return new PlanLekcjiResponseDto
                {
                    Zajecia = new List<ZajeciaUczniaDto>(),
                    KlasaNazwa = uczen?.Klasa?.Nazwa
                };
            }

            var zajecia = uczen.Klasa.Plan.Zajecia
                .Select(z => new ZajeciaUczniaDto
                {
                    Id = z.Id,
                    PrzedmiotNazwa = z.Przedmiot.Nazwa,
                    GodzinaRozpoczecia = z.GodzinaRozpoczecia,
                    GodzinaZakonczenia = z.GodzinaZakonczenia,
                    NauczycielImieNazwisko = $"{z.Nauczyciel.Imie} {z.Nauczyciel.Nazwisko}",
                    SalaNumer = "Brak"
                })
                .OrderBy(z => z.GodzinaRozpoczecia)
                .ToList();

            return new PlanLekcjiResponseDto
            {
                Zajecia = zajecia,
                KlasaNazwa = uczen.Klasa.Nazwa
            };
        }

        public async Task<FrekwencjaUczniaResponseDto> GetFrekwencjaAsync(int uczenId, DateTime? dataOd = null, DateTime? dataDo = null)
        {
            
            var start = dataOd ?? new DateTime(
                DateTime.Today.Month >= 9 ? DateTime.Today.Year : DateTime.Today.Year - 1,
                9,
                1
            );
            var end = dataDo ?? DateTime.Today;

            var frekwencje = await _context.Frekwencje
                .Include(f => f.Zajecia)
                    .ThenInclude(z => z.Przedmiot)
                .Where(f => f.UczenId == uczenId
                         && f.Data >= start
                         && f.Data <= end)
                .OrderByDescending(f => f.Data)
                .Select(f => new FrekwencjaUczniaDto
                {
                    Id = f.Id,
                    PrzedmiotNazwa = f.Zajecia.Przedmiot.Nazwa,
                    Data = f.Data,
                    Status = f.Status.ToString(),
                    GodzinaRozpoczecia = f.Zajecia.GodzinaRozpoczecia,
                    GodzinaZakonczenia = f.Zajecia.GodzinaZakonczenia
                })
                .ToListAsync();

            // Obliczanie statystyk
            var statystyki = new StatystykiFrekwencjiDto
            {
                LiczbaOgolem = frekwencje.Count,
                LiczbaObecnosci = frekwencje.Count(f => f.Status == Status.OBECNY.ToString()),
                LiczbaNieobecnosci = frekwencje.Count(f => f.Status == Status.NIEOBECNY.ToString()),
                LiczbaSpoznien = frekwencje.Count(f => f.Status == Status.SPOZNIONY.ToString()),
                LiczbaUsprawiedliwionych = frekwencje.Count(f => f.Status == Status.USPRAWIEDLIWIONY.ToString())
            };

            statystyki.ProcentObecnosci = statystyki.LiczbaOgolem > 0
                ? Math.Round((double)statystyki.LiczbaObecnosci / statystyki.LiczbaOgolem * 100, 2)
                : 0;

            return new FrekwencjaUczniaResponseDto
            {
                Frekwencje = frekwencje,
                Statystyki = statystyki
            };
        }

        public async Task<PodsumowaniePaneluUczniaDto> GetPodsumowanieAsync(int uczenId)
        {
            var uczen = await _context.Uzytkownicy
                .Include(u => u.Klasa)
                    .ThenInclude(k => k.Plan)
                        .ThenInclude(p => p.Zajecia)
                            .ThenInclude(z => z.Przedmiot)
                .Include(u => u.Klasa)
                    .ThenInclude(k => k.Plan)
                        .ThenInclude(p => p.Zajecia)
                            .ThenInclude(z => z.Nauczyciel)
                .Include(u => u.Klasa)
                    .ThenInclude(k => k.Plan)
                        .ThenInclude(p => p.Zajecia)
                            .ThenInclude(z => z.Sala)
                .FirstOrDefaultAsync(u => u.Id == uczenId && u.Rola == Rola.Uczen);

            if (uczen == null)
                return null;

            
            var ostatnieOceny = await _context.Oceny
                .Include(o => o.Przedmiot)
                .Include(o => o.Nauczyciel)
                .Where(o => o.UczenId == uczenId)
                .OrderByDescending(o => o.DataWystawienia)
                .Take(5)
                .Select(o => new OcenaUczenDto
                {
                    Id = o.Id,
                    PrzedmiotNazwa = o.Przedmiot.Nazwa,
                    Wartosc = o.Wartosc,
                    TypOceny = o.Typ.ToString(),
                    Opis = o.Opis,
                    DataWystawienia = o.DataWystawienia,
                    Nauczyciel = $"{o.Nauczyciel.Imie} {o.Nauczyciel.Nazwisko}"
                })
                .ToListAsync();

            
            var planLekcji = new List<ZajeciaUczniaDto>();
            if (uczen.Klasa?.Plan?.Zajecia != null)
            {
                planLekcji = uczen.Klasa.Plan.Zajecia
                    .Select(z => new ZajeciaUczniaDto
                    {
                        Id = z.Id,
                        PrzedmiotNazwa = z.Przedmiot.Nazwa,
                        GodzinaRozpoczecia = z.GodzinaRozpoczecia,
                        GodzinaZakonczenia = z.GodzinaZakonczenia,
                        NauczycielImieNazwisko = $"{z.Nauczyciel.Imie} {z.Nauczyciel.Nazwisko}",
                        SalaNumer = z.Sala?.Numer ?? "Brak"
                    })
                    .OrderBy(z => z.GodzinaRozpoczecia)
                    .ToList();
            }

            
            var wszystkieOceny = await _context.Oceny
                .Where(o => o.UczenId == uczenId)
                .Select(o => o.Wartosc)
                .ToListAsync();

            var sredniaOcen = wszystkieOceny.Any()
                ? (float)Math.Round(wszystkieOceny.Average(), 2)
                : 0;

            
            var rokSzkolny = new DateTime(
                DateTime.Today.Month >= 9 ? DateTime.Today.Year : DateTime.Today.Year - 1,
                9,
                1
            );

            var frekwencje = await _context.Frekwencje
                .Where(f => f.UczenId == uczenId && f.Data >= rokSzkolny)
                .ToListAsync();

            var procentObecnosci = frekwencje.Any()
                ? Math.Round((double)frekwencje.Count(f => f.Status == Status.OBECNY) / frekwencje.Count * 100, 2)
                : 0;

            return new PodsumowaniePaneluUczniaDto
            {
                ImieNazwisko = $"{uczen.Imie} {uczen.Nazwisko}",
                KlasaNazwa = uczen.Klasa?.Nazwa,
                SredniaOcen = sredniaOcen,
                OstatnieOceny = ostatnieOceny,
                PlanLekcji = planLekcji,
                ProcentObecnosci = procentObecnosci
            };
        }
    }
}
