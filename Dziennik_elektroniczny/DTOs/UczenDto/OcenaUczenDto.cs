namespace Dziennik_elektroniczny.DTOs.UczenDto
{
    public class OcenaUczenDto
    {
        public int Id { get; set; }
        public string PrzedmiotNazwa { get; set; }
        public float Wartosc { get; set; }
        public string TypOceny { get; set; }
        public string Opis { get; set; }
        public DateTime DataWystawienia { get; set; }
        public string Nauczyciel { get; set; }
    }
}
