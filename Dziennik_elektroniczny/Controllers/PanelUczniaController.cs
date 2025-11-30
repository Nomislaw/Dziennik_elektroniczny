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
    [Authorize(Roles = "Uczen")]
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
        [HttpGet("oceny")]
        public async Task<ActionResult<OcenyUczniaResponseDto>> GetOceny()
        {
            var uczenId = GetCurrentUczenId();
            if (uczenId == null)
                return Unauthorized(new ErrorResponse { Errors = new List<string> { "Nieprawidłowy token JWT" } });

            var result = await _panelUczniaService.GetOcenyAsync(uczenId.Value);
            return Ok(result);
        }

        // GET: api/panelucznia/plan-lekcji
        [HttpGet("plan-lekcji")]
        public async Task<ActionResult<PlanLekcjiResponseDto>> GetPlanLekcji()
        {
            var uczenId = GetCurrentUczenId();
            if (uczenId == null)
                return Unauthorized(new ErrorResponse { Errors = new List<string> { "Nieprawidłowy token JWT" } });

            var result = await _panelUczniaService.GetPlanLekcjiAsync(uczenId.Value);
            return Ok(result);
        }

        // GET: api/panelucznia/frekwencja
        [HttpGet("frekwencja")]
        public async Task<ActionResult<FrekwencjaUczniaResponseDto>> GetFrekwencja(
            [FromQuery] DateTime? dataOd = null,
            [FromQuery] DateTime? dataDo = null)
        {
            var uczenId = GetCurrentUczenId();
            if (uczenId == null)
                return Unauthorized(new ErrorResponse { Errors = new List<string> { "Nieprawidłowy token JWT" } });

            var result = await _panelUczniaService.GetFrekwencjaAsync(uczenId.Value, dataOd, dataDo);
            return Ok(result);
        }

        // GET: api/panelucznia/podsumowanie
        [HttpGet("podsumowanie")]
        public async Task<ActionResult<PodsumowaniePaneluUczniaDto>> GetPodsumowanie()
        {
            var uczenId = GetCurrentUczenId();
            if (uczenId == null)
                return Unauthorized(new ErrorResponse { Errors = new List<string> { "Nieprawidłowy token JWT" } });

            var result = await _panelUczniaService.GetPodsumowanieAsync(uczenId.Value);

            if (result == null)
                return NotFound(new ErrorResponse { Errors = new List<string> { "Uczeń nie został znaleziony" } });

            return Ok(result);
        }
    }
}