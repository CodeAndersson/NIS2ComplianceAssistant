using System.Net;
using Microsoft.AspNetCore.Hosting;

namespace Nis2.Api.Tests;

public class RateLimitTests
{
    [Fact]
    public async Task Requests_over_the_limit_get_429_with_retry_after()
    {
        using var baseFactory = new ApiFactory();
        using var factory = baseFactory.WithWebHostBuilder(b => b.UseSetting("RateLimiting:PermitLimit", "3"));
        var client = factory.CreateClient();
        var url = $"/api/assessments/{Guid.NewGuid()}";

        for (var i = 0; i < 3; i++)
            Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync(url)).StatusCode);
        var limited = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.TooManyRequests, limited.StatusCode);
        Assert.True(limited.Headers.RetryAfter?.Delta > TimeSpan.Zero);
        // Hälsokontrollen omfattas inte, annars skulle App Service tro att appen är nere.
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/health")).StatusCode);
    }
}
