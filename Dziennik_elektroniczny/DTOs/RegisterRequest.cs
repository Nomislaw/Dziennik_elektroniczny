using System.ComponentModel.DataAnnotations;

public class RegisterRequest
{
    [Required]
    [MinLength(8, ErrorMessage = "Hasło musi mieć co najmniej 8 znaków.")]
    [RegularExpression(
        @"^(?=(?:.*\d){3,})(?=.*[A-Z])(?=.*[\W_]).+$",
        ErrorMessage = "Hasło musi zawierać co najmniej 3 cyfry, 1 wielką literę i 1 znak specjalny."
    )]
    public string Password { get; set; } = "";

    [Required]
    public string FirstName { get; set; } = "";

    [Required]
    public string LastName { get; set; } = "";

    [Required]
    [EmailAddress(ErrorMessage = "Niepoprawny adres e-mail.")]
    public string Email { get; set; } = "";
    
}