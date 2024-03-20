using System.Reflection;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using YahtzeeGame.Models;

namespace YahtzeeGame.Controllers
{
    public class DiceController : Controller
    {
        private static readonly Random Random = new();
        private readonly List<Die> _currentRoll = new(5)
        { new Die(), new Die(), new Die(), new Die(), new Die() };

        public int Test()
        {
            return Random.Shared.Next(10);
        }
        
        [HttpGet]
        public JsonResult GetRolledDice()
        {
            foreach (var die in _currentRoll.Where(die => !die.IsLocked))
            {
                die.Roll(Random);
            }
            return Json(_currentRoll);
        }
        
        [HttpPost]
        public JsonResult CombinationChecker(string? rolls)
        {
            if (rolls == null)
            {
                Console.WriteLine($"Deserialization Error In {MethodBase.GetCurrentMethod()?.Name}!");
                return new JsonResult(0);
            }
            //deserialize json to a list of integers
            var rollsDeserialized = JsonSerializer.Deserialize<int[]>(rolls);
            _currentRoll.Clear();
            _currentRoll.AddRange(rollsDeserialized.Select(value => new Die { Value = value }));
            ScoreController.Rolls.Add(_currentRoll);
            var dice = rollsDeserialized.ToList();

            //call the CombChecker method with dice list
            var combinations = CombinationHandler.CombinationHandler.CombChecker(dice);

            //return only bool vals as a list
            var combVals = combinations.Values;
            var combValsList = new List<bool>(combVals);
            return Json(combValsList);
        }

    }

}
