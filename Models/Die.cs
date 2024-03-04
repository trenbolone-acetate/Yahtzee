namespace YahtzeeGame.Models
{
    public class Die
    {
        public int Value {  get; private set; } = 1;
        public bool IsLocked { get; set; } = false;

        public void Roll(Random random)
        {
            if (!IsLocked)
            {
                Value = random.Next(1, 7);
            }
        }
    }
}
