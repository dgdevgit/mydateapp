using System;
using System.Threading.Tasks;
using DateApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DateApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserDbContext _context;
        public AuthRepository(UserDbContext context)
        {
            _context = context;
        }
        public async Task<bool> CheckUserExists(string username)
        {
            if(await _context.users.AnyAsync(x => x.Username == username))
                return true;

            return false;
        }

        public async Task<User> Login(string username, string password)
        {
            var userValue = await _context.users.FirstOrDefaultAsync(x => x.Username == username);

            if(userValue == null)
                return null;

            if(!VerifyPassword(password, userValue.passwordHash, userValue.passwordSalt))
                return null;
                
            return userValue;
        }

        private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if(computedHash[i] != passwordHash[i])
                        return false;
                }                
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] pwdHash, pwdSalt;
            CreatePwdHash(password, out pwdHash, out pwdSalt);
            user.passwordHash = pwdHash;
            user.passwordSalt = pwdSalt;
            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public void CreatePwdHash(string pwd, out byte[] pwdHash, out byte[] pwdSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                pwdSalt = hmac.Key;
                pwdHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(pwd));
            }
        }
        
    }
}