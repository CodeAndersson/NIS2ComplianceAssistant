using Microsoft.EntityFrameworkCore;
using Nis2.Api.Contracts;
using Nis2.Api.Data;
using Nis2.Api.Domain;

namespace Nis2.Api.Services;

public interface IAssessmentService
{
    Task<AssessmentResponse?> GetAsync(Guid id, CancellationToken ct);
    Task<AssessmentResponse> CreateAsync(AssessmentRequest request, CancellationToken ct);
    Task<AssessmentResponse?> UpdateAsync(Guid id, AssessmentRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public class AssessmentService(AppDbContext db, TimeProvider clock) : IAssessmentService
{
    public async Task<AssessmentResponse?> GetAsync(Guid id, CancellationToken ct)
    {
        var assessment = await db.Assessments
            .AsNoTracking()
            .Include(a => a.Answers)
            .SingleOrDefaultAsync(a => a.Id == id, ct);

        return assessment is null ? null : AssessmentResponse.From(assessment);
    }

    public async Task<AssessmentResponse> CreateAsync(AssessmentRequest request, CancellationToken ct)
    {
        var now = clock.GetUtcNow();
        var assessment = new Assessment { Id = Guid.NewGuid(), CreatedAt = now };
        Apply(assessment, request, now);

        db.Assessments.Add(assessment);
        await db.SaveChangesAsync(ct);
        return AssessmentResponse.From(assessment);
    }

    public async Task<AssessmentResponse?> UpdateAsync(Guid id, AssessmentRequest request, CancellationToken ct)
    {
        var assessment = await db.Assessments
            .Include(a => a.Answers)
            .SingleOrDefaultAsync(a => a.Id == id, ct);
        if (assessment is null) return null;

        Apply(assessment, request, clock.GetUtcNow());
        await db.SaveChangesAsync(ct);
        return AssessmentResponse.From(assessment);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) =>
        await db.Assessments.Where(a => a.Id == id).ExecuteDeleteAsync(ct) > 0;

    /// <summary>Ersätter bedömningens uppgifter och svar med det som finns i requesten.</summary>
    private static void Apply(Assessment assessment, AssessmentRequest request, DateTimeOffset now)
    {
        assessment.Sector = request.Sector;
        assessment.Employees = request.Employees;
        assessment.Turnover = request.Turnover;
        assessment.UpdatedAt = now;

        var incoming = (request.Answers ?? [])
            .ToDictionary(kv => kv.Key, kv => AnswerValueMapping.TryParse(kv.Value, out var v) ? v : AnswerValue.No);

        // Ta bort svar som inte längre finns, uppdatera befintliga och lägg till nya.
        assessment.Answers.RemoveAll(a => !incoming.ContainsKey(a.QuestionId));
        foreach (var (questionId, value) in incoming)
        {
            var existing = assessment.Answers.Find(a => a.QuestionId == questionId);
            if (existing is not null)
                existing.Value = value;
            else
                assessment.Answers.Add(new Answer { QuestionId = questionId, Value = value });
        }
    }
}
