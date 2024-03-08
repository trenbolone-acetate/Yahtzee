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
        private static readonly Random _random = new();
        private readonly List<Die> _currentRoll = new(5)
        { new Die(), new Die(), new Die(), new Die(), new Die() };
        
        [HttpGet]
        public JsonResult GetRolledDice()
        {
            foreach (var die in _currentRoll.Where(die => !die.IsLocked))
            {
                die.Roll(_random);
            }
            ////only log the final roll of the animation
            //if (index==2)
            //{
            //    ScoreController.Rolls.Add(_currentRoll);
            //}
            return Json(_currentRoll);
        }

        public void LockUnlockDie(int index)
        {
            if (index >= 0 && index < _currentRoll.Count)
            {
                _currentRoll[index].IsLocked = !_currentRoll[index].IsLocked;
            }
        }
        
        [HttpPost]
        public JsonResult CombinationChecker(string rolls)
        {
            //deserialize json to a list of integers
            var rollsDeserialized = JsonSerializer.Deserialize<int[]>(rolls);
            if (rollsDeserialized != null)
            {
                var dice = rollsDeserialized.ToList();

                //call the CombChecker method with dice list
                var combinations = CombinationHandler.CombinationHandler.CombChecker(dice);

                //return only bool vals as a list
                var combVals = combinations.Values;
                var combValsList = new List<bool>(combVals);
                return Json(combValsList);
            }
            Console.WriteLine($"Deserialization Error In {MethodBase.GetCurrentMethod()?.Name}!");
            return new JsonResult(0);
        }

    }

}
