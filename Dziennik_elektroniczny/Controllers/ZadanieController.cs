using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZadanieController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ZadanieController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Zadania
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zadanie>>> GetZadania()
        {
            return await _context.Zadania.ToListAsync();
        }

        // GET: api/Zadania/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Zadanie>> GetZadanie(int id)
        {
            var zadanie = await _context.Zadania.FindAsync(id);

            if (zadanie == null)
            {
                return NotFound();
            }

            return zadanie;
        }

        // PUT: api/Zadania/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutZadanie(int id, Zadanie zadanie)
        {
            if (id != zadanie.Id)
            {
                return BadRequest();
            }

            _context.Entry(zadanie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Zadania.Any(e => e.Id == id))
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

        // POST: api/Zadania
        [HttpPost]
        public async Task<ActionResult<Zadanie>> PostZadanie(Zadanie zadanie)
        {
            _context.Zadania.Add(zadanie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetZadanie", new { id = zadanie.Id }, zadanie);
        }

        // DELETE: api/Zadania/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZadanie(int id)
        {
            var zadanie = await _context.Zadania.FindAsync(id);
            if (zadanie == null)
            {
                return NotFound();
            }

            _context.Zadania.Remove(zadanie);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
