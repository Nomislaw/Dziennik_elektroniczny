using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KlasaController : ControllerBase
    {
        private readonly IGenericRepository<Klasa> _klasaRepository;

        public KlasaController(IGenericRepository<Klasa> klasaRepository)
        {
            _klasaRepository = klasaRepository;
        }

        // GET: api/Klasa
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Klasa>>> GetKlasy()
        {
            var klasy = await _klasaRepository.GetAllAsync();
            return Ok(klasy);
        }

        // GET: api/Klasa/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Klasa>> GetKlasa(int id)
        {
            var klasa = await _klasaRepository.GetByIdAsync(id);

            if (klasa == null)
                return NotFound();

            return Ok(klasa);
        }

        // PUT: api/Klasa/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKlasa(int id, Klasa klasa)
        {
            if (id != klasa.Id)
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");

            _klasaRepository.Update(klasa);
            var result = await _klasaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return NoContent();
        }

        // POST: api/Klasa
        [HttpPost]
        public async Task<ActionResult<Klasa>> PostKlasa(Klasa klasa)
        {
            _klasaRepository.Add(klasa);
            var result = await _klasaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać klasy.");

            return CreatedAtAction(nameof(GetKlasa), new { id = klasa.Id }, klasa);
        }

        // DELETE: api/Klasa/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKlasa(int id)
        {
            var klasa = await _klasaRepository.GetByIdAsync(id);

            if (klasa == null)
                return NotFound();

            _klasaRepository.Delete(klasa);
            var result = await _klasaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć klasy.");

            return NoContent();
        }
    }
}
