namespace Dziennik_elektroniczny.DTOs
{
    public class RodzicDto
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public bool CzyEmailPotwierdzony { get; set; }
        public List<UczenSimpleDto> Dzieci { get; set; }
    }
}
