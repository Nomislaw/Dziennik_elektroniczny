using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcenyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OcenyController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Oceny
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ocena>>> GetOceny()
        {
            return await _context.Oceny.ToListAsync();
        }

        // GET: api/Oceny/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ocena>> GetOcena(int id)
        {
            var ocena = await _context.Oceny.FindAsync(id);

            if (ocena == null)
            {
                return NotFound();
            }

            return ocena;
        }

        // PUT: api/Oceny/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOcena(int id, Ocena ocena)
        {
            if (id != ocena.Id)
            {
                return BadRequest();
            }

            _context.Entry(ocena).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Oceny.Any(e => e.Id == id))
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

        // POST: api/Oceny
        [HttpPost]
        public async Task<ActionResult<Ocena>> PostOcena(Ocena ocena)
        {
            _context.Oceny.Add(ocena);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOcena", new { id = ocena.Id }, ocena);
        }

        // DELETE: api/Oceny/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOcena(int id)
        {
            var ocena = await _context.Oceny.FindAsync(id);
            if (ocena == null)
            {
                return NotFound();
            }

            _context.Oceny.Remove(ocena);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
