using Nis2.Api.Domain;

namespace Nis2.Api.Contracts;

/// <summary>Det klienten skickar när en bedömning skapas eller uppdateras.</summary>
public sealed record AssessmentRequest(
    string? Sector,
    string? Employees,
    string? Turnover,
    Dictionary<string, string>? Answers);

public sealed record ScopeDto(string Status, string? Category, string Explanation)
{
    public static ScopeDto From(ScopeResult r) => new(
        r.Status == ScopeStatus.Covered ? "omfattad" : "ej-omfattad",
        r.Category switch
        {
            EntityCategory.Essential => "vasentlig",
            EntityCategory.Important => "viktig",
            _ => null,
        },
        r.Explanation);
}

public sealed record AssessmentResponse(
    Guid Id,
    string? Sector,
    string? Employees,
    string? Turnover,
    IReadOnlyDictionary<string, string> Answers,
    ScopeDto Scope,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt)
{
    public static AssessmentResponse From(Assessment a) => new(
        a.Id,
        a.Sector,
        a.Employees,
        a.Turnover,
        a.Answers.OrderBy(x => x.QuestionId, StringComparer.Ordinal)
                 .ToDictionary(x => x.QuestionId, x => x.Value.ToKey()),
        ScopeDto.From(ScopeAssessor.Assess(a.Sector, a.Employees, a.Turnover)),
        a.CreatedAt,
        a.UpdatedAt);
}
