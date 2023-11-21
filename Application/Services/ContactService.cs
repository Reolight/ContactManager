using Application.Contacts.Dto;
using Core;
using Infrastructure.Repositories.Interfaces;
using Mapster;

namespace Application.Services;

public class ContactService : IContactService
{
    private readonly IRepositoryAsync<Contact> _repository;

    public ContactService(IRepositoryAsync<Contact> repository) => _repository = repository;

    public async Task<ContactDto> AddContactAsync(ContactDto contactDto)
    {
        var contact = contactDto.Adapt<Contact>();
        return (await _repository.CreateAsync(contact)).Adapt<ContactDto>();
    }

    public async Task UpdateContactAsync(Guid id, ContactDto contactDto)
    {
        var contact = contactDto.Adapt<Contact>();
        await _repository.UpdateAsync(contact);
    }

    public async Task RemoveContactAsync(Guid id)
    {
        if ((await _repository.FindByConditionAsync(contact => contact.Id == id)).FirstOrDefault() 
                is not {} remContact)
            return;
        await _repository.DeleteAsync(remContact);
    }

    public async Task<List<ContactDto>> GetAllContacts()
        => (await _repository.FindAllAsync())
            .ProjectToType<ContactDto>()
            .ToList();

    public async Task<ContactDto?> GetContactById(Guid id)
        => (await _repository.FindByConditionAsync(c => c.Id == id)).FirstOrDefault() is { } contact
            ? contact.Adapt<ContactDto>()
            : null;
}