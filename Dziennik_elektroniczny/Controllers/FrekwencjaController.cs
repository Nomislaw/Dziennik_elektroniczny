using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FrekwencjaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FrekwencjaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Frekwencje
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Frekwencja>>> GetFrekwencje()
        {
            return await _context.Frekwencje.ToListAsync();
        }

        // GET: api/Frekwencje/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Frekwencja>> GetFrekwencja(int id)
        {
            var frekwencja = await _context.Frekwencje.FindAsync(id);

            if (frekwencja == null)
            {
                return NotFound();
            }

            return frekwencja;
        }

        // PUT: api/Frekwencje/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFrekwencja(int id, Frekwencja frekwencja)
        {
            if (id != frekwencja.Id)
            {
                return BadRequest();
            }

            _context.Entry(frekwencja).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Frekwencje.Any(e => e.Id == id))
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

        // POST: api/Frekwencje
        [HttpPost]
        public async Task<ActionResult<Frekwencja>> PostFrekwencja(Frekwencja frekwencja)
        {
            _context.Frekwencje.Add(frekwencja);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFrekwencja", new { id = frekwencja.Id }, frekwencja);
        }

        // DELETE: api/Frekwencje/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFrekwencja(int id)
        {
            var frekwencja = await _context.Frekwencje.FindAsync(id);
            if (frekwencja == null)
            {
                return NotFound();
            }

            _context.Frekwencje.Remove(frekwencja);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
