using Dziennik_elektroniczny.Interfaces; // ZMIANA: Nowy using
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore; // ZMIANA: Usunięte
// using Dziennik_elektroniczny.Data; // ZMIANA: Usunięte
using System.Collections.Generic; // Dodane dla IEnumerable
using System.Threading.Tasks;
using Dziennik_elektroniczny.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore; // Dodane dla Task

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrzedmiotController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Przedmiot>
        private readonly IGenericRepository<Przedmiot> _przedmiotRepository;
        private readonly AppDbContext _dbContext;

        public PrzedmiotController(IGenericRepository<Przedmiot> przedmiotRepository, AppDbContext dbContext) // ZMIANA
        {
            _przedmiotRepository = przedmiotRepository;
            _dbContext = dbContext;
        }

        // GET: api/Przedmioty
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Przedmiot>>> GetPrzedmioty()
        {
            // ZMIANA: Użycie repozytorium
            var przedmioty = await _przedmiotRepository.GetAllAsync();
            return Ok(przedmioty);
        }
        
        [HttpGet("nauczyciel/{nauczycielId}")]
        [Authorize (Roles = "Nauczyciel")]
        public async Task<ActionResult<IEnumerable<PrzedmiotDto>>> GetPrzedmiotyNauczyciela(int nauczycielId)
        {
            var teacher = await _dbContext.Uzytkownicy
                .Include(u => u.Przedmioty)  
                .FirstOrDefaultAsync(u => u.Id == nauczycielId);  

            if (teacher == null)
                return NotFound("Nauczyciel nie znaleziony");

            var przedmioty = teacher.Przedmioty;  

            var dto = przedmioty.Select(p => new PrzedmiotDto
            {
                Id = p.Id,
                Nazwa = p.Nazwa
            });

            return Ok(dto);
        }


        // GET: api/Przedmioty/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Przedmiot>> GetPrzedmiot(int id)
        {
            // ZMIANA: Użycie repozytorium
            var przedmiot = await _przedmiotRepository.GetByIdAsync(id);

            if (przedmiot == null)
            {
                return NotFound();
            }

            return Ok(przedmiot); // ZMIANA: Dodano Ok() dla spójności
        }

        // PUT: api/Przedmioty/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrzedmiot(int id, Przedmiot przedmiot)
        {
            if (id != przedmiot.Id)
            {
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");
            }

            // ZMIANA: Logika aktualizacji jak w OcenyController
            _przedmiotRepository.Update(przedmiot);

            var result = await _przedmiotRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return Ok(new { message = "Zaktualizowano przedmiot" });
        }

        // POST: api/Przedmioty
        [HttpPost]
        public async Task<ActionResult<Przedmiot>> PostPrzedmiot(Przedmiot przedmiot)
        {
            // ZMIANA: Logika dodawania jak w OcenyController
            _przedmiotRepository.Add(przedmiot);
            var result = await _przedmiotRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać przedmiotu.");

            // Użycie nameof() jest bezpieczniejsze niż "GetPrzedmiot"
            return CreatedAtAction(nameof(GetPrzedmiot), new { id = przedmiot.Id }, przedmiot);
        }

        // DELETE: api/Przedmioty/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrzedmiot(int id)
        {
            // ZMIANA: Logika usuwania jak w OcenyController
            var przedmiot = await _przedmiotRepository.GetByIdAsync(id);
            if (przedmiot == null)
            {
                return NotFound();
            }

            _przedmiotRepository.Delete(przedmiot);
            var result = await _przedmiotRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć przedmiotu.");

            return Ok(new { message = "Usunieto przedmiot" });
        }
    }

    public class PrzedmiotDto
    {
        public int Id { get; set; }
        public string Nazwa { get; set; }
    }
}