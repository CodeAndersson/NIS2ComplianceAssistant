using Microsoft.AspNetCore.Diagnostics;

namespace Nis2.Api;

/// <summary>
/// Kestrel kastar <see cref="BadHttpRequestException"/> när t.ex. en request-body är för stor.
/// Utan den här hanteraren gör <c>UseExceptionHandler</c> om det till 500. Här behålls statuskoden (413).
/// </summary>
public sealed class BadHttpRequestExceptionHandler(IProblemDetailsService problemDetails) : IExceptionHandler
{
    public ValueTask<bool> TryHandleAsync(HttpContext http, Exception exception, CancellationToken ct)
    {
        if (exception is not BadHttpRequestException bad) return ValueTask.FromResult(false);

        http.Response.StatusCode = bad.StatusCode;
        return problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = http,
            ProblemDetails = { Status = bad.StatusCode },
        });
    }
}
