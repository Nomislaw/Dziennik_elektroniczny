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
    public class SaleController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Sala>
        private readonly IGenericRepository<Sala> _salaRepository;

        public SaleController(IGenericRepository<Sala> salaRepository) // ZMIANA
        {
            _salaRepository = salaRepository;
        }

        // GET: api/Sale
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sala>>> GetSale()
        {
            // ZMIANA: Użycie repozytorium
            var sale = await _salaRepository.GetAllAsync();
            return Ok(sale);
        }

        // GET: api/Sale/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sala>> GetSala(int id)
        {
            // ZMIANA: Użycie repozytorium
            var sala = await _salaRepository.GetByIdAsync(id);

            if (sala == null)
            {
                return NotFound();
            }

            return Ok(sala); // ZMIANA: Dodano Ok() dla spójności
        }

        // PUT: api/Sale/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSala(int id, Sala sala)
        {
            if (id != sala.Id)
            {
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");
            }

            // ZMIANA: Logika aktualizacji jak w OcenyController
            _salaRepository.Update(sala);

            var result = await _salaRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return NoContent();
        }

        // POST: api/Sale
        [HttpPost]
        public async Task<ActionResult<Sala>> PostSala(Sala sala)
        {
            // ZMIANA: Logika dodawania jak w OcenyController
            _salaRepository.Add(sala);
            var result = await _salaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać sali.");

            // Użycie nameof() jest bezpieczniejsze niż "GetSala"
            return CreatedAtAction(nameof(GetSala), new { id = sala.Id }, sala);
        }

        // DELETE: api/Sale/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSala(int id)
        {
            // ZMIANA: Logika usuwania jak w OcenyController
            var sala = await _salaRepository.GetByIdAsync(id);
            if (sala == null)
            {
                return NotFound();
            }

            _salaRepository.Delete(sala);
            var result = await _salaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć sali.");

            return NoContent();
        }
    }
}