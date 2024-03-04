using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using YahtzeeGame.Models;

namespace YahtzeeGame.Controllers
{
    public class DiceController : Controller
    {
        private readonly List<Die> _dice = new(5)
        { new Die(), new Die(), new Die(), new Die(), new Die() };
        private readonly Random _random = new();
        public IActionResult GetRolledDice()
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
    }

}
