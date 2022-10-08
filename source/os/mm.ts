module TSOS
{
    // Allocates and deallocates memory
    export class MemoryManager
    {
        private memorySize: number;
        
        constructor()
        {
            this.memorySize = 256;
        }

        // Allocate User Input Program to memory
        public allocateMem(userProgram: Array<string>)
        {
            for(var i = 0; i < this.memorySize; i++)
            {
                var hex = parseInt(userProgram[i], 16);
                // A lot of programs will not fill the entire memory array so fill the rest with 00
                // if the value is not a number we make it 00
                if (isNaN(hex))
                {
                    _Memory.setMem(i, 0x00);
                }
                // The memory that the user inputted
                else
                {
                    _Memory.setMem(i, hex);
                }
            }
        }

        // Resets memory
        public deallocateMem()
        {
            _Memory.reset();
        }

    }
}