using Microsoft.EntityFrameworkCore;

namespace Nis2.Api.Data;

public enum DatabaseProvider
{
    Sqlite,
    SqlServer,
}

public static class DatabaseSetup
{
    /// <summary>Registrerar <see cref="AppDbContext"/> mot den databas som anges i <c>Database:Provider</c>.</summary>
    public static IServiceCollection AddAppDatabase(this IServiceCollection services, IConfiguration config)
    {
        var provider = config.GetValue("Database:Provider", DatabaseProvider.Sqlite);
        var connectionString = config.GetConnectionString("Default")
            ?? throw new InvalidOperationException("ConnectionStrings:Default saknas.");

        return provider switch
        {
            DatabaseProvider.Sqlite => services.AddDbContext<AppDbContext, SqliteAppDbContext>(o =>
                o.UseSqlite(connectionString)),

            // Azure SQL serverless pausar när den inte används och kan ge tillfälliga fel medan den
            // vaknar. Retry-strategin gör om anropet i stället för att svara 500.
            DatabaseProvider.SqlServer => services.AddDbContext<AppDbContext, SqlServerAppDbContext>(o =>
                o.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure(
                    maxRetryCount: 6, maxRetryDelay: TimeSpan.FromSeconds(10), errorNumbersToAdd: null))),

            _ => throw new InvalidOperationException($"Okänd databas-provider: {provider}."),
        };
    }
}
