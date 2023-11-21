using Application.Contacts.Dto;
using Mapster;

namespace Application.Contacts.MappingProfiles;

public class ContactProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ContactDto, Core.Contact>()
            .Map(contact => contact.BirthDate,
                dto => DateOnly.Parse(dto.BirthDate));
    }
}