namespace Dziennik_elektroniczny.DTOs.ZajeciaDto
{
    public class ZajeciaDetailsDto
    {
        public int Id { get; set; }
        public string Przedmiot { get; set; }
        public string Grupa { get; set; } // Nazwa klasy z planu
        public string Godzina { get; set; } // Format: "08:00-08:45"
        public string Sala { get; set; }
        public string DzienTygodnia { get; set; }
    }
}
