using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YahtzeeGame.Models;

namespace YahtzeeGame.Controllers
{
    public class YahtzeeController : Controller
    {
        public static List<List<Die>> rolls = new List<List<Die>>();
        // GET: YahtzeeController
        public void Index()
        {
        }

        public void HandleGameResults()
        {
        }

    }
}
