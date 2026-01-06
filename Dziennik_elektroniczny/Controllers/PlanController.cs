using Dziennik_elektroniczny.DTOs.PlanyDto;
using Dziennik_elektroniczny.Interfaces; // ZMIANA: Nowy using
using Dziennik_elektroniczny.Models;
using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore; // ZMIANA: Usunięte
// using Dziennik_elektroniczny.Data; // ZMIANA: Usunięte
using System.Collections.Generic; // Dodane dla IEnumerable
using System.Threading.Tasks; // Dodane dla Task

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Plan>
        private readonly IGenericRepository<Plan> _planRepository;

        public PlanController(IGenericRepository<Plan> planRepository) // ZMIANA
        {
            _planRepository = planRepository;
        }

        // GET: api/Plany
        [HttpGet("plany")]
        public async Task<ActionResult<IEnumerable<PlanDto>>> GetPlany()
        {
            // ZMIANA: Użycie repozytorium
            var plany = await _planRepository.GetAllWithIncludesAsync("Klasa", "Semestr");
            var dto = plany.Select(p => new PlanDto
            {
                Id = p.Id,
                KlasaId = p.KlasaId,
                KlasaNazwa = p.Klasa.Nazwa,
                SemestrId = p.SemestrId,
                SemestrNazwa = $"{p.Semestr.Numer}. {p.Semestr.DataRozpoczecia:yyyy-MM-dd} - {p.Semestr.DataZakonczenia:yyyy-MM-dd}"
            });

            return Ok(dto);
        }

        // GET: api/Plany/5
        [HttpGet("plany/{id}")]
        public async Task<ActionResult<Plan>> GetPlan(int id)
        {
            // ZMIANA: Użycie repozytorium
            var plan = await _planRepository.GetByIdAsync(id);

            if (plan == null)
            {
                return NotFound();
            }

            return Ok(plan); // ZMIANA: Dodano Ok() dla spójności
        }

        // PUT: api/Plany/5
        [HttpPut("plany/{id}")]
        public async Task<IActionResult> PutPlan(int id, Plan plan)
        {
            if (id != plan.Id)
            {
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");
            }

            // ZMIANA: Logika aktualizacji jak w OcenyController
            _planRepository.Update(plan);

            var result = await _planRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return Ok(new {message="Zaktualizowano plan"});
        }

        [HttpPatch("plany/{id}")]
        public async Task<IActionResult> PatchPlan(int id, PlanUpdateDto dto)
        {
            var plan = await _planRepository.GetByIdAsync(id);
            if (plan == null)
                return NotFound();

            if (dto.KlasaId.HasValue)
                plan.KlasaId = dto.KlasaId.Value;

            if (dto.SemestrId.HasValue)
                plan.SemestrId = dto.SemestrId.Value;

            _planRepository.Update(plan);
            var result = await _planRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się zaktualizować");

            return Ok(new { message = "Zaktualizowano plan" });
        }


        // POST: api/Plany
        [HttpPost("plan")]
        public async Task<ActionResult<Plan>> PostPlan(PlanCreateDto dto)
        {
            // ZMIANA: Logika dodawania jak w OcenyController
            var plan = new Plan
            {
                KlasaId = dto.KlasaId,
                SemestrId = dto.SemestrId
            };
            _planRepository.Add(plan);
            var result = await _planRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać planu.");

            return CreatedAtAction(nameof(GetPlan), new { id = plan.Id }, plan);
        }

        // DELETE: api/Plany/5
        [HttpDelete("plany/{id}")]
        public async Task<IActionResult> DeletePlan(int id)
        {
            // ZMIANA: Logika usuwania jak w OcenyController
            var plan = await _planRepository.GetByIdAsync(id);
            if (plan == null)
            {
                return NotFound();
            }

            _planRepository.Delete(plan);
            var result = await _planRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć planu.");

            return Ok(new { message = "Usunieto plan" });
        }
    }
}