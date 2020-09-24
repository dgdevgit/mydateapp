using DateApp.API.Data;

namespace DateApp.API.Controllers
{
    public class ValueController
    {
        private readonly UserDbContext _userDbContext;
        public ValueController(UserDbContext userDbContext)
        {
            _userDbContext = userDbContext;
        }

    }
}