public class NauczycielDto
{
    public int Id { get; set; }
    public string Imie { get; set; }
    public string Nazwisko { get; set; }
    public string Email { get; set; }
    public string Rola { get; set; }
    public bool CzyEmailPotwierdzony { get; set; }
    public bool CzyWychowawca { get; set; }
    public int? WychowawstwoKlasaId { get; set; }
    public string WychowawstwoKlasaNazwa { get; set; }
    public object[] Klasy { get; set; }  // object[] zamiast List<object>
    public List<int> KlasyIds { get; set; }
    public object[] Przedmioty { get; set; }  // object[] zamiast List<object>
    public List<int> PrzedmiotyIds { get; set; }
    public List<string> ProwadzonePrzedmioty { get; set; }
    public int LiczbaWystawionychOcen { get; set; }
}