using YahtzeeGame.Models;

namespace YahtzeeGame.CombinationHandler;

public static class CombinationHandler
{
    private static readonly Dictionary<Combination, bool> CombinationAvailability = new();

    static CombinationHandler()
    {
        InitializeCmbntAvailability();
    }
    private static void InitializeCmbntAvailability()
    {
        foreach (Combination combination in Enum.GetValues(typeof(Combination)))
        {
            CombinationAvailability[combination] = false;
        }
    }
    public static (List<string>, List<string>) GetCombinationNames()
    {
        var names = Enum.GetNames(typeof(Combination))
            .Select(name => string.Concat(name.Select((x, i) => i > 0 && char.IsUpper(x) ? " " + x.ToString() : x.ToString())))
            .ToList();
        var bonusSectionIndex = names.IndexOf("Sixes");
        //removing Chance to separate it from other combinations
        //split the list into two halves
        var upperSection = names.Take(bonusSectionIndex + 1).ToList();
        var lowerSection = names.Skip(bonusSectionIndex + 1).ToList();
        return (upperSection, lowerSection);
    }
    public static Dictionary<Combination, bool> CombChecker(List<int> rolls)
    {
        InitializeCmbntAvailability();
        //upper section yahtzee
        for (var num = 0; num < 7; num++)
        {
            if (rolls.Contains(num))
            {
                CombinationAvailability[(Combination)num] = true;
            }
        }
        //lower section yahtzee
        for (int num = 3,combIndex = 7; num < 6; num++,combIndex++)
        {
            if (HasIdenticalElements(rolls,num))
            {
                CombinationAvailability[(Combination)combIndex] = true;
            }
        }
        //fullhouse check
        if (HasIdenticalElements(list:rolls, fullHouseCheck:true))
        {
            CombinationAvailability[Combination.FullHouse] = true;
        }
        //long-straight check
        if (LongStraightCheck(rolls))
        {
            CombinationAvailability[Combination.SmallStraight] = true;  
            CombinationAvailability[Combination.LargeStraight] = true;
        }
        else
        {
            CombinationAvailability[Combination.LargeStraight] = false;
        }
        //short-straight check
        CombinationAvailability[Combination.SmallStraight] = ShortStraightCheck(rolls);
        var result = new Dictionary<Combination, bool>(CombinationAvailability);
        CombinationAvailability.Clear();
        return result;
    }

    private static bool HasIdenticalElements(List<int> list, int amountToCheck=0,bool fullHouseCheck = false)
    {
        amountToCheck = fullHouseCheck ? 3 : amountToCheck;
        var elementsCount = new Dictionary<int, int>();
        foreach (var item in list)
        {
            if (!elementsCount.TryAdd(item, 1))
            {
                elementsCount[item]++;
            }
        }
        if (fullHouseCheck)
        {
            return (elementsCount.ContainsValue(3) && elementsCount.ContainsValue(2));
        }
        return elementsCount.Any(kvp => kvp.Value >= amountToCheck);
    }

    private static bool ShortStraightCheck(ICollection<int> list)
    {
        var hasShortStraight = false;

        // Check for short straight starting from 1
        for (var num = 1; num <= 4; num++)
        {
            if (!list.Contains(num))
            {
                hasShortStraight = false;
                break;
            }
            hasShortStraight = true;
        }

        if (hasShortStraight) return true;

        // Check for short straight starting from 2
        for (var num = 2; num <= 5; num++)
        {
            if (!list.Contains(num))
            {
                hasShortStraight = false;
                break;
            }
            hasShortStraight = true;
        }

        if (hasShortStraight) return true;
        
        for (var num = 3; num <= 6; num++)
        {
            if (!list.Contains(num))
            {
                hasShortStraight = false;
                break;
            }
            hasShortStraight = true;
        }

        return hasShortStraight;
    }

    private static bool LongStraightCheck(ICollection<int> list)
    {
        bool isLongStraight = Enumerable.Range(1, 5).All(list.Contains) || Enumerable.Range(2, 6).All(list.Contains);
        return isLongStraight;
    }
}
