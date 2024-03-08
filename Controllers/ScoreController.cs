using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using YahtzeeGame.Models;

namespace YahtzeeGame.Controllers
{
    public class ScoreController : Controller
    {
        //Bonus id in list - 12
        //Chance id in list - 13
        public static Dictionary<Combination, int> ScoreDictionary = new();
        public static readonly List<List<Die>> Rolls = new();
        public void HandleGameResults()
        {
        }

        public int CombinationScoreCalc(string buttonId, string rolls)
        {
            var rollsDeserialized = JsonSerializer.Deserialize<int[]>(rolls);
            int combination = int.Parse(buttonId);
            //combinations enum starts from 1, so add 1 for less confusion
            if (rollsDeserialized != null)
            {
                int score = CalculateCombinationScore(combination+1, rollsDeserialized);
                return score;
            }
            Console.WriteLine($"Deserialization Error In {MethodBase.GetCurrentMethod()?.Name}!");
            return 0;
        }

        private static int CalculateCombinationScore(int combination, IEnumerable<int> rolls)
        {
            int score;
            switch (combination)
            {
                case < 7:
                    score = rolls.Where(x => x == combination).Sum();
                    break;
                case > 6 and < 9:
                    score = rolls.Sum();
                    break;
                case 9:
                    score = 50;
                    break;
                case 10:
                    score = 25;
                    break;
                case 11:
                    score = 30;
                    break;
                case 12:
                    score = 40;
                    break;
                default:
                    return 0;
            }

            ScoreDictionary[(Combination)combination] = score;
            return score;
        }


        public void BonusCheck(){}
    }
}
