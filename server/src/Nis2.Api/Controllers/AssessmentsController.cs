using Microsoft.AspNetCore.Mvc;
using Nis2.Api.Contracts;
using Nis2.Api.Services;

namespace Nis2.Api.Controllers;

[ApiController]
[Route("api/assessments")]
[Produces("application/json")]
public class AssessmentsController(IAssessmentService service) : ControllerBase
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType<AssessmentResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var result = await service.GetAsync(id, ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [ProducesResponseType<AssessmentResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(AssessmentRequest request, CancellationToken ct)
    {
        if (Invalid(request) is { } problem) return problem;

        var created = await service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<AssessmentResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, AssessmentRequest request, CancellationToken ct)
    {
        if (Invalid(request) is { } problem) return problem;

        var updated = await service.UpdateAsync(id, request, ct);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) =>
        await service.DeleteAsync(id, ct) ? NoContent() : NotFound();

    private IActionResult? Invalid(AssessmentRequest request)
    {
        var errors = AssessmentRequestValidator.Validate(request);
        if (errors.Count == 0) return null;

        foreach (var (field, messages) in errors)
            foreach (var message in messages)
                ModelState.AddModelError(field, message);
        return ValidationProblem(ModelState);
    }
}
