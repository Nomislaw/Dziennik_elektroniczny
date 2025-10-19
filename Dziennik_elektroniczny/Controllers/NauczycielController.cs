using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NauczycielController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NauczycielController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Nauczyciele
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nauczyciel>>> GetNauczyciele()
        {
            return await _context.Nauczyciele.ToListAsync();
        }

        // GET: api/Nauczyciele/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nauczyciel>> GetNauczyciel(int id)
        {
            var nauczyciel = await _context.Nauczyciele.FindAsync(id);

            if (nauczyciel == null)
            {
                return NotFound();
            }

            return nauczyciel;
        }

        // PUT: api/Nauczyciele/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNauczyciel(int id, Nauczyciel nauczyciel)
        {
            if (id != nauczyciel.Id)
            {
                return BadRequest();
            }

            _context.Entry(nauczyciel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Nauczyciele.Any(e => e.Id == id))
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

        // POST: api/Nauczyciele
        [HttpPost]
        public async Task<ActionResult<Nauczyciel>> PostNauczyciel(Nauczyciel nauczyciel)
        {
            _context.Nauczyciele.Add(nauczyciel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNauczyciel", new { id = nauczyciel.Id }, nauczyciel);
        }

        // DELETE: api/Nauczyciele/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNauczyciel(int id)
        {
            var nauczyciel = await _context.Nauczyciele.FindAsync(id);
            if (nauczyciel == null)
            {
                return NotFound();
            }

            _context.Nauczyciele.Remove(nauczyciel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
