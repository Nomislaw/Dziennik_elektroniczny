using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.DTOs;
using Dziennik_elektroniczny.Models;
using Dziennik_elektroniczny.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Dziennik_elektroniczny.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<Uzytkownik> _passwordHasher = new();
    private readonly EmailService _emailService;

    public AuthController(AppDbContext context, IConfiguration configuration, EmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Uzytkownicy
            .Include(u => u.Rodzice)
            .Include(u => u.Dzieci)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            return Unauthorized(new ErrorResponse { Errors = new List<string> { "Niepoprawny adres e-mail."}});

        var result = _passwordHasher.VerifyHashedPassword(user, user.HasloHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new ErrorResponse { Errors = new List<string> { "Niepoprawne hasło."}});

        if (!user.CzyEmailPotwierdzony)
            return Unauthorized(new ErrorResponse { Errors = new List<string> { "Twoje konto jest nieaktywne lub niezweryfikowano konta, sprawdź e-mail."}});

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            Id = user.Id,
            Email = user.Email,
            Imie = user.Imie,
            Nazwisko = user.Nazwisko,
            Token = token,
            Rola = user.Rola.ToString()
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ErrorResponse { Errors = new List<string> {"Wprowadzono niepoprawne dane."}});

        if (await _context.Uzytkownicy.AnyAsync(u => u.Email == req.Email))
            return BadRequest(new ErrorResponse { Errors = new List<string> {"Podany adres e-mail jest już zarejestrowany."}});

        var user = new Uzytkownik
        {
            Email = req.Email,
            Imie = req.FirstName,
            Nazwisko = req.LastName,
            Rola = Rola.Uczen,
            TokenWeryfikacyjny = Guid.NewGuid().ToString()
        };

        user.HasloHash = _passwordHasher.HashPassword(user, req.Password);

        _context.Uzytkownicy.Add(user);
        await _context.SaveChangesAsync();

        var verifyUrl = $"http://localhost:3000/verify?token={user.TokenWeryfikacyjny}";
        var body = $@"
            <h3>Witaj {user.Imie}!</h3>
            <p>Dziękujemy za rejestrację w systemie Dziennik Elektroniczny.</p>
            <p>Kliknij w poniższy link, aby potwierdzić swój adres e-mail:</p>
            <a href='{verifyUrl}'>Potwierdź adres e-mail</a>";

        await _emailService.SendEmailAsync(user.Email, "Potwierdzenie rejestracji", body);

        return Ok(new { message = "Konto zostało utworzone. Sprawdź skrzynkę e-mail, aby potwierdzić rejestrację." });
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        if (string.IsNullOrEmpty(token))
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Brak tokenu weryfikacyjnego." } } );

    var user = await _context.Uzytkownicy.FirstOrDefaultAsync(u => u.TokenWeryfikacyjny == token);

        if (user == null)
            return BadRequest(new ErrorResponse { Errors = new List<string> {"Niepoprawny lub wygasły token weryfikacyjny." }});

        user.CzyEmailPotwierdzony = true;
        user.TokenWeryfikacyjny = null;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Twój adres e-mail został pomyślnie potwierdzony. Możesz się teraz zalogować." });
    }

    

    private string GenerateJwtToken(Uzytkownik user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Rola.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
