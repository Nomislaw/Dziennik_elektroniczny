using Dziennik_elektroniczny.Interfaces; // ZMIANA: Nowy using
using Dziennik_elektroniczny.Models;
using Dziennik_elektroniczny.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// using Dziennik_elektroniczny.Data; // ZMIANA: Usunięte
// using Microsoft.EntityFrameworkCore; // ZMIANA: Usunięte
using System.Collections.Generic; // Dodane dla IEnumerable
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks; // Dodane dla Task

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UzytkownikController : ControllerBase
    {
        // ZMIANA: z AppDbContext na IGenericRepository<Uzytkownik>
        private readonly IUzytkownikService _uzytkownikRepository;
        public UzytkownikController(IUzytkownikService uzytkownikRepository) // ZMIANA
        {
            _uzytkownikRepository = uzytkownikRepository;
        }

        // GET: api/<UzytkownikController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uzytkownik>>> GetAll()
        {
            // ZMIANA: Użycie repozytorium
            var uzytkownicy = await _uzytkownikRepository.GetAllAsync();
            return Ok(uzytkownicy);
        }

        // GET api/<UzytkownikController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Uzytkownik>> GetById(int id)
        {
            // ZMIANA: Użycie repozytorium
            var user = await _uzytkownikRepository.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST api/<UzytkownikController>
        [HttpPost]
        public async Task<ActionResult<Uzytkownik>> Post([FromBody] Uzytkownik newUser, [FromQuery] string haslo) // ZMIANA: typ zwracany
        {
            newUser.UstawHaslo(haslo);
            _uzytkownikRepository.Add(newUser);
            return CreatedAtAction(nameof(GetById), new { id = newUser.Id }, newUser);
        }

        // PUT api/<UzytkownikController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Uzytkownik user)
        {
            if (id != user.Id)
            {
                return BadRequest("ID w ścieżce nie zgadza się z ID obiektu.");
            }

            _uzytkownikRepository.Update(user, id);
            return NoContent();
        }

        // DELETE api/<UzytkownikController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) // ZMIANA: typ zwracany
        {
            // ZMIANA: Logika usuwania jak w SemestrController
            _uzytkownikRepository.Delete(id);
            return NoContent();
        }
        [Authorize]
        [HttpPatch("password")]
        public async Task<IActionResult> ZmienHaslo([FromQuery] string stareHaslo, [FromQuery] string noweHaslo)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Nieprawidłowy token JWT.");

            int userId = int.Parse(userIdClaim);
            var (success, message) = await _uzytkownikRepository.ZmienHasloAsync(userId, stareHaslo, noweHaslo);
            if (!success)
                return BadRequest(message);

            return Ok("Hasło zostało zmienione.");
        }

        //PATCH: api/uzytkownik/{id}/dane?imie=Jan&nazwisko=Nowak
        [Authorize]
        [HttpPatch("data")]
        public async Task<IActionResult> ZmienDane([FromQuery] string? imie, [FromQuery] string? nazwisko)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Nieprawidłowy token JWT.");

            int userId = int.Parse(userIdClaim);

            var (success, message) = await _uzytkownikRepository.ZmienDaneAsync(userId, imie, nazwisko);
            if (!success)
                return BadRequest(message);

            return Ok("Dane użytkownika zostały zaktualizowane.");
        }
        [Authorize]
        [HttpPatch("email")]
        public async Task<IActionResult> ZmienEmail([FromQuery] string nowyEmail)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Nieprawidłowy token JWT.");

            int userId = int.Parse(userIdClaim);

            var (success, message) = await _uzytkownikRepository.ZmienEmailAsync(userId, nowyEmail);
            if (!success) return BadRequest(message);

            return Ok("Email użytkownika został zaktualizowany.");
        }
    }
}