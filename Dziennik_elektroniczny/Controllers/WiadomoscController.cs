using System.Security.Claims;
using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.DTOs;
using Dziennik_elektroniczny.Models;
using Dziennik_elektroniczny.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Dziennik_elektroniczny.Controllers;

[ApiController]
[Route("api/wiadomosci")]
[Authorize]
public class WiadomosciController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<ChatHub> _hub;
    private readonly IConfiguration _configuration;

    public WiadomosciController(AppDbContext context, IHubContext<ChatHub> hub, IConfiguration configuration)
    {
        _context = context;
        _hub = hub;
        _configuration = configuration;
    }
    
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        

        return int.Parse(userIdClaim);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage(SendMessageDto dto)
    {
        

        var userId = GetUserId();

        var key = _configuration["Encryption:Key"];
        var iv = _configuration["Encryption:IV"];

        if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(iv))
            return StatusCode(500, "Brak konfiguracji dla szyfrowania.");

        var encryptedText = SimpleEncryption.Encrypt(dto.Tresc, key, iv);

        var msg = new Wiadomosc
        {
            NadawcaId = userId,
            OdbiorcaId = dto.OdbiorcaId,
            Tresc = encryptedText
        };

        _context.Wiadomosci.Add(msg);
        await _context.SaveChangesAsync();

        
        msg.Tresc = dto.Tresc;

        await _hub.Clients.User(dto.OdbiorcaId.ToString())
            .SendAsync("ReceiveMessage", msg);

        return Ok(msg);
    }


    [HttpGet("{userId}")]
    public async Task<IActionResult> GetConversation(int userId)
    {


        var myId = GetUserId();
        var key = _configuration["Encryption:Key"];
        var iv = _configuration["Encryption:IV"];

        if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(iv))
            return StatusCode(500, "Brak konfiguracji dla szyfrowania.");

        List<Wiadomosc> messages;
        try
        {
            messages = await _context.Wiadomosci
                .Where(m =>
                    (m.NadawcaId == myId && m.OdbiorcaId == userId) ||
                    (m.NadawcaId == userId && m.OdbiorcaId == myId))
                .OrderBy(m => m.DataWyslania)
                .ToListAsync();

            foreach (var m in messages)
            {
                try
                {
                    m.Tresc = SimpleEncryption.Decrypt(m.Tresc, key, iv);
                }
                catch
                {
                    m.Tresc = "[Błąd odszyfrowania wiadomości]";
                }
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Błąd podczas pobierania wiadomości", details = ex.Message });
        }

        return Ok(messages);
    }

}
