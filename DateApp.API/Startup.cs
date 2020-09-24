using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using DateApp.API.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using DateApp.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using DateApp.API.Handlers;
using AutoMapper;

namespace DateApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<UserDbContext>(opt => 
                opt.UseSqlite(Configuration.GetConnectionString("DateDatabase"))                
                );
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IDatingRepository, DatingRepository>();
            services.AddAutoMapper(typeof(DatingRepository).Assembly);
            services.AddScoped<LogLastActivity>();
            services.AddControllers().AddNewtonsoftJson(opt => 
                                    opt.SerializerSettings.ReferenceLoopHandling =
                                    Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                    );
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinaryDetails"));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(opt =>
                        opt.TokenValidationParameters = new TokenValidationParameters()
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.
                                        GetBytes(Configuration.GetSection("auth-token:secret").Value)),
                            ValidateIssuer = false,
                            ValidateAudience = false
                        });
            services.AddCors(opt => {
                opt.AddPolicy("apicors", builder => {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder => {
                    builder.Run(async context => {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;                              
                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null) {
                            context.Response.HandleCorsException(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);                                                        
                        }
                    });
                });
            }

            // app.UseHttpsRedirection();
            app.UseCors("apicors");
            app.UseRouting();

            app.UseAuthentication();
            
            app.UseAuthorization();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
