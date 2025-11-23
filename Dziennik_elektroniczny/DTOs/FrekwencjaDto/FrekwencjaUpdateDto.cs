using Dziennik_elektroniczny.Models;

namespace Dziennik_elektroniczny.DTOs.FrekwencjaDto
{
    public class FrekwencjaUpdateDto
    {
        public DateTime? Data { get; set; }
        public Status? Status { get; set; }
        public int? UczenId { get; set; }
        public int? ZajeciaId { get; set; }
    }
}
