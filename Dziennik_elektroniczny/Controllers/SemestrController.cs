using Dziennik_elektroniczny.Interfaces; // ZMIANA: Nowy using
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore; // ZMIANA: Usunięte
// using Dziennik_elektroniczny.Data; // ZMIANA: Usunięte
using System.Collections.Generic; // Dodane dla IEnumerable
using System.Threading.Tasks; // Dodane dla Task

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SemestrController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Semestr>
        private readonly IGenericRepository<Semestr> _semestrRepository;

        public SemestrController(IGenericRepository<Semestr> semestrRepository) // ZMIANA
        {
            _semestrRepository = semestrRepository;
        }

        // GET: api/Semestry
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Semestr>>> GetSemestry()
        {
            // ZMIANA: Użycie repozytorium
            var semestry = await _semestrRepository.GetAllAsync();
            return Ok(semestry);
        }

        // GET: api/Semestry/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Semestr>> GetSemestr(int id)
        {
            // ZMIANA: Użycie repozytorium
            var semestr = await _semestrRepository.GetByIdAsync(id);

            if (semestr == null)
            {
                return NotFound();
            }

            return Ok(semestr); // ZMIANA: Dodano Ok() dla spójności
        }

        // PUT: api/Semestry/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSemestr(int id, Semestr semestr)
        {
            if (id != semestr.Id)
            {
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");
            }

            // ZMIANA: Logika aktualizacji jak w SaleController
            _semestrRepository.Update(semestr);

            var result = await _semestrRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return NoContent();
        }

        // POST: api/Semestry
        [HttpPost]
        public async Task<ActionResult<Semestr>> PostSemestr(Semestr semestr)
        {
            // ZMIANA: Logika dodawania jak w SaleController
            _semestrRepository.Add(semestr);
            var result = await _semestrRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać semestru.");

            // Użycie nameof() jest bezpieczniejsze niż "GetSemestr"
            return CreatedAtAction(nameof(GetSemestr), new { id = semestr.Id }, semestr);
        }

        // DELETE: api/Semestry/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSemestr(int id)
        {
            // ZMIANA: Logika usuwania jak w SaleController
            var semestr = await _semestrRepository.GetByIdAsync(id);
            if (semestr == null)
            {
                return NotFound();
            }

            _semestrRepository.Delete(semestr);
            var result = await _semestrRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć semestru.");

            return NoContent();
        }
    }
}