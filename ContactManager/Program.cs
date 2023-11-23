using Application;
using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


if (builder.Configuration.GetConnectionString("DbContext") is not { } connectionString)
    throw new InvalidOperationException("Connection string [DbContext] not found");
builder.Services.AddInfrastructure(connectionString);
builder.Services
    .AddApplicationServices()
    .AddMappingProfiles();

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();