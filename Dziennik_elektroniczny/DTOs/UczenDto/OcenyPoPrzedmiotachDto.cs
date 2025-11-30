namespace Dziennik_elektroniczny.DTOs.UczenDto
{
    public class OcenyPoPrzedmiotachDto
    {
        public string PrzedmiotNazwa { get; set; }
        public List<OcenaUczenDto> Oceny { get; set; }
        public float SredniaArytmetyczna { get; set; }
    }
}
