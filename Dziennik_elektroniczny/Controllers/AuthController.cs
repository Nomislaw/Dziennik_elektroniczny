using System.ComponentModel.DataAnnotations;
using Dziennik_elektroniczny.Models;
using Dziennik_elektroniczny.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dziennik_elektroniczny.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<Uzytkownik> _passwordHasher = new();

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Uzytkownicy
            .Include(u => u.Rodzice)
            .Include(u => u.Dzieci)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            return Unauthorized("Niepoprawny e-mail lub hasło");

        var result = _passwordHasher.VerifyHashedPassword(user, user.HasloHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Niepoprawny e-mail lub hasło");

        return Ok(new
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.Imie,
            LastName = user.Nazwisko
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _context.Uzytkownicy.AnyAsync(u => u.Email == req.Email))
            return BadRequest("Ten adres e-mail jest już zarejestrowany");

        var user = new Uzytkownik
        {
            Email = req.Email,
            Imie = req.FirstName,
            Nazwisko = req.LastName,
            Rola = Rola.Uczen // <-- domyślna rola
        };

        var passwordHasher = new PasswordHasher<Uzytkownik>();
        user.HasloHash = passwordHasher.HashPassword(user, req.Password);

        _context.Uzytkownicy.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { user.Id, user.Email, Role = user.Rola.ToString() });
    }

}

// DTOs
public class LoginRequest
{
    [Required]
    [EmailAddress(ErrorMessage = "Niepoprawny adres e-mail.")]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    [Required]
    [MinLength(8, ErrorMessage = "Hasło musi mieć co najmniej 8 znaków.")]
    [RegularExpression(@"^(?=(?:.*\d){3,})(?=.*[!@#$%^&*(),.?""{}|<>])(?=.*[A-Z]).*$",
        ErrorMessage = "Hasło musi zawierać co najmniej 3 cyfry, 1 znak specjalny i 1 wielką literę.")]
    public string Password { get; set; } = "";

    [Required]
    public string FirstName { get; set; } = "";

    [Required]
    public string LastName { get; set; } = "";

    [Required]
    [EmailAddress(ErrorMessage = "Niepoprawny adres e-mail.")]
    public string Email { get; set; } = "";
    
}
