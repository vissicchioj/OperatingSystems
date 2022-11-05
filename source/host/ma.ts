module TSOS
{
    // Read and Writes Memory
    export class MemoryAccessor
    {

        constructor(){
        }

        /*
            IP3:
                read and write will also need to take in base and limit registers as well. The address that we need will
                be located via adding addr to the base register
            
        */
        public read(baseReg: number, addr: number)
        {
            return _Memory.getMem(addr + baseReg);
        }

        public write(baseReg, addr: number, hex: number)
        {
            _Memory.setMem(addr + baseReg, hex);
        }
    }
}