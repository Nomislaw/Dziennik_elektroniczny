using Dziennik_elektroniczny.DTOs.OcenyDto;
using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcenyController : ControllerBase
    {
        private readonly IGenericRepository<Ocena> _ocenaRepository;
        private readonly IUzytkownikService _uzytkownikRepository;
        private readonly IGenericRepository<Przedmiot> _przedmiotRepository;

        public OcenyController(IGenericRepository<Ocena> ocenaRepository, IUzytkownikService uzytkownikRepository, IGenericRepository<Przedmiot> przedmiotRepository)
        {
            _ocenaRepository = ocenaRepository;
            _uzytkownikRepository = uzytkownikRepository;
            _przedmiotRepository = przedmiotRepository;
        }

        // GET: api/Oceny
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OcenaDto>>> GetOceny()
        {
            var oceny = await _ocenaRepository.GetAllWithIncludesAsync(
                "Uczen",
                "Nauczyciel",
                "Przedmiot"
            );

            var dto = oceny.Select(o => new OcenaDto
            {
                Id = o.Id,
                DataWystawienia = o.DataWystawienia,
                Opis = o.Opis,
                Wartosc = o.Wartosc,
                Typ = o.Typ,

                UczenId = o.UczenId,
                UczenImieNazwisko = $"{o.Uczen.Imie} {o.Uczen.Nazwisko}",

                NauczycielId = o.NauczycielId,
                NauczycielImieNazwisko = $"{o.Nauczyciel.Imie} {o.Nauczyciel.Nazwisko}",

                PrzedmiotId = o.PrzedmiotId,
                PrzedmiotNazwa = o.Przedmiot.Nazwa
            });

            return Ok(dto);
        }

        // GET: api/Oceny/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OcenaDto>> GetOcena(int id)
        {
            var o = await _ocenaRepository.GetByIdWithIncludesAsync(
                id,
                "Uczen",
                "Nauczyciel",
                "Przedmiot"
            );

            if (o == null)
                return NotFound();

            var dto = new OcenaDto
            {
                Id = o.Id,
                DataWystawienia = o.DataWystawienia,
                Opis = o.Opis,
                Wartosc = o.Wartosc,
                Typ = o.Typ,

                UczenId = o.UczenId,
                UczenImieNazwisko = $"{o.Uczen.Imie} {o.Uczen.Nazwisko}",

                NauczycielId = o.NauczycielId,
                NauczycielImieNazwisko = $"{o.Nauczyciel.Imie} {o.Nauczyciel.Nazwisko}",

                PrzedmiotId = o.PrzedmiotId,
                PrzedmiotNazwa = o.Przedmiot.Nazwa
            };

            return Ok(dto);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchOcena(int id, OcenaUpdateDto dto)
        {
            var ocena = await _ocenaRepository.GetByIdAsync(id);
            if (ocena == null)
                return NotFound();

            if (dto.DataWystawienia.HasValue)
                ocena.DataWystawienia = dto.DataWystawienia.Value;

            if (dto.Opis != null)
                ocena.Opis = dto.Opis;

            if (dto.Wartosc.HasValue)
                ocena.Wartosc = dto.Wartosc.Value;

            if (dto.Typ.HasValue)
                ocena.Typ = dto.Typ.Value;

            if (dto.UczenId.HasValue)
            {
                var uczen = await _uzytkownikRepository.GetByIdAsync(dto.UczenId.Value);
                if (uczen == null || uczen.Rola != Rola.Uczen)
                    return BadRequest("Podany uczeń nie istnieje lub nie jest uczniem.");

                ocena.UczenId = dto.UczenId.Value;
            }

            if (dto.NauczycielId.HasValue)
            {
                var nauczyciel = await _uzytkownikRepository.GetByIdAsync(dto.NauczycielId.Value);
                if (nauczyciel == null || nauczyciel.Rola != Rola.Nauczyciel)
                    return BadRequest("Podany nauczyciel nie istnieje lub nie jest nauczycielem.");

                ocena.NauczycielId = dto.NauczycielId.Value;
            }

            if (dto.PrzedmiotId.HasValue)
            {
                var przedmiot = await _przedmiotRepository.GetByIdAsync(dto.PrzedmiotId.Value);
                if (przedmiot == null)
                    return BadRequest("Podany przedmiot nie istnieje.");

                ocena.PrzedmiotId = dto.PrzedmiotId.Value;
            }

            _ocenaRepository.Update(ocena);
            await _ocenaRepository.SaveChangesAsync();

            return Ok(new { message = "zmodyfikowano" });
        }

        // POST: api/Oceny
        [HttpPost]
        public async Task<ActionResult<OcenaCreateDto>> PostOcena(OcenaCreateDto dto)
        {
            var uczen = await _uzytkownikRepository.GetByIdAsync(dto.UczenId);
            if (uczen == null || uczen.Rola != Rola.Uczen)
                return BadRequest("Podany uczeń nie istnieje lub nie jest uczniem.");

            var nauczyciel = await _uzytkownikRepository.GetByIdAsync(dto.NauczycielId);
            if (nauczyciel == null || nauczyciel.Rola != Rola.Nauczyciel)
                return BadRequest("Podany nauczyciel nie istnieje lub nie jest nauczycielem.");

            var przedmiot = await _przedmiotRepository.GetByIdAsync(dto.PrzedmiotId);
            if (przedmiot == null)
                return BadRequest("Podany przedmiot nie istnieje.");

            var ocena = new Ocena
            {
                DataWystawienia = dto.DataWystawienia,
                Opis = dto.Opis,
                Wartosc = dto.Wartosc,
                Typ = dto.Typ,
                UczenId = dto.UczenId,
                NauczycielId = dto.NauczycielId,
                PrzedmiotId = dto.PrzedmiotId
            };

            _ocenaRepository.Add(ocena);
            await _ocenaRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOcena), new { id = ocena.Id }, ocena);
        }

        // DELETE: api/Oceny/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOcena(int id)
        {
            var ocena = await _ocenaRepository.GetByIdAsync(id);
            if (ocena == null)
                return NotFound();

            _ocenaRepository.Delete(ocena);
            var result = await _ocenaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć oceny.");

            return Ok(new { message = "Usunieto" });
        }
    }
}
