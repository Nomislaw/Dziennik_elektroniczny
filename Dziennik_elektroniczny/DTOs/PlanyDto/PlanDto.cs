namespace Dziennik_elektroniczny.DTOs.PlanyDto
{
    public class PlanDto
    {
        public int Id { get; set; }
        public int KlasaId { get; set; }
        public string KlasaNazwa { get; set; }
        public int SemestrId { get; set; }
        public string SemestrNazwa { get; set; }
    }
}
