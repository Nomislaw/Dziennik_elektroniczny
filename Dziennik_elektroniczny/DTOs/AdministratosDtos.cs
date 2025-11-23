namespace Dziennik_elektroniczny.DTOs;

// DTO do wyświetlania administratora
public class AdministratorDto
{
    public int Id { get; set; }
    public string Imie { get; set; } = string.Empty;
    public string Nazwisko { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool CzyEmailPotwierdzony { get; set; }
}

// DTO do dodawania administratora
public class DodajAdministratoraDto
{
    public string Imie { get; set; } = string.Empty;
    public string Nazwisko { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Haslo { get; set; } = string.Empty;
}

// DTO do edytowania administratora
public class EdytujAdministratora
{
    public string Imie { get; set; } = string.Empty;
    public string Nazwisko { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
