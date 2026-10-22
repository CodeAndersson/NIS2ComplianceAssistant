namespace Nis2.Api.Domain;

/// <summary>Svar på en fråga i gap-analysen.</summary>
public enum AnswerValue
{
    No = 0,
    Partly = 1,
    Yes = 2,
}

public static class AnswerValueMapping
{
    // Frontend och API använder samma svenska nycklar som i gränssnittet.
    private static readonly Dictionary<string, AnswerValue> FromKey = new(StringComparer.Ordinal)
    {
        ["ja"] = AnswerValue.Yes,
        ["delvis"] = AnswerValue.Partly,
        ["nej"] = AnswerValue.No,
    };

    public static IReadOnlyCollection<string> ValidKeys => FromKey.Keys;

    public static bool TryParse(string? key, out AnswerValue value) =>
        FromKey.TryGetValue(key ?? string.Empty, out value);

    public static string ToKey(this AnswerValue value) => value switch
    {
        AnswerValue.Yes => "ja",
        AnswerValue.Partly => "delvis",
        AnswerValue.No => "nej",
        _ => throw new ArgumentOutOfRangeException(nameof(value), value, null),
    };
}
