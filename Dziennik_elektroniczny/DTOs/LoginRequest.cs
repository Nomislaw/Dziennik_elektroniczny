using System.ComponentModel.DataAnnotations;

namespace Dziennik_elektroniczny.DTOs;

public class LoginRequest
{
    [Required]
    [EmailAddress(ErrorMessage = "Niepoprawny adres e-mail.")]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}