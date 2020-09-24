using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DateApp.API.Data;
using AutoMapper;
using Microsoft.Extensions.Options;
using DateApp.API.Handlers;
using CloudinaryDotNet;
using System.Threading.Tasks;
using DateApp.API.DTOs;
using System.Security.Claims;
using CloudinaryDotNet.Actions;
using DateApp.API.Models;
using System.Linq;

namespace DateApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userid}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        public PhotosController(IDatingRepository repository, IMapper mapper, 
                                IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repository = repository;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(acc);

        }

        [HttpGet("{id}", Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repository.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userid, [FromForm]PhotoForCreationDto photoforcreation) 
        {
            if(userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repository.GetUser(userid);
            var file = photoforcreation.File;
            var uploadResult = new ImageUploadResult();

            if( file.Length > 0) {                

                using(var stream = file.OpenReadStream()) {                    
                    var imageParams = new ImageUploadParams() 
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face"),
                    };
                    uploadResult = _cloudinary.Upload(imageParams);                    
                }
            }
            photoforcreation.Url = uploadResult.Uri.ToString();
            photoforcreation.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoforcreation);
            if (!user.Photos.Any(u => u.IsMain))
                photo.IsMain = true;

            user.Photos.Add(photo);
            if (await _repository.SaveAll()) {
                var photoForReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { userid = userid, id = photo.Id }, photoForReturn);
            }
            return BadRequest("Exception occured while uploading the image");            
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetPhotoMainForUser(int userid, int id)
        {
            if(userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repository.GetUser(userid);
            if(!user.Photos.Any(p => p.Id == id)) {
                return Unauthorized();
            }
            var photoFromRepo = await _repository.GetPhoto(id);
            if (photoFromRepo.IsMain) {
                return BadRequest("Photo is already main photo");
            }
            var currentMainPhoto = await _repository.GetMainPhotoForUser(userid);
            currentMainPhoto.IsMain = false;
            photoFromRepo.IsMain = true;

            if(await _repository.SaveAll())
                return NoContent();
            
            return BadRequest("Unable to set the main photo");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userid, int id) 
        {
            if(userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repository.GetUser(userid);
            if(!user.Photos.Any(p => p.Id == id))
                return BadRequest("There is no photo with the id you provided");
            
            var photoFromRepo = await _repository.GetPhoto(id);
            if (photoFromRepo.IsMain)
                return BadRequest("Main Photo can't be deleted");
            
            if (photoFromRepo.PublicId != null) {
                var delParams = new DeletionParams(photoFromRepo.PublicId);
                var resFromCloud = _cloudinary.Destroy(delParams);
                if (resFromCloud.Result == "ok") {
                    _repository.Delete(photoFromRepo);                    
                }                
            } else {
                _repository.Delete(photoFromRepo);
            }

            if(await _repository.SaveAll())
                return Ok();

            return BadRequest("Unable to delete the photo");
           
        }

        
    }
}