using Dziennik_elektroniczny.Models;

namespace Dziennik_elektroniczny.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllWithIncludesAsync(params string[] includes);
        Task<T?> GetByIdAsync(int id);
        Task<T> GetByIdWithIncludesAsync(int id, params string[] includes);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        bool Exists(int id);
        Task<bool> SaveChangesAsync();
    }
}
