using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DateApp.API.Data;
using System.Threading.Tasks;
using AutoMapper;
using DateApp.API.DTOs;
using System.Collections.Generic;
using System.Security.Claims;
using System;
using DateApp.API.Handlers;
using DateApp.API.Models;

namespace DateApp.API.Controllers
{
    [ServiceFilter(typeof(LogLastActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper) 
        {
            _repo = repo;
            _mapper = mapper;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams) 
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            userParams.UserId = currentUserId;
            var userDetail = await _repo.GetUser(currentUserId);
            
            if(String.IsNullOrEmpty(userParams.Gender)) {
                userParams.Gender = userDetail.Gender == "male" ? "female" : "male";
            }
            
            var users = await _repo.GetUsers(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UserListDto>>(users);
            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(usersToReturn);
        }
        
        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id) 
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserListDetailsDto>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserDetails(int id, UserDetailsupdateDto userDetailsupdate) 
        {            
            int nameid = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if(id != nameid)
                return Unauthorized();
            
            var user = await _repo.GetUser(id);
            _mapper.Map(userDetailsupdate, user);
            
            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Exception occured while updating the data for the id - {id}");
        }

        [HttpPost("{id}/like/{recipientid}")]
        public async Task<IActionResult> GetLike(int id, int recipientid)
        {
            int nameid = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if(id != nameid)
                return Unauthorized();
            
            if(await _repo.GetUser(recipientid) == null)
                return NotFound("Not Found");

            if (await _repo.GetLike(id, recipientid) != null)
                return BadRequest("Already liked the user");

            Like like = new Like {
                LikerId = id,
                LikeeId = recipientid
            };

            _repo.Add<Like>(like);

            if(await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to Like the user");

        }

    }
}