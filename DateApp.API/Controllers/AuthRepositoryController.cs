using Microsoft.AspNetCore.Mvc;
using DateApp.API.Data;
using System.Threading.Tasks;
using DateApp.API.Models;
using DateApp.API.DTOs;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;

namespace DateApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthRepositoryController : ControllerBase
    {
        public IAuthRepository _repo { get; set; }
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthRepositoryController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _config = config;
            _mapper = mapper;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto registerUserDto)
        {

            var username = registerUserDto.Username.ToLower();
            if (await _repo.CheckUserExists(username))
                return BadRequest("Username already exists");

            var createUname = _mapper.Map<User>(registerUserDto);

            var createdUser = await _repo.Register(createUname, registerUserDto.password);

            var userdetails = _mapper.Map<UserListDetailsDto>(createdUser);
            
            return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.Id }, userdetails);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto loginuserdto)
        {
            var userLogin = await _repo.Login(loginuserdto.username.ToLower(), loginuserdto.password);

            if (userLogin == null)
                return Unauthorized();

            var claim = new[]{
                new Claim(ClaimTypes.NameIdentifier, userLogin.Id.ToString()),
                new Claim(ClaimTypes.Name, userLogin.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("auth-token:secret").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor(){
                Subject = new ClaimsIdentity(claim),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var handler = new JwtSecurityTokenHandler();
            var token = handler.CreateToken(tokenDescriptor);
            
            return Ok(new {
                token = handler.WriteToken(token)
            });

        }
    }
}