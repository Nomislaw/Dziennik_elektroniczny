using Dziennik_elektroniczny.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Dziennik_elektroniczny.Models;
using System;
using System.Threading.Tasks;

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

            // --- ZMIANA: Konwersja string na enum Rola ---
            if (!Enum.TryParse<Rola>(model.Typ, true, out var rola))
            {
                return BadRequest("Nieprawidłowy typ użytkownika.");
            }

            // --- ZMIANA: Tworzenie jednego obiektu Uzytkownik ---
            var newUser = new Uzytkownik
            {
                Imie = model.Imie,
                Nazwisko = model.Nazwisko,
                Email = model.Email,
                Rola = rola,
                // Stan = "Aktywny" // Zakładam, że Uzytkownik ma pole Stan
                // DataUrodzenia = (rola == Rola.Uczen) ? model.DataUrodzenia : null // Zakładam, że Uzytkownik ma nullable DataUrodzenia
            };

            // Jeśli DataUrodzenia jest specyficzna tylko dla ucznia i masz ją w modelu Uzytkownik
            if (rola == Rola.Uczen)
            {
                // newUser.DataUrodzenia = model.DataUrodzenia; // Odkomentuj, jeśli masz to pole w Uzytkownik.cs
            }

            // Usunięto sprawdzanie `newUser == null`, ponieważ Enum.TryParse już to załatwił

            newUser.HasloHash = _passwordHasher.HashPassword(newUser, model.Haslo);
            // newUser.Stan = "Aktywny"; // Odkomentuj, jeśli masz to pole

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

            // --- ZMIANA: Zwracanie Roli jako string ---
            return Ok(new { message = "Logowanie zakończone sukcesem.", userId = user.Id, typ = user.Rola.ToString() });
        }
    }

    // Model rejestracji - pozostaje bez zmian, ale...
    public class RegisterModel
    {
        public string Typ { get; set; } // "Uczen", "Nauczyciel", "Rodzic"
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public string Haslo { get; set; }

        // ...upewnij się, że Twój model Uzytkownik.cs ma pole (nullable) DataUrodzenia,
        // jeśli chcesz je zbierać podczas rejestracji ucznia.
        public DateTime? DataUrodzenia { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Haslo { get; set; }
    }
}