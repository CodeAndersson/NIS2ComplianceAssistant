namespace Nis2.Api.Domain;

public enum ScopeStatus { NotCovered, Covered }

public enum EntityCategory { Essential, Important }

public sealed record ScopeResult(ScopeStatus Status, EntityCategory? Category, string Explanation);

/// <summary>
/// Preliminär bedömning av om en verksamhet omfattas av cybersäkerhetslagen (2025:1506).
/// Samma regler som i frontendens <c>bedomOmfattning</c>, så att servern kan räkna fram
/// klassificeringen själv i stället för att lita på klienten.
/// </summary>
public static class ScopeAssessor
{
    public static ScopeResult Assess(string? sector, string? employees, string? turnover)
    {
        if (string.IsNullOrEmpty(sector) || sector == Sectors.None)
        {
            return new(ScopeStatus.NotCovered, null,
                "Verksamheten tillhör ingen av sektorerna i bilaga 1 eller 2 till NIS2-direktivet.");
        }

        if (employees == EmployeeBands.Under50 && turnover == TurnoverBands.Under10)
        {
            return new(ScopeStatus.NotCovered, null,
                "Verksamheten ligger under tröskelvärdena (minst 50 anställda eller 10 MEUR omsättning). " +
                "Notera att vissa kritiska verksamheter omfattas oavsett storlek — kontrollera MCFFS 2026:1.");
        }

        var isLarge = employees == EmployeeBands.Over250 || turnover == TurnoverBands.Over50;
        var isAnnex1 = Sectors.Annex1.Contains(sector);

        if (isAnnex1 && isLarge)
        {
            return new(ScopeStatus.Covered, EntityCategory.Essential,
                "Stor verksamhet inom en sektor med hög kritikalitet (bilaga 1). Klassificeras som väsentlig verksamhetsutövare.");
        }

        return new(ScopeStatus.Covered, EntityCategory.Important, isAnnex1
            ? "Medelstor verksamhet inom en sektor med hög kritikalitet (bilaga 1). Klassificeras som viktig verksamhetsutövare."
            : "Verksamhet inom en annan kritisk sektor (bilaga 2). Klassificeras som viktig verksamhetsutövare.");
    }
}
