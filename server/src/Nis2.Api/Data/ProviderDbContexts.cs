using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Nis2.Api.Data;

/// <summary>SQLite för lokal utveckling och tester. Migrationer i Data/Migrations/Sqlite.</summary>
public sealed class SqliteAppDbContext(DbContextOptions<SqliteAppDbContext> options) : AppDbContext(options);

/// <summary>Azure SQL / SQL Server i produktion. Migrationer i Data/Migrations/SqlServer.</summary>
public sealed class SqlServerAppDbContext(DbContextOptions<SqlServerAppDbContext> options) : AppDbContext(options);

/// <summary>
/// Låter <c>dotnet ef migrations add --context SqlServerAppDbContext</c> skapa kontexten utan att
/// appen är konfigurerad för SQL Server. Anslutningssträngen används inte när migrationer genereras.
/// </summary>
public sealed class SqlServerDesignTimeFactory : IDesignTimeDbContextFactory<SqlServerAppDbContext>
{
    public SqlServerAppDbContext CreateDbContext(string[] args) =>
        new(new DbContextOptionsBuilder<SqlServerAppDbContext>()
            .UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=Nis2DesignTime")
            .Options);
}
