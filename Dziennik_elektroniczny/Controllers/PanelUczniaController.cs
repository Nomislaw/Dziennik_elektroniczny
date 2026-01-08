using Dziennik_elektroniczny.DTOs;
using Dziennik_elektroniczny.DTOs.UczenDto;
using Dziennik_elektroniczny.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Dziennik_elektroniczny.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Uczen, Rodzic")]
    public class PanelUczniaController : ControllerBase
    {
        private readonly IPanelUczniaService _panelUczniaService;

        public PanelUczniaController(IPanelUczniaService panelUczniaService)
        {
            _panelUczniaService = panelUczniaService;
        }

        // Pomocnicza metoda do pobierania ID ucznia z tokenu
        private int? GetCurrentUczenId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return null;

            return int.Parse(userIdClaim);
        }

        // GET: api/panelucznia/oceny
        [HttpGet("oceny/{uczenId}")]
        public async Task<ActionResult<OcenyUczniaResponseDto>> GetOceny(int uczenId)
        {
            
            if (uczenId == null)
                return Unauthorized(new ErrorResponse { Errors = new List<string> { "Nieprawidłowy token JWT" } });

            var result = await _panelUczniaService.GetOcenyAsync(uczenId);
            return Ok(result);
        }

        // GET: api/panelucznia/plan-lekcji
        [HttpGet("plan-lekcji/{uczenId}")]
        public async Task<ActionResult<PlanLekcjiResponseDto>> GetPlanLekcji(int uczenId)
        {
            
            if (uczenId == null)
                return Unauthorized(new ErrorResponse { Errors = new List<string> { "Nieprawidłowy token JWT" } });

            var result = await _panelUczniaService.GetPlanLekcjiAsync(uczenId);
            return Ok(result);
        }

        // GET: api/panelucznia/frekwencja
        [HttpGet("frekwencja/{uczenId}")]
        public async Task<ActionResult<FrekwencjaUczniaResponseDto>> GetFrekwencja(int uczenId,
            [FromQuery] DateTime? dataOd = null,
            [FromQuery] DateTime? dataDo = null)
        {
            
            if (uczenId == null)
                return Unauthorized(new ErrorResponse { Errors = new List<string> { "Nieprawidłowy token JWT" } });

            var result = await _panelUczniaService.GetFrekwencjaAsync(uczenId, dataOd, dataDo);
            return Ok(result);
        }

        // GET: api/panelucznia/podsumowanie
        [HttpGet("podsumowanie/{uczenId}")]
        public async Task<ActionResult<PodsumowaniePaneluUczniaDto>> GetPodsumowanie(int uczenId)
        {
           
            if (uczenId == null)
                return Unauthorized(new ErrorResponse { Errors = new List<string> { "Nieprawidłowy token JWT" } });

            var result = await _panelUczniaService.GetPodsumowanieAsync(uczenId);

            if (result == null)
                return NotFound(new ErrorResponse { Errors = new List<string> { "Uczeń nie został znaleziony" } });

            return Ok(result);
        }
    }
}