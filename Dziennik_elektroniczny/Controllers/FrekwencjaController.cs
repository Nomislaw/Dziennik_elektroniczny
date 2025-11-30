using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.DTOs;
using Dziennik_elektroniczny.DTOs.FrekwencjaDto;
using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Wymaga autoryzacji dla wszystkich endpointów
    public class FrekwencjaController : ControllerBase
    {
        private readonly IGenericRepository<Frekwencja> _frekwencjaRepository;
        private readonly IUzytkownikService _uzytkownikRepository;
        private readonly IGenericRepository<Zajecia> _zajeciaRepository;

        public FrekwencjaController(
            IGenericRepository<Frekwencja> frekwencjaRepository,
            IUzytkownikService uzytkownikService,
            IGenericRepository<Zajecia> zajeciaRepository)
        {
            _frekwencjaRepository = frekwencjaRepository;
            _uzytkownikRepository = uzytkownikService;
            _zajeciaRepository = zajeciaRepository;
        }

        // GET: api/Frekwencja
        [HttpGet]
        [Authorize(Roles = "Admin,Nauczyciel")]
        public async Task<ActionResult<IEnumerable<FrekwencjaDto>>> GetFrekwencje()
        {
            try
            {
                var fr = await _frekwencjaRepository.GetAllWithIncludesAsync(
                    "Uczen",
                    "Zajecia.Przedmiot",
                    "Zajecia.Nauczyciel",
                    "Zajecia.Sala"
                );

                var dto = fr.Select(f => new FrekwencjaDto
                {
                    Id = f.Id,
                    Data = f.Data,
                    Status = f.Status,

                    UczenId = f.UczenId,
                    UczenImieNazwisko = $"{f.Uczen.Imie} {f.Uczen.Nazwisko}",

                    ZajeciaId = f.ZajeciaId,
                    PrzedmiotNazwa = f.Zajecia.Przedmiot.Nazwa,
                    NauczycielImieNazwisko = $"{f.Zajecia.Nauczyciel.Imie} {f.Zajecia.Nauczyciel.Nazwisko}",
                    SalaNazwa = f.Zajecia.Sala.Numer
                });

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd: {ex.Message}");
            }
        }

        // GET: api/Frekwencja/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Nauczyciel,Uczen,Rodzic")]
        public async Task<ActionResult<FrekwencjaDto>> GetFrekwencja(int id)
        {
            var f = await _frekwencjaRepository.GetByIdWithIncludesAsync(
                id,
                "Uczen",
                "Zajecia.Przedmiot",
                "Zajecia.Nauczyciel",
                "Zajecia.Sala"
            );

            if (f == null)
                return NotFound();

            var dto = new FrekwencjaDto
            {
                Id = f.Id,
                Data = f.Data,
                Status = f.Status,

                UczenId = f.UczenId,
                UczenImieNazwisko = $"{f.Uczen.Imie} {f.Uczen.Nazwisko}",

                ZajeciaId = f.ZajeciaId,
                PrzedmiotNazwa = f.Zajecia.Przedmiot.Nazwa,
                NauczycielImieNazwisko = $"{f.Zajecia.Nauczyciel.Imie} {f.Zajecia.Nauczyciel.Nazwisko}",
                SalaNazwa = f.Zajecia.Sala.Numer
            };

            return Ok(dto);
        }

        // ✅ NOWY ENDPOINT - GET: api/Frekwencja/filtrowana?zajeciaId={id}&data={date}
        // Pobiera frekwencję dla konkretnych zajęć w danym dniu
        [HttpGet("filtrowana")]
        [Authorize(Roles = "Admin,Nauczyciel")]
        public async Task<ActionResult<IEnumerable<FrekwencjaDetailsDto>>> GetFrekwencjaFiltrowana(
            [FromQuery] int zajeciaId,
            [FromQuery] string data)
        {
            try
            {
                if (!DateTime.TryParse(data, out DateTime parsedDate))
                {
                    return BadRequest("Nieprawidłowy format daty");
                }

                var frekwencje = await _frekwencjaRepository.GetAllAsync();

                var filtered = frekwencje
                    .Where(f => f.ZajeciaId == zajeciaId && f.Data.Date == parsedDate.Date)
                    .Select(f => new FrekwencjaDetailsDto
                    {
                        Id = f.Id,
                        Data = f.Data,
                        Status = f.Status,
                        UczenId = f.UczenId,
                        ZajeciaId = f.ZajeciaId
                    })
                    .ToList();

                return Ok(filtered);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd: {ex.Message}");
            }
        }

        // PATCH: api/Frekwencja/{id}
        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin,Nauczyciel")]
        public async Task<IActionResult> PatchFrekwencja(int id,[FromBody] FrekwencjaUpdateDto dto)
        {
            var f = await _frekwencjaRepository.GetByIdAsync(id);
            if (f == null)
                return NotFound();

            if (dto.Data.HasValue)
                f.Data = dto.Data.Value;

            if (dto.Status.HasValue)
                f.Status = dto.Status.Value;

            if (dto.UczenId.HasValue)
            {
                var uczen = await _uzytkownikRepository.GetByIdAsync(dto.UczenId.Value);
                if (uczen == null || uczen.Rola != Rola.Uczen)
                    return BadRequest("Podany użytkownik nie jest uczniem.");

                f.UczenId = dto.UczenId.Value;
            }

            if (dto.ZajeciaId.HasValue)
            {
                var zajecia = await _zajeciaRepository.GetByIdAsync(dto.ZajeciaId.Value);
                if (zajecia == null)
                    return BadRequest("Podane zajęcia nie istnieją.");

                f.ZajeciaId = dto.ZajeciaId.Value;
            }

            _frekwencjaRepository.Update(f);
            await _frekwencjaRepository.SaveChangesAsync();

            return Ok(new { message = "Zaktualizowano frekwencję." });
        }

        // POST: api/Frekwencja
        [HttpPost]
        [Authorize(Roles = "Admin,Nauczyciel")]
        public async Task<ActionResult<FrekwencjaDto>> PostFrekwencja([FromBody]  FrekwencjaCreateDto dto)
        {
            var uczen = await _uzytkownikRepository.GetByIdAsync(dto.UczenId);
            if (uczen == null || uczen.Rola != Rola.Uczen)
                return BadRequest("Podany użytkownik nie jest uczniem.");

            var zajecia = await _zajeciaRepository.GetByIdAsync(dto.ZajeciaId);
            if (zajecia == null)
                return BadRequest("Podane zajęcia nie istnieją.");

            var f = new Frekwencja
            {
                Data = dto.Data,
                Status = dto.Status,
                UczenId = dto.UczenId,
                ZajeciaId = dto.ZajeciaId
            };

            _frekwencjaRepository.Add(f);
            await _frekwencjaRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFrekwencja), new { id = f.Id }, f);
        }

        // DELETE: api/Frekwencja/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Nauczyciel")]
        public async Task<IActionResult> DeleteFrekwencja(int id)
        {
            var frekwencja = await _frekwencjaRepository.GetByIdAsync(id);
            if (frekwencja == null)
                return NotFound(new ErrorResponse { Errors = new List<string> { "Nie znaleziono frekwencji." } });

            _frekwencjaRepository.Delete(frekwencja);
            var result = await _frekwencjaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć rekordu.");

            return Ok(new { message = "Usunięto frekwencję pomyślnie" });
        }
    }
}