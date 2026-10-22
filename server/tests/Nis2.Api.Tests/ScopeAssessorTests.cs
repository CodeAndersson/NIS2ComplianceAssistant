using Nis2.Api.Domain;

namespace Nis2.Api.Tests;

public class ScopeAssessorTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("ingen")]
    public void Not_covered_without_sector(string? sector)
    {
        var result = ScopeAssessor.Assess(sector, "250+", "50+");
        Assert.Equal(ScopeStatus.NotCovered, result.Status);
        Assert.Null(result.Category);
    }

    [Fact]
    public void Not_covered_below_both_thresholds()
    {
        var result = ScopeAssessor.Assess("Energi", "under-50", "under-10");
        Assert.Equal(ScopeStatus.NotCovered, result.Status);
    }

    [Theory]
    [InlineData("Energi", "250+", "10-50")]
    [InlineData("Transport", "50-249", "50+")]
    public void Large_annex1_entity_is_essential(string sector, string employees, string turnover)
    {
        var result = ScopeAssessor.Assess(sector, employees, turnover);
        Assert.Equal(ScopeStatus.Covered, result.Status);
        Assert.Equal(EntityCategory.Essential, result.Category);
    }

    [Fact]
    public void Medium_annex1_entity_is_important()
    {
        Assert.Equal(EntityCategory.Important, ScopeAssessor.Assess("Energi", "50-249", "10-50").Category);
    }

    [Theory]
    [InlineData("Tillverkning", "250+", "50+")]
    [InlineData("Forskning", "50-249", "under-10")]
    public void Annex2_entity_is_important_regardless_of_size(string sector, string employees, string turnover)
    {
        Assert.Equal(EntityCategory.Important, ScopeAssessor.Assess(sector, employees, turnover).Category);
    }

    [Theory]
    [InlineData("under-50", "10-50")]
    [InlineData("50-249", "under-10")]
    public void Exceeding_one_threshold_is_enough(string employees, string turnover)
    {
        Assert.Equal(ScopeStatus.Covered, ScopeAssessor.Assess("Energi", employees, turnover).Status);
    }
}
