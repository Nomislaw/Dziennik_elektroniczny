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
    public class ZadanieController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Zadanie>
        private readonly IGenericRepository<Zadanie> _zadanieRepository;

        public ZadanieController(IGenericRepository<Zadanie> zadanieRepository) // ZMIANA
        {
            _zadanieRepository = zadanieRepository;
        }

        // GET: api/Zadania
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zadanie>>> GetZadania()
        {
            // ZMIANA: Użycie repozytorium
            var zadania = await _zadanieRepository.GetAllAsync();
            return Ok(zadania);
        }

        // GET: api/Zadania/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Zadanie>> GetZadanie(int id)
        {
            // ZMIANA: Użycie repozytorium
            var zadanie = await _zadanieRepository.GetByIdAsync(id);

            if (zadanie == null)
            {
                return NotFound();
            }

            return Ok(zadanie); // ZMIANA: Dodano Ok() dla spójności
        }

        // PUT: api/Zadania/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutZadanie(int id, Zadanie zadanie)
        {
            if (id != zadanie.Id)
            {
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");
            }

            // ZMIANA: Logika aktualizacji jak w UzytkownikController
            _zadanieRepository.Update(zadanie);

            var result = await _zadanieRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return Ok(new {message = "zmodyfikowano" });
        }

        // POST: api/Zadania
        [HttpPost]
        public async Task<ActionResult<Zadanie>> PostZadanie(Zadanie zadanie)
        {
            // ZMIANA: Logika dodawania jak w UzytkownikController
            _zadanieRepository.Add(zadanie);
            var result = await _zadanieRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać zadania.");

            // Użycie nameof() jest bezpieczniejsze niż "GetZadanie"
            return CreatedAtAction(nameof(GetZadanie), new { id = zadanie.Id }, zadanie);
        }

        // DELETE: api/Zadania/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZadanie(int id)
        {
            // ZMIANA: Logika usuwania jak w UzytkownikController
            var zadanie = await _zadanieRepository.GetByIdAsync(id);
            if (zadanie == null)
            {
                return NotFound();
            }

            _zadanieRepository.Delete(zadanie);
            var result = await _zadanieRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć zadania.");

            return Ok(new { message = "Usunieto Zadanie pomyślnie" });
        }
    }
}