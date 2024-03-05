using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using YahtzeeGame.Models;

namespace YahtzeeGame.Controllers
{
    public class DiceController : Controller
    {
        private readonly List<Die> _dice = new(5)
        { new Die(), new Die(), new Die(), new Die(), new Die() };
        private readonly Random _random = new();
        
        [HttpGet]
        public JsonResult GetRolledDice()
        {
            for (var i = 0; i < _dice.Count; i++)
            {
                if (!_dice[i].IsLocked)
                {
                    _dice[i].Roll(_random);
                }
            }
            YahtzeeController.rolls.Add(_dice);
            return Json(_dice);
        }

        public void LockUnlockDie(int index)
        {
            if (index >= 0 && index < _dice.Count)
            {
                _dice[index].IsLocked = !_dice[index].IsLocked;
            }
        }
        
        [HttpPost]
        public JsonResult CombinationChecker(string rolls)
        {
            //deserialize json to a list of integers
            var rollsDeserialized = JsonSerializer.Deserialize<int[]>(rolls);
            List<int> dice = rollsDeserialized.ToList();

            //call the CombChecker method with dice list
            Dictionary<Combination, bool> combinations = CombinationHandler.CombinationHandler.CombChecker(dice);

            //return only bool vals as a list
            var combVals = combinations.Values;
            var combValsList = new List<bool>(combVals);
            return Json(combValsList);
        }

    }

}
