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
        public override string ToString()
        {
            return $" /{Value}{IsLocked.ToString()[0]}\\ ";
        }
        public Die()
        {
            Value = 1;
            IsLocked= false;
        }
    }
}
