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

        public ZajeciaController(IGenericRepository<Zajecia> zajeciaRepository) // ZMIANA
        {
            _zajeciaRepository = zajeciaRepository;
        }

        // GET: api/Zajecia
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zajecia>>> GetZajecia()
        {
            // ZMIANA: Użycie repozytorium
            var zajecia = await _zajeciaRepository.GetAllAsync();
            return Ok(zajecia);
        }

        // GET: api/Zajecia/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Zajecia>> GetZajecia(int id)
        {
            // ZMIANA: Użycie repozytorium
            var zajecia = await _zajeciaRepository.GetByIdAsync(id);

            if (zajecia == null)
            {
                return NotFound();
            }

            return Ok(zajecia); // ZMIANA: Dodano Ok() dla spójności
        }

        // PUT: api/Zajecia/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutZajecia(int id, Zajecia zajecia)
        {
            if (id != zajecia.Id)
            {
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");
            }

            // ZMIANA: Logika aktualizacji jak w ZadanieController
            _zajeciaRepository.Update(zajecia);

            var result = await _zajeciaRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return NoContent();
        }

        // POST: api/Zajecia
        [HttpPost]
        public async Task<ActionResult<Zajecia>> PostZajecia(Zajecia zajecia)
        {
            // ZMIANA: Logika dodawania jak w ZadanieController
            _zajeciaRepository.Add(zajecia);
            var result = await _zajeciaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać zajęć.");

            // Użycie nameof() jest bezpieczniejsze niż "GetZajecia"
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

            return NoContent();
        }
    }
}