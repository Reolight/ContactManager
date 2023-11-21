using System.Linq.Expressions;

namespace Infrastructure.Repositories.Interfaces;

public interface IRepository<T> 
    where T : class
{
    public T Create(T item);
    public void Update(T item);
    public void Delete(T item);
    public IQueryable<T> FindAll();
    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);
}