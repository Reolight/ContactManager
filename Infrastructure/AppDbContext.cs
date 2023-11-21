using Core;
using Infrastructure.Converters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class AppDbContext : DbContext
{
    public DbSet<Contact> Contacts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Contact>()
            .Property(contact => contact.Name)
            .HasMaxLength(32);
        modelBuilder.Entity<Contact>()
            .Property(contact => contact.JobTitle)
            .HasMaxLength(32);
        modelBuilder.Entity<Contact>()
            .Property(contact => contact.MobilePhone)
            .HasMaxLength(12);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);

        configurationBuilder.Properties<DateOnly>()
            .HaveConversion<DateOnlyConverter, DateOnlyComparer>()
            .HaveColumnType("date");
    }
}