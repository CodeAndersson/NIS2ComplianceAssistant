namespace Nis2.Api.Domain;

/// <summary>En sparad NIS2-bedömning: omfattningsuppgifter och svar i gap-analysen.</summary>
public class Assessment
{
    public Guid Id { get; set; }
    public string? Sector { get; set; }
    public string? Employees { get; set; }
    public string? Turnover { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public List<Answer> Answers { get; set; } = [];
}

public class Answer
{
    public int Id { get; set; }
    public Guid AssessmentId { get; set; }

    /// <summary>Fråge-id, t.ex. "1.1" eller "10.4".</summary>
    public string QuestionId { get; set; } = string.Empty;

    public AnswerValue Value { get; set; }
}
