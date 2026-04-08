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

// Add JWT configuration
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

builder.Services.AddScoped<ITokenService>(sp => 
    new Softlithe.ERP.BW.TokenService(secretKey, issuer, audience, int.Parse(jwtSettings["ExpirationMinutes"])));
builder.Services.AddScoped<IAutenticacionDA, AutenticacionDA>();
builder.Services.AddScoped<IAutenticacionBW, AutenticacionBW>();

builder.Services.AddControllersWithViews();
builder.Services.InyectarDependencias();
// Productos CRUD DI registration
builder.Services.AddScoped<Softlithe.ERP.Abstracciones.BW.Productos.IProductoBW, Softlithe.ERP.BW.Productos.ProductoBW>();
builder.Services.AddScoped<Softlithe.ERP.Abstracciones.DA.Productos.IProductoDA, Softlithe.ERP.DA.Productos.ProductoDA>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://127.0.0.1:5173/",
                                             "http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowAnyOrigin();
                      });
});


builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
//builder.Logging.AddEventLog(eventLogSettings =>
//{
//    eventLogSettings.SourceName = builder.Configuration.GetValue<string>("EventLog:SourceName");
//    eventLogSettings.LogName = builder.Configuration.GetValue<string>("EventLog:LogName");
//});
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ContextoBasedeDatos>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DataBase")));
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
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
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();






