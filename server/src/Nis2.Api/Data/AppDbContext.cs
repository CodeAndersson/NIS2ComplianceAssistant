using Microsoft.EntityFrameworkCore;
using Nis2.Api.Domain;

namespace Nis2.Api.Data;

/// <summary>
/// Datamodellen, gemensam för alla databaser. Migrationer är provider-specifika, så varje databas
/// har en egen subklass (<see cref="SqliteAppDbContext"/>, <see cref="SqlServerAppDbContext"/>)
/// med egna migrationer. Resten av appen beror bara på den här klassen.
/// </summary>
public abstract class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Assessment> Assessments => Set<Assessment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Assessment>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.Sector).HasMaxLength(100);
            e.Property(a => a.Employees).HasMaxLength(20);
            e.Property(a => a.Turnover).HasMaxLength(20);
            e.HasMany(a => a.Answers)
                .WithOne()
                .HasForeignKey(x => x.AssessmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Answer>(e =>
        {
            e.ToTable("Answers");
            e.HasKey(x => x.Id);
            e.Property(x => x.QuestionId).HasMaxLength(10).IsRequired();
            e.Property(x => x.Value).HasConversion<string>().HasMaxLength(10);
            e.HasIndex(x => new { x.AssessmentId, x.QuestionId }).IsUnique();
        });
    }
}
