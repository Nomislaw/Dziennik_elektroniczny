using Dziennik_elektroniczny.DTOs.ZajeciaDto;
using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // ✅ Dodana autoryzacja dla wszystkich endpointów
    public class ZajeciaController : ControllerBase
    {
        private readonly IGenericRepository<Zajecia> _zajeciaRepository;
        private readonly IUzytkownikService _uzytkownikRepository;
        private readonly IGenericRepository<Plan> _planRepository;

        public ZajeciaController(
            IGenericRepository<Zajecia> zajeciaRepository,
            IUzytkownikService uzytkownikRepository,
            IGenericRepository<Plan> planRepository)
        {
            _zajeciaRepository = zajeciaRepository;
            _uzytkownikRepository = uzytkownikRepository;
            _planRepository = planRepository;
        }

        [HttpGet("nauczyciel/{nauczycielId}")]
        [Authorize(Roles = "Administrator,Nauczyciel")]
        public async Task<ActionResult<IEnumerable<ZajeciaDetailsDto>>> GetZajeciaNauczyciela(int nauczycielId)
        {
            try
            {
                var zajecia = await _zajeciaRepository.GetAllWithIncludesAsync(
                    "Przedmiot",
                    "Plan.Klasa",
                    "Sala"
                );

                var zajeciaNauczyciela = zajecia
                    .Where(z => z.NauczycielId == nauczycielId)
                    .OrderBy(z => z.Plan != null ? (int)z.Plan.DzienTygodnia : 7) // ✅ PRZED Select
                    .ThenBy(z => z.GodzinaRozpoczecia) // ✅ PRZED Select
                    .Select(z => new ZajeciaDetailsDto
                    {
                        Id = z.Id,
                        Przedmiot = z.Przedmiot != null ? z.Przedmiot.Nazwa : "Brak przedmiotu",
                        Grupa = z.Plan?.Klasa != null ? z.Plan.Klasa.Nazwa : "Brak klasy",
                        Godzina = $"{z.GodzinaRozpoczecia}-{z.GodzinaZakonczenia}",
                        Sala = z.Sala != null ? z.Sala.Numer : "Brak sali",
                        DzienTygodnia = z.Plan != null ? GetPolishDayName((DayOfWeek)z.Plan.DzienTygodnia) : "Nieznany"
                    })
                    .ToList();

                return Ok(zajeciaNauczyciela);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd: {ex.Message}");
            }
        }

        // ========== ENDPOINT 2: Uczniowie dla zajęć ==========
        [HttpGet("{zajeciaId}/uczniowie")]
        [Authorize(Roles = "Administrator,Nauczyciel")]
        public async Task<ActionResult<IEnumerable<UczenFrekwencjaDto>>> GetUczniowieDlaZajec(int zajeciaId)
        {
            try
            {
                var zajecia = await _zajeciaRepository.GetByIdWithIncludesAsync(
                    zajeciaId,
                    "Plan.Klasa"
                );

                if (zajecia == null)
                {
                    return NotFound("Nie znaleziono zajęć.");
                }

                if (zajecia.Plan?.Klasa == null)
                {
                    return BadRequest("Zajęcia nie mają przypisanej klasy.");
                }

                var uczniowie = await _uzytkownikRepository.GetAllAsync();

                var uczniowieWKlasie = uczniowie
                    .Where(u => u.Rola == Rola.Uczen && u.KlasaId == zajecia.Plan.Klasa.Id)
                    .Select(u => new UczenFrekwencjaDto
                    {
                        Id = u.Id,
                        Imie = u.Imie,
                        Nazwisko = u.Nazwisko,
                        Email = u.Email
                    })
                    .OrderBy(u => u.Nazwisko)
                    .ThenBy(u => u.Imie)
                    .ToList();

                return Ok(uczniowieWKlasie);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd: {ex.Message}");
            }
        }

        // ========== METODA POMOCNICZA: Polskie nazwy dni ==========
        private string GetPolishDayName(DayOfWeek dayOfWeek)
        {
            return dayOfWeek switch
            {
                DayOfWeek.Monday => "Poniedziałek",
                DayOfWeek.Tuesday => "Wtorek",
                DayOfWeek.Wednesday => "Środa",
                DayOfWeek.Thursday => "Czwartek",
                DayOfWeek.Friday => "Piątek",
                DayOfWeek.Saturday => "Sobota",
                DayOfWeek.Sunday => "Niedziela",
                _ => "Nieznany"
            };
        }

        // GET: api/Zajecia
        [HttpGet]
        [Authorize(Roles = "Administrator,Nauczyciel")]
        public async Task<ActionResult<IEnumerable<ZajeciaDto>>> GetZajecia()
        {
            var zajecia = await _zajeciaRepository.GetAllWithIncludesAsync(
               "Plan", "Przedmiot", "Nauczyciel", "Sala"
            );

            var dto = zajecia.Select(z => new ZajeciaDto
            {
                Id = z.Id,
                GodzinaRozpoczecia = z.GodzinaRozpoczecia,
                GodzinaZakonczenia = z.GodzinaZakonczenia,

                PlanId = z.PlanId,
                PlanNazwa = z.Plan?.Id.ToString(),

                PrzedmiotId = z.PrzedmiotId,
                PrzedmiotNazwa = z.Przedmiot?.Nazwa,

                NauczycielId = z.NauczycielId,
                NauczycielImieNazwisko = $"{z.Nauczyciel?.Imie} {z.Nauczyciel?.Nazwisko}",

                SalaId = z.SalaId,
                SalaNazwa = z.Sala?.Numer
            });

            return Ok(dto);
        }

        // GET: api/Zajecia/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator,Nauczyciel,Uczen")]
        public async Task<ActionResult<ZajeciaDto>> GetZajecia(int id)
        {
            var zajecia = await _zajeciaRepository.GetByIdWithIncludesAsync(
                id,
                "Plan",
                "Przedmiot",
                "Nauczyciel",
                "Sala"
            );

            if (zajecia == null)
                return NotFound();

            var dto = new ZajeciaDto
            {
                Id = zajecia.Id,
                GodzinaRozpoczecia = zajecia.GodzinaRozpoczecia,
                GodzinaZakonczenia = zajecia.GodzinaZakonczenia,

                PlanId = zajecia.PlanId,
                PlanNazwa = zajecia.Plan?.Id.ToString(),

                PrzedmiotId = zajecia.PrzedmiotId,
                PrzedmiotNazwa = zajecia.Przedmiot?.Nazwa,

                NauczycielId = zajecia.NauczycielId,
                NauczycielImieNazwisko = zajecia.Nauczyciel == null
                    ? null
                    : $"{zajecia.Nauczyciel.Imie} {zajecia.Nauczyciel.Nazwisko}",

                SalaId = zajecia.SalaId,
                SalaNazwa = zajecia.Sala?.Numer
            };

            return Ok(dto);
        }

        // PATCH: api/Zajecia/5
        [HttpPatch("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult> PatchZajecia(int id, ZajeciaUpdateDto dto)
        {
            var zajecia = await _zajeciaRepository.GetByIdAsync(id);
            if (zajecia == null)
                return NotFound();

            if (dto.GodzinaRozpoczecia != null)
                zajecia.GodzinaRozpoczecia = dto.GodzinaRozpoczecia;

            if (dto.GodzinaZakonczenia != null)
                zajecia.GodzinaZakonczenia = dto.GodzinaZakonczenia;

            if (dto.PlanId.HasValue)
                zajecia.PlanId = dto.PlanId.Value;

            if (dto.PrzedmiotId.HasValue)
                zajecia.PrzedmiotId = dto.PrzedmiotId.Value;

            if (dto.NauczycielId.HasValue)
            {
                var nauczyciel = await _uzytkownikRepository.GetByIdAsync(dto.NauczycielId.Value);

                if (nauczyciel == null)
                    return BadRequest("Podany nauczyciel nie istnieje.");

                if (nauczyciel.Rola != Rola.Nauczyciel)
                    return BadRequest("Wybrany użytkownik nie jest nauczycielem.");

                zajecia.NauczycielId = dto.NauczycielId.Value;
            }

            if (dto.SalaId.HasValue)
                zajecia.SalaId = dto.SalaId.Value;

            _zajeciaRepository.Update(zajecia);
            await _zajeciaRepository.SaveChangesAsync();

            return Ok(new { message = "Zaktualizowano zajęcia" });
        }

        // POST: api/Zajecia
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Zajecia>> PostZajecia(ZajeciaCreateDto dto)
        {
            var nauczyciel = await _uzytkownikRepository.GetByIdAsync(dto.NauczycielId);
            if (nauczyciel == null)
                return BadRequest("Podany nauczyciel nie istnieje.");

            if (nauczyciel.Rola != Rola.Nauczyciel)
                return BadRequest("Wybrany użytkownik nie jest nauczycielem");

            var zajecia = new Zajecia
            {
                GodzinaRozpoczecia = dto.GodzinaRozpoczecia,
                GodzinaZakonczenia = dto.GodzinaZakonczenia,
                PlanId = dto.PlanId,
                PrzedmiotId = dto.PrzedmiotId,
                NauczycielId = dto.NauczycielId,
                SalaId = dto.SalaId
            };

            _zajeciaRepository.Add(zajecia);
            await _zajeciaRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetZajecia), new { id = zajecia.Id }, zajecia);
        }

        // DELETE: api/Zajecia/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteZajecia(int id)
        {
            var zajecia = await _zajeciaRepository.GetByIdAsync(id);
            if (zajecia == null)
            {
                return NotFound();
            }

            _zajeciaRepository.Delete(zajecia);
            var result = await _zajeciaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć zajęć.");

            return Ok(new { message = "Usunięto zajęcia" });
        }
    }
}