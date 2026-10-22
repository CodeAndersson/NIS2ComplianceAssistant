using Nis2.Api.Contracts;

namespace Nis2.Api.Tests;

public class AssessmentRequestValidatorTests
{
    private static AssessmentRequest Valid(Dictionary<string, string>? answers = null) =>
        new("Energi", "50-249", "10-50", answers ?? new() { ["1.1"] = "ja", ["10.4"] = "nej" });

    [Fact]
    public void Valid_request_has_no_errors()
    {
        Assert.Empty(AssessmentRequestValidator.Validate(Valid()));
    }

    [Fact]
    public void Empty_draft_is_valid()
    {
        Assert.Empty(AssessmentRequestValidator.Validate(new AssessmentRequest(null, null, null, null)));
    }

    [Fact]
    public void Rejects_unknown_sector_and_bands()
    {
        var errors = AssessmentRequestValidator.Validate(new AssessmentRequest("Glass", "många", "1000", null));
        Assert.Contains("sector", errors.Keys);
        Assert.Contains("employees", errors.Keys);
        Assert.Contains("turnover", errors.Keys);
    }

    [Theory]
    [InlineData("0.1")]
    [InlineData("11.1")]
    [InlineData("1.0")]
    [InlineData("abc")]
    [InlineData("1.1; DROP TABLE")]
    public void Rejects_invalid_question_ids(string questionId)
    {
        var errors = AssessmentRequestValidator.Validate(Valid(new() { [questionId] = "ja" }));
        Assert.Contains("answers", errors.Keys);
    }

    [Theory]
    [InlineData("kanske")]
    [InlineData("JA")]
    [InlineData("")]
    public void Rejects_invalid_answer_values(string value)
    {
        var errors = AssessmentRequestValidator.Validate(Valid(new() { ["1.1"] = value }));
        Assert.Contains("answers", errors.Keys);
    }

    [Fact]
    public void Rejects_too_many_answers()
    {
        var many = Enumerable.Range(0, AssessmentRequestValidator.MaxAnswers + 1)
            .ToDictionary(i => $"x{i}", _ => "ja");
        Assert.Contains("answers", AssessmentRequestValidator.Validate(Valid(many)).Keys);
    }
}
