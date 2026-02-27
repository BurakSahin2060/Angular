using Microsoft.EntityFrameworkCore;
using Schulwebapplikation.Data;

var builder = WebApplication.CreateBuilder(args);

// Set specific port for the application
builder.WebHost.UseUrls("http://localhost:5287");

// CORS für lokale Anfragen aktivieren
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5287") // Allow the same origin
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Services hinzufügen
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DBContext>(options =>
    options.UseSqlite("Data Source=schule.db"));

var app = builder.Build();

// CORS aktivieren
app.UseCors("AllowLocalhost");

// Static files aktivieren
app.UseStaticFiles();

// Swagger aktivieren (nur im Development-Modus)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
   
}

// Middleware-Konfiguration
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Anwendung starten
app.Run();