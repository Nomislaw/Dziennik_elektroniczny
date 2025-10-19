using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RodziceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RodziceController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Rodzice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rodzic>>> GetRodzice()
        {
            return await _context.Rodzice.ToListAsync();
        }

        // GET: api/Rodzice/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Rodzic>> GetRodzic(int id)
        {
            var rodzic = await _context.Rodzice.FindAsync(id);

            if (rodzic == null)
            {
                return NotFound();
            }

            return rodzic;
        }

        // PUT: api/Rodzice/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRodzic(int id, Rodzic rodzic)
        {
            if (id != rodzic.Id)
            {
                return BadRequest();
            }

            _context.Entry(rodzic).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Rodzice.Any(e => e.Id == id))
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

        // POST: api/Rodzice
        [HttpPost]
        public async Task<ActionResult<Rodzic>> PostRodzic(Rodzic rodzic)
        {
            _context.Rodzice.Add(rodzic);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRodzic", new { id = rodzic.Id }, rodzic);
        }

        // DELETE: api/Rodzice/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRodzic(int id)
        {
            var rodzic = await _context.Rodzice.FindAsync(id);
            if (rodzic == null)
            {
                return NotFound();
            }

            _context.Rodzice.Remove(rodzic);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
