using System.Collections.Generic;
using System.Threading.Tasks;
using DateApp.API.Handlers;
using DateApp.API.Models;

namespace DateApp.API.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<bool> SaveAll();
        Task<User> GetUser(int id);
        Task<PagedList<User>> GetUsers(UserParams userParams);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int userid);
        Task<Like> GetLike(int userid, int recipientid);
        Task<Message> GetMessage(int id);
        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
    }
}