using System.Linq.Expressions;

namespace Infrastructure.Repositories.Interfaces;

public interface IRepositoryAsync<T>
    where T: class
{
    public Task<T> CreateAsync(T item);
    public Task UpdateAsync(T item);
    public Task DeleteAsync(T item);
    public Task<IQueryable<T>> FindAllAsync();
    public Task<IQueryable<T>> FindByConditionAsync(Expression<Func<T, bool>> expression);
}