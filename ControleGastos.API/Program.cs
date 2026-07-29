using ControleGastos.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// comando para registrar os controllers para API
builder.Services.AddControllers();

// configurando a politica de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy => 
    {
        policy.WithOrigins("http://localhost:5173") // porta padrao do Vite
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// comando que configura a injecao do AppContext usando Sqlite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection")));

// Swagger (Documentacao OpenAPI)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// habilitando interface do swagger para testes
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ativa o middleware do CORS
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();