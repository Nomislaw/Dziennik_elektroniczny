using Dziennik_elektroniczny.Models;

namespace Dziennik_elektroniczny.Interfaces
{
    public interface IUzytkownikService
    {
        Task<IEnumerable<Uzytkownik>> GetAllAsync();
        Task<Uzytkownik> GetByIdAsync(int id);
        void Add(Uzytkownik user);
        void Update(Uzytkownik user, int id);
        void Delete(int id);
        Task<(bool success, string? message)> ZmienHasloAsync(int id, string stareHaslo, string noweHaslo);
        Task<(bool success, string? message)> ZmienDaneAsync(int id, string? imie, string? nazwisko);
        Task<(bool success, string? message)> ZmienEmailAsync(int id, string nowyEmail);
        Task<Uzytkownik?> PobierzUzytkownikaAsync(int id);
    }
}
