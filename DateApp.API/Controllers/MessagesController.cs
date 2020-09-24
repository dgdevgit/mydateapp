using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DateApp.API.Data;
using DateApp.API.DTOs;
using DateApp.API.Handlers;
using DateApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DateApp.API.Controllers
{
    [ServiceFilter(typeof(LogLastActivity))]
    [Authorize]
    [Route("api/users/{userid}/[controller]")]
    [ApiController]    
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;        
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;   
        }

        [HttpGet("{id}", Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId)
        {
            if(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value) != userId)
                return Unauthorized();
            
            var message = await _repo.GetMessage(userId);
            if (message == null)
                return NotFound();

            return Ok(message);    
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userid, [FromQuery]MessageParams messageParams)
        {
            if(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value) != userid)
                return Unauthorized();
                
            messageParams.UserId = userid;    
            var messagesfromRepo = await _repo.GetMessagesForUser(messageParams);
            var messagestoReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesfromRepo);
            Response.AddPagination(messagesfromRepo.CurrentPage, messagesfromRepo.PageSize, messagesfromRepo.TotalCount, messagesfromRepo.TotalPages);
            return Ok(messagestoReturn);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userid, int recipientId)
        {
            if(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value) != userid)
                return Unauthorized();

            var messageThread = await _repo.GetMessageThread(userid, recipientId);
            var messageThreadToReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageThread);
            return Ok(messageThreadToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userid, MessageForCreationDto messageForCreation)
        {
            var sender = await _repo.GetUser(userid);
            if(sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageForCreation.SenderId = userid;

            var receipient = await _repo.GetUser(messageForCreation.RecipientId);
            if (receipient == null)
                return BadRequest("Could not found the Recipient");            

            var messageFromDto = _mapper.Map<Message>(messageForCreation);
            _repo.Add(messageFromDto);            

            if (await _repo.SaveAll()){
                var messagetoReturn = _mapper.Map<MessageToReturnDto>(messageFromDto);
                return CreatedAtRoute("GetMessage", new {userid = userid, id = messageFromDto.Id}, messagetoReturn);
            }
            return BadRequest("Exception occured while sending a message");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userid)
        {
            if(userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if(messageFromRepo.SenderId == userid)
                messageFromRepo.SenderDeleted = true;

            if(messageFromRepo.RecipientId == userid)
                messageFromRepo.RecipientDeleted = true;

            if(messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
                _repo.Delete(messageFromRepo);
            
            if(await _repo.SaveAll())
                return NoContent();
            
            return BadRequest("Exception occured while deleting the message");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int id, int userid)
        {
            if(userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var message = await _repo.GetMessage(id);
            if(message.RecipientId != userid)
                return Unauthorized();
            message.IsRead = true;
            message.DateRead = DateTime.Now;
            await _repo.SaveAll();
            return NoContent();
        }
















    }
}