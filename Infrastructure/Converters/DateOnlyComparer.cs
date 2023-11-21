using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Infrastructure.Converters;

public class DateOnlyComparer : ValueComparer<DateOnly>
{
    public DateOnlyComparer() : base
        (
            (first, second) => first.Equals(second),
            dateOnly => dateOnly.GetHashCode()
        ) { }
}