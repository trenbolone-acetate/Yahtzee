using YahtzeeGame.Models;

namespace YahtzeeGame.CombinationHandler
{
    public class CombinationHandler
    {
        public void PairDetector(List<Die> dice)
        {
            var random = new Random();
            var numbers = dice.Select(die=>die.Value).ToList();
            //find pairs
            var pairs = numbers.GroupBy(n => n)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key);
            // Print the pairs
            foreach (var pair in pairs)
            {
                Console.WriteLine($"Pair: {pair}");
            }
        }
    }
}
