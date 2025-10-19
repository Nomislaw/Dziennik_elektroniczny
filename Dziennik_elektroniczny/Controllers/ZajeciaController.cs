using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZajeciaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ZajeciaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Zajecia
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zajecia>>> GetZajecia()
        {
            return await _context.Zajecia.ToListAsync();
        }

        // GET: api/Zajecia/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Zajecia>> GetZajecia(int id)
        {
            var zajecia = await _context.Zajecia.FindAsync(id);

            if (zajecia == null)
            {
                return NotFound();
            }

            return zajecia;
        }

        // PUT: api/Zajecia/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutZajecia(int id, Zajecia zajecia)
        {
            if (id != zajecia.Id)
            {
                return BadRequest();
            }

            _context.Entry(zajecia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Zajecia.Any(e => e.Id == id))
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

        // POST: api/Zajecia
        [HttpPost]
        public async Task<ActionResult<Zajecia>> PostZajecia(Zajecia zajecia)
        {
            _context.Zajecia.Add(zajecia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetZajecia", new { id = zajecia.Id }, zajecia);
        }

        // DELETE: api/Zajecia/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZajecia(int id)
        {
            var zajecia = await _context.Zajecia.FindAsync(id);
            if (zajecia == null)
            {
                return NotFound();
            }

            _context.Zajecia.Remove(zajecia);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
