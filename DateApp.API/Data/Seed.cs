using System.Collections.Generic;
using System.Linq;
using DateApp.API.Models;
using Newtonsoft.Json;

namespace DateApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(UserDbContext dataContext) {

            if (!dataContext.users.Any()) {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                byte[] passwordhash, passwordSalt;
                foreach(var user in users) {
                    
                    CreatePwdHash("password", out passwordhash, out passwordSalt);
                    user.passwordHash = passwordhash;
                    user.passwordSalt = passwordSalt;
                    user.Username = user.Username.ToLower();
                    dataContext.users.Add(user);
                }
                dataContext.SaveChanges();    
            }
        }

        public static void CreatePwdHash(string pwd, out byte[] pwdHash, out byte[] pwdSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                pwdSalt = hmac.Key;
                pwdHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(pwd));
            }
        }
    }
}