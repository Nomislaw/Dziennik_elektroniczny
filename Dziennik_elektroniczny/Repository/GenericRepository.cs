using Dziennik_elektroniczny.Data;
using Dziennik_elektroniczny.Interfaces;
using Dziennik_elektroniczny.Models;
using Microsoft.EntityFrameworkCore;

namespace Dziennik_elektroniczny.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly AppDbContext _dbContext;
        public GenericRepository(AppDbContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public void Add(T entity)
        {
            _dbContext.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
        }

        public bool Exists(int id)
        {
            return _dbContext.Set<T>().Any(e => e.Id == id);
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            try
            {
                return await _dbContext.Set<T>()
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error in GetAllAsync for {typeof(T).Name}: {ex.Message}");
                throw;
            }
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            try
            {
                return await _dbContext.Set<T>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Id == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error in GetByIdAsync for {typeof(T).Name}: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            try
            {
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error in SaveChangesAsync: {ex.Message}");
                throw;
            }
        }

        public void Update(T entity)
        {
            _dbContext.Set<T>().Attach(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;
        }
    }
}
