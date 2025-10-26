using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcenyController : ControllerBase
    {
        private readonly IGenericRepository<Ocena> _ocenaRepository;

        public OcenyController(IGenericRepository<Ocena> ocenaRepository)
        {
            _ocenaRepository = ocenaRepository;
        }

        // GET: api/Oceny
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ocena>>> GetOceny()
        {
            var oceny = await _ocenaRepository.GetAllAsync();
            return Ok(oceny);
        }

        // GET: api/Oceny/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ocena>> GetOcena(int id)
        {
            var ocena = await _ocenaRepository.GetByIdAsync(id);

            if (ocena == null)
                return NotFound();

            return Ok(ocena);
        }

        // PUT: api/Oceny/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOcena(int id, Ocena ocena)
        {
            if (id != ocena.Id)
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");

            _ocenaRepository.Update(ocena);

            var result = await _ocenaRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return NoContent();
        }

        // POST: api/Oceny
        [HttpPost]
        public async Task<ActionResult<Ocena>> PostOcena(Ocena ocena)
        {
            _ocenaRepository.Add(ocena);
            var result = await _ocenaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać oceny.");

            return CreatedAtAction(nameof(GetOcena), new { id = ocena.Id }, ocena);
        }

        // DELETE: api/Oceny/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOcena(int id)
        {
            var ocena = await _ocenaRepository.GetByIdAsync(id);
            if (ocena == null)
                return NotFound();

            _ocenaRepository.Delete(ocena);
            var result = await _ocenaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć oceny.");

            return NoContent();
        }
    }
}
