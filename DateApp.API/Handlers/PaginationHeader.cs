namespace DateApp.API.Handlers
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }

        public PaginationHeader(int curPage, int itemsPerPage, int totItems, int totPages)
        {
            this.CurrentPage = curPage;
            this.ItemsPerPage = itemsPerPage;
            this.TotalItems = totItems;
            this.TotalPages = totPages;
        }
    }
}