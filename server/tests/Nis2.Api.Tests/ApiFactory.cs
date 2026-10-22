using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Nis2.Api.Data;

namespace Nis2.Api.Tests;

/// <summary>Startar hela API:t i minnet med en SQLite-databas som bara lever under testet.</summary>
public sealed class ApiFactory : WebApplicationFactory<Program>
{
    public const string AllowedOrigin = "https://frontend.example";

    private readonly SqliteConnection _connection = new("Data Source=:memory:");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        _connection.Open();
        builder.UseEnvironment("Testing");
        builder.UseSetting("Database:MigrateOnStartup", "true");
        builder.UseSetting("Cors:AllowedOrigins:0", AllowedOrigin);
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<SqliteAppDbContext>>();
            services.AddDbContext<AppDbContext, SqliteAppDbContext>(o => o.UseSqlite(_connection));
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing) _connection.Dispose();
    }
}
