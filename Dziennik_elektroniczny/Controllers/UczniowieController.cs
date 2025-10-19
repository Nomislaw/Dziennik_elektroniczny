using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UczniowieController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UczniowieController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Uczniowie
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uczen>>> GetUczniowie()
        {
            return await _context.Uczniowie.ToListAsync();
        }

        // GET: api/Uczniowie/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Uczen>> GetUczen(int id)
        {
            var uczen = await _context.Uczniowie.FindAsync(id);

            if (uczen == null)
            {
                return NotFound();
            }

            return uczen;
        }

        // PUT: api/Uczniowie/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUczen(int id, Uczen uczen)
        {
            if (id != uczen.Id)
            {
                return BadRequest();
            }

            _context.Entry(uczen).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Uczniowie.Any(e => e.Id == id))
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

        // POST: api/Uczniowie
        [HttpPost]
        public async Task<ActionResult<Uczen>> PostUczen(Uczen uczen)
        {
            _context.Uczniowie.Add(uczen);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUczen", new { id = uczen.Id }, uczen);
        }

        // DELETE: api/Uczniowie/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUczen(int id)
        {
            var uczen = await _context.Uczniowie.FindAsync(id);
            if (uczen == null)
            {
                return NotFound();
            }

            _context.Uczniowie.Remove(uczen);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
