using System.Threading.Tasks;
using DateApp.API.Models;

namespace DateApp.API.Data
{
    public interface IAuthRepository
    {
        public Task<User> Register(User username, string password);
        public Task<User> Login(string username, string password);
        public Task<bool> CheckUserExists(string username);
    }
}