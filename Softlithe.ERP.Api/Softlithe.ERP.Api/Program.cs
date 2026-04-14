using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Softlithe.ERP.Api;
using Softlithe.ERP.Api.Middleware;
using Softlithe.ERP.DA.Modelos;
using Softlithe.ERP.Abstracciones.DA.Autenticacion;
using Softlithe.ERP.Abstracciones.BW.Autenticacion;
using Softlithe.ERP.Abstracciones.Servicios;
using Softlithe.ERP.DA.Autenticacion;
using Softlithe.ERP.BW.Autenticacion;
using Softlithe.ERP.BW;
using System.Text;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// ================= JWT CONFIG =================
var jwtSettings = builder.Configuration.GetSection("Jwt");

var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? jwtSettings["SecretKey"];
var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? jwtSettings["Issuer"];
var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? jwtSettings["Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// ================= DEPENDENCY INJECTION =================
builder.Services.AddScoped<ITokenService>(sp =>
    new TokenService(
        secretKey,
        issuer,
        audience,
        int.Parse(jwtSettings["ExpirationMinutes"] ?? "60")
    ));

builder.Services.AddScoped<IAutenticacionDA, AutenticacionDA>();
builder.Services.AddScoped<IAutenticacionBW, AutenticacionBW>();

builder.Services.AddControllersWithViews();
builder.Services.InyectarDependencias();

// ================= CORS (CORREGIDO) =================
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// ================= LOGGING =================
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// ================= SWAGGER =================
builder.Services.AddSwaggerGen();

// ================= DATABASE =================
var connectionString = builder.Configuration.GetConnectionString("DataBase");

Console.WriteLine($"DB STRING: {connectionString}");

builder.Services.AddDbContext<ContextoBasedeDatos>(options =>
    options.UseSqlServer(connectionString)
);

// ================= HTTP CLIENT =================
builder.Services.AddHttpClient();

var app = builder.Build();

// ================= PIPELINE =================
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 👇 IMPORTANTE: CORS antes de Auth
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddlewareExcepciones();

// ================= SWAGGER UI =================
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});

// ================= ROUTES =================
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();