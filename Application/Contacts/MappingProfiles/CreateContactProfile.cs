using Application.Contacts.Dto;
using Mapster;
using Core;

namespace Application.Contacts.MappingProfiles;

public class CreateContactProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateContactDto, Contact>()
            .Map(contact => contact.BirthDate,
                dto => DateOnly.FromDateTime(DateTime.Parse(dto.BirthDate)));
    }
}