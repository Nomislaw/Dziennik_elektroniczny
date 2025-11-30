namespace Dziennik_elektroniczny.DTOs.UczenDto
{
    public class StatystykiFrekwencjiDto
    {
        public int LiczbaOgolem { get; set; }
        public int LiczbaObecnosci { get; set; }
        public int LiczbaNieobecnosci { get; set; }
        public int LiczbaSpoznien { get; set; }
        public int LiczbaUsprawiedliwionych { get; set; }
        public double ProcentObecnosci { get; set; }
    }
}
