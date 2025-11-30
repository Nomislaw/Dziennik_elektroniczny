namespace Dziennik_elektroniczny.DTOs.UczenDto
{
    public class PodsumowaniePaneluUczniaDto
    {
        public string ImieNazwisko { get; set; }
        public string KlasaNazwa { get; set; }
        public float SredniaOcen { get; set; }
        public List<OcenaUczenDto> OstatnieOceny { get; set; }
        public List<ZajeciaUczniaDto> PlanLekcji { get; set; }
        public double ProcentObecnosci { get; set; }
    }
}
