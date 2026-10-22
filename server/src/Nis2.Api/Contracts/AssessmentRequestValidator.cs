using System.Text.RegularExpressions;
using Nis2.Api.Domain;

namespace Nis2.Api.Contracts;

public static partial class AssessmentRequestValidator
{
    public const int MaxAnswers = 100;

    // Område 1–10, fråga 1–9: "1.1" … "10.4"
    [GeneratedRegex(@"^(10|[1-9])\.[1-9]$")]
    private static partial Regex QuestionIdPattern();

    /// <summary>Returnerar valideringsfel per fält. Tom ordbok betyder giltig request.</summary>
    public static Dictionary<string, string[]> Validate(AssessmentRequest request)
    {
        var errors = new Dictionary<string, string[]>();

        if (request.Sector is not null && !Sectors.IsKnown(request.Sector))
            errors["sector"] = [$"Okänd sektor: '{request.Sector}'."];

        if (request.Employees is not null && !EmployeeBands.All.Contains(request.Employees))
            errors["employees"] = [$"Måste vara en av: {string.Join(", ", EmployeeBands.All)}."];

        if (request.Turnover is not null && !TurnoverBands.All.Contains(request.Turnover))
            errors["turnover"] = [$"Måste vara en av: {string.Join(", ", TurnoverBands.All)}."];

        var answers = request.Answers ?? [];
        if (answers.Count > MaxAnswers)
        {
            errors["answers"] = [$"Högst {MaxAnswers} svar tillåts."];
            return errors;
        }

        var answerErrors = new List<string>();
        foreach (var (questionId, value) in answers)
        {
            if (!QuestionIdPattern().IsMatch(questionId))
                answerErrors.Add($"Ogiltigt fråge-id: '{questionId}'.");
            else if (!AnswerValueMapping.TryParse(value, out _))
                answerErrors.Add($"Ogiltigt svar på fråga {questionId}: '{value}'. Tillåtna värden: ja, delvis, nej.");
        }
        if (answerErrors.Count > 0)
            errors["answers"] = [.. answerErrors];

        return errors;
    }
}
