using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;

namespace Nis2.Api;

/// <summary>Gränser för API:t, från konfigurationssektionen <c>RateLimiting</c>.</summary>
public sealed class RateLimitSettings
{
    public int PermitLimit { get; set; } = 30;
    public TimeSpan Window { get; set; } = TimeSpan.FromMinutes(1);
}

public static class RateLimiting
{
    /// <summary>Fast fönster per klient-IP för <c>/api/assessments</c>.</summary>
    public const string PerClientPolicy = "per-client";

    public static IServiceCollection AddApiRateLimiting(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<RateLimitSettings>(config.GetSection("RateLimiting"));

        return services.AddRateLimiter(o =>
        {
            o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            o.OnRejected = (context, _) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
                return ValueTask.CompletedTask;
            };

            // Gränserna läses per anrop så att tester (och App Service-inställningar) kan ändra dem.
            o.AddPolicy(PerClientPolicy, http =>
            {
                var settings = http.RequestServices.GetRequiredService<IOptions<RateLimitSettings>>().Value;
                return RateLimitPartition.GetFixedWindowLimiter(
                    http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = settings.PermitLimit,
                        Window = settings.Window,
                        QueueLimit = 0,
                    });
            });
        });
    }
}
