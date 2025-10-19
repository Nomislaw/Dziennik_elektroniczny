using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SemestrController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SemestrController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Semestry
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Semestr>>> GetSemestry()
        {
            return await _context.Semestry.ToListAsync();
        }

        // GET: api/Semestry/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Semestr>> GetSemestr(int id)
        {
            var semestr = await _context.Semestry.FindAsync(id);

            if (semestr == null)
            {
                return NotFound();
            }

            return semestr;
        }

        // PUT: api/Semestry/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSemestr(int id, Semestr semestr)
        {
            if (id != semestr.Id)
            {
                return BadRequest();
            }

            _context.Entry(semestr).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Semestry.Any(e => e.Id == id))
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

        // POST: api/Semestry
        [HttpPost]
        public async Task<ActionResult<Semestr>> PostSemestr(Semestr semestr)
        {
            _context.Semestry.Add(semestr);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSemestr", new { id = semestr.Id }, semestr);
        }

        // DELETE: api/Semestry/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSemestr(int id)
        {
            var semestr = await _context.Semestry.FindAsync(id);
            if (semestr == null)
            {
                return NotFound();
            }

            _context.Semestry.Remove(semestr);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
