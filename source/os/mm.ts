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
        public allocateMem(baseReg: number, userProgram: Array<string>)
        {
            for(var i = 0; i < this.memorySize; i++)
            {
                var hex = parseInt(userProgram[i], 16);
                // A lot of programs will not fill the entire memory array so fill the rest with 00
                // if the value is not a number we make it 00
                if (isNaN(hex))
                {
                    _Memory.setMem(i + baseReg, 0x00);
                }
                // The memory that the user inputted
                else
                {
                    _Memory.setMem(i + baseReg, hex);
                }
            }
        }

        // Resets memory
        public deallocateMem()
        {
            _Memory.reset();
        }

        public lob: number = 0x00;
        public hob: number = 0x00;
        public combinedByte: number = 0x000;
        public byteFlipArray = [];

        //used to combine two bytes together in order to create a two byte number
        //this is used to implement little endian or to add to the ProgramCounter as seen in branch
        combineBytes(loByte: number, hoByte: number): number
        {
            this.byteFlipArray[0] = hoByte;
            this.byteFlipArray[1] = loByte;
            this.combinedByte = ((this.byteFlipArray[0] << 8) | (this.byteFlipArray[1]));
            return this.combinedByte;
        }

    }
}