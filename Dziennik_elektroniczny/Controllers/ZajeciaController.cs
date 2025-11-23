using Dziennik_elektroniczny.DTOs.ZajeciaDto;
using Dziennik_elektroniczny.Interfaces; // ZMIANA: Nowy using
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
// using Dziennik_elektroniczny.Data; // ZMIANA: Usunięte
// using Microsoft.EntityFrameworkCore; // ZMIANA: Usunięte
using System.Collections.Generic; // Dodane dla IEnumerable
using System.Threading.Tasks; // Dodane dla Task

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZajeciaController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Zajecia>
        private readonly IGenericRepository<Zajecia> _zajeciaRepository;
        private readonly IUzytkownikService _uzytkownikRepository;

        public ZajeciaController(IGenericRepository<Zajecia> zajeciaRepository, IUzytkownikService uzytkownikRepository) // ZMIANA
        {
            _zajeciaRepository = zajeciaRepository;
            _uzytkownikRepository = uzytkownikRepository;
        }

        // GET: api/Zajecia
        [HttpGet]
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

        // Patch: api/Zajecia/5
        [HttpPatch("{id}")]
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

            return Ok(new { message = "Zaktualizowano zajecia" });
        }

        // POST: api/Zajecia
        [HttpPost]
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
        public async Task<IActionResult> DeleteZajecia(int id)
        {
            // ZMIANA: Logika usuwania jak w ZadanieController
            var zajecia = await _zajeciaRepository.GetByIdAsync(id);
            if (zajecia == null)
            {
                return NotFound();
            }

            _zajeciaRepository.Delete(zajecia);
            var result = await _zajeciaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć zajęć.");

            return Ok(new { message = "Usunieto zajecie" });
        }
    }
}