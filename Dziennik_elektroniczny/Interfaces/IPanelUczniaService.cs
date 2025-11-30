using Dziennik_elektroniczny.DTOs.UczenDto;

namespace Dziennik_elektroniczny.Interfaces
{
    public interface IPanelUczniaService
    {
        Task<OcenyUczniaResponseDto> GetOcenyAsync(int uczenId);
        Task<PlanLekcjiResponseDto> GetPlanLekcjiAsync(int uczenId);
        Task<FrekwencjaUczniaResponseDto> GetFrekwencjaAsync(int uczenId, DateTime? dataOd = null, DateTime? dataDo = null);
        Task<PodsumowaniePaneluUczniaDto> GetPodsumowanieAsync(int uczenId);
    }
}
