namespace Dziennik_elektroniczny.DTOs.UzytkownikDto
{
    public class EdytujRodzica
    {
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public List<int> DzieciIds { get; set; }
    }
}
