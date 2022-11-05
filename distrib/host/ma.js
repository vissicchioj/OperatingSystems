var TSOS;
(function (TSOS) {
    // Read and Writes Memory
    class MemoryAccessor {
        constructor() {
        }
        /*
            IP3:
                read and write will also need to take in base and limit registers as well. The address that we need will
                be located via adding addr to the base register
            
        */
        read(baseReg, addr) {
            return _Memory.getMem(addr + baseReg);
        }
        write(baseReg, addr, hex) {
            _Memory.setMem(addr + baseReg, hex);
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=ma.js.map