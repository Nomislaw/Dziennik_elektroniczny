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
    public class SemestrController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Semestr>
        private readonly IGenericRepository<Semestr> _semestrRepository;

        public SemestrController(IGenericRepository<Semestr> semestrRepository) // ZMIANA
        {
            _semestrRepository = semestrRepository;
        }

        // GET: api/Semestry
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Semestr>>> GetSemestry()
        {
            // ZMIANA: Użycie repozytorium
            var semestry = await _semestrRepository.GetAllAsync();
            return Ok(semestry);
        }

        // GET: api/Semestry/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Semestr>> GetSemestr(int id)
        {
            // ZMIANA: Użycie repozytorium
            var semestr = await _semestrRepository.GetByIdAsync(id);

            if (semestr == null)
            {
                return NotFound();
            }

            return Ok(semestr); // ZMIANA: Dodano Ok() dla spójności
        }

        // PUT: api/Semestry/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSemestr(int id, Semestr semestr)
        {
            semestr.Id = id;

            // ZMIANA: Logika aktualizacji jak w SaleController
            _semestrRepository.Update(semestr);

            var result = await _semestrRepository.SaveChangesAsync();
            if (!result)
                return StatusCode(500, "Nie udało się zapisać zmian.");

            return Ok(new { message = "Zaktualizowano semestr" });
        }

        // POST: api/Semestry
        [HttpPost]
        public async Task<ActionResult<Semestr>> PostSemestr(Semestr semestr)
        {
            // ZMIANA: Logika dodawania jak w SaleController
            _semestrRepository.Add(semestr);
            var result = await _semestrRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się dodać semestru.");

            // Użycie nameof() jest bezpieczniejsze niż "GetSemestr"
            return CreatedAtAction(nameof(GetSemestr), new { id = semestr.Id }, semestr);
        }

        // DELETE: api/Semestry/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSemestr(int id)
        {
            // ZMIANA: Logika usuwania jak w SaleController
            var semestr = await _semestrRepository.GetByIdAsync(id);
            if (semestr == null)
            {
                return NotFound();
            }

            _semestrRepository.Delete(semestr);
            var result = await _semestrRepository.SaveChangesAsync();

            if (!result)
                return StatusCode(500, "Nie udało się usunąć semestru.");

            return Ok(new { message = "Usunieto semestr" });
        }
        
        
        
        [HttpGet("dni-tygodnia/{dzienTygodnia}/semestrId/{semestrId}")]
        public async Task<ActionResult<IEnumerable<string>>> GetDniTygodnia(int dzienTygodnia, int semestrId)
        {
            try 
            {
                // 1. Pobierz WSZYSTKIE semestry (nie tylko aktywne)
                var semestr = await _semestrRepository.GetByIdAsync(semestrId);
              
        
                

                // 2. Użyj WSZYSTKICH semestrów (nie filtruj po dacie)
                var wszystkieDni = new List<DateTime>();
                
                    Console.WriteLine($"📅 Semestr: {semestr.DataRozpoczecia} - {semestr.DataZakonczenia}");
                    var dniSemestru = GenerateWeekdaysInRange(
                        semestr.DataRozpoczecia.Date, 
                        semestr.DataZakonczenia.Date, 
                        dzienTygodnia+1);
                    wszystkieDni.AddRange(dniSemestru);
                

                // 3. Usuń duplikaty i posortuj
                var unikalneDni = wszystkieDni
                    .Distinct()
                    .OrderBy(d => d)
                    .Select(d => d.ToString("yyyy-MM-dd"))
                    .ToList();

                Console.WriteLine($"✅ Zwrócono dat: {unikalneDni.Count}");
                return Ok(unikalneDni);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Błąd endpointu: {ex.Message}");
                return StatusCode(500, $"Błąd: {ex.Message}");
            }
        }


        // 🔧 POMOCNICZA METODA - wszystkie poniedziałki/wtorki/etc. w przedziale
        private List<DateTime> GenerateWeekdaysInRange(
            DateTime startDate, 
            DateTime endDate, 
            int targetDayOfWeek) // 1=poniedziałek, 2=wtorek, ..., 7=niedziela
        {
            var dni = new List<DateTime>();
            var current = startDate;

            // Znajdź pierwszy dzień tygodnia w przedziale
            while (current.DayOfWeek != (DayOfWeek)(targetDayOfWeek - 1))
            {
                current = current.AddDays(1);
                if (current > endDate) return dni;
            }

            // Dodawaj co 7 dni
            while (current <= endDate)
            {
                dni.Add(current.Date);
                current = current.AddDays(7);
            }

            return dni;
        }
    }
    }
    
    
