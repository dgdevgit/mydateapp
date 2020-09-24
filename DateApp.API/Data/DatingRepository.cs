using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DateApp.API.Handlers;
using DateApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DateApp.API.Data
{    
    public class DatingRepository : IDatingRepository
    {
        private readonly UserDbContext _context;
        public DatingRepository(UserDbContext context) {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userid, int recipientid)
        {
            return await _context.Likes.FirstOrDefaultAsync
                        (u => u.LikerId == userid && u.LikeeId == recipientid);
        }

        public async Task<Photo> GetMainPhotoForUser(int userid)
        {
            return await _context.Photos.Where(u => u.UserId == userid).FirstOrDefaultAsync(p => p.IsMain);            
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                        .Include(u => u.Sender).ThenInclude(p => p.Photos)
                        .Include(u => u.Recipient).ThenInclude(p => p.Photos).AsQueryable();
            switch(messageParams.MessageContainer) {
                case "inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false);
                    break;
                case "outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.IsRead == false && u.RecipientDeleted == false);
                    break;
            }
            messages = messages.OrderByDescending(u => u.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize); 
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                        .Include(u => u.Sender).ThenInclude(p => p.Photos)
                        .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                        .Where(u => u.SenderId == recipientId && u.RecipientId == userId && u.RecipientDeleted == false
                                || u.SenderId == userId && u.RecipientId == recipientId && u.SenderDeleted == false)
                        .OrderByDescending(u => u.MessageSent).ToListAsync();
            return messages;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.users.Include(p => p.Photos).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);

            users = users.Where(g => g.Gender == userParams.Gender);

            if (userParams.Liker) {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Liker);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if(userParams.Likee) {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Liker);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            
            if(userParams.MinAge != 18 || userParams.MaxAge != 99) {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(m => m.DateofBirth >= minDob && m.DateofBirth <= maxDob);
            }
            
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool liker)
        {
            var userLikes = await _context.users.Include(l => l.Likers)
                                .Include(l => l.Likees)
                                .FirstOrDefaultAsync(u => u.Id == id);
            if (liker) {
                return userLikes.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else {
                return userLikes.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
                
        }
    }
}