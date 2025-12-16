using System.ComponentModel.DataAnnotations;

namespace Dziennik_elektroniczny.DTOs.UzytkownikDto
{
    public class UzytkownikBaseDto
    {
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        [MinLength(8, ErrorMessage = "Hasło musi mieć co najmniej 8 znaków.")]
        [RegularExpression(
            @"^(?=(?:.*\d){3,})(?=.*[A-Z])(?=.*[\W_]).+$",
            ErrorMessage = "Hasło musi zawierać co najmniej 3 cyfry, 1 wielką literę i 1 znak specjalny."
        )]
        public string Haslo { get; set; }
    }
}
