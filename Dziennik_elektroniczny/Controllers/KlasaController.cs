using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.DTOs;
using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KlasaController : ControllerBase
    {
        private readonly IGenericRepository<Klasa> _klasaRepository;
        private readonly AppDbContext _dbContext;
        public KlasaController(IGenericRepository<Klasa> klasaRepository, AppDbContext dbContext)
        {
            _klasaRepository = klasaRepository;
            _dbContext = dbContext;
        }

        // GET: api/Klasa
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Klasa>>> GetKlasy()
        {
            var klasy = await _klasaRepository.GetAllAsync();
            return Ok(klasy);
        }
        
        [HttpGet("nauczyciel/{nauczycielId}")]
        [Authorize (Roles = "Nauczyciel")]
        public async Task<ActionResult<IEnumerable<PrzedmiotDto>>> GetKlasyNauczyciela(int nauczycielId)
        {
            var teacher = await _dbContext.Uzytkownicy
                .Include(u => u.Klasy)  
                .FirstOrDefaultAsync(u => u.Id == nauczycielId);  

            if (teacher == null)
                return NotFound("Nauczyciel nie znaleziony");

            var przedmioty = teacher.Klasy;  

            var dto = przedmioty.Select(p => new KlasaDto
            {
                Id = p.Id,
                Nazwa = p.Nazwa
            });

            return Ok(dto);
        }

        // GET: api/Klasa/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Klasa>> GetKlasa(int id)
        {
            var klasa = await _klasaRepository.GetByIdAsync(id);

            if (klasa == null)
                return NotFound(new ErrorResponse { Errors = new List<string> {"Nie znaleziono"}});

            return Ok(klasa);
        }

        // PUT: api/Klasa/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKlasa(int id, [FromBody] KlasaDto dto)
        {
            
            var klasa = await _klasaRepository.GetByIdAsync(id);
            if (id != klasa.Id)
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");

            klasa.Nazwa = dto.Nazwa;
            klasa.Rok = dto.Rok;

            _klasaRepository.Update(klasa);
            var result = await _klasaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return Ok(new {message = "Zmieniono klase pomyślnie"});
        }

        // POST: api/Klasa
        [HttpPost]
        public async Task<ActionResult<Klasa>> PostKlasa(Klasa klasa)
        {
            //klasa.PlanId = null;
            //klasa.WychowawcaId = null;
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

            return Ok(new {message = "Usunięto klasę pomyślnie."});
        }
    }
}
