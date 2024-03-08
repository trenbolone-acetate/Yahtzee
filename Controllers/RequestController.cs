using Microsoft.AspNetCore.Mvc;
using YahtzeeGame.Models;

namespace YahtzeeGame.Controllers
{
    public class RequestController : Controller
    {
        public async Task RollDice(List<Die>? dice)
        {
            HttpClient httpClient = new HttpClient();
            var response = await httpClient.GetAsync("/Dice/GetRolledDice");
            if (response.IsSuccessStatusCode)
            {
                dice = await response.Content.ReadFromJsonAsync<List<Die>>();
            }
            else
            {
                Console.WriteLine("HttpResponseMessage error!");
            }
        }
    }
}
