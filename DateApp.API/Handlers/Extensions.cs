using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DateApp.API.Handlers
{
    public static class Extensions
    {
        public static void HandleCorsException(this HttpResponse response, string msg) 
        {
            response.Headers.Add("Application-Error", msg);
            response.Headers.Add("Access-Control-Expose-headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        public static void AddPagination(this HttpResponse response, int curPage, int itemsPerPage, 
                            int totItems, int totPages) 
        {
            var paginationHeader = new PaginationHeader(curPage, itemsPerPage, totItems, totPages);
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-headers", "Pagination");            
        }

        public static int CalculateAge(this DateTime dob)
        {
            int age = DateTime.Now.Year - dob.Year;
            if (dob.DayOfYear > DateTime.Now.DayOfYear)
                age--;
            return age;
        }
    }
}