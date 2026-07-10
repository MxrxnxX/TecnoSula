using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);


// ============================
// CORS
// ============================

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


// ============================
// CONTROLLERS
// ============================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();


// ============================
// SWAGGER + JWT
// ============================

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingrese el token JWT"
    });


    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecuritySchemeReference("Bearer", document),
                new List<string>()
            }
        });
});


// ============================
// JWT
// ============================

var jwtKey = builder.Configuration["Jwt:Key"];


builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)

.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey!)
                )
        };
});


builder.Services.AddAuthorization();


// ============================
// DATABASE
// ============================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);


// ============================
// EMAIL SERVICE
// ============================

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings")
);


builder.Services.AddScoped<IEmailService, EmailService>();



// ============================
// APP
// ============================

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();


app.UseCors("Frontend");


app.UseAuthentication();


app.UseAuthorization();


app.MapControllers();


app.Run();