using System.Linq.Expressions;
using Core;
using Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ContactRepository : IRepository<Contact>, IRepositoryAsync<Contact>
{
    private readonly AppDbContext _context;

    public ContactRepository(AppDbContext context) => _context = context;

    public Contact Create(Contact item)
    {
        var entity = _context.Set<Contact>()
            .Add(item).Entity;
        _context.SaveChanges();
        return entity;
    }

    public void Update(Contact item)
    {
        _context.Set<Contact>()
            .Update(item);
        _context.SaveChanges();
    }

    public void Delete(Contact item)
    {
        _context.Set<Contact>()
            .Remove(item);
        _context.SaveChanges();
    }

    public IQueryable<Contact> FindAll()
        => _context.Set<Contact>().AsNoTracking();

    public IQueryable<Contact> FindByCondition(Expression<Func<Contact, bool>> expression)
        => _context.Set<Contact>()
            .Where(expression)
            .AsNoTracking();

    public async Task<Contact> CreateAsync(Contact item)
    {
        var entity = _context.Set<Contact>()
            .Add(item).Entity;
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Contact item)
    {
        _context.Set<Contact>()
            .Update(item);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Contact item)
    {
        _context.Set<Contact>()
            .Remove(item);
        await _context.SaveChangesAsync();
    }

    public Task<IQueryable<Contact>> FindAllAsync()
        => Task.FromResult(FindAll());

    public Task<IQueryable<Contact>> FindByConditionAsync(Expression<Func<Contact, bool>> expression)
        => Task.FromResult(FindByCondition(expression));
}