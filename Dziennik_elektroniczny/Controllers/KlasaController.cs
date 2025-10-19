using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KlasaController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Konstruktor automatycznie "wstrzykuje" dostęp do bazy danych
        public KlasaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Klasy
        // Pobiera listę wszystkich klas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Klasa>>> GetKlasy()
        {
            return await _context.Klasy.ToListAsync();
        }

        // GET: api/Klasy/5
        // Pobiera jedną klasę o konkretnym ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Klasa>> GetKlasa(int id)
        {
            var klasa = await _context.Klasy.FindAsync(id);

            if (klasa == null)
            {
                return NotFound();
            }

            return klasa;
        }

        // PUT: api/Klasy/5
        // Aktualizuje klasę o konkretnym ID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKlasa(int id, Klasa klasa)
        {
            if (id != klasa.Id)
            {
                return BadRequest();
            }

            _context.Entry(klasa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Klasy.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Klasy
        // Tworzy nową klasę
        [HttpPost]
        public async Task<ActionResult<Klasa>> PostKlasa(Klasa klasa)
        {
            _context.Klasy.Add(klasa);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKlasa", new { id = klasa.Id }, klasa);
        }

        // DELETE: api/Klasy/5
        // Usuwa klasę o konkretnym ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKlasa(int id)
        {
            var klasa = await _context.Klasy.FindAsync(id);
            if (klasa == null)
            {
                return NotFound();
            }

            _context.Klasy.Remove(klasa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    
    }
}
