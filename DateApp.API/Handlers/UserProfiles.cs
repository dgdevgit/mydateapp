using System.Linq;
using AutoMapper;
using DateApp.API.DTOs;
using DateApp.API.Models;

namespace DateApp.API.Handlers
{
    public class UserProfiles : Profile
    {
        public UserProfiles()
        {
            CreateMap<User, UserListDto>()
                    .ForMember(dest => dest.PhotoUrl,
                        opt => opt.MapFrom(src => src.Photos.FirstOrDefault(i => i.IsMain).Url))
                    .ForMember(dest => dest.Age,
                        opt => opt.MapFrom(src => src.DateofBirth.CalculateAge()));
            CreateMap<User, UserListDetailsDto>()
                    .ForMember(dest => dest.PhotoUrl,
                        opt => opt.MapFrom(src => src.Photos.FirstOrDefault(i => i.IsMain).Url))
                    .ForMember(dest => dest.Age,
                        opt => opt.MapFrom(src => src.DateofBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<UserDetailsupdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<RegisterUserDto, User>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
                .ForMember(u => u.SenderPhotoUrl, opt => opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(u => u.RecipientPhotoUrl, opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));

        }
    }
}