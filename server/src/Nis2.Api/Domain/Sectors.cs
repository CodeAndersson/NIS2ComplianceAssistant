namespace Nis2.Api.Domain;

/// <summary>Sektorer enligt bilaga 1 och 2 till NIS2-direktivet (EU 2022/2555).</summary>
public static class Sectors
{
    public const string None = "ingen";

    public static readonly IReadOnlySet<string> Annex1 = new HashSet<string>(StringComparer.Ordinal)
    {
        "Energi", "Transport", "Bank- och finansmarknad", "Hälso- och sjukvård",
        "Dricksvatten", "Avloppsvatten", "Digital infrastruktur",
        "IKT-tjänsteförvaltning (B2B)", "Offentlig förvaltning", "Rymd",
    };

    public static readonly IReadOnlySet<string> Annex2 = new HashSet<string>(StringComparer.Ordinal)
    {
        "Post- och budtjänster", "Avfallshantering",
        "Tillverkning, produktion och distribution av kemikalier",
        "Produktion, bearbetning och distribution av livsmedel",
        "Tillverkning", "Digitala leverantörer", "Forskning",
    };

    public static bool IsKnown(string sector) =>
        sector == None || Annex1.Contains(sector) || Annex2.Contains(sector);
}

public static class EmployeeBands
{
    public const string Under50 = "under-50";
    public const string From50To249 = "50-249";
    public const string Over250 = "250+";
    public static readonly IReadOnlySet<string> All = new HashSet<string> { Under50, From50To249, Over250 };
}

public static class TurnoverBands
{
    public const string Under10 = "under-10";
    public const string From10To50 = "10-50";
    public const string Over50 = "50+";
    public static readonly IReadOnlySet<string> All = new HashSet<string> { Under10, From10To50, Over50 };
}
