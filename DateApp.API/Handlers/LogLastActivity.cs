using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DateApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DateApp.API.Handlers
{
    public class LogLastActivity : IAsyncActionFilter
    {
        private readonly IDatingRepository _repo;

        public LogLastActivity(IDatingRepository repo)
        {
            _repo = repo;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var result = await next();
            var userId = int.Parse(result.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _repo.GetUser(userId);
            user.LastActive = DateTime.Now;
            await _repo.SaveAll();
        }
    }
}