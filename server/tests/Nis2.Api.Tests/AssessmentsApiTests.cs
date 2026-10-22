using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Nis2.Api.Contracts;

namespace Nis2.Api.Tests;

public class AssessmentsApiTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client;

    public AssessmentsApiTests(ApiFactory factory) => _client = factory.CreateClient();

    private static AssessmentRequest Request(Dictionary<string, string> answers) =>
        new("Energi", "250+", "50+", answers);

    private async Task<AssessmentResponse> CreateAsync(Dictionary<string, string> answers)
    {
        var response = await _client.PostAsJsonAsync("/api/assessments", Request(answers));
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<AssessmentResponse>())!;
    }

    [Fact]
    public async Task Create_returns_201_with_location_and_server_side_scope()
    {
        var response = await _client.PostAsJsonAsync("/api/assessments",
            Request(new() { ["1.1"] = "ja", ["2.1"] = "delvis" }));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<AssessmentResponse>();
        Assert.NotNull(body);
        Assert.Equal($"/api/assessments/{body.Id}", response.Headers.Location?.AbsolutePath);
        Assert.Equal("omfattad", body.Scope.Status);
        Assert.Equal("vasentlig", body.Scope.Category);
        Assert.Equal("delvis", body.Answers["2.1"]);
    }

    [Fact]
    public async Task Get_returns_saved_assessment()
    {
        var created = await CreateAsync(new() { ["3.1"] = "nej" });

        var fetched = await _client.GetFromJsonAsync<AssessmentResponse>($"/api/assessments/{created.Id}");

        Assert.Equal(created.Id, fetched!.Id);
        Assert.Equal("nej", fetched.Answers["3.1"]);
    }

    [Fact]
    public async Task Update_replaces_answers()
    {
        var created = await CreateAsync(new() { ["1.1"] = "nej", ["1.2"] = "nej" });

        var response = await _client.PutAsJsonAsync($"/api/assessments/{created.Id}",
            Request(new() { ["1.1"] = "ja", ["1.3"] = "delvis" }));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await _client.GetFromJsonAsync<AssessmentResponse>($"/api/assessments/{created.Id}");
        Assert.Equal(new Dictionary<string, string> { ["1.1"] = "ja", ["1.3"] = "delvis" }, updated!.Answers);
        Assert.True(updated.UpdatedAt >= created.UpdatedAt);
    }

    [Fact]
    public async Task Delete_removes_assessment()
    {
        var created = await CreateAsync(new() { ["1.1"] = "ja" });

        var delete = await _client.DeleteAsync($"/api/assessments/{created.Id}");
        var get = await _client.GetAsync($"/api/assessments/{created.Id}");

        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, get.StatusCode);
    }

    [Fact]
    public async Task Unknown_id_returns_404()
    {
        Assert.Equal(HttpStatusCode.NotFound, (await _client.GetAsync($"/api/assessments/{Guid.NewGuid()}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound,
            (await _client.PutAsJsonAsync($"/api/assessments/{Guid.NewGuid()}", Request([]))).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await _client.DeleteAsync($"/api/assessments/{Guid.NewGuid()}")).StatusCode);
    }

    [Fact]
    public async Task Invalid_request_returns_validation_problem()
    {
        var response = await _client.PostAsJsonAsync("/api/assessments",
            new AssessmentRequest("Energi", "massor", "50+", new() { ["99.9"] = "kanske" }));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.Contains("employees", problem!.Errors.Keys);
        Assert.Contains("answers", problem.Errors.Keys);
    }

    [Fact]
    public async Task Health_endpoint_reports_healthy()
    {
        var response = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Healthy", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Readiness_endpoint_checks_database()
    {
        var response = await _client.GetAsync("/health/ready");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Healthy", await response.Content.ReadAsStringAsync());
    }

    [Theory]
    [InlineData(ApiFactory.AllowedOrigin, true)]
    [InlineData("https://evil.example", false)]
    public async Task Cors_allows_only_configured_origins(string origin, bool allowed)
    {
        using var request = new HttpRequestMessage(HttpMethod.Options, "/api/assessments");
        request.Headers.Add("Origin", origin);
        request.Headers.Add("Access-Control-Request-Method", "POST");

        var response = await _client.SendAsync(request);

        Assert.Equal(allowed, response.Headers.Contains("Access-Control-Allow-Origin"));
    }
}
