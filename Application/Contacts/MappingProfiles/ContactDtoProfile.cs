using Core;
using Mapster;

namespace Application.Contacts.MappingProfiles;

public class ContactDtoProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ContactDto, Contact>()
            .Map(contact => contact.BirthDate,
                dto => DateOnly.FromDateTime(DateTime.Parse(dto.BirthDate)));
    }
}