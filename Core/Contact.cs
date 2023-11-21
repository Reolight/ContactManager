using System.ComponentModel.DataAnnotations;

namespace Core;

public class Contact
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MobilePhone { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public DateOnly BirthDate { get; set; }
}