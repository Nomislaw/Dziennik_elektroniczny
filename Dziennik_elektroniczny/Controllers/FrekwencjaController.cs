using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.DTOs;
using Dziennik_elektroniczny.Interfaces;
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
        private readonly IGenericRepository<Frekwencja> _frekwencjaRepository;

        public FrekwencjaController(IGenericRepository<Frekwencja> frekwencjaRepository)
        {
            _frekwencjaRepository = frekwencjaRepository;
        }

        // GET: api/Frekwencje
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Frekwencja>>> GetFrekwencje()
        {
            try
            {
                var fr = await _frekwencjaRepository.GetAllAsync();

                if (fr == null || !fr.Any())
                    return NotFound(new ErrorResponse { Errors = new List<string> {"Nie znaleziono żadnych frekwencji."}});

                return Ok(fr);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd: {ex.Message}");
            }
        }

        // GET: api/Frekwencje/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Frekwencja>> GetFrekwencja(int id)
        {
            var frekwencja = await _frekwencjaRepository.GetByIdAsync(id);

            if (frekwencja == null)
                return NotFound();

            return Ok(frekwencja);
        }

        // PUT: api/Frekwencje/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFrekwencja(int id, Frekwencja frekwencja)
        {
            if (id != frekwencja.Id)
                return BadRequest(new ErrorResponse { Errors = new List<string> {"ID w ścieżce nie zgadza się z ID obiektu."}});

            _frekwencjaRepository.Update(frekwencja);

            var result = await _frekwencjaRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return Ok(new {message="Zaktualizowano frekwencję."});
        }

        // POST: api/Frekwencje
        [HttpPost]
        public async Task<ActionResult<Frekwencja>> PostFrekwencja(Frekwencja frekwencja)
        {
            _frekwencjaRepository.Add(frekwencja);
            var result = await _frekwencjaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać rekordu.");

            return CreatedAtAction(nameof(GetFrekwencja), new { id = frekwencja.Id }, frekwencja);
        }

        // DELETE: api/Frekwencje/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFrekwencja(int id)
        {
            var frekwencja = await _frekwencjaRepository.GetByIdAsync(id);
            if (frekwencja == null)
                return NotFound(new ErrorResponse { Errors = new List<string> {"Nie znaleziono frekwencji."}});

            _frekwencjaRepository.Delete(frekwencja);
            var result = await _frekwencjaRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć rekordu.");

            return Ok(new {message = "Usunięto klasę pomyślnie"});
        }
    }
}
