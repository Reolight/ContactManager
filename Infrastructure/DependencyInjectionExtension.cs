using Core;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjectionExtension
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(builder =>
            builder.UseSqlServer(connectionString));
        
        services.AddScoped<IRepository<Contact>, ContactRepository>();
        services.AddScoped<IRepositoryAsync<Contact>, ContactRepository>();
        
        return services;
    }
}