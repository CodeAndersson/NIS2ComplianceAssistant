using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Nis2.Api;
using Nis2.Api.Data;
using Nis2.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAppDatabase(builder.Configuration);

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<IAssessmentService, AssessmentService>();

builder.Services.AddControllers();
builder.Services.AddApiRateLimiting(builder.Configuration);
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<BadHttpRequestExceptionHandler>();
builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>(tags: ["db"]);
builder.Services.AddOpenApi();

const string FrontendCors = "frontend";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddPolicy(FrontendCors, p => p
    .WithOrigins(allowedOrigins)
    .WithMethods("GET", "POST", "PUT", "DELETE")
    .WithHeaders("Content-Type")));

var app = builder.Build();

if (app.Configuration.GetValue("Database:MigrateOnStartup", true))
{
    using var scope = app.Services.CreateScope();
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    // Inbyggd OpenAPI-generering (/openapi/v1.json), visad med Swagger UI på /swagger.
    app.MapOpenApi();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/openapi/v1.json", "NIS2 API"));
}

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors(FrontendCors);
app.UseRateLimiter();

app.MapControllers();
// /health svarar utan att röra databasen. App Service pingar den varje minut, och en databaskoll
// där skulle hålla Azure SQL serverless vaken dygnet runt. /health/ready kontrollerar databasen.
app.MapHealthChecks("/health", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = c => c.Tags.Contains("db") });

app.Run();

// Gör Program synlig för integrationstesterna (WebApplicationFactory).
public partial class Program;
