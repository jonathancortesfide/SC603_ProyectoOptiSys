using System.Text;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Softlithe.ERP.Api;
using Softlithe.ERP.Api.Middleware;
using Softlithe.ERP.DA.Modelos;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtSecret = builder.Configuration["JwtConfig:Secret"]
    ?? throw new InvalidOperationException("JwtConfig:Secret no está configurado.");

builder.Services
    .AddAuthentication(Options =>
    {
        Options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        Options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(Options =>
    {
        Options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtConfig:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        // El SPA envía el token SIN prefijo "Bearer"
        Options.Events = new JwtBearerEvents
        {
            OnMessageReceived = Context =>
            {
                var authHeader = Context.Request.Headers["Authorization"].ToString();
                if (!string.IsNullOrEmpty(authHeader) &&
                    !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    Context.Token = authHeader;
                }
                return Task.CompletedTask;
            }
        };
    });

// ── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddControllersWithViews();
builder.Services.InyectarDependencias();
builder.Services.AddCors(Options =>
{
    Options.AddPolicy(name: MyAllowSpecificOrigins,
        Policy =>
        {
            Policy.WithOrigins(
                    "http://127.0.0.1:5173",
                    "http://localhost:5173",
                    "http://127.0.0.1:8090",
                    "http://localhost:8090",
                    "https://lensys.onrender.com")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));

// EventLog is only supported on Windows
if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
{
    builder.Logging.AddEventLog(EventLogSettings =>
    {
        EventLogSettings.SourceName = builder.Configuration.GetValue<string>("EventLog:SourceName");
        EventLogSettings.LogName = builder.Configuration.GetValue<string>("EventLog:LogName");
    });
}

builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ContextoBasedeDatos>(
    Options => Options.UseSqlServer(builder.Configuration.GetConnectionString("DataBase")));
builder.Services.AddHttpClient();

// ── Pipeline ──────────────────────────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseCors(MyAllowSpecificOrigins);
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddlewareExcepciones();
app.UseSwagger();
app.UseSwaggerUI(Options =>
{
    Options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    Options.RoutePrefix = string.Empty;
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();







