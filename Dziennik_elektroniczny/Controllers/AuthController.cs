using Dziennik_elektroniczny.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Dziennik_elektroniczny.Models;

namespace Dziennik_elektroniczny.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<Uzytkownik> _passwordHasher;

        public AuthController(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Uzytkownik>();
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (await _context.Uzytkownicy.AnyAsync(u => u.Email == model.Email))
                return BadRequest("Użytkownik o takim emailu już istnieje.");

            Uzytkownik newUser = model.Typ switch
            {
                "Uczen" => new Uczen
                {
                    Imie = model.Imie,
                    Nazwisko = model.Nazwisko,
                    Email = model.Email,
                    DataUrodzenia = model.DataUrodzenia
                },
                "Rodzic" => new Rodzic
                {
                    Imie = model.Imie,
                    Nazwisko = model.Nazwisko,
                    Email = model.Email
                },
                "Nauczyciel" => new Nauczyciel
                {
                    Imie = model.Imie,
                    Nazwisko = model.Nazwisko,
                    Email = model.Email
                },
                _ => null
            };

            if (newUser == null)
                return BadRequest("Nieprawidłowy typ użytkownika.");

            newUser.HasloHash = _passwordHasher.HashPassword(newUser, model.Haslo);
            newUser.Stan = "Aktywny";

            _context.Uzytkownicy.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Rejestracja zakończona sukcesem." });
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _context.Uzytkownicy
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
                return Unauthorized("Nieprawidłowy email lub hasło.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.HasloHash, model.Haslo);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Nieprawidłowy email lub hasło.");

            return Ok(new { message = "Logowanie zakończone sukcesem.", userId = user.Id, typ = user.GetType().Name });
        }
    }
    
    public class RegisterModel
    {
        public string Typ { get; set; } 
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public string Haslo { get; set; }
        public DateTime DataUrodzenia { get; set; } 
    }
    
    public class LoginModel
    {
        public string Email { get; set; }
        public string Haslo { get; set; }
    }
}
