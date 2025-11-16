using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;

namespace Dziennik_elektroniczny.Services
{
    public class UzytkownikService : IUzytkownikService
    {
        private readonly IGenericRepository<Uzytkownik> _uzytkownikRepository;
        public UzytkownikService(IGenericRepository<Uzytkownik> uzytkownikRepository)
        {
            _uzytkownikRepository = uzytkownikRepository;
        }

        public async Task Add(Uzytkownik user)
        {
            _uzytkownikRepository.Add(user);
            await _uzytkownikRepository.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var user = _uzytkownikRepository.GetByIdAsync(id).Result;
            if (user != null)
            {
                _uzytkownikRepository.Delete(user);
                await _uzytkownikRepository.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Uzytkownik>> GetAllAsync()
        {
            var users = await _uzytkownikRepository.GetAllAsync();
            foreach (var user in users)
            {
                user.HasloHash = null;
            }
            return users;
        }

        public async Task<Uzytkownik> GetByIdAsync(int id)
        {
            var user = await _uzytkownikRepository.GetByIdAsync(id);
            if (user != null)
            {
                user.HasloHash = null;
            }
            return user!;
        }

        public async Task<Uzytkownik?> PobierzUzytkownikaAsync(int id)
        {
            return await _uzytkownikRepository.GetByIdAsync(id);
        }

        public async Task Update(Uzytkownik user, int id)
        {
            if (user.Id != id)
            {
                throw new ArgumentException("ID użytkownika nie zgadza się z podanym ID.");
            }
            _uzytkownikRepository.Update(user);
            await _uzytkownikRepository.SaveChangesAsync();
        }

        public async Task<(bool success, string? message)> ZmienDaneAsync(int id, string? imie, string? nazwisko)
        {
            var user = await _uzytkownikRepository.GetByIdAsync(id);
            if (user == null)
                return (false, "Nie znaleziono użytkownika.");

            if (!string.IsNullOrWhiteSpace(imie))
                user.Imie = imie;

            if (!string.IsNullOrWhiteSpace(nazwisko))
                user.Nazwisko = nazwisko;

            _uzytkownikRepository.Update(user);
            var result = await _uzytkownikRepository.SaveChangesAsync();

            return result
                ? (true, null)
                : (false, "Nie udało się zapisać zmian w bazie.");
        }

        public async Task<(bool success, string? message)> ZmienHasloAsync(int id, string stareHaslo, string noweHaslo)
        {
            var user = await _uzytkownikRepository.GetByIdAsync(id);
            if (user == null)
            {
                return (false, "Użytkownik nie znaleziony.");
            }
            if (!user.SprawdzHaslo(stareHaslo))
            {
                return (false, "Stare hasło jest nieprawidłowe.");
            }

            user.UstawHaslo(noweHaslo);
            _uzytkownikRepository.Update(user);
            var result = await _uzytkownikRepository.SaveChangesAsync();
            return result ? (true, null) : (false, "Nie udało się zmienić hasła.");
        }

        public async Task<(bool success, string? message)> ZmienEmailAsync(int id, string nowyEmail)
        {
            if (string.IsNullOrWhiteSpace(nowyEmail))
                return (false, "Email nie może być pusty.");

            var user = await _uzytkownikRepository.GetByIdAsync(id);
            if (user == null)
                return (false, "Nie znaleziono użytkownika.");

            user.Email = nowyEmail;

            _uzytkownikRepository.Update(user);
            var saved = await _uzytkownikRepository.SaveChangesAsync();

            return saved ? (true, null) : (false, "Nie udało się zaktualizować emaila.");
        }

        public async Task<(bool success, string? message)> ZmienRoleAsync(int userId, Rola nowaRola)
        {
            var user = await _uzytkownikRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return (false, "Nie znaleziono użytkownika.");
            }
            user.Rola = nowaRola;
            _uzytkownikRepository.Update(user);
            var saved = await _uzytkownikRepository.SaveChangesAsync();
            return saved ? (true, null) : (false, "Nie udało się zaktualizować roli użytkownika");
        }
    }
}
