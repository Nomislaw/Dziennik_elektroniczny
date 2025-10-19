using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrzedmiotController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PrzedmiotController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Przedmioty
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Przedmiot>>> GetPrzedmioty()
        {
            return await _context.Przedmioty.ToListAsync();
        }

        // GET: api/Przedmioty/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Przedmiot>> GetPrzedmiot(int id)
        {
            var przedmiot = await _context.Przedmioty.FindAsync(id);

            if (przedmiot == null)
            {
                return NotFound();
            }

            return przedmiot;
        }

        // PUT: api/Przedmioty/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrzedmiot(int id, Przedmiot przedmiot)
        {
            if (id != przedmiot.Id)
            {
                return BadRequest();
            }

            _context.Entry(przedmiot).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Przedmioty.Any(e => e.Id == id))
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

        // POST: api/Przedmioty
        [HttpPost]
        public async Task<ActionResult<Przedmiot>> PostPrzedmiot(Przedmiot przedmiot)
        {
            _context.Przedmioty.Add(przedmiot);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPrzedmiot", new { id = przedmiot.Id }, przedmiot);
        }

        // DELETE: api/Przedmioty/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrzedmiot(int id)
        {
            var przedmiot = await _context.Przedmioty.FindAsync(id);
            if (przedmiot == null)
            {
                return NotFound();
            }

            _context.Przedmioty.Remove(przedmiot);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
