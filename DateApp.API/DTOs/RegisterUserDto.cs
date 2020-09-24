using System;
using System.ComponentModel.DataAnnotations;

namespace DateApp.API.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        public string Username { get; set; }        
        
        [Required]
        [StringLength(8, MinimumLength=4, ErrorMessage="Password should be min 4 and max 8")]
        public string password { get; set; }
        
        [Required]
        public string knownAs { get; set; }
        
        [Required]
        public string gender { get; set; }
        
        [Required]
        public DateTime dateofBirth { get; set; }
        
        [Required]
        public string city { get; set; }

        [Required]
        public string country { get; set; }
        public DateTime created { get; set; }
        public DateTime lastActive { get; set; }
        public RegisterUserDto()
        {
            created = DateTime.Now;
            lastActive = DateTime.Now;
        }
    }
}