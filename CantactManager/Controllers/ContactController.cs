using Application.Contacts.Dto;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CantactManager.Controllers;

[ApiController, Route("[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService) => _contactService = contactService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _contactService.GetAllContacts());

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => (await _contactService.GetContactById(id)) is {} contactDto
                ? Ok(contactDto)
                : NotFound();

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContactDto createContactDto)
        => await _contactService.AddContactAsync(createContactDto) is { } contactDto
            ? Created($"contact/{contactDto.Id}", contactDto)
            : BadRequest();

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateContactDto updateDto)
    {
        await _contactService.UpdateContactAsync(id, updateDto);
        return Accepted();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _contactService.RemoveContactAsync(id);
        return NoContent();
    }
}