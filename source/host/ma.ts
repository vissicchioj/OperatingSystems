module TSOS
{
    // Read and Writes Memory
    export class MemoryAccessor
    {

        constructor(){
        }

        public read(addr: number)
        {
            return _Memory.getMem(addr);
        }

        public write(addr: number, hex: number)
        {
            _Memory.setMem(addr, hex);
        }
    }
}