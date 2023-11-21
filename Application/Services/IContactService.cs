using Application.Contacts;
using Application.Contacts.Dto;

namespace Application.Services;

public interface IContactService
{
    public Task<ContactDto> AddContactAsync(CreateContactDto contact);
    public Task UpdateContactAsync(Guid id, CreateContactDto contactDto);
    public Task RemoveContactAsync(Guid id);
    public Task<List<ContactDto>> GetAllContacts();
    public Task<ContactDto?> GetContactById(Guid id);
}