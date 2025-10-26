using Dziennik_elektroniczny.Interfaces; // ZMIANA: Nowy using
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
// using Dziennik_elektroniczny.Data; // ZMIANA: Usunięte
// using Microsoft.EntityFrameworkCore; // ZMIANA: Usunięte
using System.Collections.Generic; // Dodane dla IEnumerable
using System.Threading.Tasks; // Dodane dla Task

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UzytkownikController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Uzytkownik>
        private readonly IGenericRepository<Uzytkownik> _uzytkownikRepository;
        public UzytkownikController(IGenericRepository<Uzytkownik> uzytkownikRepository) // ZMIANA
        {
            _uzytkownikRepository = uzytkownikRepository;
        }

        // GET: api/<UzytkownikController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uzytkownik>>> GetAll()
        {
            // ZMIANA: Użycie repozytorium
            var uzytkownicy = await _uzytkownikRepository.GetAllAsync();
            return Ok(uzytkownicy);
        }

        // GET api/<UzytkownikController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Uzytkownik>> GetById(int id)
        {
            // ZMIANA: Użycie repozytorium
            var user = await _uzytkownikRepository.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST api/<UzytkownikController>
        [HttpPost]
        public async Task<ActionResult<Uzytkownik>> Post([FromBody] Uzytkownik newUser) // ZMIANA: typ zwracany
        {
            // ZMIANA: Logika dodawania jak w SemestrController
            _uzytkownikRepository.Add(newUser);
            var result = await _uzytkownikRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać użytkownika.");

            return CreatedAtAction(nameof(GetById), new { id = newUser.Id }, newUser);
        }

        // PUT api/<UzytkownikController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Uzytkownik user)
        {
            if (id != user.Id)
            {
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");
            }

            // ZMIANA: Logika aktualizacji jak w SemestrController
            _uzytkownikRepository.Update(user);

            var result = await _uzytkownikRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return NoContent();
        }

        // DELETE api/<UzytkownikController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) // ZMIANA: typ zwracany
        {
            // ZMIANA: Logika usuwania jak w SemestrController
            var user = await _uzytkownikRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _uzytkownikRepository.Delete(user);
            var result = await _uzytkownikRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć użytkownika.");

            return NoContent();
        }
    }
}